# Upload ML Models - Correct Method

## ❌ Firebase CLI doesn't have `storage:upload` command

The correct methods are:

---

## ✅ Method 1: Firebase Console (Easiest & Fastest) ⭐

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **scoutgenie**
3. Click **Storage** in left sidebar
4. Click **Get Started** (if Storage not enabled)
5. Click **Create folder** → Name it `models`
6. Click **Upload file** and upload:
   - `ml_f/models/basic_pcos_model.pkl`
   - `ml_f/models/basic_imputer.pkl`
   - `ml_f/models/basic_features.pkl`

**Done!** Models are now in Storage.

---

## ✅ Method 2: gsutil (Command Line)

### Install Google Cloud SDK:

**macOS:**
```bash
brew install --cask google-cloud-sdk
```

**Or download from:**
https://cloud.google.com/sdk/docs/install

### Setup:

```bash
# Login
gcloud auth login

# Set project
gcloud config set project scoutgenie
```

### Upload:

```bash
# Upload files
gsutil cp ml_f/models/basic_pcos_model.pkl gs://scoutgenie.appspot.com/models/
gsutil cp ml_f/models/basic_imputer.pkl gs://scoutgenie.appspot.com/models/
gsutil cp ml_f/models/basic_features.pkl gs://scoutgenie.appspot.com/models/
```

**Or use the script:**
```bash
./scripts/upload-models-gsutil.sh
```

---

## ✅ Method 3: Firebase Admin SDK (Programmatic)

If you want to upload programmatically, use the Firebase Admin SDK in a script.

---

## 🎯 Recommendation

**Use Method 1 (Firebase Console)** - It's the fastest and doesn't require any CLI tools!

---

## 📍 After Upload

Your models will be at:
- `gs://scoutgenie.appspot.com/models/basic_pcos_model.pkl`
- `gs://scoutgenie.appspot.com/models/basic_imputer.pkl`
- `gs://scoutgenie.appspot.com/models/basic_features.pkl`

---

## ✅ Verify Upload

In Firebase Console → Storage → models/ folder, you should see all 3 `.pkl` files.


