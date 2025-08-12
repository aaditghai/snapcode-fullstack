# SnapCode Backend

FastAPI backend for the SnapCode application.

## 🚀 Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export OPENAI_API_KEY="your-api-key-here"

# Run the server
python -m uvicorn main:app --host 127.0.0.1 --port 8002
```

## 📁 Structure

- `main.py` - FastAPI application with endpoints
- `requirements.txt` - Python dependencies
- `railway.json` - Railway deployment configuration
- `Procfile` - Railway deployment configuration

## 🔧 API Endpoints

- `GET /` - Health check
- `POST /generate` - Generate code from description
- `POST /upload` - Upload image (unused)

## 🌐 Deployment

Deployed on Railway. See main README for deployment instructions.
