# 🚨 VERCEL 404 ERROR FIX

## Error: `404: NOT_FOUND` with Vercel ID: `bom1::zzgst-1764079541806-8725d52b4956`

This error indicates deployment configuration issues. Here's the step-by-step fix:

## ✅ IMMEDIATE SOLUTION:

### Step 1: Clean Deployment
```bash
# Remove old deployments
vercel rm hemanth-portfolio-frontend --yes
vercel rm portfolio-backend --yes
```

### Step 2: Deploy Backend First
```bash
cd backend
vercel --prod
# Note the URL: https://your-new-backend.vercel.app
```

### Step 3: Set Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables:

**Backend:**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://22r21a6729:Hemanth%40123@cluster0.w5uqskb.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0
LYZR_API_KEY=sk-default-V6WxgXjv3XYUTZCeojLNTiW61eH9Ha7W
LYZR_AGENT_ID=69259a68c69ec8d9a07849bc
```

### Step 4: Deploy Frontend
```bash
cd ../frontend
vercel env add REACT_APP_API_URL
# Enter your backend URL when prompted
vercel --prod
```

## 🔧 ALTERNATIVE: NETLIFY DEPLOYMENT

If Vercel continues having issues:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy frontend
cd frontend
npm run build
netlify deploy --prod --dir=build
```

## 🎯 QUICK COMMANDS TO RUN:

```powershell
# 1. Backend deployment
cd backend
vercel --prod

# 2. Frontend deployment  
cd ..\frontend
vercel --prod
```

## 📋 CHECKLIST:

- [ ] Backend deployed successfully
- [ ] Environment variables set in Vercel dashboard
- [ ] Frontend has REACT_APP_API_URL set
- [ ] Frontend deployed without errors
- [ ] Test both URLs work independently

## 🔍 DEBUGGING:

1. **Check Vercel Dashboard** for deployment logs
2. **Test backend directly**: `https://your-backend.vercel.app/api/health`
3. **Check build logs** in Vercel function logs
4. **Verify environment variables** are properly set

This should resolve the 404 NOT_FOUND error! 🎉