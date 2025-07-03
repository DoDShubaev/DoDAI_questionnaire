#!/usr/bin/env python3
"""
Test script for OpenRouter AI integration
"""

import asyncio
import requests
import json

async def test_openrouter_integration():
    """Test the OpenRouter AI analysis endpoint"""
    
    print("🧪 Testing OpenRouter AI Integration...")
    print("=" * 50)
    
    # Test data - Hebrew survey prompt
    test_prompt = """
    נתח את התשובות הבאות של משתמש בשאלון על שימוש ב-AI ותן המלצות מותאמות אישית:
    
    גיל: 25-34
    עיסוק: מתכנת
    הגדרה עצמית: מקצוען טכנולוגיה
    כלים מוכרים: ChatGPT, GitHub Copilot
    רמת שימוש: כן – ואני משתמש באופן קבוע
    מטרה עיקרית: שיפור הפרודוקטיביות בעבודה
    חלום יצירה עם AI: יצירת כלי אוטומציה לפיתוח
    
    בהתבסס על כל המידע הזה, כתוב ניתוח מותאם אישית בעברית.
    """
    
    # API endpoint
    url = "http://localhost:8000/api/ai/analyze"
    
    # Request payload
    payload = {
        "prompt": test_prompt,
        "add_context_from_internet": False
    }
    
    try:
        print("📡 Sending request to OpenRouter...")
        response = requests.post(url, json=payload, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            analysis = result.get("analysis", "")
            
            print("✅ SUCCESS! OpenRouter AI Response:")
            print("-" * 50)
            print(analysis)
            print("-" * 50)
            print(f"📊 Response length: {len(analysis)} characters")
            print("🎯 Hebrew AI analysis generated successfully!")
            
            # Check if it's a real AI response (not fallback)
            if "מותאם אישית" in analysis and len(analysis) > 200:
                print("🤖 This appears to be a REAL AI-generated response!")
            else:
                print("⚠️  This might be the fallback response.")
                
        else:
            print(f"❌ Error: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Is the backend server running?")
        print("💡 Try: cd api && python run.py")
        
    except requests.exceptions.Timeout:
        print("⏰ Timeout: OpenRouter API took too long to respond")
        
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_openrouter_integration()) 