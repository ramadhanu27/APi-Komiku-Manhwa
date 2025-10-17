# 🚀 Panduan Deploy API Komiku ke Internet

Agar API bisa diakses oleh siapa saja untuk membuat website, Anda perlu deploy ke hosting cloud.

## 🎯 Pilihan Platform (Gratis)

### 1. **Vercel** ⭐ (Paling Mudah)

#### Langkah-langkah:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login ke Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Deploy Production**
```bash
vercel --prod
```

**Hasil:** API akan tersedia di `https://your-project.vercel.app`

**Kelebihan:**
- ✅ Gratis
- ✅ Setup otomatis
- ✅ SSL/HTTPS gratis
- ✅ CDN global
- ✅ Auto deploy dari Git

---

### 2. **Railway** (Recommended untuk API)

#### Langkah-langkah:

1. **Buat akun di** https://railway.app
2. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

3. **Login**
```bash
railway login
```

4. **Init Project**
```bash
railway init
```

5. **Deploy**
```bash
railway up
```

6. **Generate Domain**
```bash
railway domain
```

**Hasil:** API akan tersedia di `https://your-project.up.railway.app`

**Kelebihan:**
- ✅ Gratis 500 jam/bulan
- ✅ Database support
- ✅ Environment variables
- ✅ Auto deploy dari Git

---

### 3. **Render** (Stabil & Reliable)

#### Langkah-langkah:

1. **Buat akun di** https://render.com
2. **Push code ke GitHub**
3. **Di Render Dashboard:**
   - New → Web Service
   - Connect GitHub repository
   - Build Command: `npm install`
   - Start Command: `npm run api`
   - Deploy!

**Hasil:** API akan tersedia di `https://your-project.onrender.com`

**Kelebihan:**
- ✅ Gratis
- ✅ Auto deploy dari Git
- ✅ SSL gratis
- ✅ Sangat stabil

---

### 4. **Heroku** (Classic)

#### Langkah-langkah:

1. **Install Heroku CLI**
```bash
# Download dari: https://devcenter.heroku.com/articles/heroku-cli
```

2. **Login**
```bash
heroku login
```

3. **Create App**
```bash
heroku create komiku-api
```

4. **Deploy**
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

**Hasil:** API akan tersedia di `https://komiku-api.herokuapp.com`

**Note:** Heroku tidak lagi gratis, tapi masih populer.

---

## 📝 Persiapan Sebelum Deploy

### 1. Buat `.gitignore`
```bash
node_modules/
.env
*.log
.DS_Store
.vercel
.railway
```

### 2. Update `package.json`
Pastikan ada:
```json
{
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "start": "node api-server.js",
    "api": "node api-server.js"
  }
}
```

### 3. Environment Variables
Buat file `.env.example`:
```
PORT=3000
NODE_ENV=production
```

---

## 🌐 Setelah Deploy

### URL API Anda akan jadi:
```
https://your-project.vercel.app/api/manga
https://your-project.vercel.app/api/chapters/99-wooden-stick
https://your-project.vercel.app/api/search?q=academy
```

### Cara Orang Lain Menggunakan:

#### JavaScript/Fetch
```javascript
// Ganti dengan URL deploy Anda
const API_URL = 'https://your-project.vercel.app';

// Get manga
fetch(`${API_URL}/api/manga`)
  .then(res => res.json())
  .then(data => console.log(data));

// Search
fetch(`${API_URL}/api/search?q=academy`)
  .then(res => res.json())
  .then(data => console.log(data));
```

#### React Example
```jsx
import { useState, useEffect } from 'react';

function MangaList() {
  const [manga, setManga] = useState([]);
  const API_URL = 'https://your-project.vercel.app';

  useEffect(() => {
    fetch(`${API_URL}/api/manga`)
      .then(res => res.json())
      .then(data => setManga(data.data));
  }, []);

  return (
    <div>
      {manga.map(m => (
        <div key={m.slug}>
          <h3>{m.title}</h3>
          <img src={m.image} alt={m.title} />
        </div>
      ))}
    </div>
  );
}
```

---

## 🔧 Custom Domain (Opsional)

### Vercel
```bash
vercel domains add yourdomain.com
```

### Railway
Di dashboard → Settings → Domains → Add Custom Domain

### Render
Di dashboard → Settings → Custom Domain

---

## 📊 Monitoring & Analytics

### 1. **Uptime Monitoring**
- https://uptimerobot.com (Gratis)
- https://betteruptime.com (Gratis)

### 2. **Analytics**
- Google Analytics
- Plausible Analytics

### 3. **Error Tracking**
- Sentry (https://sentry.io)
- LogRocket

---

## 🔒 Security untuk Production

### 1. Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100 // max 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 2. Helmet (Security Headers)
```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 3. CORS Configuration
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://yourwebsite.com', 'https://www.yourwebsite.com'],
  methods: ['GET'],
  credentials: true
}));
```

---

## 📖 Dokumentasi untuk User

### Buat file `PUBLIC-API-DOCS.md`:

```markdown
# Komiku API Documentation

Base URL: `https://your-project.vercel.app`

## Endpoints

### Get All Manga
GET /api/manga?page=1&limit=20

### Search Manga
GET /api/search?q=academy

### Get Chapters
GET /api/chapters/:slug

## Example Usage

fetch('https://your-project.vercel.app/api/manga')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 🎯 Quick Start (Vercel - Tercepat)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Production
vercel --prod
```

**Done!** API Anda sudah online dan bisa diakses siapa saja! 🎉

---

## 🆘 Troubleshooting

### Error: Module not found
```bash
# Pastikan package.json lengkap
npm install
```

### Error: Port already in use
```bash
# Tidak masalah di cloud, mereka auto assign port
# Pastikan di api-server.js ada:
const PORT = process.env.PORT || 3000;
```

### API lambat?
- Gunakan CDN
- Enable caching
- Optimize JSON response size

---

## 📞 Support

Setelah deploy, share URL API Anda:
- Di README.md
- Di dokumentasi
- Di GitHub repository

**Contoh:**
```
API Base URL: https://komiku-api.vercel.app
Documentation: https://komiku-api.vercel.app
```

---

## 🎉 Selamat!

API Anda sekarang bisa diakses oleh siapa saja di internet untuk membuat website manga reader!

**Next Steps:**
1. ✅ Deploy API
2. 📝 Buat dokumentasi publik
3. 🔗 Share URL API
4. 📊 Monitor usage
5. 🚀 Scale jika perlu
