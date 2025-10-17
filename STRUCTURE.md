# 📁 Struktur Folder - Komiku Scraper & API

Dokumentasi lengkap tentang struktur folder dan organisasi file.

## 🗂️ Overview

```
scraper-komiku/
├── api/              # API Server & Related Files
├── scrapers/         # Web Scraping Scripts
├── data/             # Data Storage (JSON files)
├── tests/            # Testing Scripts
├── config/           # Deployment Configurations
├── docs/             # Documentation Files
├── example-website/  # Example Implementation
└── [root files]      # Package.json, .gitignore, etc
```

---

## 📂 Folder Details

### 1. `api/` - API Server

**Purpose**: Berisi semua file terkait API server

```
api/
├── api-server.js        # Main Express.js API server
└── api-example.html     # Interactive demo UI
```

**Files:**
- **`api-server.js`** - RESTful API server dengan 10 endpoints
- **`api-example.html`** - Demo website untuk testing API

**Usage:**
```bash
node api/api-server.js
# atau
npm start
```

---

### 2. `scrapers/` - Web Scrapers

**Purpose**: Script untuk scraping data dari Komiku.org

```
scrapers/
├── scraper.js                    # Main scraper (recommended)
├── scraper-puppeteer.js          # Puppeteer-based scraper
├── scrape-simple.js              # Simple scraper
├── list-manhwa.js                # List scraper
├── generate-list.js              # Generate manga list
├── generate-latest-updates.js    # Generate updates
└── sync-list.js                  # Sync manga list
```

**Files:**
- **`scraper.js`** - Main scraper dengan retry logic
- **`scraper-puppeteer.js`** - Untuk website yang butuh JavaScript
- **`scrape-simple.js`** - Scraper sederhana
- **`list-manhwa.js`** - Scrape daftar manga
- **`generate-list.js`** - Generate komiku-list.json
- **`generate-latest-updates.js`** - Generate latest-updates.json
- **`sync-list.js`** - Sync data manga

**Usage:**
```bash
node scrapers/scraper.js list 1
node scrapers/scraper.js all 1
```

---

### 3. `data/` - Data Storage

**Purpose**: Menyimpan semua data hasil scraping

```
data/
├── komiku-list.json          # Daftar semua manga (115+ manga)
├── latest-updates.json       # Update terbaru
├── chapter-updates.json      # Chapter updates
└── Chapter/
    └── komiku/
        ├── 99-wooden-stick.json
        ├── eleceed.json
        └── ... (115+ files)
```

**Files:**
- **`komiku-list.json`** - Array of manga objects dengan title, slug, url, image, genres
- **`latest-updates.json`** - Latest manga updates
- **`chapter-updates.json`** - Chapter update tracking
- **`Chapter/komiku/*.json`** - Detail chapter untuk setiap manga

**Data Format:**

```json
// komiku-list.json
[
  {
    "title": "+99 Wooden Stick",
    "slug": "99-wooden-stick",
    "url": "https://komiku.org/manga/99-wooden-stick/",
    "image": "https://thumbnail.komiku.org/...",
    "genres": ["Action", "Drama", "Shounen"]
  }
]

// Chapter/komiku/99-wooden-stick.json
{
  "manhwaTitle": "Komik +99 Wooden Stick",
  "slug": "99-wooden-stick",
  "totalChapters": 97,
  "chapters": [
    {
      "number": "1",
      "title": "Chapter 1",
      "url": "https://...",
      "date": "16/05/2022",
      "images": [...]
    }
  ]
}
```

---

### 4. `tests/` - Testing Scripts

**Purpose**: Script untuk testing API dan scraper

```
tests/
├── test-api.js          # API endpoint testing
├── test-shutdown.js     # Shutdown test
└── test-title.js        # Title parsing test
```

**Files:**
- **`test-api.js`** - Automated testing untuk semua API endpoints
- **`test-shutdown.js`** - Test graceful shutdown
- **`test-title.js`** - Test title parsing

**Usage:**
```bash
npm test
# atau
node tests/test-api.js
```

---

### 5. `config/` - Deployment Configurations

**Purpose**: Konfigurasi untuk berbagai platform deployment

```
config/
├── vercel.json      # Vercel deployment config
├── railway.json     # Railway deployment config
└── render.yaml      # Render deployment config
```

**Files:**
- **`vercel.json`** - Config untuk deploy ke Vercel
- **`railway.json`** - Config untuk deploy ke Railway
- **`render.yaml`** - Config untuk deploy ke Render

**Usage:**
```bash
# Vercel
vercel --prod

# Railway
railway up

# Render
# Auto-deploy via GitHub
```

---

### 6. `docs/` - Documentation

**Purpose**: Semua dokumentasi proyek

```
docs/
├── README.md                        # Main docs (moved from root)
├── API-README.md                    # API documentation
├── API-SUMMARY.md                   # API summary
├── DEPLOYMENT-GUIDE.md              # Deployment guide
├── HOW-TO-SHARE-API.md             # Sharing guide
├── QUICK-START-API.md              # Quick start
├── RESTART-API.md                  # Restart guide
├── OPTIMIZATION.md                 # Optimization tips
├── TROUBLESHOOTING.md              # Troubleshooting
├── WORKFLOW.md                     # Workflow guide
├── SKIP-LOGIC.md                   # Skip logic
├── README-LIST-SCRAPER.md          # Scraper docs
└── Komiku-API.postman_collection.json
```

