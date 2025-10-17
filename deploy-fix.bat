@echo off
echo ========================================
echo   Fix Vercel Deployment (250MB Error)
echo ========================================
echo.

echo [INFO] Solution: Use GitHub Raw for data
echo [INFO] Exclude data folder from deployment
echo.

echo [1/4] Adding files...
git add .vercelignore
git add vercel.json
git add api/api-server-vercel.js
git add api/index.html

echo.
echo [2/4] Committing changes...
git commit -m "Fix: Exclude data folder, use GitHub raw for API data"

echo.
echo [3/4] Pushing to GitHub...
git push origin main

echo.
echo [4/4] Deployment info...
echo.
echo ========================================
echo   Changes Pushed!
echo ========================================
echo.
echo What changed:
echo   - Excluded data/ folder from Vercel
echo   - Created api-server-vercel.js
echo   - Fetch data from GitHub raw
echo   - Function size: ~5MB (was 250MB+)
echo.
echo Vercel will auto-deploy in ~2 minutes
echo Check: https://vercel.com/dashboard
echo.
echo Data source: GitHub Raw
echo   https://raw.githubusercontent.com/ramadhanu27/APi-Komiku-Manhwa/main/data
echo.
pause
