# Komiku API Documentation

RESTful API untuk mengakses data manga/manhwa dari Komiku.

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start the API server
npm run api

# Development mode with auto-reload
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## 📚 API Endpoints

### Base URL
```
http://localhost:3000
```

---

## 1. Manga Endpoints

### 1.1 Get All Manga
Mendapatkan daftar semua manga dengan pagination dan filter.

**Endpoint:** `GET /api/manga`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Nomor halaman |
| limit | number | 20 | Jumlah item per halaman |
| search | string | - | Cari berdasarkan judul |
| genre | string | - | Filter berdasarkan genre |

**Example Request:**
```bash
# Get all manga (page 1, 20 items)
GET http://localhost:3000/api/manga

# Search manga by title
GET http://localhost:3000/api/manga?search=solo

# Filter by genre
GET http://localhost:3000/api/manga?genre=Action

# Combine filters with pagination
GET http://localhost:3000/api/manga?search=academy&genre=Fantasy&page=1&limit=10
```

**Example Response:**
```json
{
  "success": true,
  "page": 1,
  "limit": 20,
  "total": 100,
  "totalPages": 5,
  "data": [
    {
      "title": "+99 Wooden Stick",
      "slug": "99-wooden-stick",
      "url": "https://komiku.org/manga/99-wooden-stick/",
      "image": "https://thumbnail.komiku.org/uploads/manga/99-wooden-stick/manga_thumbnail-Manhwa-99-Wooden-Stick.jpg?w=500",
      "genres": ["Action", "Drama", "Shounen"]
    }
  ]
}
```

---

### 1.2 Get Manga by Slug
Mendapatkan detail manga berdasarkan slug.

**Endpoint:** `GET /api/manga/:slug`

**Example Request:**
```bash
GET http://localhost:3000/api/manga/99-wooden-stick
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "title": "+99 Wooden Stick",
    "slug": "99-wooden-stick",
    "url": "https://komiku.org/manga/99-wooden-stick/",
    "image": "https://thumbnail.komiku.org/uploads/manga/99-wooden-stick/manga_thumbnail-Manhwa-99-Wooden-Stick.jpg?w=500",
    "genres": ["Action", "Drama", "Shounen"]
  }
}
```

---

### 1.3 Get Complete Manga Details
Mendapatkan detail lengkap manga termasuk metadata dari file chapter.

**Endpoint:** `GET /api/manga/:slug/details`

**Example Request:**
```bash
GET http://localhost:3000/api/manga/99-wooden-stick/details
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "manhwaTitle": "Komik +99 Wooden Stick",
    "alternativeTitle": "Tongkat Kayu +99",
    "manhwaUrl": "https://komiku.org/manga/99-wooden-stick/",
    "slug": "99-wooden-stick",
    "image": "https://thumbnail.komiku.org/uploads/manga/99-wooden-stick/manga_thumbnail-Manhwa-99-Wooden-Stick.jpg?w=500",
    "author": "Ryu Kim",
    "type": "Manhwa",
    "status": "Ongoing",
    "released": "15 Tahun (minimal)",
    "genres": ["Action", "Drama", "Shounen"],
    "synopsis": "Cerita berpusat pada seorang petualang muda...",
    "totalChapters": 97,
    "scrapedAt": "2025-10-17T04:09:29.577Z",
    "chapterCount": 97
  }
}
```

---

## 2. Chapter Endpoints

### 2.1 Get All Chapters
Mendapatkan semua chapter untuk manga tertentu.

**Endpoint:** `GET /api/chapters/:slug`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Nomor halaman |
| limit | number | 50 | Jumlah chapter per halaman |

**Example Request:**
```bash
GET http://localhost:3000/api/chapters/99-wooden-stick
GET http://localhost:3000/api/chapters/99-wooden-stick?page=2&limit=20
```

**Example Response:**
```json
{
  "success": true,
  "manhwaTitle": "Komik +99 Wooden Stick",
  "slug": "99-wooden-stick",
  "totalChapters": 97,
  "page": 1,
  "limit": 50,
  "totalPages": 2,
  "data": [
    {
      "number": "1",
      "title": "Chapter 1",
      "url": "https://komiku.org/99-wooden-stick-chapter-01/",
      "date": "16/05/2022",
      "images": [...]
    }
  ]
}
```

---

### 2.2 Get Specific Chapter
Mendapatkan detail chapter tertentu dengan semua gambar.

**Endpoint:** `GET /api/chapters/:slug/:chapterNumber`

**Example Request:**
```bash
GET http://localhost:3000/api/chapters/99-wooden-stick/1
```

**Example Response:**
```json
{
  "success": true,
  "manhwaTitle": "Komik +99 Wooden Stick",
  "slug": "99-wooden-stick",
  "data": {
    "number": "1",
    "title": "Chapter 1",
    "url": "https://komiku.org/99-wooden-stick-chapter-01/",
    "date": "16/05/2022",
    "images": [
      {
        "page": 1,
        "url": "https://img.komiku.org/uploads2/2511150-1.jpg",
        "filename": "page-001.jpg"
      },
      {
        "page": 2,
        "url": "https://img.komiku.org/uploads2/2511150-2.jpg",
        "filename": "page-002.jpg"
      }
    ]
  }
}
```

