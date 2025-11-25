# Skip ML Service Deployment for Now

If you want to configure Firebase Functions but deploy the ML service later, you can:

## Option 1: Use Placeholder URL (Update Later)

In the setup script, enter a placeholder:
```
https://empowerher-ml-service-placeholder.run.app
```

Then later, when you deploy, update it:
```bash
firebase functions:config:set ml_service.url="YOUR_ACTUAL_URL"
firebase deploy --only functions
```

## Option 2: Set Config Manually Later

1. **Cancel the script** (Ctrl+C)

2. **Set config manually when ready:**
   ```bash
   firebase functions:config:set ml_service.dev_mode="false"
   firebase functions:config:set ml_service.url="YOUR_CLOUD_RUN_URL"
   firebase functions:config:get
   ```

3. **Deploy:**
   ```bash
   cd functions
   npm run build
   firebase deploy --only functions
   ```

## Option 3: Keep DEV_MODE=true for Now

Keep using mock predictions until ML service is deployed:

```bash
firebase functions:config:set ml_service.dev_mode="true"
firebase deploy --only functions
```

Then switch to production mode later when ML service is ready.

