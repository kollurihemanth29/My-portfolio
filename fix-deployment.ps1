# Fix 404 Deployment Issues - PowerShell Script

Write-Host "🚨 Fixing 404 Deployment Issues..." -ForegroundColor Red
Write-Host "=====================================" -ForegroundColor Yellow

# Step 1: Remove problematic vercel.json from frontend
Write-Host "Step 1: Removing problematic frontend vercel.json..." -ForegroundColor Blue
if (Test-Path "frontend\vercel.json") {
    Remove-Item "frontend\vercel.json" -Force
    Write-Host "✅ Removed frontend/vercel.json" -ForegroundColor Green
} else {
    Write-Host "ℹ️ frontend/vercel.json already removed" -ForegroundColor Yellow
}

# Step 2: Deploy Backend First
Write-Host ""
Write-Host "Step 2: Deploy Backend First..." -ForegroundColor Blue
Write-Host "Run this command in a separate terminal:" -ForegroundColor Yellow
Write-Host "cd backend && vercel --prod" -ForegroundColor Cyan

Write-Host ""
$backendUrl = Read-Host "Enter your backend URL (e.g., https://your-backend.vercel.app)"

# Step 3: Set Environment Variable and Deploy Frontend
Write-Host ""
Write-Host "Step 3: Setting up frontend environment..." -ForegroundColor Blue

# Create .env.production for frontend
$envContent = "REACT_APP_API_URL=$backendUrl"
Set-Content "frontend\.env.production" $envContent
Write-Host "✅ Created frontend/.env.production with backend URL" -ForegroundColor Green

# Step 4: Deploy Frontend
Write-Host ""
Write-Host "Step 4: Deploy Frontend..." -ForegroundColor Blue
Write-Host "Run these commands:" -ForegroundColor Yellow
Write-Host "cd frontend" -ForegroundColor Cyan
Write-Host "vercel --prod" -ForegroundColor Cyan

Write-Host ""
Write-Host "🎉 Fix Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Yellow
Write-Host "✅ Removed problematic vercel.json" -ForegroundColor Green
Write-Host "✅ Set backend URL: $backendUrl" -ForegroundColor Green
Write-Host "✅ Created production environment file" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Blue
Write-Host "1. Deploy backend: cd backend && vercel --prod" -ForegroundColor White
Write-Host "2. Deploy frontend: cd frontend && vercel --prod" -ForegroundColor White
Write-Host "3. Set environment variables in Vercel dashboard if needed" -ForegroundColor White
Write-Host ""
Write-Host "🔍 If still having issues:" -ForegroundColor Magenta
Write-Host "- Check FIX_404_ERRORS.md for detailed troubleshooting" -ForegroundColor White
Write-Host "- Verify environment variables in Vercel dashboard" -ForegroundColor White
Write-Host "- Check browser console for specific error messages" -ForegroundColor White