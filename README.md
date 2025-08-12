# SnapCode

A fullstack application that generates HTML, CSS, and JavaScript code from text descriptions using AI.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + Python + OpenAI API
- **Deployment**: Netlify (Frontend) + Railway (Backend)

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd snapcode-fullstack
   ```

2. **Backend Setup**
   ```bash
   cd snapcode-backend
   pip install -r requirements.txt
   # Set your OpenAI API key
   export OPENAI_API_KEY="your-api-key-here"
   python -m uvicorn main:app --host 127.0.0.1 --port 8002
   ```

3. **Frontend Setup**
   ```bash
   cd snapcode-frontend
   npm install
   npm run dev
   ```

4. **Open the application**
   - Frontend: http://localhost:3000
   - Backend API: http://127.0.0.1:8002

## 🌐 Deployment

### Frontend (Netlify)

1. **Connect your GitHub repository to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Choose your repository

2. **Configure build settings**
   - **Base directory**: `snapcode-frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

3. **Environment variables**
   - Add `VITE_API_URL` with your Railway backend URL

### Backend (Railway)

1. **Connect your GitHub repository to Railway**
   - Go to [Railway](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Choose your repository

2. **Configure deployment**
   - **Root directory**: `snapcode-backend`
   - Railway will automatically detect it's a Python project

3. **Environment variables**
   - Add `OPENAI_API_KEY` with your OpenAI API key

4. **Get your Railway URL**
   - Railway will provide a URL like `https://your-app.railway.app`
   - Update your frontend's `VITE_API_URL` with this URL

## 📁 Project Structure

```
snapcode-fullstack/
├── snapcode-frontend/          # React frontend
│   ├── src/
│   ├── package.json
│   ├── netlify.toml           # Netlify configuration
│   └── ...
├── snapcode-backend/           # FastAPI backend
│   ├── main.py
│   ├── requirements.txt
│   ├── railway.json           # Railway configuration
│   ├── Procfile              # Railway deployment
│   └── ...
├── .gitignore
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Backend (Railway)**
- `OPENAI_API_KEY`: Your OpenAI API key

**Frontend (Netlify)**
- `VITE_API_URL`: Your Railway backend URL

### API Endpoints

- `POST /generate`: Generate code from description
  - Body: `{"description": "your description here"}`
  - Returns: `{"code": "generated HTML/CSS/JS"}`

## 🛠️ Development

### Adding new features

1. **Frontend changes**: Edit files in `snapcode-frontend/src/`
2. **Backend changes**: Edit files in `snapcode-backend/`
3. **Deployment**: Push to GitHub, both Netlify and Railway will auto-deploy

### Local testing

```bash
# Test backend API
curl -X POST http://127.0.0.1:8002/generate \
  -H "Content-Type: application/json" \
  -d '{"description": "A simple login form"}'
```

## 📝 License

MIT License 