# 🚀 Deployment Guide: SpikeIQ

This guide will help you deploy your **SpikeIQ** application to the web.

## 1. Backend Deployment (Render)

We will deploy the Node.js server first so we can get the API URL.

1.  **Push to GitHub**: Ensure your latest code is on GitHub (you already did this!).
2.  **Sign Up/Login to Render**: Go to [dashboard.render.com](https://dashboard.render.com/).
3.  **New Web Service**:
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository (`Health-Tracker`).
4.  **Configuration**:
    *   **Name**: `spikeiq-server` (or similar).
    *   **Root Directory**: `server` (Important!).
    *   **Environment**: `Node`.
    *   **Build Command**: `npm install`.
    *   **Start Command**: `npm start`.
5.  **Environment Variables**:
    *   Scroll down to **Advanced** -> **Environment Variables**.
    *   Add the following keys (Copy values from your `server/.env` file):
        *   `MONGODB_URI` (Your Atlas connection string)
        *   `JWT_SECRET`
        *   `CLOUDINARY_CLOUD_NAME`
        *   `CLOUDINARY_API_KEY`
        *   `CLOUDINARY_API_SECRET`
        *   `GOOGLE_CLOUD_VISION_API_KEY`
        *   `EMAIL_USER`
        *   `EMAIL_PASSWORD`
        *   `CLIENT_URL` (Set this to your *future* Vercel URL, e.g., `https://spikeiq.vercel.app`, or update it later).
6.  **Deploy**: Click **Create Web Service**.
7.  **Copy URL**: Once deployed, copy the URL (e.g., `https://spikeiq-server.onrender.com`). You will need this for the frontend.

---

## 2. Frontend Deployment (Vercel)

Now we deploy the React client.

1.  **Sign Up/Login to Vercel**: Go to [vercel.com](https://vercel.com).
2.  **Add New Project**:
    *   Click **Add New...** -> **Project**.
    *   Import your `Health-Tracker` repository.
3.  **Configure Project**:
    *   **Framework Preset**: Vite (should auto-detect).
    *   **Root Directory**: Click `Edit` and select `client`.
4.  **Environment Variables**:
    *   Add a new variable:
        *   **Name**: `VITE_API_URL`
        *   **Value**: The Render URL you copied earlier **PLUS** `/api` (unless your backend handles `/` for API).
        *   *Example*: `https://spikeiq-server.onrender.com/api`
5.  **Deploy**: Click **Deploy**.

## 3. Final Connection

1.  **Update Backend**: Go back to Render Dashboard -> Environment Variables.
2.  **Set CLIENT_URL**: Update `CLIENT_URL` to your new Vercel domain (e.g., `https://health-tracker-xy7z.vercel.app`).
    *   This ensures email links point to the correct live site!
3.  **Redeploy Backend**: Render might need a manual redeploy for the env var to take effect (usually auto-restarts).

## 4. Verification

*   Open your Vercel URL.
*   Sign up/Login (Database is Cloud MongoDB, so it persists!).
*   Test an upload (Cloudinary).
*   Test an email (Streak reminder).

🎉 **You are live!**
