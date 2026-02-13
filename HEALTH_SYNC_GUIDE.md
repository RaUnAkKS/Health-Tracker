# Passive Health Data Sync - Feature Documentation

## Overview

The passive health data sync feature allows the app to request access to health-related data (activity, sleep, energy) and use it to provide smarter, more personalized sugar insights.

**Privacy-First Approach:** Raw health numbers are NEVER displayed to users. All biometric data is converted to friendly context labels before being used.

---

## How It Works

### 1. Permission Flow

**First Time User:**
1. User opens the app
2. Sees `HealthPermissionCard` asking for permission
3. Two options:
   - **"Allow Access"** → Grants permission, shows success animation
   - **"Maybe Later"** → Declines, card disappears

**After Permission Granted:**
- Card never shows again
- Health context is simulated in the background
- Insights automatically become smarter

**"Maybe Later" Soft Reminder:**
- Card disappears
- Will re-appear after 3 sessions
- User can still use app normally

---

### 2. Data Conversion (Privacy-First)

**Raw Data → Context Labels**

The app simulates:
- Steps count (e.g., 3,500 steps)
- Sleep hours (e.g., 5.5 hours)
- Heart rate (e.g., 85 bpm)

Then **immediately converts** to context labels:

```javascript
{
  activityLevel: "low" | "moderate" | "high",
  recoveryState: "needs_rest" | "normal" | "recovered",
  energyState: "low" | "stable" | "high"
}
```

**Raw numbers are never stored or displayed!**

---

### 3. Enhanced Insights

#### Example: Low Activity
> "Since today has been less active, sugar may impact your energy more.  
> 💡 Take a 10-minute walk to help process the sugar."

#### Example: Low Recovery
> "On lower sleep days, sugar can affect recovery more.  
> 💡 Drink a glass of water and prioritize rest tonight."

#### Example: Low Energy
> "You might be feeling fatigued. Sugar won't help long-term.  
> 💡 Have a light protein snack (nuts, yogurt) instead."

---

## Testing

### Open the app
- Should see permission card
- Click "Allow Access"
- Success animation appears
- Log sugar → See enhanced insight

---

**Privacy-First. Context-Aware. User-Friendly.** 🎉
