require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Start daily reminder cron job
const { startDailyReminderCron } = require('./jobs/dailyReminderCron');
startDailyReminderCron();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/gamification', require('./routes/gamification'));
app.use('/api/health', require('./routes/health'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/api/health-check', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