**Categories:**

**API Documentation:**
- `API-README.md` - Lengkap dengan semua endpoints
- `API-SUMMARY.md` - Ringkasan fitur API
- `QUICK-START-API.md` - Panduan cepat
- `RESTART-API.md` - Cara restart server

**Deployment:**
- `DEPLOYMENT-GUIDE.md` - Deploy ke Vercel/Railway/Render
- `HOW-TO-SHARE-API.md` - Cara share API ke publik

**Scraper:**
- `README-LIST-SCRAPER.md` - Dokumentasi scraper
- `OPTIMIZATION.md` - Tips optimasi
- `TROUBLESHOOTING.md` - Pemecahan masalah
- `WORKFLOW.md` - Workflow scraping
- `SKIP-LOGIC.md` - Skip logic

**Tools:**
- `Komiku-API.postman_collection.json` - Postman collection

---

### 7. `example-website/` - Example Implementation

**Purpose**: Contoh website yang menggunakan API

```
example-website/
├── index.html       # Demo manga reader website
└── README.md        # Website documentation
```

**Files:**
- **`index.html`** - Full-featured manga reader demo
- **`README.md`** - Cara deploy dan customize

**Features:**
- Search manga
- Pagination
- Manga details
- Chapter list
- Responsive design

**Usage:**
1. Jalankan API server
2. Buka `index.html` di browser
3. Atau deploy ke Netlify/Vercel

---

### 8. Root Files

**Purpose**: File konfigurasi utama

```
[root]/
├── package.json         # NPM dependencies & scripts
├── package-lock.json    # NPM lock file
├── .gitignore          # Git ignore rules
├── README.md           # Main README (new)
└── STRUCTURE.md        # This file
```

**Files:**
- **`package.json`** - Dependencies, scripts, metadata
- **`package-lock.json`** - Exact dependency versions
- **`.gitignore`** - Files to ignore in git
- **`README.md`** - Main project documentation
- **`STRUCTURE.md`** - Folder structure documentation

---

## 🎯 File Organization Principles

### 1. **Separation of Concerns**
- API code terpisah dari scraper
- Data terpisah dari code
- Tests terpisah dari production code
- Config terpisah dari logic

### 2. **Easy Navigation**
- Folder names yang jelas
- Logical grouping
- Consistent naming

### 3. **Scalability**
- Easy to add new scrapers
- Easy to add new API endpoints
- Easy to add new tests

### 4. **Deployment Ready**
- Config files di satu tempat
- Clear entry points
- Environment-agnostic

---

## 📝 Naming Conventions

### Folders
- **Lowercase** - `api/`, `scrapers/`, `data/`
- **Plural** untuk collections - `tests/`, `docs/`
- **Descriptive** - `example-website/`

### Files
- **kebab-case** - `api-server.js`, `test-api.js`
- **Descriptive** - `generate-latest-updates.js`
- **Extensions** - `.js`, `.json`, `.md`, `.html`

### Data Files
- **kebab-case** - `komiku-list.json`
- **Descriptive** - `latest-updates.json`
- **Consistent** - All JSON files

---

## 🔄 Data Flow

```
┌─────────────┐
│  Scrapers   │ ──> Scrape data from Komiku.org
└─────────────┘
       │
       ▼
┌─────────────┐
│    Data     │ ──> Store in JSON files
└─────────────┘
       │
       ▼
┌─────────────┐
│     API     │ ──> Serve data via REST API
└─────────────┘
       │
       ▼
┌─────────────┐
│   Clients   │ ──> Websites, Apps, etc
└─────────────┘
```

---

## 🚀 Quick Reference

### Start API
```bash
npm start
# or
node api/api-server.js
```

### Run Scraper
```bash
npm run scrape:list
# or
node scrapers/scraper.js list 1
```

### Run Tests
```bash
npm test
# or
node tests/test-api.js
```

### Deploy
```bash
# Vercel
vercel --prod

# Railway
railway up
```

---

## 📊 File Count Summary

- **API Files**: 2
- **Scraper Files**: 7
- **Data Files**: 3 + 115 chapter files
- **Test Files**: 3
- **Config Files**: 3
- **Documentation**: 13
- **Example**: 2
- **Root Files**: 5

**Total**: ~150+ files

---

## 🔧 Maintenance

### Adding New Scraper
1. Create file in `scrapers/`
2. Update `package.json` scripts
3. Document in `docs/`

### Adding New API Endpoint
1. Edit `api/api-server.js`
2. Update `docs/API-README.md`
3. Add test in `tests/test-api.js`

### Adding New Documentation
1. Create file in `docs/`
2. Update `README.md` links
3. Update this `STRUCTURE.md`

---

## ✅ Benefits of This Structure

1. **Clear Organization** - Easy to find files
2. **Scalable** - Easy to add new features
3. **Maintainable** - Logical separation
4. **Professional** - Industry-standard structure
5. **Deployment Ready** - Config files organized
6. **Developer Friendly** - Clear documentation

---

## 📞 Need Help?

- Check `docs/` folder for specific documentation
- See `README.md` for quick start
- Check `TROUBLESHOOTING.md` for common issues

---

**Last Updated**: October 17, 2025
**Version**: 2.0.0 (Restructured)
