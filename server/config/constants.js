// Gamification constants
module.exports = {
    // XP values for different actions
    XP: {
        BASE_LOG: 5,
        EARLY_LOG: 3, // Before 6 PM
        CORRECTIVE_ACTION: 7,
        STREAK_BONUS: 2, // Per consecutive day
        QUICK_ACTION: 5, // Completing action within 30 min
    },

    // Streak milestones
    MILESTONES: {
        FIRST_LOG: 1,
        THREE_DAYS: 3,
        WEEK: 7,
        MONTH: 30,
    },

    // Achievement messages
    ACHIEVEMENTS: {
        1: { emoji: '🎉', message: 'First log! You\'re on your way!' },
        3: { emoji: '🔥', message: '3-day streak! You\'re building a habit!' },
        7: { emoji: '⭐', message: 'One week strong! Amazing progress!' },
        30: { emoji: '🏆', message: '30 days! You\'re a sugar tracking champion!' },
    },

    // Sugar log presets (in grams)
    SUGAR_PRESETS: {
        CHAI: { name: 'Chai', sugar: 10, icon: '☕' },
        SWEETS: { name: 'Sweets', sugar: 25, icon: '🍰' },
        COLD_DRINK: { name: 'Cold Drink', sugar: 39, icon: '🥤' },
        PACKAGED_SNACK: { name: 'Packaged Snack', sugar: 15, icon: '🍪' },
    },

    // Daily sugar limit (WHO recommendation: 25g for women, 36g for men)
    DAILY_LIMIT: {
        FEMALE: 25,
        MALE: 36,
        DEFAULT: 30,
    },

    // Activity levels (steps)
    ACTIVITY: {
        LOW: 3000,
        MEDIUM: 7000,
        HIGH: 10000,
    },

    // Sleep hours
    SLEEP: {
        POOR: 6,
        ADEQUATE: 7,
        GOOD: 8,
    },

    // BMI categories
    BMI: {
        UNDERWEIGHT: 18.5,
        NORMAL: 24.9,
        OVERWEIGHT: 29.9,
        // Above 30 is obese
    },
};
