# 🚀 Quick Start Guide

## Prerequisites

Before running the application, make sure you have:

- **Node.js** (v18 or higher) - [Download Here](https://nodejs.org/)
- **MongoDB** - Either:
  - Local MongoDB running on port 27017, OR
  - MongoDB Atlas account (free tier works!)

---

## ⚡ Quick Setup (3 Steps)

### 1. Install Dependencies

Open terminal in the project root directory and run:

```bash
npm run install-all
```

This installs dependencies for both client and server.

---

### 2. Configure MongoDB

**Option A: Local MongoDB**
- Make sure MongoDB is running on `mongodb://localhost:27017`
- No changes needed to `.env` file

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `server/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sugar-tracker
   ```

---

### 3. Start the Application

```bash
npm run dev
```

This command starts both servers:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

🎉 **That's it!** Open your browser to http://localhost:5173

---

## 📱 Testing the App

### First Time User Flow

1. **Onboarding** (4 steps):
   - Enter date of birth
   - Enter height (cm)
   - Enter weight (kg)
   - Select gender

2. **Dashboard**:
   - View your streak counter 🔥
   - Check XP and level
   - See today's sugar summary

3. **Log Sugar** (under 10 seconds):
   - Tap any preset card (Chai, Sweets, Cold Drink, Snack)
   - Get instant feedback with sound

4. **Get AI Insight**:
   - Automatic navigation to insight screen
   - Read personalized recommendation
   - Complete corrective action for bonus XP!

5. **Build Streak**:
   - Come back tomorrow
   - Log again to maintain your streak
   - Unlock achievements at Days 1, 3, 7, 30

---

## 🎨 Features to Try

✅ **Quick Logging** - Tap preset cards to log sugar in <10 seconds  
✅ **Streak System** - Build daily streaks with loss aversion messaging  
✅ **XP Rewards** - Earn variable XP with bonuses for early logs and quick actions  
✅ **AI Insights** - Get context-aware recommendations based on your profile  
✅ **Dark Mode** - Toggle in the header (moon/sun icon)  
✅ **Achievement Toasts** - Unlock milestones with celebrations  
✅ **Account Upgrade** - Go to Profile → "Upgrade Account" to link email  

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Make sure MongoDB is running
- Check the `MONGODB_URI` in `server/.env`
- For local MongoDB: `mongodb://localhost:27017/sugar-tracker`

### "Port already in use"
- Change ports in `.env` files:
  - Client: Update Vite port in `client/vite.config.js`
  - Server: Update `PORT` in `server/.env`

### "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules client/node_modules server/node_modules
npm run install-all
```

### Assets not loading
```bash
# Clear browser cache or open in incognito mode
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

---

## 🔧 Development Commands

```bash
# Install all dependencies
npm run install-all

# Run both client and server
npm run dev

# Run only client (from root)
npm run client

# Run only server (from root)
npm run server

# Build client for production
cd client && npm run build

# Preview production build
cd client && npm run preview
```

---

## 📂 Project Structure

```
Health-Tracker/
├── client/              # React frontend (port 5173)
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components with routing
│   │   ├── store/      # Zustand state management
│   │   ├── utils/      # Helper functions
│   │   └── App.jsx     # Main app with routing
│   └── package.json
│
├── server/              # Express backend (port 5000)
│   ├── models/         # MongoDB schemas
│   ├── controllers/    # Route handlers
│   ├── services/       # Business logic (AI, gamification)
│   ├── routes/         # API endpoints
│   └── server.js       # Express server
│
└── package.json         # Root workspace
```

---

## 🎯 Next Steps

Once the app is running:

1. ✅ Complete onboarding
2. ✅ Log your first sugar intake
3. ✅ Check out your AI-generated insight
4. ✅ Complete a corrective action for bonus XP
5. ✅ Toggle dark mode
6. ✅ Check your history
7. ✅ Update your profile settings

---

## 💡 Tips for Best Experience

- **Mobile Testing:** Use Chrome DevTools (F12 → Toggle device toolbar)
- **Sound Effects:** Make sure your browser allows audio
- **Animations:** For best performance, use Chrome or Edge
- **Dark Mode:** Automatically respects your system preference

---

## 🚀 Ready for Hackathon Demo

The app is production-ready with:
- ✅ Complete full-stack implementation
- ✅ Stunning UI with animations
- ✅ Real AI insight generation
- ✅ Psychology-based gamification
- ✅ Mobile-first responsive design
- ✅ Fast performance (<10s logging)

---

**Need help?** Check the main [README.md](../README.md) or [walkthrough.md](walkthrough.md) for detailed documentation.

**Happy tracking! 🍬⚡**
