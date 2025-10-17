# 🤖 Auto-Scraper System

Sistem otomatis untuk scrape list manhwa, updates, dan chapters.

---

## ⚡ Quick Overview

### **3 Auto-Scrapers:**

1. **📚 Manga List** - Scrape setiap hari
2. **🔄 Latest Updates** - Scrape setiap 6 jam  
3. **📖 Chapters** - Scrape setiap minggu

---

## 📊 Schedule

| Scraper | Frequency | Time (WIB) |
|---------|-----------|------------|
| **Manga List** | Daily | 07:00 |
| **Latest Updates** | Every 6h | 07:00, 13:00, 19:00, 01:00 |
| **Chapters** | Weekly | Sunday 07:00 |

---

## 🚀 How to Enable

### **1. Push ke GitHub:**

```bash
git add .
git commit -m "Add auto-scraper system"
git push origin main
```

### **2. Done!** ✅

GitHub Actions akan otomatis:
- ✅ Scrape data sesuai schedule
- ✅ Commit changes
- ✅ Trigger Vercel deployment
- ✅ API serve data terbaru

---

## 🎯 Manual Trigger

### **Via GitHub:**

1. Buka: https://github.com/ramadhanu27/APi-Komiku-Manhwa/actions
2. Pilih workflow:
   - "Auto Scrape Manga List"
   - "Auto Scrape Latest Updates"  
   - "Auto Scrape Chapters"
3. Klik **"Run workflow"**
4. Klik **"Run workflow"** lagi

### **Via Terminal (Lokal):**

```bash
# Scrape manga list
node scrapers/generate-list.js

# Scrape latest updates
node scrapers/generate-latest-updates.js

# Scrape outdated chapters
node scrapers/scrape-outdated-chapters.js

# Scrape specific manga
node scrapers/scraper.js single 99-wooden-stick
```

---

## 📁 Files Created

1. ✅ `.github/workflows/auto-scrape-list.yml` - Daily manga list
2. ✅ `.github/workflows/auto-scrape-updates.yml` - 6-hourly updates
3. ✅ `.github/workflows/auto-scrape-chapters.yml` - Weekly chapters
4. ✅ `scrapers/scrape-outdated-chapters.js` - Smart chapter scraper
5. ✅ `docs/AUTO-SCRAPER-GUIDE.md` - Full documentation

---

## 🔄 Workflow

```
GitHub Actions (Scheduled)
  ↓
Run scraper script
  ↓
Check if data changed
  ↓
If changed: Commit & push
  ↓
Vercel auto-deploy
  ↓
API serves fresh data ✅
```

---

## 📊 What Gets Scraped

### **1. Manga List** (`data/komiku-list.json`)
- Title, slug, URL, image, genres
- Scrape: Daily at 07:00 WIB
- Size: ~100 KB

### **2. Latest Updates** (`data/latest-updates.json`)
- Latest chapter updates
- Scrape: Every 6 hours
- Size: ~20 KB

### **3. Chapters** (`data/Chapter/komiku/*.json`)
- Chapter details & images
- Scrape: Weekly (outdated only)
- Size: ~10 MB total

---

## 🔍 Monitoring

### **Check Status:**

```
https://github.com/ramadhanu27/APi-Komiku-Manhwa/actions
```

### **Check Commits:**

```bash
# See bot commits
git log --author="github-actions" --oneline -10
```

### **Check Data:**

```bash
# Count manga
jq '. | length' data/komiku-list.json

# Count chapters
ls data/Chapter/komiku/ | wc -l
```

---

## ⚙️ Configuration

### **Change Schedule:**

Edit workflow files in `.github/workflows/`

**Example - Every 3 hours:**
```yaml
schedule:
  - cron: '0 */3 * * *'
```

**Example - Twice daily:**
```yaml
schedule:
  - cron: '0 0,12 * * *'
```

### **Change Chapter Age:**

Edit `scrapers/scrape-outdated-chapters.js`:
```javascript
maxAgeDays: 7  // Scrape if > 7 days old
```

---

## ✅ Benefits

1. ✅ **Fully Automated** - No manual work
2. ✅ **Always Fresh** - Data updated regularly
3. ✅ **Smart Scraping** - Only scrape outdated files
4. ✅ **Auto Deploy** - Vercel auto-deploy after scrape
5. ✅ **Free** - GitHub Actions 2000 min/month
6. ✅ **Reliable** - Runs on schedule

---

## 🎯 Next Steps

### **1. Push to GitHub:**
```bash
git add .
git commit -m "Add auto-scraper system"
git push origin main
```

### **2. Verify:**
- Check GitHub Actions tab
- Wait for first scheduled run
- Or trigger manually

### **3. Monitor:**
- Check Actions tab regularly
- Verify data updates
- Check API endpoints

---

## 📚 Documentation

**Full Guide:** `docs/AUTO-SCRAPER-GUIDE.md`

**Topics:**
- Detailed workflow explanation
- Configuration options
- Troubleshooting
- Advanced features
- Best practices

---

## 🎉 Summary

**Auto-scraper system ready!**

**After push to GitHub:**
- ✅ Manga list scrapes daily
- ✅ Updates scrape every 6 hours
- ✅ Chapters scrape weekly
- ✅ All automatic
- ✅ No manual work needed

**Your API will always have fresh manga data! 🚀**

---

**Quick Start:**
```bash
git push origin main
```

**That's it! Auto-scraper will handle the rest! 🎊**
