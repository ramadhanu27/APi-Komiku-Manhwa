@echo off
echo ========================================
echo   Upload Data and Deploy
echo ========================================
echo.

echo [Step 1/4] Clone Komiku-Data repo...
cd ..
git clone https://github.com/ramadhanu27/Komiku-Data.git 2>nul || cd Komiku-Data
cd Komiku-Data

echo.
echo [Step 2/4] Copy data folder...
echo This may take a few minutes (250MB+)...
xcopy "..\scraper-komiku\data" "." /E /I /Y

echo.
echo [Step 3/4] Commit and push data...
git add .
git commit -m "Add manga data: 310+ manhwa with chapters"
git push origin main

echo.
echo [Step 4/4] Update main repo...
cd "..\scraper-komiku"
git add api/api-server-vercel.js
git commit -m "Fix: Update data repo URL to Komiku-Data"
git push origin main

echo.
echo ========================================
echo   Upload Complete!
echo ========================================
echo.
echo Data repo: https://github.com/ramadhanu27/Komiku-Data
echo Main repo: https://github.com/ramadhanu27/APi-Komiku-Manhwa
echo.
echo Vercel will auto-deploy in ~2 minutes
echo.
echo Test after deployment:
echo   https://api-komiku-manhwa.vercel.app/api/health
echo   https://api-komiku-manhwa.vercel.app/api/list
echo.
pause
