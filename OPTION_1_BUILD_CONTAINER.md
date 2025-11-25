# Option 1: Build Container Image First

If Option 2 (repository) doesn't work for you, here's how to use Option 1:

## Step 1: Build Container Image Locally

Since you have Docker installed, we can build the image:

```bash
cd ml-service

# Build the Docker image
docker build -t empowerher-ml:latest .

# Tag it for Google Container Registry
docker tag empowerher-ml:latest gcr.io/studio-9165758963-a10e4/empowerher-ml:latest
```

## Step 2: Push to Google Container Registry

You'll need to authenticate first:

```bash
# Authenticate Docker with Google Cloud
gcloud auth configure-docker

# Push the image
docker push gcr.io/studio-9165758963-a10e4/empowerher-ml:latest
```

**Note:** This requires `gcloud` CLI. If you don't have it, Option 2 is easier.

## Step 3: Use in Cloud Run

Then in the Cloud Run console:
1. Select **Option 1**: "Deploy one revision from an existing container image"
2. Enter: `gcr.io/studio-9165758963-a10e4/empowerher-ml:latest`
3. Configure the service (name, region, etc.)
4. Deploy

## Alternative: Use Artifact Registry

If you prefer Artifact Registry over Container Registry:
1. Create an Artifact Registry repository in Google Cloud Console
2. Push to that instead
3. Use that image URL in Option 1

