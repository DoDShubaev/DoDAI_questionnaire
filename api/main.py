from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import sqlite3
import json
import datetime
import os
from dotenv import load_dotenv
from openai import AsyncOpenAI

# Load environment variables
load_dotenv()

app = FastAPI(title="AI Navigator API", version="1.0.0")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://dodai-questionnaire.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenRouter configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "microsoft/phi-3-mini-128k-instruct:free")

# Initialize OpenAI client for OpenRouter
openai_client = AsyncOpenAI(
    base_url=OPENROUTER_BASE_URL,
    api_key=OPENROUTER_API_KEY,
) if OPENROUTER_API_KEY else None

# Database setup
DB_FILE = "survey_responses.db"

def init_db():
    """Initialize SQLite database with survey_responses table"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS survey_responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            age_group TEXT,
            current_activity TEXT,
            self_definition TEXT,
            self_definition_other TEXT,
            known_ai_tools TEXT,
            ai_usage_level TEXT,
            ai_experience TEXT,
            ai_learning_method TEXT,
            ai_learning_method_other TEXT,
            main_ai_goal TEXT,
            main_ai_goal_other TEXT,
            biggest_ai_challenge TEXT,
            ai_creation_dream TEXT,
            future_ai_impact TEXT,
            monthly_spending TEXT,
            ai_barriers TEXT,
            barriers_other TEXT,
            community_interest TEXT,
            specific_ai_help TEXT,
            specific_ai_help_other TEXT,
            investment_willingness TEXT,
            platform_access TEXT,
            first_name TEXT,
            email TEXT,
            completion_time INTEGER,
            ai_analysis TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Pydantic models
class SurveyResponse(BaseModel):
    age_group: Optional[str] = None
    current_activity: Optional[List[str]] = None
    self_definition: Optional[str] = None
    self_definition_other: Optional[str] = None
    known_ai_tools: Optional[List[str]] = None
    ai_usage_level: Optional[str] = None
    ai_experience: Optional[str] = None
    ai_learning_method: Optional[List[str]] = None
    ai_learning_method_other: Optional[str] = None
    main_ai_goal: Optional[str] = None
    main_ai_goal_other: Optional[str] = None
    biggest_ai_challenge: Optional[str] = None
    ai_creation_dream: Optional[str] = None
    future_ai_impact: Optional[str] = None
    monthly_spending: Optional[str] = None
    ai_barriers: Optional[List[str]] = None
    barriers_other: Optional[str] = None
    community_interest: Optional[str] = None
    specific_ai_help: Optional[str] = None
    specific_ai_help_other: Optional[str] = None
    investment_willingness: Optional[str] = None
    platform_access: Optional[str] = None
    first_name: Optional[str] = None
    email: Optional[str] = None
    completion_time: Optional[int] = None
    ai_analysis: Optional[str] = None

class AnalysisRequest(BaseModel):
    prompt: str
    add_context_from_internet: bool = False

def generate_ai_analysis(responses: dict) -> str:
    """Simple AI analysis generator based on survey responses"""
    
    # Extract key information
    age = responses.get('age_group', 'לא צוין')
    activity = ', '.join(responses.get('current_activity', [])) if responses.get('current_activity') else 'לא צוין'
    definition = responses.get('self_definition', 'לא צוין')
    tools = ', '.join(responses.get('known_ai_tools', [])) if responses.get('known_ai_tools') else 'לא צוין'
    usage_level = responses.get('ai_usage_level', 'לא צוין')
    main_goal = responses.get('main_ai_goal', 'לא צוין')
    
    # Generate personalized analysis
    analysis = f"""
🎯 **הפרופיל האישי שלך**

בהתבסס על התשובות שלך, אני רואה שאתה {definition.lower()} בגיל {age}, {activity}. 
המטרה העיקרית שלך עם AI היא {main_goal.lower()}, והניסיון שלך כרגע הוא ברמה של "{usage_level}".

🚀 **המלצות מותאמות אישית**

בהתבסס על הפרופיל שלך, אני ממליץ להתמקד ב:

1. **ChatGPT** - מושלם לשיפור הפרודוקטיביות והלמידה
2. **Claude** - מעולה לכתיבה ופתרון בעיות מורכבות  
3. **Perplexity** - מצוין למחקר ואיסוף מידע

📚 **נתיב הלמידה המומלץ**

1. התחל עם ChatGPT בפרויקטים קטנים יומיומיים
2. למד על הנדסת פרומפטים (Prompt Engineering)
3. נסה ליישם AI בתחום העיסוק שלך

💡 **רעיון לפרויקט ראשון**

מומלץ לבחור פרויקט קטן הקשור לתחום שלך - למשל אוטומציה של משימה יומיומית או יצירת תוכן מותאם אישית.

בהצלחה במסע שלך עם AI! 🌟
    """
    
    return analysis.strip()

# API endpoints
@app.get("/")
async def root():
    return {"message": "AI Navigator API", "status": "running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "sqlite",
        "timestamp": datetime.datetime.now().isoformat()
    }

@app.post("/api/surveys")
async def create_survey(survey: SurveyResponse):
    """Create a new survey response"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Convert lists to JSON strings for storage
        data = survey.dict()
        for field in ['current_activity', 'known_ai_tools', 'ai_learning_method', 'ai_barriers']:
            if data.get(field):
                data[field] = json.dumps(data[field])
        
        # Insert survey response
        columns = list(data.keys())
        placeholders = ', '.join(['?' for _ in columns])
        query = f"INSERT INTO survey_responses ({', '.join(columns)}) VALUES ({placeholders})"
        
        cursor.execute(query, list(data.values()))
        survey_id = cursor.lastrowid
        
        conn.commit()
        conn.close()
        
        return {"id": survey_id, "message": "Survey created successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating survey: {str(e)}")