---

## 3. Genre Endpoints

### 3.1 Get All Genres
Mendapatkan daftar semua genre yang tersedia.

**Endpoint:** `GET /api/genres`

**Example Request:**
```bash
GET http://localhost:3000/api/genres
```

**Example Response:**
```json
{
  "success": true,
  "total": 45,
  "data": [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Historical",
    "Martial Arts",
    "Romance",
    "Shounen"
  ]
}
```

---

## 4. Latest Updates Endpoints

### 4.1 Get Latest Updates
Mendapatkan manga yang baru diupdate.

**Endpoint:** `GET /api/latest-updates`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Nomor halaman |
| limit | number | 20 | Jumlah item per halaman |

**Example Request:**
```bash
GET http://localhost:3000/api/latest-updates
GET http://localhost:3000/api/latest-updates?page=1&limit=10
```

**Example Response:**
```json
{
  "success": true,
  "page": 1,
  "limit": 20,
  "total": 100,
  "totalPages": 5,
  "data": [
    {
      "title": "Manga Title",
      "slug": "manga-slug",
      "latestChapter": "Chapter 100",
      "updatedAt": "2025-10-17"
    }
  ]
}
```

---

## 5. Search Endpoints

### 5.1 Advanced Search
Pencarian lanjutan dengan berbagai filter.

**Endpoint:** `GET /api/search`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| q | string | - | Query pencarian |
| genre | string | - | Filter berdasarkan genre |
| page | number | 1 | Nomor halaman |
| limit | number | 20 | Jumlah item per halaman |

**Example Request:**
```bash
# Search by query
GET http://localhost:3000/api/search?q=academy

# Search with genre filter
GET http://localhost:3000/api/search?q=academy&genre=Fantasy

# Search with pagination
GET http://localhost:3000/api/search?q=solo&page=1&limit=10
```

**Example Response:**
```json
{
  "success": true,
  "query": "academy",
  "page": 1,
  "limit": 20,
  "total": 15,
  "totalPages": 1,
  "data": [
    {
      "title": "Academy's Genius Swordmaster",
      "slug": "12321-academys-genius-swordmaster",
      "url": "https://komiku.org/manga/12321-academys-genius-swordmaster/",
      "image": "...",
      "genres": ["Fantasy"]
    }
  ]
}
```

---

## 6. Statistics Endpoints

### 6.1 Get API Statistics
Mendapatkan statistik API.

**Endpoint:** `GET /api/stats`

**Example Request:**
```bash
GET http://localhost:3000/api/stats
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "totalManga": 100,
    "totalMangaWithChapters": 75,
    "totalGenres": 45,
    "lastUpdated": "2025-10-17T08:18:00.000Z"
  }
}
```

---

## 7. Health Check

### 7.1 Health Check
Memeriksa status API.

**Endpoint:** `GET /api/health`

**Example Request:**
```bash
GET http://localhost:3000/api/health
```

**Example Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-10-17T08:18:00.000Z"
}
```

---

## 🔧 Error Handling

API akan mengembalikan error dalam format berikut:

### 404 Not Found
```json
{
  "success": false,
  "error": "Manga not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Error details..."
}
```

---

## 📝 Response Format

Semua response mengikuti format standar:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Success Response with Pagination
```json
{
  "success": true,
  "page": 1,
  "limit": 20,
  "total": 100,
  "totalPages": 5,
  "data": [ ... ]
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 🌐 CORS

API ini sudah dikonfigurasi dengan CORS untuk menerima request dari semua origin. Cocok untuk development dan testing.

---

## 🔒 Environment Variables

Anda bisa mengatur port dengan environment variable:

```bash
PORT=3000 npm run api
```

Default port: `3000`

---

## 📦 Data Structure

### Manga Object
```typescript
{
  title: string;
  slug: string;
  url: string;
  image: string;
  genres: string[];
}
```

### Chapter Object
```typescript
{
  number: string;
  title: string;
  url: string;
  date: string;
  images: Image[];
}
```

### Image Object
```typescript
{
  page: number;
  url: string;
  filename: string;
}
```

---

## 💡 Tips

1. **Pagination**: Gunakan pagination untuk performa yang lebih baik
2. **Caching**: Pertimbangkan untuk mengimplementasikan caching di client side
3. **Rate Limiting**: Untuk production, tambahkan rate limiting
4. **Authentication**: Untuk production, tambahkan authentication jika diperlukan

---

## 🚀 Production Deployment

Untuk deployment ke production:

1. Set environment variable `NODE_ENV=production`
2. Gunakan process manager seperti PM2
3. Setup reverse proxy dengan Nginx
4. Implementasikan rate limiting
5. Setup monitoring dan logging

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start api-server.js --name komiku-api

# Monitor
pm2 monit
```

---

## 📞 Support

Jika ada pertanyaan atau issue, silakan buat issue di repository.

---

**Happy Coding! 🎉**
