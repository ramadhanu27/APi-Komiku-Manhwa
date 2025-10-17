@echo off
echo ========================================
echo   Update Railway URL
echo ========================================
echo.

set /p RAILWAY_URL="Enter your Railway URL (e.g., https://your-app.up.railway.app): "

echo.
echo Updating api/index.html...

powershell -Command "(Get-Content 'api/index.html') -replace 'https://api-komiku-manhwa.vercel.app', '%RAILWAY_URL%' | Set-Content 'api/index.html'"

echo.
echo ========================================
echo   URL Updated!
echo ========================================
echo.
echo Old URL: https://api-komiku-manhwa.vercel.app
echo New URL: %RAILWAY_URL%
echo.
echo Next steps:
echo   1. git add api/index.html
echo   2. git commit -m "Update: Railway URL"
echo   3. git push origin main
echo.
pause
