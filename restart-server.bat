@echo off
echo Stopping existing server...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo Starting API server...
cd /d "%~dp0"
start "Komiku API Server" cmd /k "node api/api-server.js"

echo.
echo Server restarted!
echo Open: http://localhost:3000
echo.
pause
