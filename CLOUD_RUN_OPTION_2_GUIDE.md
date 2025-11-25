# Deploy Using Option 2: Continuously Deploy from Repository

## Step-by-Step Guide

### 1. Select Option 2
- Click on **"Continuously deploy from a repository (source or function)"**
- You'll see a GitHub icon on this option

### 2. Connect Repository
You'll be asked to connect a repository. You have options:

#### Option A: Connect GitHub (If your code is on GitHub)
- Click "Connect repository"
- Authorize Google Cloud to access your GitHub
- Select your repository
- Select the branch (usually `main` or `master`)
- Set the root directory to `ml-service` (if your repo has the ml-service folder)

#### Option B: Use Cloud Source Repositories
- If you don't have GitHub, you can push to Cloud Source Repositories
- Or use the "Upload files" option if available

### 3. Configure Build Settings
After connecting the repository:

- **Build type**: Select "Dockerfile" (since we have a Dockerfile)
- **Dockerfile path**: `ml-service/Dockerfile` (or just `Dockerfile` if root is ml-service)
- **Build context**: `ml-service` (or `.` if root is ml-service)

### 4. Configure Service Settings

#### Basic Settings:
- **Service name**: `empowerher-ml-service`
- **Region**: `us-central1` (or closest to you)
- **Authentication**: ✅ **Check "Allow unauthenticated invocations"**

#### Environment Variables:
Click **"Variables & Secrets"** → **"Add Variable"**:
- **Name**: `MODEL_DIR`
- **Value**: `/app/models`

#### Resource Settings:
- **CPU allocation**: `1`
- **Memory**: `1 GiB`
- **Timeout**: `300 seconds`
- **Container port**: `8000` (important - our service runs on port 8000)

### 5. Important: Model Files

⚠️ **The models need to be accessible!** You have two options:

#### Option A: Include models in the repository
- Make sure `ml_f/models/` folder is in your repository
- Update Dockerfile to copy models:
  ```dockerfile
  COPY ml_f/models /app/models
  ```

#### Option B: Download from Firebase Storage at runtime
- Upload models to Firebase Storage first
- Modify `main.py` to download models on startup
- Set `MODEL_DIR` environment variable

### 6. Deploy

- Click **"CREATE"** button
- Wait for build and deployment (5-10 minutes)
- You'll see build logs in real-time
- Once done, you'll get the service URL

### 7. Get Your URL

After successful deployment:
- The service URL will be displayed at the top
- It looks like: `https://empowerher-ml-service-xxxxx-uc.a.run.app`
- **Copy this URL** - you'll need it for Firebase Functions config

## If Option 2 Doesn't Work

If you can't use Option 2 (repository not available), you can:

1. **Use Option 1** but first build and push a container image
2. **Or** use gcloud CLI (if you install it later)

Let me know if you need help with either approach!

