# SpikeIQ 🍬⚡

**Real-Time, Context-Aware Nudges for Healthier Choices**

A mobile-first, gamified health tracking web application that helps users reduce sugar intake through real-time logging, AI-driven insights, and psychology-based engagement features.

## ✨ Features

- 🎮 **Gamified Onboarding** - No signup required, one question per screen
- ⚡ **Fast Sugar Logging** - Log sugar in under 10 seconds with preset cards
- 🔥 **Daily Streak System** - Build habits with loss aversion psychology
- 🤖 **AI-Powered Insights** - Context-aware personalized recommendations
- 📱 **Mobile-First Design** - Responsive, smooth animations, dark mode support
- 🎯 **Variable Rewards** - Dynamic XP system to increase engagement
- 🏆 **Achievement Milestones** - Celebrate progress at Days 1, 3, 7, 30

## 🛠️ Tech Stack

### Frontend
- React 18 with Vite
- TailwindCSS for styling
- Framer Motion for animations
- Zustand for state management
- Axios for API calls

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT authentication (optional signup)
- Rule-based AI insight engine

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Health-Tracker
```

2. Install all dependencies
```bash
npm run install-all
```

3. Set up environment variables

**Client (.env in client folder):**
```env
VITE_API_URL=http://localhost:5000/api
```

**Server (.env in server folder):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sugar-tracker
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

4. Run the application
```bash
npm run dev
```

This will start:
- Frontend at `http://localhost:5173`
- Backend at `http://localhost:5000`

## 📁 Project Structure

```
Health-Tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── store/         # Zustand state management
│   │   ├── utils/         # Helper functions
│   │   └── assets/        # Images, sounds, icons
│   └── package.json
├── server/                # Express backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── controllers/      # Route handlers
│   ├── services/         # Business logic
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   └── package.json
└── package.json          # Root workspace config
```

## 🎯 Usage

1. **First Visit**: Complete the gamified onboarding (age, height, weight, gender)
2. **Log Sugar**: Tap preset cards (Chai, Sweets, Cold Drink, Snacks)
3. **Get Insights**: Receive personalized AI recommendations
4. **Build Streaks**: Log daily to maintain your streak 🔥
5. **Earn XP**: Complete corrective actions for bonus points
6. **Optional Signup**: Unlock cross-device sync after experiencing value

## 🧪 Testing

```bash
# Frontend build test
cd client && npm run build

# Backend tests (if implemented)
cd server && npm test
```

## 📱 Mobile Testing

Use browser DevTools to test mobile responsiveness:
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device presets
4. Test touch interactions and animations

## 🎨 Design Philosophy

- **Loss Aversion**: Streaks create commitment
- **Instant Gratification**: Animations + sounds on every action
- **Variable Rewards**: Unpredictable XP to boost engagement
- **Habit Loop Design**: Cue → Routine → Reward

## 🏗️ Development

### Adding New Features

1. Create backend route in `server/routes/`
2. Add controller logic in `server/controllers/`
3. Create frontend component in `client/src/components/`
4. Add to relevant page in `client/src/pages/`
5. Update Zustand store if needed

### Code Style

- Use ES6+ syntax
- Component names in PascalCase
- File names match component names
- Keep components focused and reusable

## 📄 License

ISC

## 🤝 Contributing

This is a hackathon project. Feel free to fork and experiment!

---

**Built with ❤️ for healthier choices**
