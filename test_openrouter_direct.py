#!/usr/bin/env python3
"""
Direct test of OpenRouter API to verify connection and API key
"""

import requests
import json
import os
from dotenv import load_dotenv

def test_openrouter_direct():
    """Test OpenRouter API directly"""
    
    print("🔑 Testing OpenRouter API directly...")
    print("=" * 60)
    
    # Load environment variables
    load_dotenv("api/.env")
    
    api_key = os.getenv("OPENROUTER_API_KEY")
    base_url = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
    model = os.getenv("OPENROUTER_MODEL", "microsoft/phi-3-mini-128k-instruct:free")
    
    print(f"🔧 API Key: {api_key[:20]}...{api_key[-10:] if api_key else 'NOT FOUND'}")
    print(f"🌐 Base URL: {base_url}")
    print(f"🤖 Model: {model}")
    print()
    
    if not api_key:
        print("❌ Error: OPENROUTER_API_KEY not found in environment variables")
        return
    
    # Test message
    messages = [
        {"role": "system", "content": "You are a helpful AI assistant. Respond in Hebrew."},
        {"role": "user", "content": "שלום! איך אתה יכול לעזור לי עם AI?"}
    ]
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8000",  # Required by OpenRouter
        "X-Title": "AI Navigator Test"  # Optional but helps
    }
    
    payload = {
        "model": model,
        "messages": messages,
        "max_tokens": 200,
        "temperature": 0.7
    }
    
    try:
        print("📡 Making direct API call to OpenRouter...")
        
        response = requests.post(
            f"{base_url}/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        print(f"📊 Response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            
            if "choices" in result and len(result["choices"]) > 0:
                ai_response = result["choices"][0]["message"]["content"]
                print("✅ SUCCESS! OpenRouter responded:")
                print("-" * 50)
                print(ai_response)
                print("-" * 50)
                print("🎉 OpenRouter integration is working correctly!")
                
                # Check model info
                if "model" in result:
                    print(f"🤖 Model used: {result['model']}")
                    
                if "usage" in result:
                    usage = result["usage"]
                    print(f"📈 Tokens used: {usage.get('total_tokens', 'N/A')}")
                    
            else:
                print("❌ Error: No choices in response")
                print(f"Response: {result}")
                
        elif response.status_code == 401:
            print("❌ Authentication Error: Invalid API key")
            print("💡 Check if your OpenRouter API key is correct")
            
        elif response.status_code == 429:
            print("⏱️  Rate limit exceeded")
            print("💡 Wait a moment and try again")
            
        else:
            print(f"❌ Error: HTTP {response.status_code}")
            try:
                error_data = response.json()
                print(f"Error details: {error_data}")
            except:
                print(f"Raw response: {response.text}")
                
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Cannot reach OpenRouter API")
        print("💡 Check your internet connection")
        
    except requests.exceptions.Timeout:
        print("⏰ Timeout: OpenRouter API took too long to respond")
        
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

if __name__ == "__main__":
    test_openrouter_direct() 