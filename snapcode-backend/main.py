from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
import base64
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000", 
        "http://localhost:3001", 
        "http://127.0.0.1:3001",
        "https://*.vercel.app",  # Vercel preview deployments
        "https://*.railway.app",  # Railway preview deployments
        "https://*.netlify.app",  # Netlify preview deployments
        "https://*.netlify.com"   # Netlify custom domains
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not set")

client = OpenAI(api_key=OPENAI_API_KEY)

class GenerateRequest(BaseModel):
    description: str

@app.get("/")
async def root():
    return {"message": "SnapCode API", "endpoints": ["POST /generate"]}

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
        print(f"OpenAI API error: {e}")
        # Return detailed error information
        error_msg = str(e)
        if "insufficient_quota" in error_msg:
            raise HTTPException(status_code=402, detail="API quota exceeded. Please check your OpenAI billing.")
        elif "429" in error_msg:
            raise HTTPException(status_code=429, detail="Rate limit exceeded. Please wait a moment and try again.")
        elif "model_not_found" in error_msg:
            raise HTTPException(status_code=400, detail="Model not available. Please check your OpenAI account access.")
        elif "invalid_api_key" in error_msg:
            raise HTTPException(status_code=401, detail="Invalid API key. Please check your OpenAI API key.")
        else:
            raise HTTPException(status_code=500, detail=f"OpenAI API error: {error_msg}")
