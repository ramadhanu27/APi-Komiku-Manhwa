@echo off
echo ========================================
echo   Komiku API - Restart and Open
echo ========================================
echo.

echo [1/3] Stopping existing server...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo [2/3] Starting API server...
cd /d "%~dp0"
start "Komiku API Server" cmd /k "node api/api-server.js"
timeout /t 3 /nobreak >nul

echo [3/3] Opening browser...
start http://localhost:3000

echo.
echo ========================================
echo   Server started and browser opened!
echo ========================================
echo.
echo Server running at: http://localhost:3000
echo Press any key to close this window...
pause >nul
