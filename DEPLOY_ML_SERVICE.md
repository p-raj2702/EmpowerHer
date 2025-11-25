# Deploy ML Service to Cloud Run

## Option 1: Using Firebase Console (No CLI needed)

Since you don't have `gcloud` CLI installed, you can deploy via the Firebase Console:

### Steps:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select project: `studio-9165758963-a10e4`

2. **Enable Cloud Run API**
   - Go to **APIs & Services** → **Library**
   - Search for "Cloud Run API"
   - Click **Enable**

3. **Deploy via Cloud Run Console**
   - Go to **Cloud Run** → **Create Service**
   - Service name: `empowerher-ml-service`
   - Region: `us-central1`
   - **Deploy one revision from a source repository** or **Deploy a new revision**
   - Choose **Source** tab
   - Select your repository or upload the `ml-service` folder
   - Set environment variables:
     - `MODEL_DIR` = `/app/models`
   - Memory: `1 GiB`
   - CPU: `1`
   - Timeout: `300 seconds`
   - **Allow unauthenticated invocations**: ✅ Checked
   - Click **Create**

4. **Get the URL**
   - After deployment, you'll see the service URL
   - It will look like: `https://empowerher-ml-service-xxxxx-uc.a.run.app`
   - Copy this URL

## Option 2: Install gcloud CLI and Deploy

### Install gcloud CLI:

**macOS:**
```bash
# Download and install
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

**Or using Homebrew:**
```bash
brew install --cask google-cloud-sdk
gcloud init
```

### Then deploy:

```bash
cd ml-service
gcloud run deploy empowerher-ml-service \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --set-env-vars MODEL_DIR=/app/models
```

## Option 3: Use Local Development URL (For Testing)

If you want to test the Firebase Functions configuration first with your local ML service:

1. **Start your local ML service:**
   ```bash
   cd ml-service
   export MODEL_DIR=/Users/piyushraj/Downloads/EmpowerHer-main-2/ml_f/models
   python3.11 main.py
   ```

2. **Use a tunnel service** to expose it publicly:
   - Use **ngrok**: `ngrok http 8000`
   - Or use **Cloudflare Tunnel**: `cloudflared tunnel --url http://localhost:8000`
   
3. **Use the tunnel URL** in the Firebase Functions config

## Important Notes

⚠️ **Model Files**: The ML service needs access to the model files. You have two options:

1. **Include models in the container** (modify Dockerfile):
   ```dockerfile
   COPY ../ml_f/models /app/models
   ```

2. **Download from Firebase Storage at runtime** (recommended for production):
   - Upload models to Firebase Storage first
   - Modify `main.py` to download models on startup
   - Set `MODEL_DIR` environment variable

## After Getting the URL

Once you have your Cloud Run URL, run:

```bash
# Cancel the current script (Ctrl+C) and run:
firebase functions:config:set ml_service.dev_mode="false"
firebase functions:config:set ml_service.url="YOUR_CLOUD_RUN_URL_HERE"
firebase functions:config:get
```

