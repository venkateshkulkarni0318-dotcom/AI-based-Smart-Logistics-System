# AI-LOGIX Command Platform - PowerShell 1-Click Launcher
# Mini Project | Dept of Computer Science & Engineering, NCET

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "   AI-LOGIX: Multi-Modal Rural Logistics & Disaster Command" -ForegroundColor White
Write-Host "   Mini Project | Dept of Computer Science & Engineering, NCET" -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not found in PATH! Please install Node.js v18+." -ForegroundColor Red
    exit 1
}

# 2. Check Python
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Python is not found in PATH! Please install Python 3.10+." -ForegroundColor Red
    exit 1
}

$nodeVer = node -v
$pyVer = python --version
Write-Host "[✓] Node.js detected: $nodeVer" -ForegroundColor Green
Write-Host "[✓] Python detected: $pyVer" -ForegroundColor Green
Write-Host ""

# 3. Check Dependencies
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "[*] Installing backend dependencies..." -ForegroundColor Yellow
    Push-Location backend
    npm install
    Pop-Location
}

if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "[*] Installing frontend dependencies..." -ForegroundColor Yellow
    Push-Location frontend
    npm install
    Pop-Location
}

if (-not (Test-Path "ml-service\.venv")) {
    Write-Host "[*] Setting up Python virtual environment..." -ForegroundColor Yellow
    Push-Location ml-service
    python -m venv .venv
    .\.venv\Scripts\pip install -r requirements.txt
    Pop-Location
}

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "   Starting all 3 microservices concurrently..." -ForegroundColor White
Write-Host "   Browser will open automatically at http://localhost:5173/" -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

# Launch Browser after 4 seconds
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 4
    Start-Process "http://localhost:5173/"
} | Out-Null

# Start services via unified orchestrator
node run_all.js
