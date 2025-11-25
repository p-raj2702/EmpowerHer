#!/bin/bash

# Script to upload ML model files to Firebase Storage
# Usage: ./scripts/upload-models.sh

set -e

echo "🚀 Uploading ML models to Firebase Storage..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if logged in
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please login to Firebase..."
    firebase login
fi

# Get project ID
PROJECT_ID=$(firebase use 2>&1 | grep -oP '(?<=\[default\] ).*' || echo "")
if [ -z "$PROJECT_ID" ]; then
    echo "📋 Available projects:"
    firebase projects:list
    echo ""
    read -p "Enter your Firebase project ID: " PROJECT_ID
    firebase use "$PROJECT_ID"
fi

echo "📦 Uploading models to project: $PROJECT_ID"

# Upload model files
echo "📤 Uploading basic_pcos_model.pkl..."
firebase storage:upload ml_f/models/basic_pcos_model.pkl models/ --project "$PROJECT_ID"

echo "📤 Uploading basic_imputer.pkl..."
firebase storage:upload ml_f/models/basic_imputer.pkl models/ --project "$PROJECT_ID"

echo "📤 Uploading basic_features.pkl..."
firebase storage:upload ml_f/models/basic_features.pkl models/ --project "$PROJECT_ID"

echo "✅ All models uploaded successfully!"
echo ""
echo "📍 Models are now available at:"
echo "   gs://$PROJECT_ID.appspot.com/models/"
echo ""
echo "💡 Next steps:"
echo "   1. Deploy your ML service to Cloud Run"
echo "   2. Update ML_SERVICE_URL in Firebase Functions config"
echo "   3. Set DEV_MODE=false"


