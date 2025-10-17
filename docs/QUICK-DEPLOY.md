# ⚡ Quick Deploy Guide

Panduan cepat deploy Komiku API ke platform pilihan.

---

## 🏆 RECOMMENDED: VERCEL (2 menit)

### Why Vercel?
- ✅ **Gratis unlimited**
- ✅ **Setup paling mudah**
- ✅ **Global CDN**
- ✅ **Perfect untuk API ini**

### Deploy Steps:

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login (buka browser)
vercel login

# 3. Deploy
vercel

# 4. Production
vercel --prod
```

**Done! API online!** 🎉

**URL:** `https://your-project.vercel.app`

### Test API:
```bash
curl https://your-project.vercel.app/api/health
curl https://your-project.vercel.app/api/manga
```

---

## 🚂 ALTERNATIVE: RAILWAY (5 menit)

### Why Railway?
- ✅ **Always on (no cold start)**
- ✅ **500 jam gratis/bulan**
- ✅ **Database support**

### Deploy Steps:

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Init project
railway init

# 4. Deploy
railway up

# 5. Generate domain
railway domain
```

**Done! API online!** 🎉

**URL:** `https://your-project.up.railway.app`

---

## ✈️ ADVANCED: FLY.IO (15 menit)

### Why Fly.io?
- ✅ **Global deployment**
- ✅ **Production-grade**
- ✅ **Best performance**

### Deploy Steps:

```bash
# 1. Install Fly CLI
# Windows PowerShell:
iwr https://fly.io/install.ps1 -useb | iex

# 2. Login
fly auth login

# 3. Launch (jawab pertanyaan)
fly launch

# 4. Deploy
fly deploy
```

**Done! API online!** 🎉

**URL:** `https://your-app.fly.dev`

---

## 📊 Quick Comparison

| Feature | Vercel | Railway | Fly.io |
|---------|--------|---------|--------|
| Setup Time | 2 min | 5 min | 15 min |
| Free Tier | ✅ Unlimited | ✅ 500h | ✅ Limited |
| Cold Start | ⚠️ Yes | ❌ No | ❌ No |
| Global CDN | ✅ Yes | ❌ No | ✅ Yes |
| Best For | **API Read-Only** | Always On | Production |

---

## 🎯 Recommendation

### Start Here: **VERCEL** ⭐⭐⭐⭐⭐

**Perfect untuk Komiku API karena:**
- Gratis unlimited
- Setup tercepat
- Global CDN
- Zero configuration

**Command:**
```bash
npm install -g vercel && vercel login && vercel --prod
```

---

## 🔧 After Deploy

### 1. Update API URL

Edit `example-website/index.html`:
```javascript
// Ganti ini:
const API_URL = 'http://localhost:3000';

// Dengan URL deploy Anda:
const API_URL = 'https://your-project.vercel.app';
```

### 2. Test API

```bash
# Health check
curl https://your-project.vercel.app/api/health

# Get manga
curl https://your-project.vercel.app/api/manga?limit=5

# Search
curl https://your-project.vercel.app/api/search?q=academy
```

### 3. Share URL

Share ke teman/komunitas:
```
API Base URL: https://your-project.vercel.app
Documentation: https://your-project.vercel.app
```

---

## 🆘 Troubleshooting

### Vercel: Build Failed?
```bash
# Check vercel.json ada di root
# Check package.json scripts
npm start  # Test locally first
```

### Railway: Out of Hours?
```bash
# Check usage
railway status

# Upgrade to Hobby ($5/month)
```

### Fly.io: Deploy Failed?
```bash
# Check Dockerfile
# Check fly.toml
fly logs  # Check errors
```

---

## 📚 More Info

- **Full Comparison**: See `PLATFORM-COMPARISON.md`
- **Deployment Guide**: See `DEPLOYMENT-GUIDE.md`
- **API Docs**: See `API-README.md`

---

**Quick Deploy: `vercel --prod`** 🚀
