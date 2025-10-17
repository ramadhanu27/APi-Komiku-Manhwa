# 🔧 Vercel Deployment Troubleshooting

## ❌ Error: 404 NOT_FOUND

### Penyebab:
1. ⏳ **Build masih berjalan** - Tunggu 5-10 menit
2. ❌ **Build failed** - Ada error saat build
3. ⚠️ **Wrong URL** - URL deployment salah
4. 🔄 **Old deployment** - Akses deployment lama yang sudah dihapus

---

## ✅ Solusi:

### 1. **Cek Vercel Dashboard**

Buka dashboard Vercel:
```
https://vercel.com/ramadhanu27
```

Atau langsung ke project:
```
https://vercel.com/ramadhanu27/a-pi-komiku-manhwa
```

### 2. **Cek Status Deployment**

Di dashboard, lihat:
- **Building** ⏳ - Tunggu sampai selesai
- **Ready** ✅ - Deployment sukses
- **Error** ❌ - Ada masalah, lihat logs

### 3. **Dapatkan URL yang Benar**

Setelah deployment sukses, Vercel akan memberikan URL:
```
https://a-pi-komiku-manhwa.vercel.app
```

Atau URL dengan hash:
```
https://a-pi-komiku-manhwa-[hash].vercel.app
```

---

## 🚀 Deploy Ulang (Jika Perlu)

### Option 1: Via Vercel Dashboard

1. Buka https://vercel.com/ramadhanu27/a-pi-komiku-manhwa
2. Klik tab **"Deployments"**
3. Klik **"Redeploy"** pada deployment terakhir

### Option 2: Via Git Push

```bash
# Buat perubahan kecil
echo "# Update" >> README.md

# Commit
git add README.md
git commit -m "Trigger redeploy"

# Push
git push origin main
```

Vercel akan otomatis deploy ulang!

### Option 3: Via Vercel CLI

```bash
# Install Vercel CLI (jika belum)
npm install -g vercel

# Login
vercel login

# Deploy
cd "c:\Users\User\Desktop\File HTML\scraper-komiku"
vercel --prod
```

---

## 🔍 Debug Build Errors

### 1. Lihat Build Logs

Di Vercel dashboard:
1. Klik project
2. Klik deployment yang failed
3. Lihat **"Build Logs"**

### 2. Common Errors:

#### **Error: Module not found**
```bash
# Fix: Install dependencies
npm install
```

#### **Error: Cannot find file**
```bash
# Fix: Check file paths
# Pastikan semua file ada di Git
git status
```

#### **Error: Build timeout**
```bash
# Fix: Optimize dependencies
# Hapus puppeteer dari dependencies
```

---

## ✅ Checklist Sebelum Deploy

- [ ] `package.json` ada di root
- [ ] `vercel.json` ada di root
- [ ] `api/api-server.js` ada
- [ ] `api/index.html` ada
- [ ] `data/` folder ada
- [ ] Semua file sudah di-commit
- [ ] Sudah push ke GitHub

---

## 📝 Cara Cek URL yang Benar

### Via Vercel Dashboard:

1. Buka https://vercel.com
2. Login
3. Klik project **"a-pi-komiku-manhwa"**
4. Lihat **"Domains"** section
5. Copy URL yang benar

### Via Vercel CLI:

```bash
vercel ls
```

Output akan show semua deployments dengan URL-nya.

---

## 🎯 Expected URLs

Setelah deployment sukses, URL yang valid:

### Production:
```
https://a-pi-komiku-manhwa.vercel.app
```

### Preview (per commit):
```
https://a-pi-komiku-manhwa-git-main-ramadhanu27.vercel.app
https://a-pi-komiku-manhwa-[hash].vercel.app
```

---

## 🔄 Jika Masih Error

### 1. Delete & Redeploy

Di Vercel dashboard:
1. Settings → Delete Project
2. Deploy ulang dari scratch:
```bash
vercel
```

### 2. Check GitHub Connection

Pastikan Vercel terhubung dengan GitHub:
1. Vercel Dashboard → Settings
2. Git Integration
3. Reconnect jika perlu

### 3. Manual Deploy

```bash
# Deploy manual via CLI
cd "c:\Users\User\Desktop\File HTML\scraper-komiku"
vercel --prod --force
```

---

## 📞 Support

Jika masih error:
1. Screenshot error message
2. Copy build logs
3. Check Vercel documentation: https://vercel.com/docs

---

## ✨ Tips

1. **First deployment** selalu lebih lama (5-10 menit)
2. **Next deployments** lebih cepat (1-2 menit)
3. **Always check dashboard** untuk status real-time
4. **Use correct URL** dari dashboard, bukan URL lama

---

**Last Updated:** October 17, 2025
