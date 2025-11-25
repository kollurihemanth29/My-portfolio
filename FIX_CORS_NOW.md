# 🔥 URGENT: Fix CORS Now

## Current Situation
- Frontend: `https://my-portfolio-lloxsstxf-kolluri-hemanths-projects.vercel.app`
- Backend: `https://my-portfolio-98vge4q0z-kolluri-hemanths-projects.vercel.app`
- Status: ❌ CORS blocking all API calls

## ✅ Files Updated (Just Now)
1. ✅ `backend/server.js` - Enhanced CORS with OPTIONS handler
2. ✅ `frontend/vercel.json` - Added API proxy rewrite
3. ✅ `frontend/.env.production` - Set to empty (uses rewrites)

## 🚀 Deploy Now (2 Commands)

```powershell
# 1. Deploy backend with CORS fix
cd backend
vercel --prod

# 2. Deploy frontend with rewrites
cd ..\frontend
vercel --prod
```

## ⏱️ Time: 3 minutes

## ✅ What This Does

### Backend CORS Fix:
- Handles OPTIONS preflight requests properly
- Logs which origins are allowed/blocked
- Returns correct CORS headers

### Frontend Rewrites:
- API calls go to `/api/*` (same domain)
- Vercel proxies to backend automatically
- **No CORS issues!**

## 🔍 After Deployment

1. Visit your frontend URL
2. Open console (F12)
3. Should see:
   - ✅ No CORS errors
   - ✅ Projects load
   - ✅ Certifications load

## 🎯 Why This Works

**Before:**
```
Frontend (lloxsstxf) → Backend (98vge4q0z)
❌ Browser blocks: Different origins
```

**After:**
```
Frontend (lloxsstxf) → /api/* (same domain)
Vercel rewrites → Backend (98vge4q0z)
✅ Browser allows: Same origin
```

## 🚨 Important

**Don't skip the backend deployment!** The CORS fix needs to be live on the backend first.

## 📋 Quick Checklist

- [ ] Run: `cd backend && vercel --prod`
- [ ] Wait for backend deployment to complete
- [ ] Run: `cd ..\frontend && vercel --prod`
- [ ] Wait for frontend deployment to complete
- [ ] Visit frontend URL
- [ ] Check console - no CORS errors
- [ ] Verify projects/certifications load

---

**Just run the 2 commands above and you're done!** 🚀
