# 🔧 Netlify API Fix - Troubleshooting Guide

## ✅ Perbaikan yang Sudah Dilakukan

### 1. **File Path Resolution**
- Menambahkan multiple path fallback untuk membaca file JSON
- Mendukung berbagai environment Netlify (build, runtime, lambda)

### 2. **Debug Endpoint**
- Endpoint baru: `/api/debug`
- Menampilkan informasi path dan file yang tersedia
- Membantu troubleshooting masalah path

### 3. **Error Handling**
- Logging yang lebih detail
- Error messages yang informatif
- Fallback paths untuk semua file operations

## 🧪 Cara Testing

### 1. Test Debug Endpoint (Penting!)
```bash
curl https://your-site.netlify.app/api/debug
```

Response akan menunjukkan:
- Current working directory
- Apakah folder `data/` exists
- List file di folder `data/`
- Environment variables

### 2. Test Health Check
```bash
curl https://your-site.netlify.app/api/health
```

### 3. Test Stats
```bash
curl https://your-site.netlify.app/api/stats
```

### 4. Test List
```bash
curl https://your-site.netlify.app/api/list?limit=5
```

## 🚨 Jika Masih Error

### Error: "Failed to load manga list"

**Kemungkinan Penyebab:**
1. Folder `data/` tidak ter-deploy ke Netlify
2. File JSON tidak ada atau corrupt
3. Path resolution issue

**Solusi:**

#### A. Pastikan Data Folder Ter-commit
```bash
# Check apakah data folder ada di git
git ls-files data/

# Jika kosong, add data folder
git add data/
git commit -m "Add data folder"
git push
```

#### B. Verify Data Files
Pastikan file-file ini ada:
- `data/komiku-list.json`
- `data/latest-updates.json`
- `data/chapter-updates.json`

```bash
# Check file size
ls -lh data/*.json
```

#### C. Check Netlify Deploy Log
1. Buka Netlify Dashboard
2. Pilih site Anda
3. Go to "Deploys"
4. Click deploy terakhir
5. Lihat "Deploy log"
6. Cari error messages

#### D. Check Function Logs
1. Netlify Dashboard → Functions
2. Click function "api"
3. Lihat logs real-time
4. Test endpoint dan lihat error

### Error: "Chapters not found"

**Solusi:**
1. Pastikan folder `public/Chapter/komiku/` ter-commit
2. Pastikan file `{slug}.json` ada untuk manga tersebut

```bash
# Check chapter files
git ls-files public/Chapter/komiku/

# Add if missing
git add public/
git commit -m "Add chapter data"
git push
```

## 📋 Checklist Deployment

Sebelum deploy, pastikan:

- [ ] Folder `data/` ada dan berisi file JSON
- [ ] File `data/komiku-list.json` valid JSON
- [ ] File `data/latest-updates.json` valid JSON
- [ ] Folder `public/Chapter/komiku/` ada (jika ada chapter data)
- [ ] File `netlify.toml` ada di root
- [ ] Folder `netlify/functions/` ada dan berisi `api.js`
- [ ] Semua file ter-commit ke Git
- [ ] Push ke repository

## 🔍 Debug Commands

### Local Testing dengan Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Test functions locally
netlify dev

# Test specific endpoint
curl http://localhost:8888/api/debug
curl http://localhost:8888/api/list?limit=5
```

### Validate JSON Files
```bash
# Check if JSON is valid
node -e "console.log(JSON.parse(require('fs').readFileSync('data/komiku-list.json')))"
```

### Check File Permissions
```bash
# Make sure files are readable
ls -la data/
ls -la netlify/functions/
```

## 🎯 Expected Responses

### `/api/debug` - Success
```json
{
  "status": "debug",
  "cwd": "/var/task",
  "dirname": "/var/task/netlify/functions",
  "dataExists": true,
  "publicExists": true,
  "dataFiles": [
    "komiku-list.json",
    "latest-updates.json",
    "chapter-updates.json"
  ],
  "env": {
    "LAMBDA_TASK_ROOT": "/var/task",
    "NODE_ENV": "production"
  }
}
```

### `/api/stats` - Success
```json
{
  "success": true,
  "data": {
    "totalManga": 310,
    "totalUpdates": 50,
    "lastUpdate": "2025-10-17T15:35:00.000Z"
  }
}
```

### `/api/list` - Success
```json
{
  "success": true,
  "data": [
    {
      "title": "99 Wooden Stick",
      "slug": "99-wooden-stick",
      "genres": ["Action", "Fantasy"],
      ...
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 16,
    "totalItems": 310,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## 💡 Tips

1. **Gunakan `/api/debug` terlebih dahulu** untuk memastikan file tersedia
2. **Check Netlify Function Logs** untuk error messages detail
3. **Test locally dengan `netlify dev`** sebelum deploy
4. **Validate JSON files** sebelum commit
5. **Check file size limits** - Netlify Functions punya limit 50MB

## 🆘 Masih Bermasalah?

Jika masih error setelah semua langkah di atas:

1. **Share hasil dari `/api/debug`**
2. **Share Netlify Function logs**
3. **Share error message lengkap**
4. **Verify data files exist** dengan screenshot

## 📞 Quick Fix Commands

```bash
# Re-deploy everything
git add .
git commit -m "Fix Netlify API paths"
git push origin main

# Or force deploy via CLI
netlify deploy --prod

# Check deploy status
netlify status

# Open site
netlify open:site

# Open admin
netlify open:admin
```

---

**Status**: ✅ API sudah diperbaiki dengan multiple path fallback dan debug endpoint

Setelah deploy, test dengan `/api/debug` untuk memastikan file paths correct! 🚀
