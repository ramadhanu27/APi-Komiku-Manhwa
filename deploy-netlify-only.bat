@echo off
echo ========================================
echo   Deploy with Netlify CDN Only
echo ========================================
echo.

echo Data Source: https://manhwaapi.netlify.app
echo API Server: Vercel
echo.

echo [1/2] Committing changes...
git add api/api-server-vercel.js
git commit -m "Fix: Use correct Netlify URL (manhwaapi.netlify.app)"

echo.
echo [2/2] Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo   Deployed!
echo ========================================
echo.
echo Vercel will auto-deploy in ~2 minutes
echo.
echo Architecture:
echo   Netlify: https://manhwaapi.netlify.app (Data CDN)
echo   Vercel:  API Server (fetches from Netlify)
echo.
echo Test after deployment:
echo   https://api-komiku-manhwa.vercel.app/api/health
echo   https://api-komiku-manhwa.vercel.app/api/list
echo.
pause
