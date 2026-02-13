# Cloudinary Setup Guide

## What is Cloudinary?

Cloudinary is a cloud-based service for storing and managing images and videos. For this app, we use it to store photos that users upload with their sugar logs.

---

## Setup Steps (Free Account)

### 1. Create Account

1. Go to [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Sign up for a **free** account
3. Verify your email

### 2. Get Your Credentials

After logging in, you'll see your dashboard. You need three values:

1. **Cloud Name** - shown at the top of dashboard
2. **API Key** - shown under "Account Details"
3. **API Secret** - shown under "Account Details" (click eye icon to reveal)

### 3. Update Environment Variables

Open `server/.env` and update these lines:

```env
CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
CLOUDINARY_API_KEY=your-actual-api-key
CLOUDINARY_API_SECRET=your-actual-api-secret
```

Replace the values with your actual credentials from Cloudinary dashboard.

### 4. Restart Server

After updating `.env`, restart your dev server:

```bash
# Stop with Ctrl+C, then:
npm run dev
```

---

## Free Tier Limits

Cloudinary free tier includes:
- ✅ **25 GB** storage
- ✅ **25 GB** monthly bandwidth
- ✅ **25,000** transformations/month
- ✅ **500** auto-optimized photos/month

This is **more than enough** for development and testing!

---

## How It Works in the App

1. User takes/selects photo
2. Photo sent to backend as FormData
3. Server uploads to Cloudinary
4. Cloudinary returns URL
5. URL saved in database with log
6. Photo displayed in History

---

## Features Implemented

✅ **Auto-optimization** - Images resized to max 800x800px
✅ **Format conversion** - Auto WebP for modern browsers  
✅ **Quality optimization** - Automatic quality selection  
✅ **5MB size limit** - Prevents huge uploads  
✅ **Image-only filter** - Only JPEG, PNG, GIF, WebP allowed  

---

## Testing Photo Upload

1. Make sure Cloudinary credentials are configured
2. Restart server if needed
3. Go to Dashboard
4. Click "Custom Log with Photo"
5. Enter sugar amount
6. Add photo (camera or gallery)
7. Click "Log Sugar"
8. Photo will upload to Cloudinary!

---

## Troubleshooting

### "Cloudinary config error"
- Check that all three env variables are set correctly
- Make sure there are no extra spaces in .env file
- Restart the server after changing .env

### "Upload failed"
- Check your internet connection
- Verify Cloudinary credentials are correct
- Check file size is under 5MB
- Make sure file is an image (JPEG, PNG, GIF, WebP)

### "Photos not showing in History"
- Clear browser cache
- Check browser console for errors
- Verify photoUrl is being returned from API

---

## Optional: Disable Photo Upload

If you don't want to set up Cloudinary right now:

1. The app will still work fine
2. Photos just won't be saved
3. Normal logging without photos works perfectly
4. You can set up Cloudinary later

The app gracefully handles missing photo uploads - if Cloudinary fails, it creates the log without the photo.

---

**That's it! You're ready to test photo uploads.** 📸
