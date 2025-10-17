# 🚨 Quick Fix - "Failed to load manga list"

## ✅ Perbaikan Terbaru

File sudah diupdate dengan:
1. ✅ `netlify.toml` - Added `included_files` configuration
2. ✅ `api.js` - Improved path resolution
3. ✅ Enhanced debug endpoint

## 🔥 Deploy Sekarang

```bash
git add .
git commit -m "Fix Netlify data path with included_files"
git push origin main
```

## 🧪 Test Setelah Deploy

### 1. Test Debug Endpoint (WAJIB!)
```
https://manhwaapi.netlify.app/api/debug
```

Lihat response:
- `paths` - Cek path mana yang `exists: true`
- `testRead.success` - Harus `true`
- `testRead.itemCount` - Harus > 0

### 2. Jika `testRead.success: false`

**Kemungkinan penyebab:**
- Folder `data/` tidak ter-commit ke Git
- File `komiku-list.json` tidak ada

**Solusi:**
```bash
# Check apakah data ter-commit
git ls-files data/

# Jika kosong, add data
git add data/ -f
git commit -m "Add data folder"
git push
```

### 3. Jika masih error setelah push

**Check Netlify Build Log:**
1. Buka https://app.netlify.com
2. Pilih site "manhwaapi"
3. Go to "Deploys"
4. Click deploy terakhir
5. Scroll ke bawah, lihat "Deploy log"
6. Cari error atau warning

**Check Function Log:**
1. Dashboard → Functions
2. Click "api"
3. Lihat real-time logs
4. Test endpoint dan lihat error detail

## 🎯 Expected Debug Response

```json
{
  "status": "debug",
  "cwd": "/var/task",
  "dirname": "/var/task/netlify/functions",
  "env": {
    "LAMBDA_TASK_ROOT": "/var/task",
    "NODE_ENV": "production"
  },
  "paths": {
    "dirname/../../data": {
      "path": "/var/task/data",
      "exists": true,
      "files": [
        "komiku-list.json",
        "latest-updates.json",
        "chapter-updates.json"
      ]
    }
  },
  "testRead": {
    "success": true,
    "itemCount": 310
  }
}
```

## 🔧 Alternative: Copy Data ke Functions Folder

Jika `included_files` tidak work, copy data ke functions folder:

```bash
# Copy data files
cp -r data netlify/functions/

# Commit
git add netlify/functions/data/
git commit -m "Copy data to functions folder"
git push
```

Lalu update `api.js` line 10:
```javascript
path.resolve(__dirname, 'data', filename),  // Add this as first path
```

## 📞 Jika Masih Error

Share hasil dari:
1. `/api/debug` response
2. Netlify deploy log
3. Netlify function log

---

**Next Step:** Deploy dan test `/api/debug` dulu! 🚀
