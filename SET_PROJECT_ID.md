# Your Firebase Projects

I found these Firebase projects in your account:

## Existing Projects:

1. **campusfest-qah50** (CampusFest)
2. **scoutgenie** (scoutgenie)
3. **studio-1485485748-20683** (Firebase app)
4. **studio-4354815756-2669d** (Firebase app)
5. **studio-4974834306-4d442** (Firebase app)
6. **studio-5789808662-44895** (Firebase app)
7. **studio-6664472548-f5453** (Firebase app)
8. **studio-827010330-91b76** (Firebase app)
9. **studio-9165758963-a10e4** (Firebase app)

## Choose an Option:

### Option A: Use an Existing Project

If you want to use an existing project (e.g., `scoutgenie` or `campusfest-qah50`):

```bash
firebase use scoutgenie
# OR
firebase use campusfest-qah50
```

### Option B: Create a New Project for EmpowerHer (Recommended)

Create a dedicated project for EmpowerHer:

```bash
# Create new project
firebase projects:create empowerher-app

# Or with a custom ID
firebase projects:create --project-id empowerher-app-2024
```

Then set it:
```bash
firebase use empowerher-app
```

### Option C: Use Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" or select an existing one
3. Note the Project ID
4. Set it locally:
```bash
firebase use YOUR_PROJECT_ID
```

## After Setting Project ID

Once you've chosen, update `.firebaserc`:

```bash
# This will automatically update .firebaserc
firebase use YOUR_PROJECT_ID
```

Or manually edit `.firebaserc`:
```json
{
  "projects": {
    "default": "your-chosen-project-id"
  }
}
```

## Verify

```bash
firebase use
# Should show: Using project YOUR_PROJECT_ID
```

## Recommendation

For a production app like EmpowerHer, I recommend **creating a new dedicated project**:

```bash
firebase projects:create empowerher-app
firebase use empowerher-app
```

This keeps your EmpowerHer app isolated from other projects.


