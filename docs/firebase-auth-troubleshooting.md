# Firebase Google Authentication Troubleshooting Guide

## Current Issue
You're encountering the "Firebase: Error (auth/configuration-not-found)" error when trying to use Google sign-in. This typically happens when:

1. Google authentication isn't enabled in Firebase console
2. Your web app isn't properly registered in Firebase
3. Your domain (localhost) isn't in the authorized domains list
4. There's a mismatch between your Firebase config and the actual project settings

## Step 1: Check Firebase Authentication Settings

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (mindease-57a64)
3. Go to **Authentication** → **Sign-in method**
4. Make sure **Google** provider is enabled:
   - Click on Google in the list
   - Toggle the "Enable" switch to ON
   - Set the project support email
   - Save the changes

## Step 2: Add Authorized Domains

1. In Firebase Authentication settings, go to the **Authorized domains** tab
2. Add `localhost` to the list if it's not already there
3. Click **Add**

## Step 3: Verify Web App Registration

1. Go to **Project Settings** (gear icon in top-left)
2. Scroll down to "Your apps" section
3. If you don't see a Web app listed, click **Add app** and choose the Web platform
4. Follow the setup instructions to register your app
5. Copy the Firebase config object and compare it with the values in `src/services/firebase.ts`

## Step 4: Update Firebase Config (if needed)

If the configuration values don't match, update them in your `.env.local` file:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 5: Verify OAuth Consent Screen

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** → **OAuth consent screen**
4. Make sure your app is properly configured
5. Go to **Credentials** → find the Web Client under OAuth 2.0 Client IDs
6. Make sure the **Authorized JavaScript origins** include `http://localhost:3000` (or the port you're using)

## Step 6: Running the Diagnostic Script

For convenience, we've created a diagnostic script to help walk through these steps:

```bash
node scripts/check-firebase-auth.js
```

This will guide you through verifying your Firebase setup.

## Step 7: Additional Troubleshooting

If you're still experiencing issues:

1. Clear your browser cache
2. Check browser console for other errors
3. Try testing with a different browser
4. Ensure you're using the latest Firebase SDK
5. Check if there are any restrictions on your Firebase project (like billing status)

If none of these solutions work, you might need to regenerate the OAuth credentials in Google Cloud Console.
