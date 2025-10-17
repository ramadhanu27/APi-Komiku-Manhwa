# 🎨 Deploy to Render.com

## Why Render?
- ✅ **Free tier** (750 hours/month)
- ✅ **No size limit** (unlike Vercel)
- ✅ **Auto-deploy** from GitHub
- ✅ **Easy setup** (5 minutes)
- ✅ **Custom domains**

---

## 🚀 Quick Deploy

### Step 1: Go to Render
```
https://render.com
```

### Step 2: Sign Up
- Click "Get Started"
- Sign up with GitHub
- Authorize Render

### Step 3: Create Web Service
1. Click "New +" button
2. Select "Web Service"
3. Click "Connect account" (GitHub)
4. Find repo: `ramadhanu27/APi-Komiku-Manhwa`
5. Click "Connect"

### Step 4: Configure
```
Name: komiku-api
Environment: Node
Region: Singapore (closest to Indonesia)
Branch: main

Build Command: npm install
Start Command: npm start

Instance Type: Free
```

### Step 5: Deploy
- Click "Create Web Service"
- Wait ~2-3 minutes
- Done! ✅

### Step 6: Get URL
```
Your app URL: https://komiku-api.onrender.com
```

---

## ⚙️ Configuration

### Environment Variables (Optional)
```
NODE_ENV=production
PORT=3000
```

### Auto-Deploy
Render automatically deploys when you push to GitHub:
```bash
git push origin main
# Render deploys in ~2 minutes
```

---

## 💰 Free Tier

### Limits
- 750 hours/month
- 512MB RAM
- Shared CPU
- Sleeps after 15 min inactivity

### Wake Up
- First request: ~30 seconds
- Subsequent: instant

### Keep Awake (Optional)
Use cron job to ping every 10 minutes:
```bash
# External service like cron-job.org
curl https://komiku-api.onrender.com/api/health
```

---

## 🎯 Advantages

| Feature | Render | Vercel |
|---------|--------|--------|
| Size Limit | ✅ No limit | ❌ 250MB |
| Free Tier | ✅ 750h/month | ✅ Yes |
| Sleep | ⚠️ 15 min | ✅ No |
| Setup | ✅ Easy | ✅ Easy |
| Custom Domain | ✅ Free | ✅ Free |

---

## 📝 After Deployment

### Update Base URL
Edit `api/index.html`:
```html
<input value="https://komiku-api.onrender.com" readonly>
```

### Test Endpoints
```bash
curl https://komiku-api.onrender.com/api/health
curl https://komiku-api.onrender.com/api/list
```

---

## ✅ Summary

**Steps:**
1. Go to https://render.com
2. Sign up with GitHub
3. Create Web Service
4. Connect repo
5. Deploy

**Time:** 5 minutes
**Cost:** Free (750h/month)
**Result:** ✅ Working API with no size limit!
