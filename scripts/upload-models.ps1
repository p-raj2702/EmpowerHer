# PowerShell script to upload ML model files to Firebase Storage
# Usage: .\scripts\upload-models.ps1

Write-Host "🚀 Uploading ML models to Firebase Storage..." -ForegroundColor Cyan

# Check if Firebase CLI is installed
if (-not (Get-Command firebase -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Firebase CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

# Check if logged in
try {
    firebase projects:list | Out-Null
} catch {
    Write-Host "🔐 Please login to Firebase..." -ForegroundColor Yellow
    firebase login
}

# Get project ID
$projectId = (firebase use 2>&1 | Select-String -Pattern '\[default\] (.+)' | ForEach-Object { $_.Matches.Groups[1].Value })
if (-not $projectId) {
    Write-Host "📋 Available projects:" -ForegroundColor Cyan
    firebase projects:list
    $projectId = Read-Host "Enter your Firebase project ID"
    firebase use $projectId
}

Write-Host "📦 Uploading models to project: $projectId" -ForegroundColor Green

# Upload model files
Write-Host "📤 Uploading basic_pcos_model.pkl..." -ForegroundColor Yellow
firebase storage:upload ml_f/models/basic_pcos_model.pkl models/ --project $projectId

Write-Host "📤 Uploading basic_imputer.pkl..." -ForegroundColor Yellow
firebase storage:upload ml_f/models/basic_imputer.pkl models/ --project $projectId

Write-Host "📤 Uploading basic_features.pkl..." -ForegroundColor Yellow
firebase storage:upload ml_f/models/basic_features.pkl models/ --project $projectId

Write-Host "✅ All models uploaded successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Models are now available at:" -ForegroundColor Cyan
Write-Host "   gs://$projectId.appspot.com/models/" -ForegroundColor White


