# 📚 Komiku List Scraper

Script untuk scrape daftar manhwa dari Komiku dengan fitur real-time save.

## ✨ Features

- ✅ **Real-time Save**: Setiap manhwa baru langsung disimpan ke JSON
- ✅ **Fast Scroll**: Scroll cepat (800ms delay)
- ✅ **Graceful Shutdown**: Tekan `Ctrl+C` untuk stop dengan aman
- ✅ **Auto-merge**: Merge dengan data existing tanpa duplikat
- ✅ **Progress Tracking**: Lihat progress real-time

## 🚀 Usage

### Basic Usage
```bash
cd scraper-komiku
node list-manhwa.js
```

### With Max Scrolls
```bash
# Scroll maksimal 10 kali
node list-manhwa.js 10

# Scroll maksimal 50 kali
node list-manhwa.js 50

# Scroll tanpa batas (sampai habis)
node list-manhwa.js
```

## ⚡ Quick Start

```bash
# 1. Install dependencies (if not installed)
npm install

# 2. Run scraper
node list-manhwa.js

# 3. Stop anytime with Ctrl+C
# Data akan auto-save!
```

## 📊 Output

File akan disimpan di:
```
public/komiku-list.json
```

Format:
```json
[
  {
    "title": "Solo Leveling",
    "slug": "solo-leveling-id",
    "url": "https://komiku.org/manga/solo-leveling-id/",
    "image": "https://...",
    "genres": ["Action", "Fantasy"]
  }
]
```

## 🎯 How It Works

1. **Launch Browser**: Buka Komiku pustaka page
2. **Auto Scroll**: Scroll ke bawah untuk load manhwa
3. **Extract Data**: Parse HTML dengan Cheerio
4. **Real-time Save**: Save setiap manhwa baru langsung
5. **Merge**: Gabung dengan data existing
6. **Sort**: Sort alphabetically

## 💾 Real-time Save

Setiap kali menemukan manhwa baru:
```
✨ New: Solo Leveling
💾 Auto-save: 80 manhwa saved
```

Data langsung masuk ke JSON, jadi aman stop kapan saja!

## 🛑 Graceful Shutdown

Tekan `Ctrl+C` untuk stop:
```
⚠️  Stopping scraper...
💾 Saving current progress...
✅ Progress saved successfully!
👋 Goodbye!
```

## ⚙️ Configuration

Edit di `list-manhwa.js`:

```javascript
// Scroll delay (default: 800ms)
await delay(800)

// Auto-save trigger
// Sekarang: Save setiap manhwa baru
// Sebelumnya: Save setiap 10 manhwa
```

## 📈 Performance

| Metric | Value |
|--------|-------|
| **Scroll Speed** | 800ms per scroll |
| **Save Speed** | Instant (real-time) |
| **Memory** | Low (incremental) |
| **Safe Stop** | Yes (Ctrl+C) |

## 🔄 Workflow

```
Start Scraper
    ↓
Load Existing List
    ↓
Scroll & Extract
    ↓
New Manhwa Found? → Save Immediately ✅
    ↓
Continue Scrolling
    ↓
Ctrl+C? → Save & Exit ✅
    ↓
End of List? → Final Save ✅
```

## 💡 Tips

### 1. Stop Anytime
```bash
# Tekan Ctrl+C kapan saja
# Data sudah tersimpan!
```

### 2. Resume Later
```bash
# Script akan merge dengan data existing
# Tidak ada duplikat
node list-manhwa.js
```

### 3. Check Progress
```bash
# Lihat berapa manhwa sudah tersimpan
cat ../public/komiku-list.json | grep "title" | wc -l
```

### 4. Fast Scrape
```bash
# Untuk scrape cepat, limit scroll
node list-manhwa.js 20
```

## 🐛 Troubleshooting

### Browser tidak muncul?
```bash
# Set headless: false di script
const browser = await puppeteer.launch({
  headless: false  // ✅ Browser akan muncul
})
```

### Data tidak tersimpan?
```bash
# Check folder public/ ada?
ls ../public/

# Check permission
chmod +w ../public/komiku-list.json
```

### Scroll terlalu cepat?
```javascript
// Edit delay di script
await delay(1500)  // Lebih lambat
```

## 📋 Example Output

```
🚀 Starting Komiku List Scraper...
📜 Max scrolls: Infinity

🌐 Launching browser...
📚 Navigating to: https://komiku.org/pustaka/...

📜 Scrolling to load manhwa...
  📜 Scroll 1/Infinity
  📜 Scroll 2/Infinity
  ✨ New: Solo Leveling
  💾 Auto-save: 80 manhwa saved
  📜 Scroll 3/Infinity
  ✨ New: The Beginning After The End
  💾 Auto-save: 81 manhwa saved
  ...

✅ Extracted 150 manhwa from Komiku
   - With images: 150
   - Without images: 0
   - New manhwa added: 15

💾 Saved to: 150 manhwa saved
📊 Total manhwa in list: 150
   - Previous: 135
   - New added: 15
   - Duplicates skipped: 0
```

## 🎉 Success!

Sekarang kamu bisa:
- ✅ Scrape manhwa list dengan cepat
- ✅ Stop kapan saja tanpa kehilangan data
- ✅ Lihat progress real-time
- ✅ Merge otomatis tanpa duplikat

Happy scraping! 🚀
