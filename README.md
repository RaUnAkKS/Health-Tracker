# SpikeIQ

**Scientific Sugar Tracking & AI Insights**

SpikeIQ is a modern, full-stack health application designed to help users manage their sugar intake through real-time logging, gamification, and AI-driven insights. It combines behavioral psychology (streaks, variable rewards) with hard data to build healthier habits.

## ✨ Features

- **🚀 Smart Logging**: Log common items (Chai, Sweets) in one tap or use **Voice Logging** for hands-free entry.
- **⚡ Fast Uploads**: Client-side image compression for instant photo logging.
- **🧠 Sugar Intelligence**: Personalized AI feed that analyzes your habits and gives actionable advice.
- **🔥 Streak System**: Build consistency with a powerful daily streak mechanic.
- **🎮 Gamification**: Earn XP, level up, and unlock milestones (Day 3, 7, 30).
- **📅 Visual History**: Monthly calendar view to track your long-term progress.
- **🔔 Smart Reminders**: Automated emails to save your streak if you forget to log.
- **📱 Mobile-First**: Fully responsive design with smooth animations and dark mode.

## 🔗 Live Demo
- **Frontend**: [health-tracker-fawn.vercel.app](https://health-tracker-fawn.vercel.app)
- **Backend API**: [spikeiq-server.onrender.com](https://spikeiq-server.onrender.com)

---

## 🧠 AI & Machine Learning Architecture

SpikeIQ uses a hybrid approach of **Rule-Based Systems** and **Cloud AI** to deliver its features:

1.  **Sugar Intelligence Engine (Rule-Based Expert System)**
    -   **File**: `server/services/insightEngine.js`
    -   **Function**: Analyzes user logs, streaks, and time-of-day patterns against a knowledge base of 150+ health facts.
    -   **Output**: Context-aware recommendations (e.g., "High sugar morning" -> "Suggest protein-heavy lunch").

2.  **Visual Food Recognition (Google Cloud Vision API)**
    -   **Integration**: `server/services/foodDetectionService.js`
    -   **Function**: When users upload a photo, image classification models identify the food item.
    -   **Output**: Automatic tagging (e.g., "Chocolate Cake") to suggest sugar content.

3.  **Voice Processing (Web Speech API)**
    -   **Integration**: `client/src/utils/voiceParser.js`
    -   **Function**: Uses browser-native NLP to transcribe speech.
    -   **Logic**: Regex-based parsing extracts food items and quantities (e.g., "Had 2 cups of tea" -> `{ item: "tea", qty: 2 }`).

---

## 🛠️ Tech Stack

**Frontend**
- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS
- **State**: Zustand (with persistence)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP**: Axios

**Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Mongoose)
- **Auth**: JWT (JSON Web Tokens)
- **Storage**: Cloudinary (Image upload)
- **Email**: Nodemailer (Streak reminders)
- **Scheduling**: Node-Cron

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB Atlas** account (or local MongoDB)
- **Cloudinary** account (for images)
- **Gmail Account** (for email reminders - requires App Password)

### 1. Installation

Clone the repo and install dependencies for both client and server:

```bash
git clone https://github.com/RaUnAkKS/Health-Tracker.git
cd Health-Tracker

# Install root, client, and server dependencies
npm run install-all
```

### 2. Environment Variables

You need to create **two** `.env` files.

**A. Server Config (`server/.env`)**
Create this file in the `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/spikeiq
JWT_SECRET=your_super_secret_key_change_this_to_something_random
NODE_ENV=development

# Cloudinary (for Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (for Streak Reminders)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
```

**B. Client Config (`client/.env`)**
Create this file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Running Locally

Start both the frontend and backend with a single command:

```bash
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000`

---

## 🌐 Deployment

### Backend (Render)
1.  Connect your GitHub repo to **Render**.
2.  Select the `server` directory as the generic **Root Directory**.
3.  **Build Command**: `npm install`
4.  **Start Command**: `node server.js`
5.  Add all environment variables from `server/.env` to Render's Environment dashboard.

### Frontend (Vercel)
1.  Connect your GitHub repo to **Vercel**.
2.  Select the `client` directory as the **Root Directory**.
3.  **Build Command**: `npm run build`
4.  **Output Directory**: `dist`
5.  Add `VITE_API_URL` environment variable (set it to your Render Backend URL).

### ⚡ Optimization (Optional)
To keep the free Render server awake 24/7, set up **UptimeRobot** to ping the backend URL (`/`) every 5 minutes.

---

## 📂 Project Structure

```
Health-Tracker/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Main route pages
│   │   ├── store/         # State management (Zustand)
│   │   ├── utils/         # Helpers (Image compression, API)
│   │   └── App.jsx        # Routing & Layout
│   └── vite.config.js
│
├── server/                 # Express Backend
│   ├── config/            # DB & Cloudinary connection
│   ├── controllers/       # Route logic
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoints
│   ├── services/          # Email, Cron, Cloudinary logic
│   └── server.js          # Entry point
│
└── package.json           # Root scripts
```

---

## 🤝 Contributing

This is a portfolio/hackathon project. Feel free to fork it!
If you find a bug, please submit an issue.
