# Production Setup Guide

## Step 1: Deploy ML Service to Cloud Run

First, deploy your ML service to Google Cloud Run to get the production URL.

### Option A: Using gcloud CLI (Recommended)

```bash
cd ml-service

# Set your project
gcloud config set project studio-9165758963-a10e4

# Build and deploy to Cloud Run
gcloud run deploy empowerher-ml-service \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --set-env-vars MODEL_DIR=/app/models

# After deployment, you'll get a URL like:
# https://empowerher-ml-service-xxxxx-uc.a.run.app
```

### Option B: Using Docker

```bash
cd ml-service

# Build Docker image
docker build -t gcr.io/studio-9165758963-a10e4/empowerher-ml:latest .

# Push to Google Container Registry
docker push gcr.io/studio-9165758963-a10e4/empowerher-ml:latest

# Deploy to Cloud Run
gcloud run deploy empowerher-ml-service \
  --image gcr.io/studio-9165758963-a10e4/empowerher-ml:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300
```

**Note**: Make sure to upload your model files to the container or download them from Firebase Storage at startup.

## Step 2: Configure Firebase Functions Environment Variables

Once you have your Cloud Run URL, set the environment variables:

### Using Firebase CLI (Recommended)

```bash
cd functions

# Set DEV_MODE to false
firebase functions:config:set ml_service.dev_mode="false"

# Set ML_SERVICE_URL to your Cloud Run URL
firebase functions:config:set ml_service.url="https://empowerher-ml-service-xxxxx-uc.a.run.app"

# Verify the configuration
firebase functions:config:get
```

### Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `studio-9165758963-a10e4`
3. Go to **Functions** → **Configuration**
4. Click **Add variable**
5. Add:
   - **Variable name**: `ML_SERVICE_URL`
   - **Value**: `https://your-cloud-run-url.run.app`
6. Add another:
   - **Variable name**: `DEV_MODE`
   - **Value**: `false`

## Step 3: Update Functions Code to Use Config

The code already reads from `process.env`, but Firebase Functions v2 uses a different config system. Update `functions/src/utils/mlModel.ts`:

```typescript
import * as functions from "firebase-functions";

const config = functions.config();
const DEV_MODE = config.ml_service?.dev_mode === "true" || process.env.DEV_MODE === "true";
const ML_SERVICE_URL = config.ml_service?.url || process.env.ML_SERVICE_URL || "http://localhost:8000";
```

## Step 4: Deploy Firebase Functions

```bash
cd functions
npm run build
firebase deploy --only functions
```

## Step 5: Test Production Setup

```bash
# Test the health endpoint
curl https://us-central1-studio-9165758963-a10e4.cloudfunctions.net/health

# Test prediction (requires auth token)
# Use your Firebase app to call the predict function
```

## Troubleshooting

### If ML Service URL is not accessible:
- Check Cloud Run service is deployed and running
- Verify `allow-unauthenticated` is set
- Check CORS settings in ML service

### If Functions can't reach ML Service:
- Verify environment variables are set correctly
- Check Cloud Run logs: `gcloud run services logs read empowerher-ml-service`
- Check Functions logs: `firebase functions:log`

