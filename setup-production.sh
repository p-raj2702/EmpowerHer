#!/bin/bash

# Production Setup Script for Firebase Functions
# This script sets up environment variables for production

set -e

echo "🚀 Setting up Firebase Functions for Production"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "   npm install -g firebase-tools"
    exit 1
fi

# Check if logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase. Please run:"
    echo "   firebase login"
    exit 1
fi

echo "📋 Current Firebase project:"
firebase use

echo ""
echo "⚠️  IMPORTANT: Before proceeding, make sure you have:"
echo "   1. Deployed your ML service to Cloud Run"
echo "   2. Have the Cloud Run URL (e.g., https://empowerher-ml-service-xxxxx-uc.a.run.app)"
echo ""

read -p "Enter your Cloud Run ML Service URL: " ML_URL

if [ -z "$ML_URL" ]; then
    echo "❌ ML Service URL is required"
    exit 1
fi

echo ""
echo "🔧 Setting environment variables..."

# Set DEV_MODE to false
firebase functions:config:set ml_service.dev_mode="false"

# Set ML_SERVICE_URL
firebase functions:config:set ml_service.url="$ML_URL"

echo ""
echo "✅ Configuration set successfully!"
echo ""
echo "📝 Current configuration:"
firebase functions:config:get

echo ""
echo "📦 Next steps:"
echo "   1. Build the functions: cd functions && npm run build"
echo "   2. Deploy: firebase deploy --only functions"
echo ""
echo "🧪 To test locally with production config:"
echo "   firebase emulators:start --only functions"
echo ""

