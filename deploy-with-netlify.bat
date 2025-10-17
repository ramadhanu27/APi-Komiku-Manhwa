@echo off
echo ========================================
echo   Deploy with Netlify Data Source
echo ========================================
echo.

echo Architecture:
echo   Netlify: https://data-komiku.netlify.app (Data CDN)
echo   Vercel:  API Server (fetches from Netlify)
echo.

echo [1/2] Committing changes...
git add api/api-server-vercel.js
git commit -m "Update: Use Netlify CDN as primary data source"

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
echo Benefits:
echo   ✅ Netlify: Fast CDN for data
echo   ✅ Vercel: Serverless API (no 250MB issue!)
echo   ✅ Fallback: GitHub if Netlify down
echo   ✅ Cache: 5 minutes for performance
echo.
echo Test after deployment:
echo   https://api-komiku-manhwa.vercel.app/api/health
echo   https://api-komiku-manhwa.vercel.app/api/list
echo.
pause
