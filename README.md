# AI Navigator

Simple AI survey application with FastAPI backend and React frontend.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm

### 1. Clone and Setup

```bash
git clone <repository-url>
cd ai-navigator
```

### 2. Setup Backend (FastAPI)

```bash
cd api
pip install -r requirements.txt
python run.py
```

Backend runs on: http://localhost:8000

### 3. Setup Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

### 4. Open Application

Visit http://localhost:5173 to use the survey!

## 📁 Project Structure

```
ai-navigator/
├── api/              # FastAPI backend
│   ├── main.py       # Main FastAPI app
│   ├── run.py        # Development server
│   └── requirements.txt
├── frontend/         # React frontend
│   ├── src/
│   ├── pages/        # Survey pages
│   ├── components/   # UI components
│   └── package.json
└── README.md
```

## 🛠️ Features

- **Multi-step Survey**: Comprehensive AI usage questionnaire in Hebrew
- **AI Analysis**: Personalized recommendations based on responses
- **SQLite Database**: Simple local storage for survey responses
- **Modern UI**: Beautiful React interface with Tailwind CSS
- **CORS Enabled**: Frontend and backend communicate seamlessly

## 🗄️ Database

Uses SQLite (`survey_responses.db`) that's created automatically when you first run the API.

## 🔧 Development

### Backend Development
```bash
cd api
python run.py  # Auto-reload enabled
```

### Frontend Development
```bash
cd frontend
npm run dev  # Hot reload enabled
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/surveys` | Create survey response |
| GET | `/api/surveys` | Get all responses |
| GET | `/api/surveys/{id}` | Get specific response |
| GET | `/api/surveys/stats` | Get statistics |
| POST | `/api/ai/analyze` | Generate AI analysis |

## 🎯 Survey Flow

1. **Welcome Screen**: Introduction to the survey
2. **Multi-step Questions**: Demographics, AI experience, goals
3. **AI Analysis**: Personalized recommendations
4. **Results**: Display insights and next steps

## ⚡ Windows Quick Start

For Windows users, double-click `start.bat` to start both servers automatically.

## 🔄 Data Structure

The survey collects:
- Demographics (age, activity, self-definition)
- AI Knowledge (tools, experience level)
- Goals and Challenges
- Learning preferences
- Investment willingness
- Contact information (optional)

## 🛡️ Technology Stack

**Backend:**
- FastAPI (Python web framework)
- SQLite (Database)
- Pydantic (Data validation)

**Frontend:**
- React 18
- Tailwind CSS
- Vite (Build tool)
- Framer Motion (Animations)
- Lucide React (Icons)

## 📝 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## 🚀 Production Deployment

### Backend
```bash
cd api
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm run build
# Serve the 'dist' folder
```

## 🧪 Testing

Test the API directly:
```bash
curl http://localhost:8000/health
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📜 License

MIT License

## 🆘 Troubleshooting

**Backend won't start:**
- Check Python version (3.8+)
- Install requirements: `pip install -r requirements.txt`
- Check port 8000 is available

**Frontend won't start:**
- Check Node.js version (18+)
- Run `npm install` in frontend directory
- Check port 5173 is available

**CORS errors:**
- Ensure backend is running on port 8000
- Check VITE_API_URL in frontend/.env

## ✨ What's New

This is a completely refactored version using:
- ✅ FastAPI instead of Express.js
- ✅ Pure Python backend (no Node.js)
- ✅ Removed all external service dependencies
- ✅ Simple SQLite database
- ✅ Cleaner, simpler codebase
- ✅ Same beautiful frontend design