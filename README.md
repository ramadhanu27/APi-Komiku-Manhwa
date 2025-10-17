# 📚 Komiku Scraper

Scraper untuk mengambil data manhwa dari [Komiku.org](https://komiku.org)

## 🚀 Installation

```bash
cd scraper-komiku
npm install
```

## 📖 Usage

### 1. Scrape Manhwa List (Tanpa Detail)

Scrape daftar manhwa dari halaman pustaka:

```bash
node scraper.js list 1
```

**Output:** List manhwa di console (JSON format)

---

### 2. Scrape All Manhwa (Dengan Detail)

Scrape semua manhwa dengan detail lengkap (tanpa images):

```bash
node scraper.js all 1
```

**Output:** File JSON di `public/Chapter/komiku/{slug}.json`

**Contoh:**
```bash
node scraper.js all 3  # Scrape 3 halaman
```

---

### 3. Scrape All Manhwa (Dengan Images)

Scrape semua manhwa termasuk images chapter:

```bash
node scraper.js all 1 --images
```

⚠️ **Warning:** Ini akan memakan waktu lama karena scrape semua images!

---

### 4. Scrape Single Manhwa

Scrape 1 manhwa saja (tanpa images):

```bash
node scraper.js single solo-leveling
```

**Dengan images:**
```bash
node scraper.js single solo-leveling --images
```

---

## 📁 Output Structure

```
public/
└── Chapter/
    └── komiku/
        ├── solo-leveling.json
        ├── the-beginning-after-the-end.json
        └── ...
```

### JSON Format:

```json
{
  "manhwaTitle": "Solo Leveling",
  "alternativeTitle": "나 혼자만 레벨업",
  "manhwaUrl": "https://komiku.org/manga/solo-leveling/",
  "slug": "solo-leveling",
  "image": "https://...",
  "author": "Chugong",
  "type": "Manhwa",
  "status": "Completed",
  "released": "2018",
  "genres": ["Action", "Adventure", "Fantasy"],
  "synopsis": "...",
  "totalChapters": 179,
  "scrapedAt": "2025-10-15T13:00:00.000Z",
  "chapters": [
    {
      "number": "1",
      "title": "Chapter 1",
      "url": "https://komiku.org/ch/solo-leveling-chapter-1/",
      "date": "2 years ago",
      "images": [
        {
          "page": 1,
          "url": "https://...",
          "filename": "page-001.jpg"
        }
      ]
    }
  ]
}
```

---

## 🎯 Selectors Used

Berdasarkan struktur HTML Komiku:

### Manhwa List Page:
- **Container:** `.bge`
- **Link:** `.kan a`
- **Title:** `.kan a h3`
- **Image:** `.bgei img`
- **Genres:** `.genre span`

### Manhwa Detail Page:
- **Title:** `.judul h1`
- **Alternative Title:** `.judul .j2`
- **Image:** `.ims img`
- **Synopsis:** `.sin`
- **Metadata:** `.inftable tr`
- **Genres:** `.genre li a`
- **Chapters:** `.chapter-list .judulseries`

### Chapter Page:
- **Images:** `#Baca_Komik img`

---

## ⚙️ Features

- ✅ Scrape manhwa list
- ✅ Scrape manhwa details
- ✅ Scrape chapter list
- ✅ Scrape chapter images (optional)
- ✅ Auto delay to avoid rate limiting
- ✅ Error handling
- ✅ Progress logging
- ✅ JSON output

---

## 🔧 Configuration

Edit `scraper.js` untuk customize:

```javascript
// Base URL
const BASE_URL = 'https://komiku.org'

// Delay between requests (ms)
await delay(2000)  // 2 seconds

// Headers
const headers = {
  'User-Agent': '...',
  'Referer': 'https://komiku.org/'
}
```

---

## 📊 Examples

### Scrape 5 halaman manhwa:
```bash
node scraper.js all 5
```

### Scrape Solo Leveling dengan images:
```bash
node scraper.js single solo-leveling --images
```

### Test scraper (list only):
```bash
npm test
```

---

## ⚠️ Notes

1. **Rate Limiting:** Scraper menggunakan delay untuk menghindari rate limiting
2. **Images:** Scraping images memakan waktu lama, gunakan `--images` hanya jika perlu
3. **Storage:** Pastikan ada cukup space untuk menyimpan images
4. **Legal:** Gunakan scraper ini untuk personal use only

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'axios'"
```bash
npm install
```

### Error: "ECONNREFUSED"
- Check internet connection
- Komiku.org mungkin down
- Try again later

### No images scraped
- Check selector `#Baca_Komik img`
- Komiku mungkin update struktur HTML
- Update selector di `scrapeChapterImages()`

---

## 📝 TODO

- [ ] Download images to local
- [ ] Multi-threading untuk faster scraping
- [ ] Resume scraping dari last position
- [ ] Update existing manhwa
- [ ] Scrape comments/ratings

---

## 🤝 Contributing

Feel free to improve this scraper!

---

**Happy Scraping! 📚✨**
