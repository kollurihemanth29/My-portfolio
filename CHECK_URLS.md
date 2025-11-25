# 🔍 Check Your URLs

## Current Configuration

### Frontend .env.production:
```
REACT_APP_API_URL=https://my-portfolio-f270x9ve6-kolluri-hemanths-projects.vercel.app
```

### Frontend vercel.json rewrite:
```
destination: https://my-portfolio-98vge4q0z-kolluri-hemanths-projects.vercel.app/api/:path*
```

## ❌ Problem: Two Different Backend URLs!

Your frontend is confused about which backend to use.

## ✅ Solution: Pick ONE Backend URL

### Option 1: Find Your Current Backend URL

1. Go to: https://vercel.com/dashboard
2. Find your backend project
3. Click on it
4. Copy the **Production** URL
5. It should look like: `https://my-portfolio-xxxxx-kolluri-hemanths-projects.vercel.app`

### Option 2: Test Which Backend Works

Open these URLs in your browser:

**Test URL 1:**
```
https://my-portfolio-f270x9ve6-kolluri-hemanths-projects.vercel.app/health
```

**Test URL 2:**
```
https://my-portfolio-98vge4q0z-kolluri-hemanths-projects.vercel.app/health
```

**Whichever returns `{"status":"OK",...}` is your working backend!**

## 🔧 Once You Know the Correct URL

Let's say your working backend is: `https://my-portfolio-98vge4q0z-kolluri-hemanths-projects.vercel.app`

### Update These Files:

**1. frontend/.env.production:**
```env
REACT_APP_API_URL=
```
(Leave it empty to use rewrites)

**2. frontend/vercel.json:**
```json
{
  "name": "hemanth-portfolio-frontend",
  "version": 2,
  "public": true,
  "github": {
    "silent": true
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://my-portfolio-98vge4q0z-kolluri-hemanths-projects.vercel.app/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Then Deploy:
```powershell
cd frontend
vercel --prod
```

## 🎯 Quick Test

After you tell me which backend URL works, I'll update the files for you!

**Reply with:**
- Your working backend URL, OR
- Which test URL returned `{"status":"OK"}`
