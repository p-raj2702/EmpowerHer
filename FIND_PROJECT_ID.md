# How to Find Your Firebase Project ID

## Method 1: Firebase Console (Easiest) ⭐

1. Go to [Firebase Console](https://console.firebase.google.com)
2. You'll see a list of your projects
3. Click on your project
4. The **Project ID** is shown:
   - In the project settings (gear icon → Project settings)
   - In the URL: `https://console.firebase.google.com/project/YOUR_PROJECT_ID`
   - At the top of the console

## Method 2: Firebase CLI (After Login)

```bash
# First, login if not already
firebase login

# Temporarily remove the placeholder project
# Then list projects
firebase projects:list
```

## Method 3: Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project from the dropdown
3. The Project ID is shown in the project selector

## Method 4: Check Existing Firebase Apps

If you have other Firebase apps or configs, check:
- `.env` files
- `firebase.json` 
- Any existing Firebase app configurations

## After Finding Your Project ID

Update `.firebaserc`:

```bash
# Replace YOUR_PROJECT_ID with your actual project ID
firebase use YOUR_ACTUAL_PROJECT_ID
```

Or edit `.firebaserc` directly:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

## Common Project ID Format

- All lowercase
- Can contain hyphens and numbers
- Example: `my-awesome-app-12345`
- Example: `empowerher-app`

## Don't Have a Firebase Project Yet?

Create one:

```bash
firebase projects:create
```

Or go to [Firebase Console](https://console.firebase.google.com) and click "Add project"


