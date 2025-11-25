# 🚀 Quick Vercel Deployment Guide

## Prerequisites
- Node.js installed
- Vercel account (free tier works)
- MongoDB Atlas database
- Lyzr API credentials

## 🎯 One-Command Deployment

### Option 1: PowerShell (Windows)
```powershell
.\deploy.ps1
```

### Option 2: Manual Steps

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy Backend:**
   ```bash
   cd backend
   vercel
   # Set environment variables when prompted
   vercel --prod
   ```

3. **Deploy Frontend:**
   ```bash
   cd ../frontend
   # Update API URL in vercel.json with your backend URL
   npm run build
   vercel --prod
   ```

## 🔧 Environment Variables

### Backend (Vercel Dashboard → Settings → Environment Variables):
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `LYZR_API_KEY`: sk-default-V6WxgXjv3XYUTZCeojLNTiW61eH9Ha7W
- `LYZR_AGENT_ID`: 69259a68c69ec8d9a07849bc
- `NODE_ENV`: production

### Frontend:
- `REACT_APP_API_URL`: Your backend Vercel URL

## ✅ Post-Deployment Testing

1. Visit your frontend URL
2. Test the modern chat assistant
3. Upload a resume file to test AI analysis
4. Verify all portfolio sections load
5. Check API endpoints work

## 🛠️ Troubleshooting

**Common Issues:**
- **CORS Error**: Update frontend URL in backend CORS config
- **API Not Found**: Check `REACT_APP_API_URL` environment variable
- **Chat Not Working**: Verify Lyzr API credentials
- **Database Error**: Check MongoDB connection string and whitelist 0.0.0.0/0

## 📱 Features After Deployment

✅ **Modern AI Chat Assistant** - 5 modes (Developer, Designer, Mentor, Resume, Career)  
✅ **Resume Analysis** - Upload PDF/Word files for AI feedback  
✅ **Structured Responses** - ChatGPT/Gemini style formatting  
✅ **Real-time Chat** - Powered by Lyzr AI API  
✅ **Responsive Design** - Works on all devices  
✅ **Professional Portfolio** - Complete showcase of skills and projects  

## 🎨 UI Features
- Glassmorphism design matching your portfolio theme
- Animated interactions and smooth transitions
- File upload with drag-and-drop feel
- Multiple AI personalities with visual modes
- Mobile-optimized responsive layout

Your portfolio with AI assistant will be live and ready to impress! 🎉