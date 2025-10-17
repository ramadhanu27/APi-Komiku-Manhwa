# Restart API Server

Jika Anda sudah menjalankan server dan perlu me-restart untuk menerapkan perubahan:

## Windows (PowerShell)

### Cara 1: Manual
1. Tekan `Ctrl + C` di terminal yang menjalankan server
2. Jalankan lagi: `npm run api`

### Cara 2: Kill Process
```powershell
# Cari process yang menggunakan port 3000
netstat -ano | findstr :3000

# Kill process (ganti PID dengan nomor yang muncul)
taskkill /PID <PID> /F

# Jalankan lagi
npm run api
```

## Setelah Restart

Test API dengan:
```bash
node test-api.js
```

Atau buka browser:
- http://localhost:3000
- Buka file `api-example.html`

## Note

Jika menggunakan `npm run dev` (dengan nodemon), server akan otomatis restart saat ada perubahan file.
