# 🤖 Auto-Scraper Guide

Panduan lengkap sistem auto-scraper otomatis untuk list manhwa, updates, dan chapters.

---

## 📋 Overview

Sistem auto-scraper akan otomatis scrape:
1. ✅ **Manga List** - Setiap hari (00:00 UTC / 07:00 WIB)
2. ✅ **Latest Updates** - Setiap 6 jam
3. ✅ **Chapters** - Setiap minggu (Sunday)

---

## 🚀 GitHub Actions Workflows

### **1. Auto Scrape Manga List** 📚

**File:** `.github/workflows/auto-scrape-list.yml`

**Schedule:** Daily at 00:00 UTC (07:00 WIB)

**What it does:**
- Scrape daftar manga dari Komiku.org
- Update `data/komiku-list.json`
- Commit jika ada manga baru
- Trigger Vercel deployment

**Manual trigger:**
```
GitHub → Actions → "Auto Scrape Manga List" → Run workflow
```

---

### **2. Auto Scrape Latest Updates** 🔄

**File:** `.github/workflows/auto-scrape-updates.yml`

**Schedule:** Every 6 hours

**What it does:**
- Scrape latest updates dari homepage
- Update `data/latest-updates.json`
- Commit jika ada updates baru
- Trigger Vercel deployment

**Manual trigger:**
```
GitHub → Actions → "Auto Scrape Latest Updates" → Run workflow
```

---

### **3. Auto Scrape Chapters** 📖

**File:** `.github/workflows/auto-scrape-chapters.yml`

**Schedule:** Weekly on Sunday at 00:00 UTC

**What it does:**
- Scrape chapters yang outdated (> 7 hari)
- Update `data/Chapter/komiku/*.json`
- Commit perubahan
- Trigger Vercel deployment

**Manual trigger:**
```
GitHub → Actions → "Auto Scrape Chapters" → Run workflow
```

**Manual trigger specific manga:**
```
GitHub → Actions → "Auto Scrape Chapters" → Run workflow
→ Input manga_slug: "99-wooden-stick"
```

---

## 📊 Scraping Schedule

| Task | Frequency | Time (UTC) | Time (WIB) |
|------|-----------|------------|------------|
| **Manga List** | Daily | 00:00 | 07:00 |
| **Latest Updates** | Every 6h | 00:00, 06:00, 12:00, 18:00 | 07:00, 13:00, 19:00, 01:00 |
| **Chapters** | Weekly | Sunday 00:00 | Sunday 07:00 |

---

## 🔧 Configuration

### **Manga List Scraper:**

Edit `.github/workflows/auto-scrape-list.yml`:
```yaml
schedule:
  - cron: '0 0 * * *'  # Daily at midnight
```

**Cron examples:**
- `0 0 * * *` - Daily at midnight
- `0 */12 * * *` - Every 12 hours
- `0 0 * * 1` - Every Monday

---

### **Latest Updates Scraper:**

Edit `.github/workflows/auto-scrape-updates.yml`:
```yaml
schedule:
  - cron: '0 */6 * * *'  # Every 6 hours
```

**Cron examples:**
- `0 */6 * * *` - Every 6 hours
- `0 */3 * * *` - Every 3 hours
- `0 */12 * * *` - Every 12 hours

---

### **Chapters Scraper:**

Edit `.github/workflows/auto-scrape-chapters.yml`:
```yaml
schedule:
  - cron: '0 0 * * 0'  # Weekly on Sunday
```

**Cron examples:**
- `0 0 * * 0` - Every Sunday
- `0 0 * * 1,4` - Every Monday and Thursday
- `0 0 1 * *` - First day of month

---

### **Outdated Chapters Config:**

Edit `scrapers/scrape-outdated-chapters.js`:
```javascript
const CONFIG = {
  maxAgeDays: 7,      // Scrape if older than 7 days
  maxConcurrent: 3,   // Max concurrent scrapes
  delayMs: 3000,      // 3 seconds delay
};
```

---

## 🎯 How It Works

### **Workflow:**

```
1. GitHub Actions triggers (scheduled or manual)
   ↓
2. Checkout repository
   ↓
3. Install Node.js & dependencies
   ↓
4. Run scraper script
   ↓
5. Check if data changed
   ↓
6. If changed: Commit & push
   ↓
7. Vercel auto-deploys
   ↓
8. API serves fresh data ✅
```

---

## 📝 Manual Operations

### **Test Locally:**

```bash
# Test manga list scraper
node scrapers/generate-list.js

# Test latest updates scraper
node scrapers/generate-latest-updates.js

# Test outdated chapters scraper
node scrapers/scrape-outdated-chapters.js

# Test single manga scraper
node scrapers/scraper.js single 99-wooden-stick
```

---

### **Manual Trigger on GitHub:**

1. Go to: https://github.com/ramadhanu27/APi-Komiku-Manhwa/actions
2. Select workflow:
   - "Auto Scrape Manga List"
   - "Auto Scrape Latest Updates"
   - "Auto Scrape Chapters"
3. Click **"Run workflow"**
4. Select branch: `main`
5. Click **"Run workflow"**

---

## 📊 Monitoring

### **Check Workflow Status:**

1. Go to: https://github.com/ramadhanu27/APi-Komiku-Manhwa/actions
2. See recent workflow runs
3. Click on run to see details
4. Check logs for errors

### **Check Commit History:**

```bash
# See recent commits
git log --oneline -10

# See commits by bot
git log --author="github-actions" --oneline
```

### **Check Data Changes:**

```bash
# Check manga list
git log -p data/komiku-list.json

# Check latest updates
git log -p data/latest-updates.json

# Check chapters
git log --oneline data/Chapter/
```

---

## 🔍 Troubleshooting

### **Workflow Failed?**

