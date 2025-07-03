#!/usr/bin/env python3
"""
Submit a test survey to generate AI analysis for dashboard testing
"""

import requests
import json

def submit_test_survey():
    """Submit a realistic survey response to test AI analysis"""
    
    print("🧪 Submitting test survey with AI analysis...")
    print("=" * 60)
    
    # Realistic survey data that will trigger good AI analysis
    survey_data = {
        "age_group": "25-34",
        "current_activity": ["עובד במקצוע הטכנולוגיה", "סטודנט"],
        "self_definition": "מקצוען טכנולוגיה",
        "self_definition_other": "",
        "known_ai_tools": ["ChatGPT", "GitHub Copilot", "Claude", "Midjourney"],
        "ai_usage_level": "כן – ואני משתמש באופן קבוע",
        "ai_experience": "למעלה משנה",
        "ai_learning_method": ["סרטונים ביוטיוב", "תיעוד רשמי של כלים", "קהילות באינטרנט"],
        "ai_learning_method_other": "",
        "main_ai_goal": "שיפור הפרודוקטיביות בעבודה",
        "main_ai_goal_other": "",
        "biggest_ai_challenge": "הבנת איך להשתמש בכלים בצורה יעילה",
        "ai_creation_dream": "יצירת מערכת AI שעוזרת למפתחים לכתוב קוד איכותי יותר ולחסוך זמן בפיתוח. רוצה ליצור בוט שמזהה באגים ומציע פתרונות אוטומטית.",
        "future_ai_impact": "חיסכון משמעותי בזמן ושיפור איכות העבודה",
        "monthly_spending": "50-100 ש״ח",
        "ai_barriers": ["מחיר גבוה", "קושי טכני בשימוש"],
        "barriers_other": "",
        "community_interest": "ברור שכן",
        "specific_ai_help": "הדרכה טכנית ומעשית",
        "specific_ai_help_other": "",
        "investment_willingness": "100-200 ש״ח",
        "platform_access": "כן",
        "first_name": "דני",
        "email": "danny.test@example.com",
        "completion_time": 180
    }
    
    # API endpoint
    url = "http://localhost:8000/api/surveys"
    
    try:
        print("📡 Sending survey data to backend...")
        response = requests.post(url, json=survey_data, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            survey_id = result.get("id")
            
            print("✅ Survey submitted successfully!")
            print(f"📊 Survey ID: {survey_id}")
            print()
            
            # Now generate AI analysis for this survey
            print("🤖 Generating AI analysis...")
            
            # Create analysis prompt based on survey data
            analysis_prompt = f"""
נתח את התשובות הבאות של משתמש בשאלון על שימוש ב-AI ותן המלצות מותאמות אישית:

גיל: {survey_data['age_group']}
עיסוק: {', '.join(survey_data['current_activity'])}
הגדרה עצמית: {survey_data['self_definition']}
כלים מוכרים: {', '.join(survey_data['known_ai_tools'])}
רמת שימוש: {survey_data['ai_usage_level']}
ניסיון קודם: {survey_data['ai_experience']}
דרך למידה מועדפת: {', '.join(survey_data['ai_learning_method'])}
מטרה עיקרית: {survey_data['main_ai_goal']}
האתגר הגדול ביותר: {survey_data['biggest_ai_challenge']}
חלום יצירה עם AI: {survey_data['ai_creation_dream']}
השפעה רצויה על החיים: {survey_data['future_ai_impact']}
הוצאה חודשית: {survey_data['monthly_spending']}
מחסומים: {', '.join(survey_data['ai_barriers'])}
עניין בקהילה: {survey_data['community_interest']}
עזרה ספציפית: {survey_data['specific_ai_help']}
נכונות להשקעה: {survey_data['investment_willingness']}

בהתבסס על כל המידע הזה, כתוב ניתוח מותאם אישית עם:
1. פרופיל אישיותי קצר המבוסס על הגדרה עצמית, מטרות ואתגרים.
2. המלצות ספציפיות ל-3 כלי AI שמתאימים למטרות ולניסיון שלו.
3. נתיב למידה מותאם אישית המבוסס על דרך הלמידה המועדפת עליו.
4. רעיון לפרויקט אישי שמתחבר לחלומות ולשאיפות שהציג.

כתוב בעברית, בטון חם, מעודד ומקצועי, באורך של כ-300 מילים.
            """
            
            # Call AI analysis endpoint
            analysis_url = "http://localhost:8000/api/ai/analyze"
            analysis_data = {
                "prompt": analysis_prompt,
                "add_context_from_internet": False
            }
            
            analysis_response = requests.post(analysis_url, json=analysis_data, timeout=30)
            
            if analysis_response.status_code == 200:
                analysis_result = analysis_response.json()
                ai_analysis = analysis_result.get("analysis", "")
                
                print("✅ AI Analysis Generated!")
                print("-" * 50)
                print(ai_analysis)
                print("-" * 50)
                print(f"📊 Analysis length: {len(ai_analysis)} characters")
                print()
                print("🎯 Now check your dashboard at: http://localhost:5173/dashboard")
                print("You should see the new survey response with AI analysis!")
                
            else:
                print(f"❌ AI Analysis failed: HTTP {analysis_response.status_code}")
                print(f"Response: {analysis_response.text}")
            
        else:
            print(f"❌ Survey submission failed: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Is the backend server running?")
        print("💡 Try: cd api && python run.py")
        
    except requests.exceptions.Timeout:
        print("⏰ Timeout: Request took too long")
        
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

if __name__ == "__main__":
    submit_test_survey() 