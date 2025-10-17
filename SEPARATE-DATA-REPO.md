# 📦 Separate Data Repository Solution

## Problem
- Main repo: 250MB+ (too big for Vercel)
- Data folder: 250MB+ (310 manhwa JSON files)
- Vercel limit: 250MB

## Solution
**Split into 2 repositories:**
1. **Main repo** (API code) - ~5MB ✅
2. **Data repo** (JSON files) - 250MB+ ✅

---

## 🎯 Architecture

### Before (Single Repo)
```
ramadhanu27/APi-Komiku-Manhwa
├── api/
├── data/              ← 250MB+
│   ├── komiku-list.json
│   └── Chapter/komiku/*.json
└── Total: 250MB+ ❌ (Too big for Vercel)
```

### After (Separate Repos)
```
ramadhanu27/APi-Komiku-Manhwa (Main)
├── api/
├── package.json
└── Total: ~5MB ✅ (Vercel OK!)

ramadhanu27/komiku-data (Data)
├── data/
│   ├── komiku-list.json
│   └── Chapter/komiku/*.json
└── Total: 250MB+ ✅ (No problem!)
```

---

## 🚀 Setup Guide

### Step 1: Create Data Repository

**Manual Steps:**
1. Go to: https://github.com/new
2. Repository name: `komiku-data`
3. Description: `Data for Komiku API`
4. Visibility: **Public** (important!)
5. Click "Create repository"

### Step 2: Copy Data to New Repo

```bash
# Clone new repo
cd "c:\Users\User\Desktop\File HTML"
git clone https://github.com/ramadhanu27/komiku-data.git
cd komiku-data

# Copy data folder
xcopy "..\scraper-komiku\data" "data\" /E /I /Y

# Commit and push
git add .
git commit -m "Initial commit: Add all manga data"
git push origin main
```

### Step 3: Remove Data from Main Repo

```bash
# Go back to main repo
cd "..\scraper-komiku"

# Add data to .gitignore
echo data/ >> .gitignore

# Remove from git (but keep locally)
git rm -r --cached data/

# Commit
git add .gitignore
git commit -m "Remove data folder, moved to separate repo"
git push origin main
```

### Step 4: Verify

**Main repo size:**
```bash
# Should be ~5MB now
git count-objects -vH
```

**Data repo:**
```
https://github.com/ramadhanu27/komiku-data
```

---

## ✅ API Already Updated!

The API (`api-server-vercel.js`) is already configured to fetch from separate repo:

```javascript
// Fetches from: https://raw.githubusercontent.com/ramadhanu27/komiku-data/main/data
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/ramadhanu27/komiku-data/main/data';
```

**Endpoints work automatically:**
- `/api/list` → Fetches from komiku-data repo
- `/api/manga/:slug` → Fetches from komiku-data repo
- `/api/chapters/:slug` → Fetches from komiku-data repo

---

## 🎯 Benefits

### 1. Vercel Deployment Works
```
Main repo: ~5MB ✅
Vercel limit: 250MB ✅
Result: Deployment success!
```

### 2. Separate Concerns
```
Main repo: Code, API, logic
Data repo: JSON files only
```

### 3. Independent Updates
```
Update code: Push to main repo
Update data: Push to data repo
No need to redeploy API!
```

### 4. Better Performance
```
API caches data for 5 minutes
Faster subsequent requests
```

---

## 🔄 Workflow

### Update Data (Add New Manga)
```bash
# 1. Scrape new data
cd scraper-komiku
node scrapers/scrape-simple.js --list 1000 --images

# 2. Copy to data repo
cd ..\komiku-data
xcopy "..\scraper-komiku\data" "data\" /E /I /Y

# 3. Push to data repo
git add .
git commit -m "Update: Add new manga"
git push origin main

# 4. API auto-updates (5 min cache)
# No API redeploy needed!
```

### Update API Code
```bash
# 1. Make changes to API
cd scraper-komiku
# Edit api/api-server-vercel.js

# 2. Push to main repo
git add .
git commit -m "Update: API improvements"
git push origin main

# 3. Vercel auto-deploys
# Data stays in separate repo
```

---

## 📊 Comparison

| Aspect | Single Repo | Separate Repos |
|--------|-------------|----------------|
| Main repo size | 250MB+ ❌ | ~5MB ✅ |
| Vercel deploy | ❌ Failed | ✅ Success |
| Update data | Redeploy API | No redeploy |
| Update code | Redeploy | Redeploy |
| Management | Simple | Slightly complex |

---

## 🚀 Deploy to Vercel (After Separation)

### Step 1: Update vercel.json
Already configured to use `api-server-vercel.js` ✅

### Step 2: Push Changes
```bash
git add .
git commit -m "Use separate data repository"
git push origin main
```

### Step 3: Vercel Auto-Deploy
```
⏳ Cloning repo (5MB only)
⏳ Building...
⏳ Deploying...
✅ Success!
```

### Step 4: Test
```bash
curl https://api-komiku-manhwa.vercel.app/api/health
curl https://api-komiku-manhwa.vercel.app/api/list
```

---

## 🔍 Verify Separation

### Check Main Repo Size
```bash
cd scraper-komiku
git count-objects -vH

# Should show: ~5MB
```

### Check Data Repo
```
https://github.com/ramadhanu27/komiku-data
# Should show: 250MB+ (all JSON files)
```

### Check API
```bash
# Should fetch from data repo
curl https://raw.githubusercontent.com/ramadhanu27/komiku-data/main/data/komiku-list.json
```

---

## ✅ Summary

**Problem:**
- ❌ Single repo: 250MB+
- ❌ Vercel: 250MB limit
- ❌ Deployment failed

**Solution:**
- ✅ Main repo: ~5MB (code only)
- ✅ Data repo: 250MB+ (JSON only)
- ✅ API fetches from data repo
- ✅ Vercel deployment works!

**Steps:**
1. Create `komiku-data` repository
2. Copy data folder to new repo
3. Remove data from main repo
4. API already configured ✅
5. Deploy to Vercel ✅

**Result:**
- ✅ Vercel deployment success
- ✅ API works perfectly
- ✅ Can update data independently
- ✅ No 250MB limit issues

---

## 🎯 Next Steps

1. **Create data repo**: https://github.com/new
2. **Run script**: `setup-separate-data-repo.bat`
3. **Deploy to Vercel**: Auto-deploy from GitHub
4. **Test API**: All endpoints working!

**This is the BEST solution for Vercel! 🎉**
