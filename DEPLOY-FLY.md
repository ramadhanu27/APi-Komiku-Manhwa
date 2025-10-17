# ✈️ Deploy to Fly.io

## Why Fly.io?
- ✅ **Free tier** (3 VMs)
- ✅ **No sleep** (always on)
- ✅ **Fast** (global edge)
- ✅ **No size limit**

---

## 🚀 Quick Deploy

### Step 1: Install Fly CLI
```powershell
# PowerShell (Run as Administrator)
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### Step 2: Login
```bash
fly auth login
```

### Step 3: Launch App
```bash
cd "c:\Users\User\Desktop\File HTML\scraper-komiku"

# Create fly.toml config
fly launch

# Answer prompts:
# App name: komiku-api
# Region: Singapore (sin)
# Database: No
# Deploy now: Yes
```

### Step 4: Deploy
```bash
fly deploy
```

### Step 5: Get URL
```bash
fly status

# Your URL: https://komiku-api.fly.dev
```

---

## ⚙️ Configuration

### fly.toml (Auto-generated)
```toml
app = "komiku-api"

[build]
  builder = "heroku/buildpacks:20"

[env]
  PORT = "8080"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]
```

---

## 💰 Free Tier

### Limits
- 3 shared-cpu VMs
- 256MB RAM each
- 160GB bandwidth/month
- **No sleep!** (always on)

### Scaling
```bash
# Scale to 1 VM (free)
fly scale count 1

# Scale to 2 VMs (free)
fly scale count 2
```

---

## 🔄 Auto-Deploy

### Option 1: GitHub Actions
Create `.github/workflows/fly.yml`:
```yaml
name: Fly Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Option 2: Manual
```bash
git push origin main
fly deploy
```

---

## 🎯 Advantages

| Feature | Fly.io | Vercel |
|---------|--------|--------|
| Size Limit | ✅ No limit | ❌ 250MB |
| Free Tier | ✅ 3 VMs | ✅ Yes |
| Sleep | ✅ No sleep | ✅ No |
| Speed | ✅ Fast | ✅ Fast |
| Global | ✅ Edge | ✅ Edge |

---

## 📝 Commands

### Deploy
```bash
fly deploy
```

### View Logs
```bash
fly logs
```

### SSH into VM
```bash
fly ssh console
```

### Check Status
```bash
fly status
```

### Scale
```bash
fly scale count 1
fly scale memory 256
```

---

## ✅ Summary

**Steps:**
1. Install Fly CLI
2. `fly auth login`
3. `fly launch`
4. `fly deploy`

**Time:** 10 minutes
**Cost:** Free (3 VMs)
**Result:** ✅ Always-on API with no size limit!
