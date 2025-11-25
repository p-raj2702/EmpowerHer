# Quick Production Setup

## Current Status
✅ Firebase project: `studio-9165758963-a10e4`  
✅ Code updated to support Firebase Functions config  
✅ Ready to configure

## Step 1: Get Your Cloud Run URL

First, you need to deploy your ML service to Cloud Run. If you haven't done this yet:

```bash
cd ml-service

# Deploy to Cloud Run
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

**Save this URL** - you'll need it in the next step.

## Step 2: Set Firebase Functions Configuration

Once you have your Cloud Run URL, run these commands:

```bash
# Set DEV_MODE to false (use real ML model)
firebase functions:config:set ml_service.dev_mode="false"

# Set ML_SERVICE_URL (replace with your actual Cloud Run URL)
firebase functions:config:set ml_service.url="https://empowerher-ml-service-xxxxx-uc.a.run.app"

# Verify the configuration
firebase functions:config:get
```

You should see:
```
ml_service:
  dev_mode: "false"
  url: "https://empowerher-ml-service-xxxxx-uc.a.run.app"
```

## Step 3: Deploy Functions

```bash
cd functions
npm run build
firebase deploy --only functions
```

## Alternative: Use the Setup Script

If you prefer an interactive setup:

```bash
./setup-production.sh
```

The script will prompt you for the Cloud Run URL and set everything up automatically.

## Verify It's Working

After deployment, test the health endpoint:

```bash
curl https://us-central1-studio-9165758963-a10e4.cloudfunctions.net/health
```

Check the logs to ensure it's using the real ML service:

```bash
firebase functions:log --only predict
```

Look for logs showing calls to your Cloud Run URL instead of mock predictions.

## Troubleshooting

### If you get "config is not a function" error:
The code has been updated to handle both Firebase Functions v1 and v2 config. Make sure you've rebuilt:
```bash
cd functions
npm run build
```

### If ML service is not reachable:
1. Check Cloud Run service is running: `gcloud run services list`
2. Verify the URL is correct: `firebase functions:config:get`
3. Check CORS settings in `ml-service/main.py`

### To switch back to dev mode:
```bash
firebase functions:config:set ml_service.dev_mode="true"
firebase deploy --only functions
```

