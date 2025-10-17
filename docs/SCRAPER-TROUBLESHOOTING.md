# 🔧 Scraper Troubleshooting

Panduan troubleshooting untuk auto-scraper dan manual scraper.

---

## ℹ️ "No new manga" - Normal!

### **Ini BUKAN Error!**

Output `"No new manga"` artinya:
- ✅ Scraper **berhasil** jalan
- ✅ Data **berhasil** di-scrape
- ℹ️ Tidak ada perubahan (data sama)
- ℹ️ Tidak perlu commit

**Ini bagus karena:**
1. Workflow efficient (tidak commit jika tidak perlu)
2. Hemat GitHub Actions minutes
3. Tidak spam commit history

---

## 🧪 Test Scraper Locally

### **Quick Test:**

```bash
# Test manga list scraper
npm run test:list

# Test latest updates scraper
npm run test:updates

# Test chapter scraper
npm run test:chapter

# Test specific manga
node test-scraper.js chapter 99-wooden-stick
```

### **Output Example:**

```
🧪 Testing Scraper
============================================================
📚 Testing: Manga List Scraper
============================================================

⏳ Running scraper...

✅ Scraping completed

============================================================
📊 Results:
============================================================
✅ File updated!
📦 Size: 45000 → 45100 bytes
📈 Change: +100 bytes
📚 Total manga: 115
📅 Last modified: 2025-10-17 16:30:00
📁 File: data/komiku-list.json
============================================================
✅ Test completed successfully!
```

---

## 🔍 Check if Scraper Working

### **1. Check File Timestamp:**

```bash
# Windows PowerShell
Get-Item data\komiku-list.json | Select-Object LastWriteTime

# Linux/Mac
ls -lh data/komiku-list.json
```

### **2. Check File Content:**

```bash
# Count manga
jq '. | length' data/komiku-list.json

# Show first manga
jq '.[0]' data/komiku-list.json

# Check if valid JSON
jq . data/komiku-list.json > /dev/null && echo "Valid JSON" || echo "Invalid JSON"
```

### **3. Compare Before/After:**

```bash
# Backup current file
cp data/komiku-list.json data/komiku-list.json.backup

# Run scraper
npm run test:list

# Compare
diff data/komiku-list.json.backup data/komiku-list.json
```

---

## 🐛 Common Issues

### **1. "No new manga" Always**

**Possible causes:**
- Website tidak ada manga baru (normal)
- Scraper tidak detect changes
- Data sudah up-to-date

**Solution:**
```bash
# Force re-scrape
rm data/komiku-list.json
npm run test:list

# Check if file created
ls -lh data/komiku-list.json
```

---

### **2. Scraper Error/Timeout**

**Symptoms:**
- Scraper hangs
- Network timeout
- No output file

**Solution:**
```bash
# Check network
ping komiku.org

# Test with verbose output
node scrapers/generate-list.js

# Check error logs
cat update.log
```

---

### **3. Invalid JSON Output**

**Symptoms:**
- API returns error
- JSON parse error

**Solution:**
```bash
# Validate JSON
jq . data/komiku-list.json

# If invalid, re-scrape
rm data/komiku-list.json
npm run test:list
```

---

### **4. GitHub Actions Not Running**

**Check:**
- [ ] Workflow file correct?
- [ ] GitHub Actions enabled?
- [ ] Cron schedule correct?
- [ ] Repository not archived?

**Solution:**
1. Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
2. Check workflow status
3. Enable if disabled
4. Trigger manually to test

---

### **5. Workflow Runs But No Commit**

**This is NORMAL if:**
- No new manga found
- Data unchanged
- Scraper working correctly

**To verify:**
1. Check workflow logs
2. Look for "No new manga" message
3. Check manga count in summary

**To force commit (testing):**
```bash
# Add dummy change
echo "# Test" >> data/komiku-list.json

# Commit
git add data/komiku-list.json
git commit -m "Test commit"
git push

# Workflow will detect change
```

