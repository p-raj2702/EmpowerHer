# Cloud Build Configuration for ML Service

## Current Settings (What You See)

- **Branch**: `^main$` ✅ (This is correct - matches the main branch)
- **Build Type**: Dockerfile ✅ (This is correct)
- **Source location**: `/Dockerfile` ❌ (This needs to be fixed!)

## Fix Required

Since your ML service code is in the `ml-service/` folder, you need to update the source location.

### Step 1: Update Source Location

In the "Source location" field, change:
- **From**: `/Dockerfile`
- **To**: `ml-service/Dockerfile`

This tells Cloud Build to:
- Look for the Dockerfile in the `ml-service` folder
- Use `ml-service/` as the build context (where all files will be copied from)

### Step 2: Verify Repository Structure

Your repository structure should be:
```
EmpowerHer/
├── ml-service/
│   ├── Dockerfile          ← This is what we're pointing to
│   ├── main.py
│   ├── requirements.txt
│   └── ...
├── ml_f/
│   └── models/
│       └── ... (model files)
└── ... (other files)
```

### Step 3: Save Configuration

After updating the source location to `ml-service/Dockerfile`:
1. Click **"Save"** button
2. Continue to the next step (Service Configuration)

## Important Notes

### About Model Files

⚠️ **The Dockerfile needs access to model files!** 

Your current Dockerfile has this commented out:
```dockerfile
# COPY ../ml_f/models /app/models
```

You have two options:

#### Option A: Update Dockerfile to Copy Models
Modify the Dockerfile in your repository to:
```dockerfile
# Copy model files
COPY ml_f/models /app/models
```

**Note**: This requires the `ml_f/models` folder to be in the repository.

#### Option B: Download Models at Runtime
Keep the current Dockerfile and modify `main.py` to download models from Firebase Storage on startup.

### Build Context

When you set source location to `ml-service/Dockerfile`:
- The build context will be `ml-service/` folder
- Files referenced in Dockerfile (like `COPY . .`) will be relative to `ml-service/`
- If you need files from parent directory (like `ml_f/models`), you'll need to adjust the Dockerfile

## Recommended Dockerfile Update

If models are in the repository, update your Dockerfile:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Copy model files from parent directory
# Note: This requires adjusting build context or copying from parent
COPY ../ml_f/models /app/models

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**However**, if build context is `ml-service/`, you can't access `../ml_f/models` directly. You'll need to either:
1. Copy models into `ml-service/models/` folder
2. Or use a different build context
3. Or download models from Firebase Storage at runtime

