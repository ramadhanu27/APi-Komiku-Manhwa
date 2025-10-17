# 🔄 Auto-Update Guide

Panduan lengkap untuk auto-update data manga, chapter, dan latest updates.

---

## 📋 Overview

Sistem auto-update akan otomatis:
1. ✅ Update daftar manga (setiap 24 jam)
2. ✅ Update latest updates (setiap 6 jam)
3. ✅ Update chapters yang outdated (setiap 24 jam)

---

## 🚀 Quick Start

### **Manual Update (Lokal)**

```bash
# Update semua (list, updates, chapters)
npm run update

# Update manga list saja
npm run update:list

# Update latest updates saja
npm run update:updates

# Update chapters saja
npm run update:chapters
```

### **Auto Update (Background Service)**

```bash
# Jalankan sebagai service (update setiap 6 jam)
npm run update:schedule
```

---

## 🤖 GitHub Actions (Otomatis di Cloud)

### **Setup:**

1. **File sudah dibuat:** `.github/workflows/auto-update.yml`
2. **Auto-run:** Setiap 6 jam otomatis
3. **Manual trigger:** Bisa trigger manual dari GitHub

### **Cara Trigger Manual:**

1. Buka GitHub repository
2. Klik tab **"Actions"**
3. Pilih **"Auto Update Manga Data"**
4. Klik **"Run workflow"**
5. Pilih type: `all`, `list`, `updates`, atau `chapters`
6. Klik **"Run workflow"**

### **Hasil:**

- ✅ Data otomatis ter-update
- ✅ Commit otomatis ke GitHub
- ✅ Vercel auto-deploy dengan data baru
- ✅ API langsung update

---

## 📝 Update Logic

### **1. Manga List Update**

**Frequency:** Setiap 24 jam

**What it does:**
- Scrape daftar manga dari Komiku.org
- Update `data/komiku-list.json`
- Tambah manga baru jika ada

**Command:**
```bash
npm run update:list
```

**File updated:**
- `data/komiku-list.json`

---

### **2. Latest Updates**

**Frequency:** Setiap 6 jam

**What it does:**
- Scrape latest updates dari homepage
- Update `data/latest-updates.json`
- Track chapter terbaru

**Command:**
```bash
npm run update:updates
```

**File updated:**
- `data/latest-updates.json`

---

### **3. Chapters Update**

**Frequency:** Setiap 24 jam (hanya yang outdated)

**What it does:**
- Check setiap manga chapter file
- Update jika file > 24 jam
- Skip jika masih fresh

**Command:**
```bash
npm run update:chapters
```

**Files updated:**
- `data/Chapter/komiku/*.json`

---

## ⚙️ Configuration

Edit `scrapers/auto-update.js` untuk customize:

```javascript
const CONFIG = {
  updateInterval: 6 * 60 * 60 * 1000, // 6 hours
  dataDir: path.join(__dirname, '..', 'data'),
  scrapersDir: __dirname,
  logFile: path.join(__dirname, '..', 'update.log')
};
```

**Options:**
- `updateInterval` - Interval update (milliseconds)
- `dataDir` - Data directory path
- `logFile` - Log file path

---

## 📊 Update Schedule

### **Recommended Schedule:**

| Data Type | Frequency | Reason |
|-----------|-----------|--------|
| **Manga List** | 24 hours | Manga baru jarang |
| **Latest Updates** | 6 hours | Chapter update sering |
| **Chapters** | 24 hours | Cukup untuk track updates |

### **GitHub Actions Schedule:**

```yaml
schedule:
  - cron: '0 */6 * * *'  # Every 6 hours
```

**Cron format:**
- `0 */6 * * *` - Every 6 hours
- `0 0 * * *` - Every day at midnight
- `0 */12 * * *` - Every 12 hours

---

## 🔍 Monitoring

### **Check Logs:**

```bash
# View update log
cat update.log

# Tail log (real-time)
tail -f update.log

# Last 50 lines
tail -n 50 update.log
```

### **Log Format:**

```
[2025-10-17T10:00:00.000Z] Starting auto-update process
[2025-10-17T10:00:01.000Z] Manga list age: 25.50 hours
[2025-10-17T10:00:01.000Z] Updating manga list...
[2025-10-17T10:00:05.000Z] Completed: Generate manga list
[2025-10-17T10:00:05.000Z] Latest updates age: 7.20 hours
[2025-10-17T10:00:05.000Z] Updating latest updates...
[2025-10-17T10:00:10.000Z] Auto-update process completed successfully
```

---

## 🛠️ Manual Operations

### **Update Specific Manga:**

```bash
# Update single manga
node scrapers/scraper.js single 99-wooden-stick

# Update multiple manga
node scrapers/scraper.js single eleceed
node scrapers/scraper.js single solo-leveling
```

### **Force Update All:**

