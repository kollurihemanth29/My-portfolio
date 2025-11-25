#!/bin/bash

# Hemanth Portfolio - Vercel Deployment Script

echo "🚀 Starting Hemanth Portfolio Deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo ""
echo "📋 Deployment Checklist:"
echo "1. ✅ Ensure MongoDB Atlas database is set up"
echo "2. ✅ Have your connection string ready"
echo "3. ✅ Lyzr API credentials available"
echo ""

read -p "Press Enter to continue with backend deployment..."

# Deploy Backend
echo ""
echo "🔧 Deploying Backend API..."
cd backend

echo "Setting up backend environment variables..."
echo "Please enter your MongoDB connection string:"
read -p "MONGODB_URI: " MONGODB_URI

# Set environment variables
vercel env add MONGODB_URI <<< "$MONGODB_URI"
vercel env add LYZR_API_KEY <<< "sk-default-V6WxgXjv3XYUTZCeojLNTiW61eH9Ha7W"
vercel env add LYZR_AGENT_ID <<< "69259a68c69ec8d9a07849bc"
vercel env add NODE_ENV <<< "production"

# Deploy backend
echo "Deploying backend..."
vercel --prod

# Get backend URL
echo ""
echo "Backend deployed! Please copy the production URL."
read -p "Enter your backend URL (e.g., https://your-backend.vercel.app): " BACKEND_URL

cd ../

# Deploy Frontend
echo ""
echo "🎨 Deploying Frontend..."
cd frontend

# Update vercel.json with actual backend URL
sed -i "s|https://your-backend-url.vercel.app|$BACKEND_URL|g" vercel.json

# Build frontend
echo "Building frontend..."
npm run build

# Deploy frontend
echo "Deploying frontend..."
vercel --prod

cd ../

echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "📍 Your Portfolio URLs:"
echo "Frontend: Check Vercel dashboard for URL"
echo "Backend API: $BACKEND_URL"
echo ""
echo "🔧 Next Steps:"
echo "1. Test your portfolio website"
echo "2. Test the AI chatbot functionality" 
echo "3. Upload a resume to test file analysis"
echo "4. Configure custom domain (optional)"
echo ""
echo "📚 Troubleshooting:"
echo "- Check DEPLOYMENT.md for common issues"
echo "- Verify environment variables in Vercel dashboard"
echo "- Check Vercel function logs for errors"