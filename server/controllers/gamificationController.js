const User = require('../models/User');

/**
 * @desc    Get user gamification data
 * @route   GET /api/gamification
 * @access  Private
 */
const getGamificationData = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            xp: user.gamification.xp,
            level: user.gamification.level,
            currentStreak: user.gamification.currentStreak,
            longestStreak: user.gamification.longestStreak,
            totalLogs: user.gamification.totalLogs,
            achievements: user.gamification.achievements,
            lastLogDate: user.gamification.lastLogDate,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Get streak status (for daily reminder)
 * @route   GET /api/gamification/streak
 * @access  Private
 */
const getStreakStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastLogDate = user.gamification.lastLogDate
            ? new Date(user.gamification.lastLogDate)
            : null;

        let loggedToday = false;
        let streakAtRisk = false;

        if (lastLogDate) {
            lastLogDate.setHours(0, 0, 0, 0);
            const daysDiff = Math.floor((today - lastLogDate) / (1000 * 60 * 60 * 24));

            loggedToday = daysDiff === 0;
            streakAtRisk = daysDiff >= 1 && user.gamification.currentStreak > 0;
        }

        res.json({
            currentStreak: user.gamification.currentStreak,
            loggedToday,
            streakAtRisk,
            message: loggedToday
                ? `${user.gamification.currentStreak} day streak! 🔥`
                : streakAtRisk
                    ? `Log today to protect your ${user.gamification.currentStreak}-day streak! 🔥`
                    : 'Start your streak today!',
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getGamificationData,
    getStreakStatus,
};
