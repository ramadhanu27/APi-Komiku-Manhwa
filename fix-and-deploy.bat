@echo off
echo ========================================
echo   Fix Vercel 500 Error and Deploy
echo ========================================
echo.

echo Changes made:
echo   ✅ Added fallback to main repo if data repo fails
echo   ✅ Better error handling with try-catch
echo   ✅ Global error handler
echo   ✅ 404 handler
echo   ✅ Timeout for axios requests
echo.

echo [1/3] Adding files...
git add api/api-server-vercel.js
git add vercel.json
git add .vercelignore

echo.
echo [2/3] Committing...
git commit -m "Fix: Add error handling and fallback for data fetching"

echo.
echo [3/3] Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo   Deployed!
echo ========================================
echo.
echo Vercel will auto-deploy in ~2 minutes
echo.
echo What was fixed:
echo   - Fallback to main repo if data repo not found
echo   - Better error messages
echo   - Proper error handling
echo   - Timeout for slow requests
echo.
echo Test after deployment:
echo   https://api-komiku-manhwa.vercel.app/api/health
echo.
pause