@app.get("/api/surveys")
async def get_surveys(limit: int = 100, offset: int = 0):
    """Get all survey responses"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT * FROM survey_responses 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        """, (limit, offset))
        
        rows = cursor.fetchall()
        columns = [description[0] for description in cursor.description]
        
        surveys = []
        for row in rows:
            survey = dict(zip(columns, row))
            # Convert JSON strings back to lists
            for field in ['current_activity', 'known_ai_tools', 'ai_learning_method', 'ai_barriers']:
                if survey.get(field):
                    try:
                        survey[field] = json.loads(survey[field])
                    except:
                        pass
            surveys.append(survey)
        
        conn.close()
        return {"surveys": surveys, "total": len(surveys)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching surveys: {str(e)}")

@app.get("/api/surveys/{survey_id}")
async def get_survey(survey_id: int):
    """Get a specific survey response"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM survey_responses WHERE id = ?", (survey_id,))
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Survey not found")
        
        columns = [description[0] for description in cursor.description]
        survey = dict(zip(columns, row))
        
        # Convert JSON strings back to lists
        for field in ['current_activity', 'known_ai_tools', 'ai_learning_method', 'ai_barriers']:
            if survey.get(field):
                try:
                    survey[field] = json.loads(survey[field])
                except:
                    pass
        
        conn.close()
        return survey
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching survey: {str(e)}")

@app.post("/api/ai/analyze")
async def analyze_responses(request: AnalysisRequest):
    """Generate AI analysis for survey responses using OpenRouter"""
    try:
        if not openai_client:
            # Fallback to static analysis if OpenRouter is not configured
            return {"analysis": get_fallback_analysis()}
        
        # Enhanced system prompt for better Hebrew analysis
        system_prompt = """
אתה מומחה AI שמסייע לאנשים בישראל להבין ולהתחיל להשתמש בטכנולוגיות בינה מלאכותית.
המטרה שלך היא לנתח תשובות שאלון ולתת המלצות מותאמות אישית בעברית.

הנחיות לניתוח:
1. כתוב בעברית בטון חם, מעודד ומקצועי
2. תן המלצות ספציפיות ומעשיות 
3. התמקד בכלי AI חינמיים ונגישים
4. הצע נתיב למידה הדרגתי
5. כלול רעיון לפרויקט ראשון מותאם אישית
6. השתמש באמוג'י להפיכת התוכן לחזותי יותר

מבנה הניתוח:
🎯 פרופיל אישי (2-3 שורות)
🚀 המלצות לכלי AI (3 כלים ספציפיים)
📚 נתיב למידה מומלץ (3-4 צעדים)
💡 רעיון לפרויקט ראשון
✨ עידוד לסיום

אורך: כ-250 מילים.
        """
        
        # Call OpenRouter API
        response = await openai_client.chat.completions.create(
            model=OPENROUTER_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.prompt}
            ],
            max_tokens=800,
            temperature=0.7
        )
        
        analysis = response.choices[0].message.content
        return {"analysis": analysis}
        
    except Exception as e:
        # Return fallback analysis if OpenRouter fails
        print(f"OpenRouter API error: {str(e)}")
        return {"analysis": get_fallback_analysis()}

def get_fallback_analysis():
    """Fallback analysis when OpenRouter is unavailable"""
    return """
🎯 **ניתוח מותאם אישית**

בהתבסס על התשובות שלך, אני יכול לראות שיש לך עניין אמיתי בטכנולוגיות AI. 

🚀 **המלצות ראשונות**
1. **ChatGPT** - התחל עם השירות החינמי לשיפור הפרודוקטיביות היומיומית
2. **Claude** - מעולה לכתיבה ופתרון בעיות מורכבות
3. **Perplexity** - מצוין למחקר ואיסוף מידע

📚 **נתיב למידה מומלץ**
• צפה בסרטונים בעברית על AI ביוטיוב
• התחל עם פרויקטים קטנים יומיומיים
• למד הנדסת פרומפטים בסיסית
• הצטרף לקהילות AI בעברית

💡 **הצעה לפרויקט ראשון**
נסה להשתמש ב-ChatGPT לכתיבת אימיילים מקצועיים או לסיכום מאמרים - זה יתן לך הרגשה ראשונה של הכוח של AI.

✨ בהצלחה במסע שלך עם AI! יש לך את כל הכלים להצליח!
    """.strip()

@app.get("/api/surveys/stats")
async def get_stats():
    """Get survey statistics"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Total count
        cursor.execute("SELECT COUNT(*) FROM survey_responses")
        total = cursor.fetchone()[0]
        
        # Today's count
        cursor.execute("""
            SELECT COUNT(*) FROM survey_responses 
            WHERE DATE(created_at) = DATE('now')
        """)
        today = cursor.fetchone()[0]
        
        conn.close()
        return {"total": total, "today": today}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stats: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 