# 🎌 Komiku Scraper & API

Scraper dan RESTful API untuk data manga/manhwa dari Komiku.org

## 📁 Struktur Folder

```
scraper-komiku/
├── api/                          # API Server
│   ├── api-server.js            # Main API server
│   └── api-example.html         # Interactive API demo
│
├── scrapers/                     # Web Scrapers
│   ├── scraper.js               # Main scraper
│   ├── scraper-puppeteer.js     # Puppeteer scraper
│   ├── scrape-simple.js         # Simple scraper
│   ├── list-manhwa.js           # List scraper
│   ├── generate-list.js         # Generate manga list
│   ├── generate-latest-updates.js
│   └── sync-list.js             # Sync manga list
│
├── data/                         # Data Storage
│   ├── komiku-list.json         # Manga list
│   ├── latest-updates.json      # Latest updates
│   ├── chapter-updates.json     # Chapter updates
│   └── Chapter/                 # Chapter data
│       └── komiku/              # Individual manga chapters
│
├── tests/                        # Testing Scripts
│   ├── test-api.js              # API testing
│   ├── test-shutdown.js         # Shutdown test
│   └── test-title.js            # Title test
│
├── config/                       # Configuration Files
│   ├── vercel.json              # Vercel deployment
│   ├── railway.json             # Railway deployment
│   └── render.yaml              # Render deployment
│
├── docs/                         # Documentation
│   ├── README.md                # Main documentation
│   ├── API-README.md            # API documentation
│   ├── API-SUMMARY.md           # API summary
│   ├── DEPLOYMENT-GUIDE.md      # Deployment guide
│   ├── HOW-TO-SHARE-API.md      # Sharing guide
│   ├── QUICK-START-API.md       # Quick start
│   ├── RESTART-API.md           # Restart guide
│   ├── OPTIMIZATION.md          # Optimization tips
│   ├── TROUBLESHOOTING.md       # Troubleshooting
│   ├── WORKFLOW.md              # Workflow guide
│   ├── SKIP-LOGIC.md            # Skip logic
│   ├── README-LIST-SCRAPER.md   # List scraper docs
│   └── Komiku-API.postman_collection.json
│
├── example-website/              # Example Website
│   ├── index.html               # Demo website
│   └── README.md                # Website docs
│
├── .gitignore                    # Git ignore
├── package.json                  # NPM dependencies
└── package-lock.json             # NPM lock file
```

## 🚀 Quick Start

### 1. Installation

```bash
npm install
```

### 2. Jalankan API Server

```bash
# Production mode
npm start

# Development mode (auto-reload)
npm run dev

# Alternative
npm run api
```

Server akan berjalan di: **http://localhost:3000**

### 3. Testing

```bash
# Test API
npm test

# Manual test
node tests/test-api.js
```

### 4. Scraping (Optional)

```bash
# Scrape manga list
npm run scrape:list

# Scrape all manga
npm run scrape:all

# Scrape with images
npm run scrape:all:images
```

## 📚 Dokumentasi

### API Documentation
- **[API-README.md](docs/API-README.md)** - Dokumentasi lengkap API
- **[QUICK-START-API.md](docs/QUICK-START-API.md)** - Panduan cepat
- **[API-SUMMARY.md](docs/API-SUMMARY.md)** - Ringkasan API

### Deployment
- **[DEPLOYMENT-GUIDE.md](docs/DEPLOYMENT-GUIDE.md)** - Panduan deploy
- **[HOW-TO-SHARE-API.md](docs/HOW-TO-SHARE-API.md)** - Cara share API

### Scraper
- **[README-LIST-SCRAPER.md](docs/README-LIST-SCRAPER.md)** - Scraper docs
- **[OPTIMIZATION.md](docs/OPTIMIZATION.md)** - Optimization
- **[TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Troubleshooting

## 🎯 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/manga` | GET | Daftar semua manga |
| `/api/manga/:slug` | GET | Detail manga |
| `/api/manga/:slug/details` | GET | Detail lengkap |
| `/api/chapters/:slug` | GET | Semua chapter |
| `/api/chapters/:slug/:number` | GET | Chapter spesifik |
| `/api/genres` | GET | Daftar genre |
| `/api/latest-updates` | GET | Update terbaru |
| `/api/search` | GET | Pencarian |
| `/api/stats` | GET | Statistik |
| `/api/health` | GET | Health check |

## 💻 Example Usage

```javascript
const API_URL = 'http://localhost:3000';

// Get all manga
fetch(`${API_URL}/api/manga?page=1&limit=20`)
  .then(res => res.json())
  .then(data => console.log(data));

// Search manga
fetch(`${API_URL}/api/search?q=academy`)
  .then(res => res.json())
  .then(data => console.log(data));

// Get chapters
fetch(`${API_URL}/api/chapters/99-wooden-stick`)
  .then(res => res.json())
  .then(data => console.log(data));
```

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel login
vercel
vercel --prod
```

### Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Render

1. Buka https://render.com
2. Connect GitHub repository
3. Deploy!

**Lihat [DEPLOYMENT-GUIDE.md](docs/DEPLOYMENT-GUIDE.md) untuk detail lengkap**

## 🔧 Configuration

### Environment Variables

```bash
PORT=3000              # Server port
NODE_ENV=production    # Environment
```

### Config Files

- `config/vercel.json` - Vercel configuration
- `config/railway.json` - Railway configuration
- `config/render.yaml` - Render configuration

## 📊 Features

### API Features
- ✅ RESTful API
- ✅ CORS enabled
- ✅ Pagination
- ✅ Search & Filter
- ✅ Error handling
- ✅ Comprehensive documentation

### Scraper Features
- ✅ Manga list scraping
- ✅ Chapter scraping
- ✅ Image downloading
- ✅ Auto-retry on failure
- ✅ Progress tracking

## 🧪 Testing

### API Testing

```bash
# Run all tests
npm test

# Manual testing
node tests/test-api.js
```

### Interactive Testing

1. Buka `api/api-example.html` di browser
2. Atau akses http://localhost:3000 setelah server running

## 📝 Scripts

```bash
npm start              # Start API server
npm run dev            # Development mode
npm run api            # Start API (alternative)
npm test               # Run tests
npm run scrape:list    # Scrape manga list
npm run scrape:all     # Scrape all manga
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check `docs/` folder
- **Issues**: Create GitHub issue
- **Questions**: Check TROUBLESHOOTING.md

## 🎉 Credits

- Data source: Komiku.org
- Built with Express.js, Cheerio, Puppeteer

---

**Made with ❤️ for manga lovers**

**Quick Links:**
- [API Documentation](docs/API-README.md)
- [Deployment Guide](docs/DEPLOYMENT-GUIDE.md)
- [Example Website](example-website/)
- [Postman Collection](docs/Komiku-API.postman_collection.json)
