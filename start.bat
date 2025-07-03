@echo off
echo Starting AI Navigator (FastAPI + React)
echo.

echo Starting FastAPI backend...
start "API Server" cmd /k "cd api && python run.py"

timeout /t 3 /nobreak >nul

echo Starting React frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause >nul 