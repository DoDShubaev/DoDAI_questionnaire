Write-Host "Starting AI Navigator Application..." -ForegroundColor Green

# Start backend in background
Write-Host "Starting FastAPI Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\api'; python run.py"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting React Frontend..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\frontend"
npm run dev 