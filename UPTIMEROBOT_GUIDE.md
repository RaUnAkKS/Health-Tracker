# ⏰ Keep Server Alive 24/7 (UptimeRobot)

Since you are using the **Free Tier** of Render, your server "goes to sleep" after 15 minutes of inactivity. This causes the 50-second delay when you open the app.

To fix this, we use **UptimeRobot** to "ping" your server every 5 minutes, forcing it to stay awake.

## Steps

1.  **Sign Up**: Go to [uptimerobot.com](https://uptimerobot.com/) and create a free account.
2.  **Create New Monitor**:
    *   Click **+ Add New Monitor**.
    *   **Monitor Type**: Select **HTTP(s)**.
    *   **Friendly Name**: `SpikeIQ Server`
    *   **URL (or IP)**: Paste your **Render Backend URL** (e.g., `https://spikeiq-server.onrender.com`).
        *   *Note: You can just use the base URL because I added a special route at `/` that says "SpikeIQ Server is Running!".*
    *   **Monitoring Interval**: Set to **5 minutes** (Important! This prevents sleep).
    *   **Monitor Timeout**: Leave as default (30s).
3.  **Finish**: Click **Create Monitor**.

## ✅ Done!
UptimeRobot will now visit your server every 5 minutes.
*   **Result**: Your app will be **instantly fast** every time you open it, 24/7! 🚀