---

## 📊 Debugging Steps

### **Step 1: Test Locally**

```bash
# Test scraper
npm run test:list

# Check output
cat data/komiku-list.json | jq '. | length'
```

### **Step 2: Check GitHub Actions**

1. Go to Actions tab
2. Click latest workflow run
3. Check each step
4. Look for errors

### **Step 3: Check Logs**

```bash
# Local logs
cat update.log

# GitHub Actions logs
# Download from Actions tab
```

### **Step 4: Verify Data**

```bash
# Check file exists
ls -lh data/komiku-list.json

# Check file size
du -h data/komiku-list.json

# Check content
jq '.[0:3]' data/komiku-list.json
```

---

## 🔧 Manual Fix

### **If Scraper Broken:**

```bash
# 1. Backup current data
cp -r data/ data-backup/

# 2. Delete problematic file
rm data/komiku-list.json

# 3. Re-scrape
npm run test:list

# 4. Verify
jq '. | length' data/komiku-list.json

# 5. If good, commit
git add data/komiku-list.json
git commit -m "Fix: Re-scrape manga list"
git push
```

---

## 📈 Monitor Scraper Health

### **Weekly Checklist:**

- [ ] Check GitHub Actions runs
- [ ] Verify data updates
- [ ] Check error logs
- [ ] Test API endpoints
- [ ] Monitor file sizes

### **Commands:**

```bash
# Check recent workflow runs
gh run list --limit 10

# Check data freshness
ls -lh data/*.json

# Count manga
jq '. | length' data/komiku-list.json

# Check API
curl https://your-api.vercel.app/api/stats
```

---

## 🎯 Expected Behavior

### **Normal Workflow:**

```
1. Workflow triggers (scheduled/manual)
2. Scraper runs
3. Data scraped
4. Check for changes
5a. If changed: Commit & push → Deploy
5b. If unchanged: Skip commit → Done
6. Summary created
```

### **Normal Outputs:**

**With changes:**
```
✅ New manga found!
📊 Changes: 1 file changed, 5 insertions(+)
📚 Total manga: 116
```

**Without changes:**
```
ℹ️  No new manga
📚 Total manga: 115 (unchanged)
```

---

## 🆘 Still Having Issues?

### **1. Check Documentation:**
- `docs/AUTO-SCRAPER-GUIDE.md`
- `docs/AUTO-UPDATE-GUIDE.md`
- `README.md`

### **2. Test Components:**

```bash
# Test scraper
npm run test:list

# Test API
npm test

# Test local server
npm start
```

### **3. Check Logs:**

```bash
# Scraper logs
cat update.log

# GitHub Actions logs
# Download from Actions tab

# Vercel logs
# Check Vercel dashboard
```

### **4. Create Issue:**

If still stuck, create GitHub issue with:
- Error message
- Workflow logs
- Steps to reproduce
- Expected vs actual behavior

---

## ✅ Success Indicators

### **Scraper Working:**
- ✅ Workflow runs successfully
- ✅ No errors in logs
- ✅ Data file updated (if changes)
- ✅ API serves fresh data

### **Auto-Update Working:**
- ✅ Scheduled runs appear in Actions
- ✅ Commits from github-actions bot
- ✅ Vercel deployments triggered
- ✅ API data matches scraped data

---

## 📝 Quick Reference

### **Test Commands:**
```bash
npm run test:list      # Test manga list
npm run test:updates   # Test updates
npm run test:chapter   # Test chapters
```

### **Check Commands:**
```bash
jq '. | length' data/komiku-list.json  # Count manga
ls -lh data/                           # Check files
git log --oneline -10                  # Recent commits
```

### **Fix Commands:**
```bash
rm data/komiku-list.json  # Delete & re-scrape
npm run test:list         # Re-scrape
git status                # Check changes
```

---

**Remember:** "No new manga" is NORMAL and means everything is working! ✅

---

**Last Updated:** October 17, 2025
