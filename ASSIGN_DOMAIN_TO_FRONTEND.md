# 🌐 Assign Domain to Frontend Project

## Current Setup
- **Backend**: `https://my-portfolio-f270x9ve6-kolluri-hemanths-projects.vercel.app` ✅
- **Frontend**: Should be on `https://my-portfolio-rho-nine-76.vercel.app` ✅

## 🎯 Goal
Make your domain `my-portfolio-rho-nine-76.vercel.app` point to the **frontend** project (not backend).

---

## 📋 Step-by-Step Instructions

### Step 1: Check Which Project Has the Domain

1. Go to: https://vercel.com/dashboard
2. Look at your projects
3. Find which project currently has `my-portfolio-rho-nine-76.vercel.app`

### Step 2: Remove Domain from Backend (if assigned there)

If the domain is currently on the backend project:

1. Click on **backend project**
2. Go to **Settings** → **Domains**
3. Find `my-portfolio-rho-nine-76.vercel.app`
4. Click **Remove** or **Delete**

### Step 3: Add Domain to Frontend Project

1. Click on **frontend project**
2. Go to **Settings** → **Domains**
3. Click **Add Domain**
4. Enter: `my-portfolio-rho-nine-76.vercel.app`
5. Click **Add**
6. Vercel will automatically configure it

### Step 4: Deploy Frontend

```powershell
cd frontend
vercel --prod
```

---

## ✅ After Setup

Your URLs will be:
- **Frontend (Portfolio)**: `https://my-portfolio-rho-nine-76.vercel.app` ✅
- **Backend (API)**: `https://my-portfolio-f270x9ve6-kolluri-hemanths-projects.vercel.app` ✅

---

## 🔍 Verify It Works

1. Visit: `https://my-portfolio-rho-nine-76.vercel.app`
   - Should show your **portfolio** (not API JSON)
   - Projects should load
   - Certifications should load
   - Chat should work

2. Visit: `https://my-portfolio-f270x9ve6-kolluri-hemanths-projects.vercel.app/health`
   - Should show: `{"status":"OK",...}`
   - This is your backend API

---

## 🎯 Configuration Summary

Your files are already configured correctly:

**frontend/.env.production:**
```env
REACT_APP_API_URL=https://my-portfolio-f270x9ve6-kolluri-hemanths-projects.vercel.app
```
✅ Frontend calls backend API

**backend/server.js:**
```javascript
/^https:\/\/my-portfolio-rho-nine-76\.vercel\.app$/,  // Production domain
```
✅ Backend allows requests from frontend domain

---

## 🚀 Quick Steps

1. **Vercel Dashboard** → Assign domain to frontend project
2. **Deploy frontend**: `cd frontend && vercel --prod`
3. **Visit**: `https://my-portfolio-rho-nine-76.vercel.app`
4. **Done!** ✅

---

## 💡 Alternative: Use Vercel CLI

You can also assign the domain using CLI:

```powershell
cd frontend
vercel domains add my-portfolio-rho-nine-76.vercel.app
vercel --prod
```

---

**The configuration is ready! Just assign the domain in Vercel Dashboard and deploy.** 🚀
