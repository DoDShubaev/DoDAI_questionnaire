# Start AI Navigator Servers with OpenRouter Integration
Write-Host "🚀 Starting AI Navigator with Real AI Analysis..." -ForegroundColor Green
Write-Host ""

# Check if .env file exists
if (-not (Test-Path "api\.env")) {
    Write-Host "⚠️  Warning: .env file not found in api directory" -ForegroundColor Yellow
    Write-Host "   AI analysis will use fallback mode" -ForegroundColor Yellow
    Write-Host ""
}

# Start Backend (FastAPI with OpenRouter)
Write-Host "🔧 Starting Backend Server (FastAPI + OpenRouter)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd api; python run.py"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend (React)
Write-Host "🌐 Starting Frontend Server (React)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host ""
Write-Host "✅ AI Navigator is starting up!" -ForegroundColor Green
Write-Host "📊 Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "🌐 Frontend App: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🤖 AI Analysis: OpenRouter.ai (Free LLMs)" -ForegroundColor Magenta
Write-Host ""
Write-Host "The survey now uses REAL AI analysis powered by OpenRouter!" -ForegroundColor Green
Write-Host "Complete the survey to see personalized Hebrew recommendations." -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 