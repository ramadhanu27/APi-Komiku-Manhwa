@echo off
echo ========================================
echo   Setup Vercel Branch (No Data)
echo ========================================
echo.

echo [1/6] Creating vercel-deploy branch...
git checkout -b vercel-deploy 2>nul || git checkout vercel-deploy

echo.
echo [2/6] Removing data folder from this branch...
git rm -r --cached data/
git commit -m "Remove data folder for Vercel deployment"

echo.
echo [3/6] Adding .gitignore for data...
echo data/ >> .gitignore
git add .gitignore
git commit -m "Ignore data folder in vercel-deploy branch"

echo.
echo [4/6] Pushing vercel-deploy branch...
git push -u origin vercel-deploy --force

echo.
echo [5/6] Switching back to main branch...
git checkout main

echo.
echo [6/6] Done!
echo.
echo ========================================
echo   Vercel Branch Created!
echo ========================================
echo.
echo Next steps:
echo   1. Go to Vercel Dashboard
echo   2. Settings → Git
echo   3. Change Production Branch to: vercel-deploy
echo   4. Redeploy
echo.
echo Branch info:
echo   - main branch: Has data folder (for development)
echo   - vercel-deploy branch: No data (for production)
echo.
pause
