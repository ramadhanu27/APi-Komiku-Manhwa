# Fix Vercel 250MB Error - Solutions

## Problem
- Data folder (310 manhwa) = 250MB+
- Vercel Serverless Function limit = 250MB
- `.vercelignore` doesn't work because data is in Git history

## Solutions (Choose One)

### ✅ Solution 1: Deploy to Railway (Recommended)
Railway has no 250MB limit and supports full Node.js apps.

**Steps:**
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repo
4. Railway will auto-detect and deploy
5. No changes needed!

**Pros:**
- ✅ No size limit
- ✅ Works with existing code
- ✅ Free tier available
- ✅ Faster than Vercel for this use case

**Cons:**
- ❌ Different platform

---

### ✅ Solution 2: Use Vercel + External Data Storage

Keep API on Vercel, store data elsewhere.

**Option A: GitHub Raw (Current)**
- Already implemented in `api-server-vercel.js`
- Fetches data from GitHub raw URLs
- Problem: Vercel still clones full repo

**Option B: Vercel Blob Storage**
```bash
npm install @vercel/blob
```

Upload data to Vercel Blob:
```javascript
import { put } from '@vercel/blob';

// Upload once
const blob = await put('komiku-list.json', file, {
  access: 'public',
});
```

**Option C: External CDN (Cloudflare R2, AWS S3)**
- Upload data to CDN
- API fetches from CDN
- Free tier available

---

### ✅ Solution 3: Separate Data Repository

Create new repo for data only.

**Steps:**
1. Create new repo: `komiku-data`
2. Move `data/` folder to new repo
3. Update API to fetch from new repo
4. Main repo size: ~5MB ✅

**Pros:**
- ✅ Clean separation
- ✅ Vercel deployment works
- ✅ Can update data independently

**Cons:**
- ❌ Need to manage 2 repos

---

### ✅ Solution 4: Remove Data from Git History

Remove data from Git history completely.

**Steps:**
```bash
# Install BFG Repo Cleaner
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Remove data folder from history
bfg --delete-folders data

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin --force --all
```

**Pros:**
- ✅ Repo becomes small
- ✅ Vercel works

**Cons:**
- ❌ Destructive (rewrites history)
- ❌ Collaborators need to re-clone

---

## Recommended Approach

### For Quick Fix: Deploy to Railway
1. Go to https://railway.app
2. Deploy from GitHub
3. Done! ✅

### For Long-term: Separate Data Repo
1. Create `komiku-data` repo
2. Move data folder
3. Update API endpoints
4. Deploy to Vercel ✅

### For Best Performance: Vercel + CDN
1. Upload data to Cloudflare R2 (free)
2. API fetches from CDN
3. Fast + scalable ✅

---

## Quick Commands

### Deploy to Railway:
```bash
# No setup needed, just connect GitHub
# Railway auto-detects Node.js
```

### Create Data Repo:
```bash
# 1. Create new repo on GitHub
# 2. Clone it
git clone https://github.com/ramadhanu27/komiku-data.git

# 3. Copy data
cp -r data/ komiku-data/
cd komiku-data
git add .
git commit -m "Initial data"
git push

# 4. Update API URL
# Change: ramadhanu27/APi-Komiku-Manhwa
# To: ramadhanu27/komiku-data
```

---

## Which Solution Should You Use?

| Solution | Difficulty | Time | Best For |
|----------|-----------|------|----------|
| Railway | ⭐ Easy | 5 min | Quick fix |
| Separate Repo | ⭐⭐ Medium | 15 min | Long-term |
| CDN Storage | ⭐⭐⭐ Hard | 30 min | Production |
| Remove History | ⭐⭐⭐⭐ Hard | 20 min | Clean slate |

**Recommendation: Start with Railway, then migrate to separate repo later.**
