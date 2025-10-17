# 🔄 Auto-Update System

Sistem otomatis untuk update data manga, chapter, dan latest updates.

---

## ⚡ Quick Commands

```bash
# Update semua (list + updates + chapters)
npm run update

# Update manga list saja
npm run update:list

# Update latest updates saja
npm run update:updates

# Update chapters saja
npm run update:chapters

# Jalankan sebagai service (background)
npm run update:schedule
```

---

## 🤖 Auto-Update (GitHub Actions)

### **Otomatis Setiap 6 Jam** ✅

GitHub Actions akan otomatis:
1. Update data yang outdated
2. Commit changes ke GitHub
3. Trigger Vercel deployment
4. API serve data terbaru

### **Manual Trigger:**

1. Buka: https://github.com/ramadhanu27/APi-Komiku-Manhwa/actions
2. Klik: "Auto Update Manga Data"
3. Klik: "Run workflow"
4. Pilih type update
5. Klik: "Run workflow"

---

## 📊 Update Schedule

| Data | Frequency | Auto? |
|------|-----------|-------|
| **Manga List** | 24 jam | ✅ Yes |
| **Latest Updates** | 6 jam | ✅ Yes |
| **Chapters** | 24 jam | ✅ Yes |

---

## 📝 What Gets Updated?

### **1. Manga List** (`data/komiku-list.json`)
- Daftar semua manga
- Title, slug, URL, image, genres
- Update: Setiap 24 jam

### **2. Latest Updates** (`data/latest-updates.json`)
- Chapter terbaru
- Update: Setiap 6 jam

### **3. Chapters** (`data/Chapter/komiku/*.json`)
- Detail chapter setiap manga
- Images URLs
- Update: Setiap 24 jam (selective)

---

## 🔍 Check Status

```bash
# View update log
cat update.log

# Check last update time
ls -lh data/komiku-list.json

# Count manga
jq '. | length' data/komiku-list.json
```

---

## 🎯 Files Created

1. ✅ `scrapers/auto-update.js` - Main auto-update script
2. ✅ `.github/workflows/auto-update.yml` - GitHub Actions
3. ✅ `update.js` - Quick update CLI
4. ✅ `docs/AUTO-UPDATE-GUIDE.md` - Full documentation

---

## 📚 Documentation

**Full Guide:** `docs/AUTO-UPDATE-GUIDE.md`

**Topics:**
- Setup & configuration
- Update logic
- Monitoring & logs
- Troubleshooting
- Best practices

---

## ✅ Benefits

1. ✅ **Always Fresh Data** - Auto-update setiap 6 jam
2. ✅ **No Manual Work** - GitHub Actions handle everything
3. ✅ **Selective Updates** - Only update outdated files
4. ✅ **Auto Deploy** - Vercel auto-deploy after update
5. ✅ **Logging** - Track all updates in `update.log`

---

## 🚀 Quick Start

### **1. Test Locally:**
```bash
npm run update
```

### **2. Check Results:**
```bash
cat update.log
git status
```

### **3. Push to GitHub:**
```bash
git add .
git commit -m "Update manga data"
git push
```

### **4. GitHub Actions Will:**
- ✅ Run every 6 hours
- ✅ Auto-commit changes
- ✅ Trigger Vercel deploy

---

**That's it! Your API will always have fresh data! 🎉**

**For details:** See `docs/AUTO-UPDATE-GUIDE.md`
