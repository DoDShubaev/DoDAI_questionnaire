#!/usr/bin/env python3
"""
Simple test script for AI Navigator API
"""
import requests
import json

API_URL = "http://localhost:8000"

def test_api():
    print("🧪 Testing AI Navigator FastAPI...\n")
    
    # Test health check
    try:
        print("1. Testing health check...")
        response = requests.get(f"{API_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check: {data['status']}")
            print(f"   Database: {data['database']}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return
    
    # Test creating a survey
    try:
        print("\n2. Testing survey creation...")
        survey_data = {
            "age_group": "22–26",
            "current_activity": ["סטודנט"],
            "self_definition": "טכנולוגי",
            "known_ai_tools": ["ChatGPT"],
            "ai_usage_level": "כן – ואני משתמש באופן קבוע",
            "ai_experience": "Testing the FastAPI",
            "completion_time": 120,
            "first_name": "Test User",
            "email": "test@example.com"
        }
        
        response = requests.post(f"{API_URL}/api/surveys", json=survey_data)
        if response.status_code == 200:
            data = response.json()
            print("✅ Survey created successfully")
            print(f"   ID: {data['id']}")
            
            # Test getting the survey
            print("\n3. Testing survey retrieval...")
            get_response = requests.get(f"{API_URL}/api/surveys/{data['id']}")
            if get_response.status_code == 200:
                survey = get_response.json()
                print("✅ Survey retrieved successfully")
                print(f"   Age group: {survey['age_group']}")
            else:
                print(f"❌ Survey retrieval failed: {get_response.status_code}")
        else:
            print(f"❌ Survey creation failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Survey test failed: {e}")
    
    # Test AI analysis
    try:
        print("\n4. Testing AI analysis...")
        analysis_data = {
            "prompt": "Test analysis prompt",
            "add_context_from_internet": False
        }
        response = requests.post(f"{API_URL}/api/ai/analyze", json=analysis_data)
        if response.status_code == 200:
            data = response.json()
            print("✅ AI analysis generated successfully")
            print(f"   Analysis length: {len(data['analysis'])} characters")
        else:
            print(f"❌ AI analysis failed: {response.status_code}")
    except Exception as e:
        print(f"❌ AI analysis test failed: {e}")
    
    # Test statistics
    try:
        print("\n5. Testing statistics...")
        response = requests.get(f"{API_URL}/api/surveys/stats")
        if response.status_code == 200:
            data = response.json()
            print("✅ Statistics retrieved successfully")
            print(f"   Total surveys: {data['total']}")
            print(f"   Today: {data['today']}")
        else:
            print(f"❌ Statistics failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Statistics test failed: {e}")
    
    print("\n🎉 API testing completed!")

if __name__ == "__main__":
    try:
        test_api()
    except KeyboardInterrupt:
        print("\n\n👋 Test interrupted by user")
    except Exception as e:
        print(f"\n❌ Test failed: {e}") 