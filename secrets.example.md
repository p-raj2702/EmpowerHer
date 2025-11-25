# Required GitHub Secrets

Configure these in your GitHub repository settings under Settings > Secrets and variables > Actions:

## FIREBASE_TOKEN
Get your Firebase CI token:
```bash
firebase login:ci
```
Copy the token and add it as `FIREBASE_TOKEN` secret.

## GCP_SA_KEY
1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. Copy the entire JSON content and add it as `GCP_SA_KEY` secret (single-line JSON)

## FIREBASE_PROJECT_ID
Your Firebase project ID (e.g., `my-project-12345`)

## Optional: Environment-specific secrets
- `STAGING_FIREBASE_PROJECT_ID` (if using staging environment)
- `PRODUCTION_FIREBASE_PROJECT_ID` (if using production environment)





