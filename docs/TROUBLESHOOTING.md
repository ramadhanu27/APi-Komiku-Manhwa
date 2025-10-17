# 🔧 Troubleshooting Guide

## ❌ Data tidak tersimpan saat Ctrl+C

### Masalah
```
⚠️  Stopping scraper...
💾 Saving current progress...
⚠️  No data to save yet
👋 Goodbye!
```

### Penyebab
Global state `currentManhwaList` belum ter-update dengan data terbaru.

### Solusi ✅
Script sudah diperbaiki dengan:

1. **Initialize global state early**
```javascript
// Set filepath dan load existing data
currentFilepath = filepath
currentManhwaList = [...existingList]
```

2. **Update global state setiap save**
```javascript
// Setiap kali ada manhwa baru
currentManhwaList = [...existingList]
saveManhwaList(existingList, filepath, true)
```

3. **Shutdown handler yang robust**
```javascript
if (currentManhwaList.length > 0 && currentFilepath) {
  fs.writeFileSync(currentFilepath, JSON.stringify(currentManhwaList, null, 2))
  console.log(`✅ Progress saved! (${currentManhwaList.length} manhwa)`)
}
```

### Test
```bash
# Test shutdown handler
node test-shutdown.js

# Tunggu beberapa detik, lalu Ctrl+C
# Check file: public/test-shutdown.json
```

---

## 🧪 Cara Test Shutdown

### 1. Run Test Script
```bash
cd scraper-komiku
node test-shutdown.js
```

Output:
```
🧪 Testing shutdown handler...
Press Ctrl+C to test

Adding items every 2 seconds...
✨ Added: Item 1 (Total: 1)
✨ Added: Item 2 (Total: 2)
✨ Added: Item 3 (Total: 3)

[Press Ctrl+C]

⚠️  Stopping scraper...
💾 Saving current progress...
✅ Progress saved successfully! (3 items)
👋 Goodbye!
```

### 2. Check File
```bash
cat ../public/test-shutdown.json
```

Should show:
```json
[
  {
    "id": 1,
    "title": "Item 1",
    "timestamp": "..."
  },
  ...
]
```

---

## 📊 Debug Checklist

### ✅ Sebelum Scrape
- [ ] File `public/komiku-list.json` exists?
- [ ] File writable? (check permissions)
- [ ] Folder `public/` exists?

### ✅ Saat Scrape
- [ ] Lihat output `💾 Auto-save: X manhwa saved`
- [ ] Check file size bertambah: `ls -lh ../public/komiku-list.json`
- [ ] Lihat `✨ New: [title]` untuk manhwa baru

### ✅ Saat Ctrl+C
- [ ] Lihat `⚠️  Stopping scraper...`
- [ ] Lihat `✅ Progress saved successfully! (X manhwa)`
- [ ] Check file: `cat ../public/komiku-list.json | grep "title" | wc -l`

---

## 🔍 Common Issues

### Issue 1: "No data to save yet"
**Penyebab:** Belum ada manhwa baru yang di-scrape

**Solusi:**
- Tunggu sampai ada output `✨ New: [title]`
- Atau sudah ada data existing, tapi belum ada yang baru

### Issue 2: File tidak ter-update
**Penyebab:** Permission error atau disk full

**Solusi:**
```bash
# Check permission
ls -la ../public/komiku-list.json

# Fix permission
chmod 644 ../public/komiku-list.json

# Check disk space
df -h
```

### Issue 3: Browser crash saat Ctrl+C
**Penyebab:** Puppeteer belum sempat close

**Solusi:**
Script sudah handle ini dengan graceful shutdown.

---

## 💡 Best Practices

### 1. Backup Before Scrape
```bash
# Backup existing data
cp ../public/komiku-list.json ../public/komiku-list.backup.json
```

### 2. Monitor Progress
```bash
# Terminal 1: Run scraper
node list-manhwa.js

# Terminal 2: Watch file size
watch -n 1 'ls -lh ../public/komiku-list.json'
```

### 3. Verify After Stop
```bash
# Count manhwa
cat ../public/komiku-list.json | grep '"title"' | wc -l

# Check last entry
tail -n 20 ../public/komiku-list.json
```

---

## 🚨 Emergency Recovery

### Jika file corrupt:
```bash
# Restore from backup
cp ../public/komiku-list.backup.json ../public/komiku-list.json

# Or start fresh
echo "[]" > ../public/komiku-list.json
```

### Jika data hilang:
```bash
# Check git history
git log --all --full-history -- public/komiku-list.json

# Restore from git
git checkout HEAD~1 -- public/komiku-list.json
```

---

## ✅ Verification

Setelah scrape, verify data:

```bash
# 1. Check file exists
test -f ../public/komiku-list.json && echo "✅ File exists" || echo "❌ File missing"

# 2. Check valid JSON
node -e "JSON.parse(require('fs').readFileSync('../public/komiku-list.json'))" && echo "✅ Valid JSON" || echo "❌ Invalid JSON"

# 3. Count entries
node -e "console.log('Total:', JSON.parse(require('fs').readFileSync('../public/komiku-list.json')).length)"

# 4. Show first entry
node -e "console.log(JSON.parse(require('fs').readFileSync('../public/komiku-list.json'))[0])"
```

---

## 📞 Still Having Issues?

1. **Check logs**: Look for error messages in terminal
2. **Test shutdown**: Run `node test-shutdown.js`
3. **Verify permissions**: `ls -la ../public/`
4. **Check disk space**: `df -h`
5. **Try fresh start**: Backup and delete JSON, start over

---

**Updated:** 2025-10-17  
**Status:** ✅ Fixed - Shutdown handler now properly saves data
