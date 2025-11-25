# Step-by-Step Guide: Activate Real ML Model

## Overview
This guide will help you activate the real ML model for PCOS risk prediction. The model is a Python pickle file, so we'll use a Python FastAPI microservice that Firebase Functions can call.

---

## Step 1: Upload Model Files to Firebase Storage

### Option A: Using Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **Get Started** if you haven't enabled Storage
5. Create a folder called `models/`
6. Upload these files from `ml_f/models/`:
   - `basic_pcos_model.pkl`
   - `basic_imputer.pkl`
   - `basic_features.pkl`

### Option B: Using Firebase CLI

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Upload models
firebase storage:upload ml_f/models/basic_pcos_model.pkl models/
firebase storage:upload ml_f/models/basic_imputer.pkl models/
firebase storage:upload ml_f/models/basic_features.pkl models/
```

### Option C: Using gsutil (Google Cloud SDK)

```bash
# Install gsutil if needed
# https://cloud.google.com/storage/docs/gsutil_install

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Upload files
gsutil cp ml_f/models/basic_pcos_model.pkl gs://YOUR_PROJECT_ID.appspot.com/models/
gsutil cp ml_f/models/basic_imputer.pkl gs://YOUR_PROJECT_ID.appspot.com/models/
gsutil cp ml_f/models/basic_features.pkl gs://YOUR_PROJECT_ID.appspot.com/models/
```

**Note the Storage URL** - you'll need it for the ML service (e.g., `gs://your-project.appspot.com/models/`)

---

## Step 2: Set Up Python ML Service

### 2.1 Install Python Dependencies

```bash
cd ml-service
pip install -r requirements.txt
```

### 2.2 Test Locally

```bash
# Set model directory
export MODEL_DIR=../ml_f/models

# Run the service
python main.py
# OR
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 2.3 Test the Service

Open a new terminal and test:

```bash
# Health check
curl http://localhost:8000/health

# Test prediction
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 28,
    "weight": 65,
    "height": 165,
    "cycleRegularity": "irregular",
    "exerciseFrequency": "1-2_week",
    "diet": "balanced"
  }'
```

You should see a JSON response with prediction results.

---

## Step 3: Deploy ML Service to Cloud Run

### 3.1 Create Dockerfile (Optional but Recommended)

Create `ml-service/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Download models from Firebase Storage at startup
# Or mount them as a volume

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 3.2 Deploy to Cloud Run

```bash
cd ml-service

# Build and deploy
gcloud run deploy pcos-prediction-service \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MODEL_DIR=/app/models \
  --memory 2Gi \
  --cpu 2

# Note the service URL (e.g., https://pcos-prediction-service-xxx.run.app)
```

**Alternative: Deploy without Docker (using Cloud Run source-based deployment)**

```bash
gcloud run deploy pcos-prediction-service \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MODEL_DIR=/app/models
```

### 3.3 Copy Models to Cloud Run Container

You have two options:

**Option A: Download models at startup** (modify `main.py` to download from Firebase Storage)

**Option B: Include models in Docker image** (add COPY command in Dockerfile)

**Option C: Use Cloud Storage** (recommended - models stay in Storage, service downloads on startup)

---

## Step 4: Update Firebase Functions

### 4.1 Update functions/src/utils/mlModel.ts

The file has already been updated to call the ML service. Verify it looks correct.

### 4.2 Set Environment Variables

#### For Local Development (functions/.env):

```bash
DEV_MODE=false
ML_SERVICE_URL=http://localhost:8000  # For local testing
```

#### For Production (Firebase Functions):

```bash
# Set via Firebase Console or CLI
firebase functions:config:set \
  ml_service.url="https://pcos-prediction-service-xxx.run.app" \
  ml_service.dev_mode="false"

# Or use environment variables (Firebase Functions v2)
firebase functions:secrets:set ML_SERVICE_URL
firebase functions:secrets:set DEV_MODE
```

**Using Firebase Console:**
1. Go to Firebase Console > Functions
2. Click on your function
3. Go to "Configuration" tab
4. Add environment variables:
   - `ML_SERVICE_URL` = `https://your-cloud-run-url.run.app`
   - `DEV_MODE` = `false`

---

## Step 5: Deploy Firebase Functions

```bash
cd functions

# Install dependencies
npm ci

# Build
npm run build

# Deploy
firebase deploy --only functions
```

---

## Step 6: Test the Integration

### 6.1 Test Locally with Emulators

```bash
# Terminal 1: Start Firebase Emulators
firebase emulators:start --only functions

# Terminal 2: Start ML Service
cd ml-service
python main.py

# Terminal 3: Test the function
curl -X POST http://localhost:5001/YOUR_PROJECT_ID/us-central1/predict \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "age": 28,
      "weight": 65,
      "height": 165,
      "cycleRegularity": "irregular",
      "exerciseFrequency": "1-2_week",
      "diet": "balanced"
    }
  }'
```

### 6.2 Test in Production

Call the deployed function from your app or using curl:

```bash
# Get auth token first (if needed)
# Then call the function
```

---

## Troubleshooting

### Issue: "Model not loaded" error

**Solution:**
- Check that model files are in the correct directory
- Verify `MODEL_DIR` environment variable is set correctly
- Check Cloud Run logs: `gcloud run services logs read pcos-prediction-service`

### Issue: "Connection refused" to ML service

**Solution:**
- Verify ML service is running: `curl http://localhost:8000/health`
- Check `ML_SERVICE_URL` environment variable
- For Cloud Run, ensure service is deployed and URL is correct

### Issue: Prediction returns wrong format

**Solution:**
- Check that the ML service response matches `PredictionResult` interface
- Verify feature transformation in `ml-service/main.py` matches your model's expected input

### Issue: Feature mismatch

**Solution:**
- Inspect your model's expected features
- Update `transform_input()` function in `ml-service/main.py` to match
- You may need to check the original training script to see feature order

---

## Verification Checklist

- [ ] Model files uploaded to Firebase Storage
- [ ] ML service running locally and responding to `/health`
- [ ] ML service deployed to Cloud Run
- [ ] Cloud Run service URL noted
- [ ] Firebase Functions environment variables set (`ML_SERVICE_URL`, `DEV_MODE=false`)
- [ ] Functions deployed successfully
- [ ] Test prediction works end-to-end
- [ ] App shows real predictions (not mock)

---

## Next Steps

1. Monitor ML service performance in Cloud Run
2. Set up logging and monitoring
3. Add caching for predictions (optional)
4. Consider model versioning
5. Set up alerts for service failures

---

## Support

If you encounter issues:
1. Check Cloud Run logs: `gcloud run services logs read pcos-prediction-service`
2. Check Functions logs: `firebase functions:log`
3. Verify all environment variables are set correctly
4. Test ML service independently first


