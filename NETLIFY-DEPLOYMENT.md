# 🚀 Netlify Deployment Guide - Komiku API

## ✅ Persiapan Selesai

File-file berikut sudah dibuat dan siap untuk deployment:

### 📁 File Struktur
```
scraper-komiku/
├── netlify.toml              # Konfigurasi Netlify
├── index.html                # Redirect ke dokumentasi API
├── api/
│   └── index.html           # Dokumentasi API
├── netlify/
│   └── functions/
│       ├── api.js           # Netlify Function untuk API endpoints
│       └── package.json     # Dependencies untuk functions
└── data/
    ├── komiku-list.json     # Data manga
    ├── latest-updates.json  # Update terbaru
    └── chapter-updates.json # Update chapter
```

## 🌐 API Endpoints yang Tersedia

Setelah deploy, API akan tersedia di:

### Base URL
```
https://your-site.netlify.app
```

### Endpoints

1. **Health Check**
   ```
   GET /api/health
   ```

2. **Statistics**
   ```
   GET /api/stats
   ```

3. **List All Manga**
   ```
   GET /api/list?page=1&limit=20
   GET /api/list?search=academy
   GET /api/list?genre=action
   ```

4. **Get All Manga (dengan pagination)**
   ```
   GET /api/manga?page=1&limit=20
   ```

5. **Get Manga by Slug**
   ```
   GET /api/manga/99-wooden-stick
   GET /api/manga/eleceed
   ```

6. **Latest Updates**
   ```
   GET /api/latest-updates?limit=20
   ```

7. **Get All Genres**
   ```
   GET /api/genres
   ```

8. **Search Manga**
   ```
   GET /api/search?q=academy
   GET /api/search?q=academy&genre=action
   ```

9. **Get Chapters**
   ```
   GET /api/chapters/99-wooden-stick
   GET /api/chapters/99-wooden-stick?page=1&limit=50
   ```

10. **Get Specific Chapter**
    ```
    GET /api/chapters/99-wooden-stick/1
    ```

## 📝 Cara Deploy ke Netlify

### Metode 1: Deploy via Git (Recommended)

1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Add Netlify configuration and functions"
   git push origin main
   ```

2. **Connect ke Netlify**
   - Login ke [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Pilih GitHub dan repository Anda
   - Build settings akan otomatis terdeteksi dari `netlify.toml`
   - Click "Deploy site"

3. **Done!** 🎉
   - Site akan otomatis deploy
   - API akan tersedia di `https://your-site.netlify.app/api/...`

### Metode 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Metode 3: Drag & Drop

1. Login ke [Netlify](https://app.netlify.com)
2. Drag folder project ke area "Sites"
3. Done! (tapi tidak recommended karena tidak auto-update)

## ⚙️ Konfigurasi Netlify

File `netlify.toml` sudah dikonfigurasi dengan:

- ✅ **Publish directory**: Root folder (`.`)
- ✅ **Functions directory**: `netlify/functions`
- ✅ **Redirects**: Semua `/api/*` routes ke Netlify Functions
- ✅ **CORS headers**: Enabled untuk semua endpoints
- ✅ **Root redirect**: `/` → `/api/index.html` (dokumentasi)

## 🔧 Testing Setelah Deploy

1. **Test Health Check**
   ```bash
   curl https://your-site.netlify.app/api/health
   ```

2. **Test Stats**
   ```bash
   curl https://your-site.netlify.app/api/stats
   ```

3. **Test List**
   ```bash
   curl https://your-site.netlify.app/api/list?limit=5
   ```

4. **Open Documentation**
   ```
   https://your-site.netlify.app
   ```

## 📊 Response Format

Semua API responses menggunakan format JSON:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## 🚨 Troubleshooting

### Function Error 500
- Check Netlify function logs di dashboard
- Pastikan file `data/*.json` ada dan valid

### CORS Error
- Sudah dikonfigurasi di `netlify.toml`
- Headers otomatis ditambahkan ke semua responses

### 404 Not Found
- Pastikan `netlify.toml` ada di root folder
- Check redirects configuration di Netlify dashboard

### Data Tidak Muncul
- Pastikan folder `data/` dan file JSON-nya ter-commit ke Git
- Check file permissions

## 📈 Monitoring

Netlify menyediakan:
- **Function logs**: Lihat di Netlify dashboard → Functions
- **Analytics**: Traffic dan usage statistics
- **Deploy logs**: History semua deployments

## 🔄 Auto-Deploy

Jika connect via Git:
- Setiap push ke branch `main` akan otomatis deploy
- Preview deployments untuk pull requests
- Rollback ke versi sebelumnya kapan saja

## 💡 Tips

1. **Custom Domain**: Bisa set custom domain di Netlify dashboard
2. **Environment Variables**: Set di Netlify dashboard jika butuh
3. **Build Hooks**: Untuk trigger deploy dari external services
4. **Edge Functions**: Untuk performance lebih baik (optional upgrade)

## 📞 Support

Jika ada masalah:
1. Check Netlify function logs
2. Test locally dengan `netlify dev`
3. Review `netlify.toml` configuration

---

**Status**: ✅ Ready to Deploy!

Semua file sudah siap. Tinggal push ke Git dan deploy ke Netlify! 🚀
