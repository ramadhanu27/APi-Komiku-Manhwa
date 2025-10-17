@echo off
echo ========================================
echo   Deploy to Vercel
echo ========================================
echo.

echo [1/3] Checking git status...
git status

echo.
echo [2/3] Committing changes...
git add .
git commit -m "Update: Add demo website section and trust badges"

echo.
echo [3/3] Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo   Pushed to GitHub!
echo ========================================
echo.
echo Vercel will auto-deploy in ~2 minutes
echo Check: https://vercel.com/dashboard
echo.
pause
