# Complete Cloud Run Deployment Steps

## Step 1: Navigate to Cloud Run

**Direct Link:** https://console.cloud.google.com/run?project=studio-9165758963-a10e4

Or manually:
1. Go to https://console.cloud.google.com/
2. Select project: `studio-9165758963-a10e4` (top dropdown)
3. Click **☰ Menu** (top-left)
4. Find **"Cloud Run"** under "Serverless" section
5. Click **"+ CREATE SERVICE"** button

## Step 2: Enable Cloud Run API (If Needed)

If you see an error about API not enabled:
- Go to: https://console.cloud.google.com/apis/library/run.googleapis.com?project=studio-9165758963-a10e4
- Click **"Enable"** button
- Wait for it to enable

## Step 3: Create Service Configuration

When you click "CREATE SERVICE", you'll see a form. Fill it out:

### Basic Settings:
- **Service name**: `empowerher-ml-service`
- **Region**: Select `us-central1` (or closest to you)
- **Authentication**: Select **"Allow unauthenticated invocations"** ✅

### Container Settings:
- **Deploy one revision from a source repository**: Select this option
- **Source**: Choose one:
  - **Cloud Source Repositories** (if you have code there)
  - **GitHub** (if you want to connect GitHub)
  - **Upload from local** (if available)

**OR** use **"Deploy a new revision"** and:
- **Container image URL**: Leave empty (we'll build from source)
- **Source**: Upload your `ml-service` folder

### Environment Variables:
Click **"Variables & Secrets"** → **"Add Variable"**:
- **Name**: `MODEL_DIR`
- **Value**: `/app/models`

### Resource Settings:
- **CPU allocation**: `1`
- **Memory**: `1 GiB`
- **Timeout**: `300 seconds`
- **Maximum number of instances**: `10` (default is fine)

### Advanced Settings (Optional):
- **Container port**: `8000`
- **Concurrency**: `80` (default)

## Step 4: Deploy

1. Click **"CREATE"** or **"DEPLOY"** button
2. Wait for deployment (takes 2-5 minutes)
3. Once deployed, you'll see the service URL at the top
4. **Copy the URL** - it looks like: `https://empowerher-ml-service-xxxxx-uc.a.run.app`

## Step 5: Test the Service

After deployment, test it:

```bash
# Test health endpoint
curl https://YOUR-SERVICE-URL.run.app/health

# Should return:
# {"status":"healthy","model_loaded":true,"imputer_loaded":false}
```

## Step 6: Use URL in Firebase Functions

Once you have the URL, go back to your terminal and run:

```bash
firebase functions:config:set ml_service.dev_mode="false"
firebase functions:config:set ml_service.url="https://YOUR-SERVICE-URL.run.app"
firebase functions:config:get
```

## Troubleshooting

### "API not enabled" error:
- Enable Cloud Run API: https://console.cloud.google.com/apis/library/run.googleapis.com?project=studio-9165758963-a10e4

### "Permission denied" error:
- Make sure you're logged in with the correct account
- Check you have "Cloud Run Admin" or "Editor" role

### "Source not found" error:
- You may need to upload files differently
- Try using "Container image" option instead
- Or use gcloud CLI (if you install it later)

### Service doesn't start:
- Check logs in Cloud Run → Your service → "LOGS" tab
- Make sure `MODEL_DIR` environment variable is set
- Verify model files are accessible

