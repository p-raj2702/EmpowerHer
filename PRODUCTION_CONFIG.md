# Production Configuration Guide

## Quick Setup

### Option 1: Using the Setup Script (Easiest)

```bash
./setup-production.sh
```

The script will:
- Check Firebase CLI installation
- Verify you're logged in
- Prompt for your Cloud Run URL
- Set `DEV_MODE=false` and `ML_SERVICE_URL` automatically

### Option 2: Manual Setup with Firebase CLI

```bash
# Set DEV_MODE to false
firebase functions:config:set ml_service.dev_mode="false"

# Set ML_SERVICE_URL (replace with your actual Cloud Run URL)
firebase functions:config:set ml_service.url="https://empowerher-ml-service-xxxxx-uc.a.run.app"

# Verify configuration
firebase functions:config:get
```

### Option 3: Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `studio-9165758963-a10e4`
3. Navigate to **Functions** → **Configuration** → **Environment variables**
4. Click **Add variable** and add:
   - **Variable name**: `ml_service.dev_mode`
   - **Value**: `false`
5. Click **Add variable** again:
   - **Variable name**: `ml_service.url`
   - **Value**: `https://your-cloud-run-url.run.app`

## Before You Start

### 1. Deploy ML Service to Cloud Run

You need to deploy your ML service first to get the URL:

```bash
cd ml-service

# Option A: Direct deploy (if models are in the repo)
gcloud run deploy empowerher-ml-service \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --set-env-vars MODEL_DIR=/app/models

# Option B: Using Docker (if you need to include models)
# First, make sure models are accessible in the container
docker build -t gcr.io/studio-9165758963-a10e4/empowerher-ml:latest .
docker push gcr.io/studio-9165758963-a10e4/empowerher-ml:latest
gcloud run deploy empowerher-ml-service \
  --image gcr.io/studio-9165758963-a10e4/empowerher-ml:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated
```

After deployment, you'll get a URL like:
```
https://empowerher-ml-service-xxxxx-uc.a.run.app
```

### 2. Test Your ML Service

```bash
# Test health endpoint
curl https://your-cloud-run-url.run.app/health

# Test prediction
curl -X POST https://your-cloud-run-url.run.app/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 28,
    "weight": 65,
    "height": 165,
    "cycleRegularity": "irregular",
    "exerciseFrequency": "1-2_week",
    "diet": "balanced",
    "skinDarkening": true,
    "fastFood": false,
    "pregnant": false,
    "cycleLength": 30
  }'
```

## Deploy Firebase Functions

After setting the configuration:

```bash
cd functions

# Build TypeScript
npm run build

# Deploy to Firebase
firebase deploy --only functions
```

## Verify Configuration

After deployment, check the logs:

```bash
# View function logs
firebase functions:log

# Test the health endpoint
curl https://us-central1-studio-9165758963-a10e4.cloudfunctions.net/health
```

## Troubleshooting

### Configuration not working?

1. **Check if config is set:**
   ```bash
   firebase functions:config:get
   ```

2. **Verify in code:**
   The code now supports both `functions.config()` and `process.env`. Check `functions/src/utils/mlModel.ts`

3. **Check function logs:**
   ```bash
   firebase functions:log --only predict
   ```

### ML Service not reachable?

1. **Check Cloud Run service status:**
   ```bash
   gcloud run services describe empowerher-ml-service --region us-central1
   ```

2. **Check Cloud Run logs:**
   ```bash
   gcloud run services logs read empowerher-ml-service --region us-central1
   ```

3. **Verify CORS settings** in `ml-service/main.py` allows requests from Firebase Functions

### Environment Variables Not Loading?

Firebase Functions v2 uses a different config system. The code has been updated to support both:
- `functions.config()` for Firebase Functions config
- `process.env` for local development and environment variables

## Local Development

For local development, you can still use `.env` file:

```bash
cd functions
cat > .env << EOF
DEV_MODE=false
ML_SERVICE_URL=http://localhost:8000
EOF
```

Then use the emulator:
```bash
firebase emulators:start --only functions
```

