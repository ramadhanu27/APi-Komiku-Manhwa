# 🔄 Scraper Workflow

## 📋 Complete Workflow

### **Step 1: Scrape Manhwa Details**
```bash
# Scrape 10 manhwa (without images - fast)
node scrape-simple.js --list 10

# Scrape with images (slow but complete)
node scrape-simple.js --list 10 --images
```

**Output:** 
- `public/Chapter/komiku/{slug}.json` (10 files)

---

### **Step 2: Sync List**
```bash
# Auto-add new manhwa to list
node sync-list.js
```

**Output:**
- Updates `public/komiku-list.json`
- Adds missing manhwa from scraped files

---

### **Step 3: Refresh Website**
```
Just refresh browser!
Website automatically shows new manhwa
```

---

## 🎯 Smart Scraping Logic

### **Auto-Skip Already Scraped:**

```javascript
// Check if file exists
if (fs.existsSync(`${slug}.json`)) {
  
  // If --images flag, check if has images
  if (includeImages) {
    const data = JSON.parse(fs.readFileSync(...))
    const hasImages = data.chapters.some(ch => ch.images?.length > 0)
    
    if (hasImages) {
      skip()  // Already has images
    } else {
      addImages()  // Add images to existing
    }
  } else {
    skip()  // Already scraped
  }
}
```

---

## 📊 Workflow Examples

### **Example 1: Fresh Start**
```bash
# 1. Scrape 50 manhwa (fast, no images)
node scrape-simple.js --list 50

# 2. Sync to list
node sync-list.js

# 3. Website shows 50 manhwa!
```

**Time:** ~2 minutes

---

### **Example 2: Add Images Later**
```bash
# 1. Already scraped 50 manhwa (no images)
# 2. Add images to all
node scrape-simple.js --list 50 --images

# 3. Auto-skips manhwa with images
# 4. Only adds images to manhwa without images
```

**Time:** ~15 minutes (only processes manhwa without images)

---

### **Example 3: Continue Interrupted**
```bash
# 1. Scraping interrupted at manhwa 25/50
# 2. Re-run same command
node scrape-simple.js --list 50

# 3. Auto-skips 1-24 (already done)
# 4. Continues from 25
```

**Time:** ~1 minute (skips 24, scrapes 26)

---

## 🔍 Check Status

### **How Many Scraped?**
```bash
# Count files
ls public/Chapter/komiku/*.json | wc -l
```

### **How Many in List?**
```bash
# Check list
cat public/komiku-list.json | grep "slug" | wc -l
```

### **Missing from List?**
```bash
# Sync will show
node sync-list.js
# Output: Added: X
```

---

## 💡 Best Practices

### **1. Scrape Without Images First**
```bash
# Fast scraping (2 min for 50 manhwa)
node scrape-simple.js --list 50

# Then sync
node sync-list.js

# Website ready!
```

### **2. Add Images Later**
```bash
# When you have time (15 min for 50 manhwa)
node scrape-simple.js --list 50 --images
```

### **3. Regular Updates**
```bash
# Daily: Check for new chapters
node scrape-simple.js --list 50

# Weekly: Add images for new manhwa
node scrape-simple.js --list 50 --images
```

---

## 🎯 Sync Logic

### **sync-list.js:**

```javascript
// 1. Load existing list
const existingList = JSON.parse(fs.readFileSync('komiku-list.json'))

// 2. Get all scraped files
const scrapedFiles = fs.readdirSync('Chapter/komiku/')

// 3. Find missing
for (const file of scrapedFiles) {
  const slug = file.replace('.json', '')
  
  if (!existingList.find(m => m.slug === slug)) {
    // Add to list
    existingList.push({...})
  }
}

// 4. Save updated list
fs.writeFileSync('komiku-list.json', JSON.stringify(existingList))
```

---

## 📋 Summary

### **Commands:**

| Command | Purpose | Time |
|---------|---------|------|
| `scrape-simple.js --list 50` | Scrape details | 2 min |
| `scrape-simple.js --list 50 --images` | Add images | 15 min |
| `sync-list.js` | Update list | 5 sec |
| `generate-list.js` | Regenerate list | 5 sec |

### **Files:**

| File | Purpose |
|------|---------|
| `scrape-simple.js` | Main scraper |
| `sync-list.js` | Sync list with scraped data |
| `generate-list.js` | Generate list from scratch |
| `list-manhwa.js` | Get manhwa list from Komiku |

---

## ✅ Complete Workflow

```
1. Scrape
   ↓
2. Sync List
   ↓
3. Refresh Website
   ↓
4. Done! ✨
```

**Simple, fast, and smart! 🚀**
