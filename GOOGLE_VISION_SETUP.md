# Google Cloud Vision API Setup Guide

## What is Google Cloud Vision?

Google Cloud Vision is an AI service that can analyze images and detect objects, labels, and text. We use it to automatically identify food items and estimate sugar content.

---

## Setup Steps (Free Tier - 1,000 images/month)

### 1. Create Google Cloud Account

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Sign in with your Google account
3. Accept terms and create a project

### 2. Create a New Project

1. Click on project dropdown (top left)
2. Click "New Project"
3. Name it: "Sugar Tracker" or similar
4. Click "Create"

### 3. Enable Vision API

1. Go to [API Library](https://console.cloud.google.com/apis/library)
2. Search for "Cloud Vision API"
3. Click on it
4. Click "Enable"

### 4. Create API Key

1. Go to [Credentials](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" → "API Key"
3. Copy the API key
4. (Optional) Click "Restrict Key":
   - Under "API restrictions" → Select "Cloud Vision API"
   - Click "Save"

### 5. Update Environment Variables

Open `server/.env` and update:

```env
GOOGLE_CLOUD_VISION_API_KEY=YOUR-ACTUAL-API-KEY-HERE
```

Replace `YOUR-ACTUAL-API-KEY-HERE` with the API key you copied.

### 6. Restart Server

```bash
# Stop with Ctrl+C, then:
npm run dev
```

---

## Free Tier Limits

✅ **1,000 images/month** - FREE  
✅ **Label Detection** - Included  
✅ **Web Detection** - Included  
⚠️ After  1,000 images: ~$1.50 per 1,000 images

**Plenty for development and hackathon demos!**

---

## How It Works

1. **User uploads photo** → "Analyzing photo with AI..."
2. **AI detects labels** → "Food", "Chocolate", "Candy bar"
3. **AI searches web entities** → "Snickers bar", "Chocolate"
4. **Estimate sugar** → Matches against database (~24g)
5. **Auto-fill** → Sugar amount pre-filled
6. **User adjusts if needed** → Can override estimate

---

## Food Detection Features

### What AI Can Detect:
✅ Packaged foods (chips, candy, soda, etc.)  
✅ Common foods (pizza, burger, fruit)  
✅ Desserts (cake, ice cream, cookies)  
✅ Beverages (juice, coffee, tea)

### Sugar Estimate Database:
- 50+ common foods/drinks
- Conservative estimates
- Confidence scores (0-1)

### Fallback Behavior:
- If no food detected → Manual entry only
- If low confidence → Show estimate but suggest manual review
- If API fails → Works without AI (graceful degradation)

---

## Testing

1. **Upload packaged food photo** (e.g., candy bar)
   - Should detect: "Candy", "Chocolate"
   - Should estimate: ~20-30g sugar

2. **Upload fruit photo** (e.g., banana)
   - Should detect: "Banana", "Fruit"
   - Should estimate: ~14g sugar

3. **Upload unclear photo**
   - Should show low confidence or no detection
   - Falls back to manual entry

---

## Troubleshooting

### "Google Cloud Vision not configured"
- Check that API key is set in `.env`
- Make sure there are no extra spaces
- Restart server after changing `.env`

### "API detection failed"
- Verify API is enabled in Google Cloud Console
- Check API key restrictions (should allow Vision API)
- Check free tier limit (1,000 images/month)

### "No food detected"
- Photo might be unclear or not contain food
- This is normal - user can still log manually
- Try with clearer photo or packaged food

### AI estimates seem off
- Estimates are conservative approximations
- User can always override the suggestion
- Based on typical serving sizes

---

## Cost Management

**Free tier is 1,000 images/month.**

To stay within free tier:
- Only enable AI for testing/demo
- Don't auto-detect on every upload in production
- Add toggle to enable/disable AI

**Current setup:** AI runs on every photo upload

---

**That's it! You're ready to test AI food detection.** 🤖✨
