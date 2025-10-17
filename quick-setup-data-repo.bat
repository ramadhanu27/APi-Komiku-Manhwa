@echo off
echo ========================================
echo   Quick Setup Data Repository
echo ========================================
echo.

echo Step 1: Create repo on GitHub first!
echo   Go to: https://github.com/new
echo   Name: komiku-data
echo   Public repository
echo   Click "Create repository"
echo.
pause

echo.
echo Step 2: Clone and setup...
cd ..
git clone https://github.com/ramadhanu27/komiku-data.git
cd komiku-data

echo.
echo Step 3: Copy data folder...
xcopy "..\scraper-komiku\data" "." /E /I /Y

echo.
echo Step 4: Commit and push...
git add .
git commit -m "Initial: Add manga data (310+ manhwa)"
git push origin main

echo.
echo ========================================
echo   Data Repo Created!
echo ========================================
echo.
echo Repo URL: https://github.com/ramadhanu27/komiku-data
echo.
echo Vercel will now work because:
echo   - Main repo: ~5MB (no data folder)
echo   - Data repo: 250MB+ (all JSON files)
echo   - API fetches from data repo
echo.
echo Next: Redeploy on Vercel
echo.
pause
