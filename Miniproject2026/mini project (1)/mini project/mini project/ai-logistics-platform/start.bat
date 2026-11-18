@echo off
setlocal enabledelayedexpansion

title AI-LOGIX Command Platform - Unified Launcher
color 0B

echo =====================================================================
echo    AI-LOGIX: Multi-Modal Rural Logistics ^& Disaster Command
echo    Mini Project ^| Dept of Computer Science ^& Engineering, NCET
echo =====================================================================
echo.

:: 1. Verify Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js v18 or higher from https://nodejs.org/
    pause
    exit /b 1
)

:: 2. Verify Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.10 or higher from https://python.org/
    pause
    exit /b 1
)

echo [✓] Node.js environment detected:
node -v
echo [✓] Python environment detected:
python --version
echo.

:: 3. Check dependencies
if not exist "backend\node_modules" (
    echo [*] Installing backend dependencies...
    cd backend && call npm install && cd ..
)

if not exist "frontend\node_modules" (
    echo [*] Installing frontend dependencies...
    cd frontend && call npm install && cd ..
)

if not exist "ml-service\.venv" (
    echo [*] Setting up Python virtual environment...
    cd ml-service && python -m venv .venv && call .\.venv\Scripts\pip.exe install -r requirements.txt && cd ..
)

echo.
echo =====================================================================
echo    Starting all 3 microservices concurrently:
echo      1. Node.js Express Gateway    [:5050]
echo      2. Python ML / TreeSHAP Engine[:8000]
echo      3. Vite Frontend Web Console  [:5173]
echo =====================================================================
echo.

:: 4. Launch browser after 4 seconds in background
start /min cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:5173/"

:: 5. Launch all services via run_all.js
node run_all.js

pause
