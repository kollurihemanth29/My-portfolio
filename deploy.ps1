# Hemanth Portfolio - Vercel Deployment Script (PowerShell)

Write-Host "🚀 Starting Hemanth Portfolio Deployment to Vercel..." -ForegroundColor Green

# Check if Vercel CLI is installed
if (!(Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

Write-Host ""
Write-Host "📋 Deployment Checklist:" -ForegroundColor Yellow
Write-Host "1. ✅ Ensure MongoDB Atlas database is set up"
Write-Host "2. ✅ Have your connection string ready"  
Write-Host "3. ✅ Lyzr API credentials available"
Write-Host ""

Read-Host "Press Enter to continue with backend deployment"

# Deploy Backend
Write-Host ""
Write-Host "🔧 Deploying Backend API..." -ForegroundColor Blue
Set-Location backend

Write-Host "Setting up backend environment variables..." -ForegroundColor Yellow
$MONGODB_URI = Read-Host "Please enter your MongoDB connection string"

# Set environment variables
Write-Host "MONGODB_URI" | vercel env add MONGODB_URI
Write-Host "sk-default-V6WxgXjv3XYUTZCeojLNTiW61eH9Ha7W" | vercel env add LYZR_API_KEY  
Write-Host "69259a68c69ec8d9a07849bc" | vercel env add LYZR_AGENT_ID
Write-Host "production" | vercel env add NODE_ENV

# Deploy backend
Write-Host "Deploying backend..." -ForegroundColor Green
vercel --prod

# Get backend URL
Write-Host ""
Write-Host "Backend deployed! Please copy the production URL." -ForegroundColor Green
$BACKEND_URL = Read-Host "Enter your backend URL (e.g., https://your-backend.vercel.app)"

Set-Location ../

# Deploy Frontend  
Write-Host ""
Write-Host "🎨 Deploying Frontend..." -ForegroundColor Blue
Set-Location frontend

# Update vercel.json with actual backend URL
$vercelConfig = Get-Content "vercel.json" -Raw
$vercelConfig = $vercelConfig -replace "https://your-backend-url.vercel.app", $BACKEND_URL
Set-Content "vercel.json" $vercelConfig

# Build frontend
Write-Host "Building frontend..." -ForegroundColor Yellow
npm run build

# Deploy frontend
Write-Host "Deploying frontend..." -ForegroundColor Green  
vercel --prod

Set-Location ../

Write-Host ""
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Your Portfolio URLs:" -ForegroundColor Yellow
Write-Host "Frontend: Check Vercel dashboard for URL"
Write-Host "Backend API: $BACKEND_URL"
Write-Host ""
Write-Host "🔧 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Test your portfolio website"
Write-Host "2. Test the AI chatbot functionality"
Write-Host "3. Upload a resume to test file analysis" 
Write-Host "4. Configure custom domain (optional)"
Write-Host ""
Write-Host "📚 Troubleshooting:" -ForegroundColor Magenta
Write-Host "- Check DEPLOYMENT.md for common issues"
Write-Host "- Verify environment variables in Vercel dashboard"  
Write-Host "- Check Vercel function logs for errors"