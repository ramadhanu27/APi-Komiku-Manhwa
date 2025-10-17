# 🚀 Quick Start - Komiku API

## Instalasi

```bash
# Install dependencies (sudah dilakukan)
npm install
```

## Menjalankan API Server

### Cara 1: Mode Normal
```bash
npm run api
```

### Cara 2: Mode Development (auto-reload)
```bash
npm run dev
```

Server akan berjalan di: **http://localhost:3000**

## Testing API

### 1. Buka Browser
Akses: http://localhost:3000

Anda akan melihat dokumentasi endpoint yang tersedia.

### 2. Test dengan Browser (UI Demo)
Buka file: `api-example.html` di browser Anda untuk melihat demo interaktif.

### 3. Test dengan cURL

```bash
# Get all manga
curl http://localhost:3000/api/manga

# Get manga by slug
curl http://localhost:3000/api/manga/99-wooden-stick

# Get manga details
curl http://localhost:3000/api/manga/99-wooden-stick/details

# Get chapters
curl http://localhost:3000/api/chapters/99-wooden-stick

# Get specific chapter
curl http://localhost:3000/api/chapters/99-wooden-stick/1

# Search manga
curl "http://localhost:3000/api/search?q=academy"

# Get genres
curl http://localhost:3000/api/genres

# Get stats
curl http://localhost:3000/api/stats

# Health check
curl http://localhost:3000/api/health
```

### 4. Test dengan Postman/Insomnia
Import endpoint berikut:
- GET http://localhost:3000/api/manga
- GET http://localhost:3000/api/manga/:slug
- GET http://localhost:3000/api/chapters/:slug
- dll (lihat API-README.md)

## Endpoint Utama

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/manga` | Daftar semua manga |
| GET | `/api/manga/:slug` | Detail manga |
| GET | `/api/manga/:slug/details` | Detail lengkap manga |
| GET | `/api/chapters/:slug` | Semua chapter manga |
| GET | `/api/chapters/:slug/:number` | Detail chapter tertentu |
| GET | `/api/genres` | Daftar genre |
| GET | `/api/latest-updates` | Update terbaru |
| GET | `/api/search` | Pencarian manga |
| GET | `/api/stats` | Statistik API |
| GET | `/api/health` | Health check |

## Query Parameters

### Pagination
```
?page=1&limit=20
```

### Search
```
?search=solo
```

### Filter by Genre
```
?genre=Action
```

### Kombinasi
```
?search=academy&genre=Fantasy&page=1&limit=10
```

## Contoh Response

### Success Response
```json
{
  "success": true,
  "page": 1,
  "limit": 20,
  "total": 100,
  "totalPages": 5,
  "data": [...]
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Tips

1. **CORS sudah enabled** - Bisa diakses dari frontend manapun
2. **Gunakan pagination** - Untuk performa lebih baik
3. **Check health endpoint** - Untuk monitoring
4. **Lihat API-README.md** - Untuk dokumentasi lengkap

## Troubleshooting

### Port sudah digunakan?
```bash
# Ganti port
PORT=3001 npm run api
```

### Module not found?
```bash
npm install
```

### Data tidak muncul?
Pastikan file berikut ada:
- `komiku-list.json`
- `latest-updates.json`
- `Chapter/komiku/*.json`

## Next Steps

1. ✅ API sudah running
2. 📖 Baca dokumentasi lengkap di `API-README.md`
3. 🎨 Buka `api-example.html` untuk demo UI
4. 🔧 Customize sesuai kebutuhan

**Happy Coding! 🎉**
