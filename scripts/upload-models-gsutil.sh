#!/bin/bash

# Upload ML models to Firebase Storage using gsutil
# Usage: ./scripts/upload-models-gsutil.sh

set -e

PROJECT_ID="studio-9165758963-a10e4"
BUCKET_NAME="${PROJECT_ID}.appspot.com"

echo "🚀 Uploading ML models to Firebase Storage..."
echo "📦 Project: $PROJECT_ID"
echo "📦 Bucket: $BUCKET_NAME"
echo ""

# Check if gsutil is installed
if ! command -v gsutil &> /dev/null; then
    echo "❌ gsutil not found. Installing Google Cloud SDK..."
    echo ""
    echo "Please install Google Cloud SDK:"
    echo "  macOS: brew install --cask google-cloud-sdk"
    echo "  Or visit: https://cloud.google.com/sdk/docs/install"
    echo ""
    echo "After installation, run:"
    echo "  gcloud auth login"
    echo "  gcloud config set project $PROJECT_ID"
    exit 1
fi

# Set project
echo "🔧 Setting GCP project..."
gcloud config set project $PROJECT_ID

# Upload files
echo ""
echo "📤 Uploading basic_pcos_model.pkl..."
gsutil cp ml_f/models/basic_pcos_model.pkl gs://${BUCKET_NAME}/models/

echo "📤 Uploading basic_imputer.pkl..."
gsutil cp ml_f/models/basic_imputer.pkl gs://${BUCKET_NAME}/models/

echo "📤 Uploading basic_features.pkl..."
gsutil cp ml_f/models/basic_features.pkl gs://${BUCKET_NAME}/models/

echo ""
echo "✅ All models uploaded successfully!"
echo ""
echo "📍 Models are now available at:"
echo "   gs://${BUCKET_NAME}/models/"
echo ""
echo "💡 Next steps:"
echo "   1. Deploy your ML service to Cloud Run"
echo "   2. Update ML_SERVICE_URL in Firebase Functions config"
echo "   3. Set DEV_MODE=false"

