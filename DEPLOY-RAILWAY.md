# 🚂 Deploy to Railway (No 250MB Limit!)

## Why Railway?
- ✅ **No 250MB limit** (Vercel has 250MB limit)
- ✅ **Works with existing code** (no changes needed)
- ✅ **Free tier** ($5 credit/month)
- ✅ **Auto-deploy** from GitHub
- ✅ **Faster** for large apps

---

## 🚀 Quick Deploy (5 Minutes)

### Step 1: Go to Railway
```
https://railway.app
```

### Step 2: Sign Up / Login
- Click "Login"
- Sign in with GitHub

### Step 3: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose: `ramadhanu27/APi-Komiku-Manhwa`
4. Click "Deploy Now"

### Step 4: Configure (Auto-detected)
Railway will automatically:
- ✅ Detect Node.js
- ✅ Install dependencies
- ✅ Run `npm start`
- ✅ Deploy!

### Step 5: Get URL
After deployment:
1. Click on your project
2. Go to "Settings" tab
3. Click "Generate Domain"
4. Copy your URL: `https://your-app.up.railway.app`

---

## ⚙️ Configuration

### Environment Variables (Optional)
```
PORT=3000
NODE_ENV=production
```

### Custom Domain (Optional)
1. Go to Settings → Domains
2. Click "Custom Domain"
3. Add your domain
4. Update DNS records

---

## 📊 Deployment Info

### Build Command
```bash
npm install
```

### Start Command
```bash
npm start
```

### Port
```
Railway auto-detects PORT from process.env.PORT
```

---

## 🔄 Auto-Deploy

Railway automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update API"
git push origin main

# Railway auto-deploys in ~2 minutes
```

---

## 💰 Pricing

### Free Tier
- $5 credit/month
- ~500 hours/month
- Perfect for this API

### Usage
- API server: ~$0.01/hour
- ~$7/month for 24/7 uptime
- First $5 free!

---

## 🎯 After Deployment

### Update API Documentation
Update `api/index.html`:

```javascript
// Change base URL from:
https://api-komiku-manhwa.vercel.app

// To:
https://your-app.up.railway.app
```

### Test Endpoints
```bash
# Health check
curl https://your-app.up.railway.app/api/health

# List manga
curl https://your-app.up.railway.app/api/list

# Get manga
curl https://your-app.up.railway.app/api/manga/solo-leveling-id
```

---

## ✅ Advantages over Vercel

| Feature | Railway | Vercel |
|---------|---------|--------|
| Size Limit | ✅ No limit | ❌ 250MB |
| Full Node.js | ✅ Yes | ⚠️ Serverless only |
| WebSocket | ✅ Yes | ❌ No |
| Long Running | ✅ Yes | ❌ 10s timeout |
| Price | ✅ $5 free | ✅ Free tier |

---

## 🔧 Troubleshooting

### Build Failed
Check logs in Railway dashboard:
1. Click on deployment
2. View "Deploy Logs"
3. Fix errors

### Port Issues
Railway uses `process.env.PORT`:
```javascript
const PORT = process.env.PORT || 3000;
```

### Memory Issues
Upgrade plan if needed:
- Settings → Resources
- Increase memory

---

## 📝 Summary

**Steps:**
1. ✅ Go to https://railway.app
2. ✅ Login with GitHub
3. ✅ Deploy from repo
4. ✅ Get URL
5. ✅ Update documentation

**Time:** ~5 minutes

**Cost:** Free ($5 credit/month)

**Result:** 
- ✅ No 250MB limit
- ✅ Full data folder included
- ✅ Auto-deploy from GitHub
- ✅ Production ready!

---

## 🚀 Deploy Now!

```
https://railway.app/new
```

Click "Deploy from GitHub" → Select your repo → Done! 🎉
