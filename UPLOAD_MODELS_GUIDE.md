# Upload ML Models to Firebase Storage - Recommendation

## 🎯 **Recommended: Option B (Firebase CLI)**

### Why Option B is Better:

✅ **Faster** - Upload all files in seconds  
✅ **Scriptable** - Can be automated  
✅ **Repeatable** - Easy to re-upload if needed  
✅ **CI/CD Ready** - Can be part of deployment pipeline  
✅ **Professional** - Standard practice for developers  
✅ **Version Control** - Upload scripts can be tracked in git  

### When to Use Option A (Console):

- Quick one-time test
- Not comfortable with command line
- Just exploring Firebase Storage

---

## 🚀 Quick Start with Option B

### Prerequisites:

1. **Install Firebase CLI** (if not already installed):
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**:
```bash
firebase login
```

3. **Set your project** (if not already set):
```bash
firebase use YOUR_PROJECT_ID
```

### Upload Models (3 Methods):

#### Method 1: Use the Upload Script (Easiest) ⭐

**Mac/Linux:**
```bash
./scripts/upload-models.sh
```

**Windows (PowerShell):**
```powershell
.\scripts\upload-models.ps1
```

#### Method 2: Manual Commands

```bash
# Upload each file
firebase storage:upload ml_f/models/basic_pcos_model.pkl models/
firebase storage:upload ml_f/models/basic_imputer.pkl models/
firebase storage:upload ml_f/models/basic_features.pkl models/
```

#### Method 3: Using gsutil (Google Cloud SDK)

```bash
# Set project
gcloud config set project YOUR_PROJECT_ID

# Upload files
gsutil cp ml_f/models/basic_pcos_model.pkl gs://YOUR_PROJECT_ID.appspot.com/models/
gsutil cp ml_f/models/basic_imputer.pkl gs://YOUR_PROJECT_ID.appspot.com/models/
gsutil cp ml_f/models/basic_features.pkl gs://YOUR_PROJECT_ID.appspot.com/models/
```

---

## 📋 Step-by-Step: Option B (Recommended)

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login

```bash
firebase login
```

This will open a browser for authentication.

### Step 3: Navigate to Project Root

```bash
cd /path/to/EmpowerHer-main-2
```

### Step 4: Set Firebase Project

```bash
# List available projects
firebase projects:list

# Use your project
firebase use YOUR_PROJECT_ID
```

### Step 5: Upload Models

**Option A: Use the script**
```bash
./scripts/upload-models.sh
```

**Option B: Manual commands**
```bash
firebase storage:upload ml_f/models/basic_pcos_model.pkl models/
firebase storage:upload ml_f/models/basic_imputer.pkl models/
firebase storage:upload ml_f/models/basic_features.pkl models/
```

### Step 6: Verify Upload

```bash
# List files in Storage
firebase storage:list models/
```

Or check in Firebase Console → Storage → models/

---

## 🔍 Verification

After uploading, verify the files:

1. **Firebase Console:**
   - Go to Firebase Console → Storage
   - Check `models/` folder
   - Should see 3 `.pkl` files

2. **CLI:**
```bash
firebase storage:list models/
```

3. **gsutil:**
```bash
gsutil ls gs://YOUR_PROJECT_ID.appspot.com/models/
```

---

## 🆚 Comparison

| Feature | Option A (Console) | Option B (CLI) |
|---------|-------------------|----------------|
| Speed | ⭐⭐ Slow (manual) | ⭐⭐⭐⭐⭐ Fast |
| Automation | ❌ No | ✅ Yes |
| Scriptable | ❌ No | ✅ Yes |
| CI/CD | ❌ No | ✅ Yes |
| Ease of Use | ⭐⭐⭐⭐⭐ Very Easy | ⭐⭐⭐⭐ Easy |
| Repeatable | ⭐⭐ Manual | ⭐⭐⭐⭐⭐ Scripted |
| Professional | ⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Best Practice |

---

## 💡 Pro Tips

1. **Add to CI/CD:** Include upload script in your deployment pipeline
2. **Version Models:** Consider versioning model files (e.g., `models/v1/`, `models/v2/`)
3. **Automate:** Create a script that uploads models before deploying functions
4. **Verify:** Always verify uploads before deploying

---

## 🐛 Troubleshooting

### Issue: "firebase: command not found"

**Solution:**
```bash
npm install -g firebase-tools
```

### Issue: "Permission denied"

**Solution:**
```bash
firebase login
```

### Issue: "Project not found"

**Solution:**
```bash
firebase projects:list
firebase use YOUR_PROJECT_ID
```

### Issue: Storage not enabled

**Solution:**
1. Go to Firebase Console
2. Enable Storage
3. Choose "Start in test mode" (we'll update rules later)

---

## ✅ Next Steps After Upload

1. ✅ Models uploaded to Firebase Storage
2. ⏭️ Deploy ML service to Cloud Run (see `ACTIVATE_ML_MODEL.md`)
3. ⏭️ Update Firebase Functions config
4. ⏭️ Deploy Functions

---

## 📚 Related Documentation

- Full ML activation guide: `ACTIVATE_ML_MODEL.md`
- Quick start: `QUICK_START_ML.md`
- ML service README: `ml-service/README.md`


