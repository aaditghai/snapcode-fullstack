from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
import base64
import httpx
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

# Exact origins (optional FRONTEND_URL for your Netlify site, e.g. https://foo.netlify.app)
_frontend_url = os.getenv("FRONTEND_URL", "").rstrip("/")
_allow_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]
if _frontend_url:
    _allow_origins.append(_frontend_url)

# Starlette does NOT support "https://*.netlify.app" globs in allow_origins —
# use regex for Netlify / Vercel preview and production hosts.
app.add_middleware(
    CORSMiddleware,
    allow_origins=_allow_origins,
    allow_origin_regex=r"https://.*\.(netlify\.app|netlify\.com|vercel\.app)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_API_KEY = (os.getenv("OPENAI_API_KEY") or "").strip().strip('"').strip("'")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not set")

# trust_env=False avoids broken HTTP(S)_PROXY vars that can cause "Connection error" on hosts
_http_client = httpx.Client(timeout=60.0, trust_env=False)
_openai_kwargs = {
    "api_key": OPENAI_API_KEY,
    "http_client": _http_client,
}
if os.getenv("OPENAI_BASE_URL"):
    _openai_kwargs["base_url"] = os.getenv("OPENAI_BASE_URL")

client = OpenAI(**_openai_kwargs)


def _error_detail(exc: Exception) -> str:
    parts = [str(exc)]
    cause = getattr(exc, "__cause__", None) or getattr(exc, "__context__", None)
    if cause:
        parts.append(f"cause: {cause}")
    return " | ".join(parts)

class GenerateRequest(BaseModel):
    description: str

@app.get("/")
async def root():
    return {"message": "SnapCode API", "endpoints": ["POST /generate", "GET /health"]}


@app.get("/health")
async def health():
    """Report whether OpenAI is reachable from this host (no secrets returned)."""
    status = {
        "ok": False,
        "openai_key_present": bool(OPENAI_API_KEY),
        "openai_key_length": len(OPENAI_API_KEY),
        "openai_base_url": os.getenv("OPENAI_BASE_URL") or "https://api.openai.com/v1",
    }
    try:
        client.models.list()
        status["ok"] = True
        status["openai"] = "reachable"
    except Exception as e:
        status["openai"] = "unreachable"
        status["error"] = _error_detail(e)
    return status

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    # Read and encode the image
    image_bytes = await file.read()
    image_base64 = base64.b64encode(image_bytes).decode('utf-8')
    
    try:
        # Generate HTML/CSS code from description using GPT-3.5-turbo
        code_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert front-end developer. Generate clean, modern HTML and CSS code based on the description provided. Include responsive design and best practices."
                },
                {
                    "role": "user",
                    "content": f"Create HTML and CSS code for this UI description: {description}"
                }
            ],
            max_tokens=1000,
            temperature=0.3
        )
        
        html_css_code = code_response.choices[0].message.content
        
        if not html_css_code:
            raise HTTPException(status_code=500, detail="Failed to generate HTML/CSS")
        
        return {
            "description": description,
            "html_css": html_css_code
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate")
async def generate_code(request: GenerateRequest):
    try:
        # Generate HTML/CSS code from description using GPT-3.5-turbo
        code_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """You are an expert front-end developer. Generate clean, modern HTML and CSS code based on the description provided. 
                    
                    Requirements:
                    - Include complete HTML structure with proper DOCTYPE, head, and body tags
                    - Include CSS styling within <style> tags in the head
                    - Include JavaScript within <script> tags at the end of body if needed
                    - Make the design responsive and modern
                    - Use semantic HTML elements
                    - Include proper accessibility attributes
                    - Use modern CSS features like flexbox/grid
                    - Create different designs based on the description
                    
                    Return the complete HTML document with embedded CSS and JavaScript."""
                },
                {
                    "role": "user",
                    "content": f"Create a complete HTML document with CSS and JavaScript for this UI description: {request.description}"
                }
            ],
            max_tokens=2000,
            temperature=0.7
        )
        
        generated_code = code_response.choices[0].message.content
        
        if not generated_code:
            raise HTTPException(status_code=500, detail="Failed to generate code")
        
        return {
            "code": generated_code
        }
        
    except Exception as e:
        error_msg = _error_detail(e)
        print(f"OpenAI API error: {error_msg}")
        if "insufficient_quota" in error_msg:
            raise HTTPException(status_code=402, detail="API quota exceeded. Please check your OpenAI billing.")
        elif "429" in error_msg:
            raise HTTPException(status_code=429, detail="Rate limit exceeded. Please wait a moment and try again.")
        elif "model_not_found" in error_msg:
            raise HTTPException(status_code=400, detail="Model not available. Please check your OpenAI account access.")
        elif "invalid_api_key" in error_msg or "Incorrect API key" in error_msg:
            raise HTTPException(status_code=401, detail="Invalid API key. Please check your OpenAI API key.")
        else:
            raise HTTPException(status_code=500, detail=f"OpenAI API error: {error_msg}")
