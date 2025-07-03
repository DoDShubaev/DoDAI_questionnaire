# AI Navigator FastAPI Backend

Simple FastAPI backend for the AI Navigator survey application.

## Setup

1. Install Python 3.8+
2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python run.py
```

The API will be available at: http://localhost:8000

## Endpoints

- `GET /health` - Health check
- `POST /api/surveys` - Create survey response
- `GET /api/surveys` - Get all survey responses
- `GET /api/surveys/{id}` - Get specific survey
- `GET /api/surveys/stats` - Get statistics
- `POST /api/ai/analyze` - Generate AI analysis

## Database

Uses SQLite database (`survey_responses.db`) that's created automatically.

## Development

The server runs with auto-reload enabled for development. 