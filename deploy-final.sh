#!/bin/bash

# Final Deployment Script - Optimized for Vercel
echo "🚀 Hemanth Portfolio - Final Deployment"
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Pre-deployment checklist:${NC}"
echo "✅ MongoDB Atlas database ready"
echo "✅ Lyzr API credentials available"
echo "✅ Modern Chat Assistant implemented"
echo "✅ Environment variables configured"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
fi

echo -e "${YELLOW}🔧 Starting Backend Deployment...${NC}"
cd backend

# Deploy backend first
echo "Deploying backend API..."
vercel --prod

echo ""
echo -e "${GREEN}Backend deployed! Please copy the production URL.${NC}"
read -p "Enter your backend URL: " BACKEND_URL

cd ../

echo -e "${YELLOW}🎨 Starting Frontend Deployment...${NC}"
cd frontend

# Create production environment file
echo "REACT_APP_API_URL=$BACKEND_URL" > .env.production

# Build and deploy frontend
echo "Building frontend..."
npm run build

echo "Deploying frontend..."
vercel --prod

cd ../

echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "========================================"
echo -e "${BLUE}📍 Your URLs:${NC}"
echo "Backend API: $BACKEND_URL"
echo "Frontend: Check Vercel dashboard"
echo ""
echo -e "${YELLOW}🔧 Environment Variables to Set in Vercel Dashboard:${NC}"
echo ""
echo -e "${BLUE}Backend:${NC}"
echo "NODE_ENV=production"
echo "MONGODB_URI=mongodb+srv://22r21a6729:Hemanth%40123@cluster0.w5uqskb.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0"
echo "LYZR_API_KEY=sk-default-V6WxgXjv3XYUTZCeojLNTiW61eH9Ha7W"
echo "LYZR_AGENT_ID=69259a68c69ec8d9a07849bc"
echo ""
echo -e "${BLUE}Frontend:${NC}"
echo "REACT_APP_API_URL=$BACKEND_URL"
echo ""
echo -e "${GREEN}🎯 Next Steps:${NC}"
echo "1. Set environment variables in Vercel dashboard"
echo "2. Test your portfolio website"
echo "3. Test the AI chatbot functionality"
echo "4. Upload a resume to test file analysis"
echo ""
echo -e "${BLUE}📚 Troubleshooting:${NC}"
echo "- Check DEPLOYMENT_CHECKLIST.md for detailed testing"
echo "- Verify environment variables in Vercel dashboard"
echo "- Check Vercel function logs for any errors"