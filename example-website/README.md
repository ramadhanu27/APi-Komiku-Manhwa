# Example Website - Komiku Reader

Ini adalah contoh website sederhana yang menggunakan Komiku API.

## 🚀 Cara Menggunakan

### 1. Jalankan API Server
```bash
# Di folder utama
npm run api
```

### 2. Buka Website
Buka file `index.html` di browser Anda.

### 3. Setelah Deploy API
Edit file `index.html`, ganti baris ini:
```javascript
const API_URL = 'http://localhost:3000'; 
```

Dengan URL API Anda yang sudah di-deploy:
```javascript
const API_URL = 'https://your-project.vercel.app';
```

## 📝 Fitur

- ✅ Menampilkan daftar manga
- ✅ Search manga
- ✅ Pagination
- ✅ Detail manga
- ✅ Daftar chapter
- ✅ Responsive design

## 🌐 Deploy Website

### Option 1: Netlify
1. Buat akun di https://netlify.com
2. Drag & drop folder `example-website` ke Netlify
3. Done!

### Option 2: Vercel
```bash
cd example-website
vercel
```

### Option 3: GitHub Pages
1. Push ke GitHub
2. Settings → Pages → Deploy from branch
3. Done!

## 🔧 Customization

Edit `index.html` untuk:
- Mengubah tampilan
- Menambah fitur
- Mengubah warna
- Menambah halaman baru

## 💡 Tips

1. **Ganti API_URL** setelah deploy API
2. **Tambahkan loading state** untuk UX lebih baik
3. **Implementasi caching** untuk performa
4. **Tambahkan error handling** yang lebih baik

## 📚 Resources

- API Documentation: `../API-README.md`
- Deployment Guide: `../DEPLOYMENT-GUIDE.md`

**Happy Coding! 🎉**
