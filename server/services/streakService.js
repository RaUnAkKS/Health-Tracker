const User = require('../models/User');

/**
 * Streak Service - Handles all streak-related logic
 * Implements daily ritual and habit formation system
 */

/**
 * Calculate and update user's streak
 * Called after every log creation
 */
const calculateStreak = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { success: false, error: 'User not found' };
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const lastLogDate = user.gamification?.lastLogDate
            ? new Date(user.gamification.lastLogDate)
            : null;

        let newStreak = user.gamification?.currentStreak || 0;
        let milestoneHit = null;

        if (!lastLogDate) {
            // First ever log
            newStreak = 1;
        } else {
            const lastLog = new Date(
                lastLogDate.getFullYear(),
                lastLogDate.getMonth(),
                lastLogDate.getDate()
            );

            const daysDiff = Math.floor((today - lastLog) / (1000 * 60 * 60 * 24));

            if (daysDiff === 0) {
                // Logged today already - no change
                newStreak = user.gamification.currentStreak;
            } else if (daysDiff === 1) {
                // Logged yesterday - increment streak
                newStreak = user.gamification.currentStreak + 1;
            } else {
                // Missed a day - reset streak
                newStreak = 1;
            }
        }

        // Update user's streak
        user.gamification.currentStreak = newStreak;
        user.gamification.longestStreak = Math.max(
            newStreak,
            user.gamification.longestStreak || 0
        );
        user.gamification.lastLogDate = now;

        // Check for milestone achievements
        if (newStreak === 3 && !user.gamification.milestones.day3) {
            user.gamification.milestones.day3 = true;
            milestoneHit = 3;
        } else if (newStreak === 7 && !user.gamification.milestones.day7) {
            user.gamification.milestones.day7 = true;
            milestoneHit = 7;
        } else if (newStreak === 30 && !user.gamification.milestones.day30) {
            user.gamification.milestones.day30 = true;
            milestoneHit = 30;
        }

        await user.save();

        console.log(`[Streak] User ${userId}: ${newStreak} days${milestoneHit ? ` (Milestone: ${milestoneHit})` : ''}`);

        return {
            success: true,
            streak: newStreak,
            longestStreak: user.gamification.longestStreak,
            milestone: milestoneHit,
        };
    } catch (error) {
        console.error('[Streak] Calculation error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get motivational message based on context
 */
const getMotivationalMessage = (context) => {
    const {
        streak,
        activityLevel,
        recoveryState,
        energyState,
        sugarAmount
    } = context;

    // Milestone messages (highest priority)
    if (streak === 3) {
        return "🔥 3-day streak! Your discipline is building.";
    }
    if (streak === 7) {
        return "7 days strong. Your body is thanking you.";
    }
    if (streak === 30) {
        return "30 days! You're officially sugar-aware.";
    }

    // Health context messages
    if (activityLevel === 'low' && sugarAmount > 20) {
        return "Balance it out — try a 10-minute walk.";
    }

    if (recoveryState === 'needs_rest' && energyState === 'low') {
        return "Low sleep + sugar can reduce focus. Hydrate well today.";
    }

    if (activityLevel === 'low') {
        return "Your body needs movement. A short walk can help.";
    }

    if (energyState === 'low') {
        return "Feeling low energy? Hydration and movement can help more than sugar.";
    }

    // Healthy behavior
    if (sugarAmount < 15 && activityLevel === 'high') {
        return "Nice control today. Keep it steady.";
    }

    // Default encouraging message
    const defaultMessages = [
        "Small steps. Big impact.",
        "You're in control.",
        "Building better habits, one day at a time.",
        "Your future self will thank you.",
    ];

    return defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
};

/**
 * Check if user has logged today
 */
const hasLoggedToday = (user) => {
    if (!user.gamification?.lastLogDate) {
        return false;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastLog = new Date(user.gamification.lastLogDate);
    const lastLogDay = new Date(
        lastLog.getFullYear(),
        lastLog.getMonth(),
        lastLog.getDate()
    );

    return today.getTime() === lastLogDay.getTime();
};

/**
 * Get progress to next milestone
 */
const getProgressToNextMilestone = (currentStreak) => {
    let nextMilestone;
    let progress;

    if (currentStreak < 3) {
        nextMilestone = 3;
        progress = (currentStreak / 3) * 100;
    } else if (currentStreak < 7) {
        nextMilestone = 7;
        progress = ((currentStreak - 3) / 4) * 100;
    } else if (currentStreak < 30) {
        nextMilestone = 30;
        progress = ((currentStreak - 7) / 23) * 100;
    } else {
        nextMilestone = currentStreak + 10;  // After 30, milestones are every 10 days
        const base = Math.floor((currentStreak - 30) / 10) * 10 + 30;
        progress = ((currentStreak - base) / 10) * 100;
    }

    return {
        nextMilestone,
        progress: Math.min(Math.round(progress), 100),
        daysRemaining: nextMilestone - currentStreak,
    };
};

module.exports = {
    calculateStreak,
    getMotivationalMessage,
    hasLoggedToday,
    getProgressToNextMilestone,
};