```bash
# Delete old data
rm -rf data/Chapter/komiku/*

# Re-scrape all
npm run scrape:all
```

### **Update Only New Manga:**

```bash
# Generate list first
npm run update:list

# Then update chapters for new manga
npm run update:chapters
```

---

## 🔄 Workflow

### **Normal Workflow:**

```
1. GitHub Actions runs every 6 hours
   ↓
2. Check which data needs update
   ↓
3. Run scrapers for outdated data
   ↓
4. Commit changes to GitHub
   ↓
5. Vercel auto-deploys
   ↓
6. API serves fresh data
```

### **Manual Workflow:**

```
1. You trigger update manually
   ↓
2. npm run update
   ↓
3. Data updated locally
   ↓
4. git add & commit
   ↓
5. git push
   ↓
6. Vercel auto-deploys
```

---

## 📈 Performance

### **Update Times:**

| Operation | Time | Data Size |
|-----------|------|-----------|
| Manga List | ~30 sec | ~100 KB |
| Latest Updates | ~20 sec | ~20 KB |
| Single Chapter | ~5 sec | ~10 KB |
| All Chapters | ~10 min | ~10 MB |

### **Optimization Tips:**

1. **Selective Updates** - Only update outdated files
2. **Rate Limiting** - 2 sec delay between requests
3. **Parallel Updates** - Update multiple manga simultaneously
4. **Caching** - Skip if file < 24 hours old

---

## 🚨 Troubleshooting

### **Update Failed?**

**Check logs:**
```bash
cat update.log
```

**Common issues:**
- Network error → Retry
- Rate limited → Increase delay
- Scraper broken → Check website changes

### **GitHub Actions Failed?**

1. Go to GitHub → Actions tab
2. Click failed workflow
3. Check error logs
4. Fix issue
5. Re-run workflow

### **Data Not Updating?**

**Check:**
- [ ] GitHub Actions enabled?
- [ ] Workflow file correct?
- [ ] Scrapers working?
- [ ] Network accessible?

---

## 🎯 Best Practices

### **1. Regular Monitoring**

Check logs weekly:
```bash
tail -n 100 update.log
```

### **2. Backup Data**

Before major updates:
```bash
cp -r data/ data-backup/
```

### **3. Test Locally First**

Before deploying:
```bash
npm run update
git status
# Check changes before commit
```

### **4. Gradual Updates**

Don't update everything at once:
```bash
# Day 1: Update list
npm run update:list

# Day 2: Update chapters
npm run update:chapters
```

---

## 📊 Statistics Tracking

### **Track Updates:**

Create `data/update-stats.json`:
```json
{
  "lastUpdate": "2025-10-17T10:00:00Z",
  "totalUpdates": 150,
  "mangaAdded": 5,
  "chaptersUpdated": 120
}
```

### **Monitor Growth:**

```bash
# Count manga
jq '. | length' data/komiku-list.json

# Count chapters
ls data/Chapter/komiku/ | wc -l

# Total size
du -sh data/
```

---

## 🔐 Security

### **GitHub Token:**

GitHub Actions uses `GITHUB_TOKEN` automatically.

**No setup needed!** ✅

### **Rate Limiting:**

Built-in 2-second delay between requests:
```javascript
await new Promise(resolve => setTimeout(resolve, 2000));
```

---

## 📞 Support

### **Issues?**

1. Check `update.log`
2. Check GitHub Actions logs
3. Test scrapers manually
4. Create GitHub issue

### **Questions?**

- Check `docs/TROUBLESHOOTING.md`
- Check `docs/README-LIST-SCRAPER.md`
- Check scraper source code

---

## ✅ Checklist

### **Setup:**
- [ ] `scrapers/auto-update.js` created
- [ ] `.github/workflows/auto-update.yml` created
- [ ] `update.js` created
- [ ] `package.json` scripts added
- [ ] GitHub Actions enabled

### **Testing:**
- [ ] Test manual update: `npm run update`
- [ ] Check logs: `cat update.log`
- [ ] Verify data updated
- [ ] Test GitHub Actions
- [ ] Verify Vercel auto-deploy

### **Monitoring:**
- [ ] Check logs weekly
- [ ] Monitor GitHub Actions
- [ ] Track data growth
- [ ] Verify API serving fresh data

---

## 🎉 Summary

**Auto-update system ready!**

**Commands:**
```bash
npm run update              # Update all
npm run update:list         # Update list only
npm run update:updates      # Update latest only
npm run update:chapters     # Update chapters only
npm run update:schedule     # Run as service
```

**GitHub Actions:**
- ✅ Runs every 6 hours automatically
- ✅ Can trigger manually
- ✅ Auto-commits changes
- ✅ Triggers Vercel deployment

**Result:**
- ✅ Always fresh data
- ✅ No manual work
- ✅ API always up-to-date

---

**Last Updated:** October 17, 2025  
**Version:** 1.0.0
