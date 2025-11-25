# Hemanth Portfolio - Vercel Deployment

## 🚀 Deployment Instructions

### Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Have a MongoDB Atlas database ready
4. Have your Lyzr API credentials

### Backend Deployment

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Deploy backend:**
   ```bash
   vercel
   ```

3. **Set environment variables:**
   ```bash
   vercel env add MONGODB_URI
   vercel env add LYZR_API_KEY
   vercel env add LYZR_AGENT_ID
   ```

   Values:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `LYZR_API_KEY`: sk-default-V6WxgXjv3XYUTZCeojLNTiW61eH9Ha7W
   - `LYZR_AGENT_ID`: 69259a68c69ec8d9a07849bc

4. **Redeploy with environment variables:**
   ```bash
   vercel --prod
   ```

### Frontend Deployment

1. **Update API URL in frontend:**
   - Copy your backend Vercel URL (e.g., `https://your-backend-url.vercel.app`)
   - Update `frontend/vercel.json` with your backend URL

2. **Navigate to frontend directory:**
   ```bash
   cd ../frontend
   ```

3. **Build and deploy frontend:**
   ```bash
   npm run build
   vercel
   ```

4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### Environment Variables Setup

**Backend (.env for local, Vercel dashboard for production):**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
LYZR_API_KEY=sk-default-V6WxgXjv3XYUTZCeojLNTiW61eH9Ha7W
LYZR_AGENT_ID=69259a68c69ec8d9a07849bc
PORT=5000
```

**Frontend (.env.production for local, Vercel dashboard for production):**
```
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

### Post-Deployment Checklist

1. ✅ Backend API responding at `/api/health`
2. ✅ Frontend loading properly
3. ✅ Chat assistant connecting to backend
4. ✅ File upload functionality working
5. ✅ All API endpoints accessible
6. ✅ CORS configured for frontend domain

### Troubleshooting

**Common Issues:**
1. **CORS errors**: Update CORS configuration in server.js
2. **API not found**: Check API URL in frontend environment variables
3. **Chat not working**: Verify Lyzr API credentials in backend
4. **File upload errors**: Check payload size limits on Vercel
5. **MongoDB connection**: Verify MongoDB Atlas IP whitelist (0.0.0.0/0 for Vercel)

### Custom Domains (Optional)

1. **Add custom domain in Vercel dashboard**
2. **Update DNS records**
3. **Update API URLs in frontend**

## 📁 Project Structure After Deployment

```
Portfolio/
├── frontend/          # React app (deployed separately)
│   ├── vercel.json   # Frontend config
│   └── build/        # Production build
├── backend/          # Node.js API (deployed separately)  
│   ├── vercel.json   # Backend config
│   └── server.js     # Entry point
```

## 🔗 URLs After Deployment

- **Frontend**: `https://your-frontend-url.vercel.app`
- **Backend API**: `https://your-backend-url.vercel.app`
- **Chat API**: `https://your-backend-url.vercel.app/api/chat`

## 🛡️ Security Notes

- Environment variables are encrypted in Vercel
- API keys are not exposed in frontend code
- CORS is configured for security
- MongoDB uses connection string authentication