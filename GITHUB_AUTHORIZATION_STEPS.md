# Step-by-Step: Authorize GitHub for Cloud Run

## Quick Steps

### 1. In Cloud Run Create Service Page

When you select **Option 2: "Continuously deploy from a repository"**, you should see:

- A section that says **"Connect repository"** or **"Select source"**
- Click on **"Connect repository"** or **"Authorize GitHub"** button

### 2. GitHub Authorization Page

You'll be redirected to GitHub where you need to:

1. **Sign in to GitHub** (if not already signed in)
   - Make sure you're signed in with the account that has access to `cakecheese1005/EmpowerHer`
   - This should be the account your teammate added as a collaborator

2. **Authorize Google Cloud Platform**
   - GitHub will show what permissions Google Cloud is requesting
   - Click **"Authorize"** or **"Grant access"**

### 3. Return to Cloud Run

After authorization:
- You'll be redirected back to Cloud Run
- The repository list should now show your repositories
- Search for: `cakecheese1005/EmpowerHer` or just `EmpowerHer`

## If You Don't See "Connect Repository" Button

### Option A: Go to Cloud Build Settings First

1. **Go to Cloud Build directly:**
   - Visit: https://console.cloud.google.com/cloud-build/triggers?project=studio-9165758963-a10e4

2. **Click "Connect Repository"** (top of the page)

3. **Select "GitHub"**

4. **Authorize GitHub** (follow steps above)

5. **Then go back to Cloud Run** and try again

### Option B: Check Repository Access

1. **Verify you can access the repo:**
   - Go to: https://github.com/cakecheese1005/EmpowerHer
   - Make sure you can see it (not getting 404)

2. **Check your GitHub account:**
   - Go to: https://github.com/settings/applications
   - Look for "Google Cloud Platform" in authorized applications
   - If it's there, you might need to re-authorize

## Common Issues

### Issue: "Repository not found"
**Solution:** Make sure you're signed in to GitHub with the correct account that has collaborator access.

### Issue: "No repositories available"
**Solution:** 
1. Re-authorize GitHub connection
2. Make sure the repository is accessible to your GitHub account
3. Try refreshing the repository list

### Issue: "Permission denied"
**Solution:**
1. Ask your teammate to verify you're added as a collaborator
2. Check repository settings on GitHub
3. Re-authorize with the correct GitHub account

## Alternative: Direct Cloud Build Connection

If Cloud Run's repository connection doesn't work, connect via Cloud Build first:

1. **Go to Cloud Build:**
   https://console.cloud.google.com/cloud-build/triggers?project=studio-9165758963-a10e4

2. **Click "Connect Repository"**

3. **Select "GitHub"** and authorize

4. **Select your repository:** `cakecheese1005/EmpowerHer`

5. **Then in Cloud Run**, the repository should appear in the list

