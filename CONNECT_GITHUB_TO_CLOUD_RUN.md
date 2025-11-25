# Connect GitHub Repository to Cloud Run

## Problem
Your GitHub repository (https://github.com/cakecheese1005/EmpowerHer) isn't showing up when trying to connect in Cloud Run.

## Solution: Authorize Google Cloud to Access GitHub

### Step 1: Authorize GitHub Connection

1. **In the Cloud Run "Create service" page:**
   - After selecting **Option 2: "Continuously deploy from a repository"**
   - You should see a section to connect a repository
   - Look for a button like **"Connect repository"** or **"Authorize GitHub"**

2. **Click "Connect repository" or "Authorize"**
   - This will open a GitHub authorization page
   - You'll be asked to sign in to GitHub (if not already)
   - Make sure you're signed in with the account that has access to the repository

3. **Grant Permissions:**
   - GitHub will ask what permissions to grant
   - You need to authorize Google Cloud to:
     - Read repository contents
     - Access repository metadata
   - Click **"Authorize"** or **"Grant access"**

### Step 2: Select the Repository

After authorization:

1. **Refresh the repository list** (if needed)
2. **Search for the repository:**
   - Type: `cakecheese1005/EmpowerHer`
   - Or: `EmpowerHer`
3. **Select the repository** from the list

### Step 3: Configure Repository Settings

Once the repository is connected:

1. **Select Branch:**
   - Choose: `main` (or `master` if that's the default branch)

2. **Set Root Directory:**
   - If your ML service code is in a subfolder, set the root directory
   - For example: `ml-service` (if the ML service code is in that folder)
   - Or leave as `/` if the service code is at the root

3. **Build Settings:**
   - **Build type**: Select "Dockerfile"
   - **Dockerfile path**: 
     - If ML service is in `ml-service/` folder: `ml-service/Dockerfile`
     - If at root: `Dockerfile`
   - **Build context**: Same as Dockerfile path

## Troubleshooting

### Repository Still Not Showing?

#### Check 1: Verify GitHub Access
- Go to: https://github.com/cakecheese1005/EmpowerHer
- Make sure you can access it (you're logged in as a collaborator)
- Check you're signed in with the correct GitHub account

#### Check 2: Re-authorize GitHub
1. Go to Google Cloud Console
2. Navigate to: **Cloud Build** → **Triggers** → **Connect Repository**
3. Or go to: https://console.cloud.google.com/cloud-build/triggers?project=studio-9165758963-a10e4
4. Click **"Connect Repository"**
5. Select **"GitHub"**
6. Authorize again

#### Check 3: Check Repository Visibility
- Make sure the repository is either:
  - **Public**, OR
  - **Private** but you've granted access to Google Cloud

#### Check 4: Use Cloud Source Repositories (Alternative)
If GitHub connection still doesn't work:

1. **Push code to Cloud Source Repositories:**
   ```bash
   # In your local repo
   git remote add google https://source.developers.google.com/p/studio-9165758963-a10e4/r/empowerher-repo
   git push google main
   ```

2. **Or use Cloud Source Repositories in Cloud Run:**
   - Select "Cloud Source Repositories" instead of GitHub
   - Create a new repository there
   - Push your code

### Alternative: Manual Upload

If repository connection is too complicated:

1. **Use Option 1** (Container image)
2. **Build locally** and push to Container Registry
3. See `OPTION_1_BUILD_CONTAINER.md` for instructions

## Quick Links

- **Cloud Build Triggers**: https://console.cloud.google.com/cloud-build/triggers?project=studio-9165758963-a10e4
- **GitHub Repository**: https://github.com/cakecheese1005/EmpowerHer
- **Cloud Source Repositories**: https://console.cloud.google.com/source/repos?project=studio-9165758963-a10e4