1. Go to Actions tab
2. Click failed workflow
3. Check error logs
4. Common issues:
   - Network timeout → Retry
   - Scraper broken → Check website changes
   - Rate limited → Increase delay

### **No Data Updated?**

**Possible reasons:**
- No new manga/updates available
- Scraper couldn't find changes
- Website structure changed

**Check:**
```bash
# Test scraper locally
node scrapers/generate-list.js

# Check output
cat data/komiku-list.json
```

### **Workflow Not Running?**

**Check:**
- [ ] GitHub Actions enabled?
- [ ] Workflow file correct?
- [ ] Cron schedule correct?
- [ ] Repository not archived?

---

## ⚙️ Advanced Configuration

### **Change Scraping Frequency:**

Edit workflow files:

**More frequent (every 3 hours):**
```yaml
schedule:
  - cron: '0 */3 * * *'
```

**Less frequent (every 12 hours):**
```yaml
schedule:
  - cron: '0 */12 * * *'
```

**Specific times:**
```yaml
schedule:
  - cron: '0 0,12 * * *'  # 00:00 and 12:00
```

---

### **Selective Chapter Scraping:**

Edit `scrapers/scrape-outdated-chapters.js`:

**Only scrape very old chapters:**
```javascript
maxAgeDays: 30  // Only if > 30 days
```

**Scrape more frequently:**
```javascript
maxAgeDays: 3  // If > 3 days
```

---

### **Add Notifications:**

Add to workflow (after push step):

**Telegram notification:**
```yaml
- name: Send Telegram notification
  if: steps.check_changes.outputs.changes == 'true'
  run: |
    curl -X POST "https://api.telegram.org/bot${{ secrets.TELEGRAM_BOT_TOKEN }}/sendMessage" \
      -d chat_id="${{ secrets.TELEGRAM_CHAT_ID }}" \
      -d text="✅ Manga list updated!"
```

**Discord webhook:**
```yaml
- name: Send Discord notification
  if: steps.check_changes.outputs.changes == 'true'
  run: |
    curl -X POST "${{ secrets.DISCORD_WEBHOOK }}" \
      -H "Content-Type: application/json" \
      -d '{"content":"✅ Manga list updated!"}'
```

---

## 📈 Performance

### **Scraping Times:**

| Task | Time | Data Size |
|------|------|-----------|
| Manga List | ~30 sec | ~100 KB |
| Latest Updates | ~20 sec | ~20 KB |
| Single Chapter | ~5 sec | ~10 KB |
| Outdated Chapters | ~5-30 min | Varies |

### **GitHub Actions Limits:**

- **Free tier:** 2000 minutes/month
- **Timeout:** 6 hours max per job
- **Concurrent:** 20 jobs max

### **Optimization:**

1. **Selective scraping** - Only outdated files
2. **Rate limiting** - 3 sec delay between requests
3. **Efficient scrapers** - Minimal dependencies
4. **Smart scheduling** - Different frequencies

---

## 🎯 Best Practices

### **1. Monitor Regularly**

Check Actions tab weekly:
```
https://github.com/ramadhanu27/APi-Komiku-Manhwa/actions
```

### **2. Test Locally First**

Before relying on automation:
```bash
node scrapers/generate-list.js
node scrapers/generate-latest-updates.js
```

### **3. Backup Data**

Before major changes:
```bash
git tag backup-$(date +%Y%m%d)
git push --tags
```

### **4. Review Changes**

Check commits regularly:
```bash
git log --author="github-actions" --oneline -20
```

---

## 🔐 Security

### **GitHub Token:**

- ✅ Auto-provided by GitHub Actions
- ✅ No setup needed
- ✅ Limited to repository scope

### **Rate Limiting:**

- ✅ 3 second delay between requests
- ✅ Respectful to source website
- ✅ Prevents IP blocking

### **Error Handling:**

- ✅ Graceful failures
- ✅ Retry logic
- ✅ Detailed logging

---

## 📊 Statistics

### **Track Scraping Activity:**

```bash
# Count bot commits
git log --author="github-actions" --oneline | wc -l

# See scraping frequency
git log --author="github-actions" --since="1 week ago" --oneline

# Check data growth
du -sh data/
```

---

## ✅ Setup Checklist

### **Initial Setup:**
- [ ] Workflow files created
- [ ] Scraper scripts ready
- [ ] Push to GitHub
- [ ] GitHub Actions enabled

### **Testing:**
- [ ] Test manga list scraper locally
- [ ] Test updates scraper locally
- [ ] Test chapters scraper locally
- [ ] Trigger manual workflow
- [ ] Verify data updated

### **Monitoring:**
- [ ] Check Actions tab
- [ ] Verify commits
- [ ] Check Vercel deployments
- [ ] Test API endpoints

---

## 🎉 Summary

**Auto-scraper system ready!**

**3 Workflows:**
1. ✅ **Manga List** - Daily
2. ✅ **Latest Updates** - Every 6 hours
3. ✅ **Chapters** - Weekly

**Features:**
- ✅ Fully automated
- ✅ Smart scheduling
- ✅ Selective scraping
- ✅ Auto-commit & deploy
- ✅ Error handling
- ✅ Manual trigger available

**Result:**
- ✅ Always fresh data
- ✅ No manual work
- ✅ API always up-to-date
- ✅ Free (GitHub Actions)

---

**Next Step:**

```bash
# Push to GitHub to enable auto-scraper
git add .
git commit -m "Add auto-scraper system"
git push origin main
```

**After push, workflows will:**
- ✅ Run on schedule automatically
- ✅ Scrape fresh data
- ✅ Commit changes
- ✅ Deploy to Vercel

**Your API will always have fresh manga data! 🚀**

---

**Last Updated:** October 17, 2025  
**Version:** 1.0.0
