#!/usr/bin/env python3
"""
Simple script to view survey responses from the SQLite database
"""

import sqlite3
import json
import os
from datetime import datetime

def view_responses():
    db_path = 'api/survey_responses.db'
    
    print(f"🔍 Looking for database at: {os.path.abspath(db_path)}")
    print(f"📁 Database exists: {os.path.exists(db_path)}")
    
    if not os.path.exists(db_path):
        print("❌ Database file not found!")
        return
        
    try:
        # Connect to the database
        print("🔗 Connecting to database...")
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='survey_responses'")
        table_exists = cursor.fetchone()
        
        if not table_exists:
            print("❌ Table 'survey_responses' does not exist!")
            # Show what tables do exist
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = cursor.fetchall()
            print(f"📋 Available tables: {[t[0] for t in tables]}")
            return
        
        print("✅ Table found!")
        
        # Get all responses
        cursor.execute("SELECT * FROM survey_responses ORDER BY created_at DESC")
        rows = cursor.fetchall()
        
        # Get column names
        cursor.execute("PRAGMA table_info(survey_responses)")
        columns = [column[1] for column in cursor.fetchall()]
        
        print("=" * 80)
        print(f"📊 SURVEY RESPONSES DATABASE - {len(rows)} responses found")
        print("=" * 80)
        
        if not rows:
            print("📝 No responses found in the database yet.")
            print("💡 Try completing a survey first at http://localhost:5173")
            return
        
        for i, row in enumerate(rows, 1):
            print(f"\n🔹 Response #{i} (ID: {row[0]})")
            print("-" * 50)
            
            # Create a dictionary from row data
            response = dict(zip(columns, row))
            
            # Display all fields for debugging
            for key, value in response.items():
                if value is not None:
                    print(f"   {key}: {value}")
            
        print("\n" + "=" * 80)
        print("✅ Database query completed successfully!")
        
    except sqlite3.Error as e:
        print(f"❌ Database error: {e}")
        import traceback
        traceback.print_exc()
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    print("🚀 Starting Survey Database Viewer...")
    view_responses() 