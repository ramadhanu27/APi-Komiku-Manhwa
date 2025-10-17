@echo off
echo ========================================
echo   Setup Separate Data Repository
echo ========================================
echo.

echo This script will:
echo   1. Create new repo for data only
echo   2. Remove data from main repo
echo   3. Update API to fetch from data repo
echo.
pause

echo.
echo [Step 1] Creating data repository...
echo.
echo Please do this manually:
echo   1. Go to: https://github.com/new
echo   2. Repository name: komiku-data
echo   3. Description: Data for Komiku API
echo   4. Public repository
echo   5. Click "Create repository"
echo.
echo Press any key when done...
pause >nul

echo.
echo [Step 2] Cloning and setting up data repo...
cd ..
git clone https://github.com/ramadhanu27/komiku-data.git
cd komiku-data

echo.
echo [Step 3] Copying data folder...
xcopy "..\scraper-komiku\data" "data\" /E /I /Y

echo.
echo [Step 4] Committing data...
git add .
git commit -m "Initial commit: Add all manga data"
git push origin main

echo.
echo [Step 5] Going back to main repo...
cd "..\scraper-komiku"

echo.
echo [Step 6] Removing data from main repo...
echo data/ >> .gitignore
git rm -r --cached data/
git add .gitignore
git commit -m "Remove data folder, moved to separate repo"
git push origin main

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Main repo: https://github.com/ramadhanu27/APi-Komiku-Manhwa
echo Data repo: https://github.com/ramadhanu27/komiku-data
echo.
echo Next: Update API to use data repo URL
echo.
pause
