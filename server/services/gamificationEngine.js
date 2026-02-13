const User = require('../models/User');
const SugarLog = require('../models/SugarLog');
const { XP, MILESTONES, ACHIEVEMENTS } = require('../config/constants');

/**
 * Gamification engine for calculating XP, streaks, and achievements
 */

/**
 * Calculate XP for a sugar log with variable rewards
 * 60% chance → +3 XP
 * 30% chance → +5 XP
 * 10% chance → +10 XP (Surprise Bonus!)
 */
const calculateXP = (context) => {
    const random = Math.random();
    let baseXP;
    let isBonus = false;

    if (random < 0.6) {
        // 60% chance: +3 XP
        baseXP = 3;
    } else if (random < 0.9) {
        // 30% chance: +5 XP
        baseXP = 5;
    } else {
        // 10% chance: +10 XP (Surprise Bonus!)
        baseXP = 10;
        isBonus = true;
    }

    let totalXP = baseXP;

    // Early log bonus (before 6 PM)
    const hour = new Date().getHours();
    if (hour < 18) {
        totalXP += 1; // Small early bonus
    }

    // Streak bonus
    if (context.currentStreak && context.currentStreak > 0) {
        totalXP += Math.min(Math.floor(context.currentStreak / 3), 3); // +1 per 3 days, cap at +3
    }

    return {
        totalXP,
        baseXP,
        isBonus,
    };
};

/**
 * Update user streak
 */
const updateStreak = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastLogDate = user.gamification.lastLogDate
            ? new Date(user.gamification.lastLogDate)
            : null;

        if (lastLogDate) {
            lastLogDate.setHours(0, 0, 0, 0);
            const daysDiff = Math.floor((today - lastLogDate) / (1000 * 60 * 60 * 24));

            if (daysDiff === 0) {
                // Already logged today, no streak change
                return {
                    currentStreak: user.gamification.currentStreak,
                    isNewAchievement: false,
                };
            } else if (daysDiff === 1) {
                // Next day, increment streak
                user.gamification.currentStreak += 1;
            } else {
                // Broke streak
                user.gamification.currentStreak = 1;
            }
        } else {
            // First ever log
            user.gamification.currentStreak = 1;
        }

        // Update longest streak if current is higher
        if (
            user.gamification.currentStreak > user.gamification.longestStreak
        ) {
            user.gamification.longestStreak = user.gamification.currentStreak;
        }

        // Update last log date
        user.gamification.lastLogDate = new Date();
        user.gamification.totalLogs += 1;

        // Check for milestone achievements
        const newAchievement = checkMilestone(
            user.gamification.currentStreak,
            user.gamification.achievements
        );

        if (newAchievement) {
            user.gamification.achievements.push(newAchievement);
        }

        await user.save();

        return {
            currentStreak: user.gamification.currentStreak,
            isNewAchievement: !!newAchievement,
            achievement: newAchievement,
        };
    } catch (error) {
        console.error('Error updating streak:', error);
        throw error;
    }
};

/**
 * Check if current streak hits a milestone
 */
const checkMilestone = (currentStreak, existingAchievements) => {
    // Check if this milestone already exists
    const milestoneValues = Object.values(MILESTONES);

    if (milestoneValues.includes(currentStreak)) {
        const alreadyUnlocked = existingAchievements.some(
            (ach) => ach.milestone === currentStreak
        );

        if (!alreadyUnlocked) {
            const achievement = ACHIEVEMENTS[currentStreak];
            return {
                milestone: currentStreak,
                unlockedAt: new Date(),
                emoji: achievement.emoji,
                message: achievement.message,
            };
        }
    }

    return null;
};

/**
 * Award XP to user
 */
const awardXP = async (userId, xpAmount) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        user.gamification.xp += xpAmount;

        // Level up logic (100 XP per level)
        const newLevel = Math.floor(user.gamification.xp / 100) + 1;
        user.gamification.level = newLevel;

        await user.save();

        return {
            xp: user.gamification.xp,
            level: user.gamification.level,
            xpGained: xpAmount,
        };
    } catch (error) {
        console.error('Error awarding XP:', error);
        throw error;
    }
};

/**
 * Award bonus XP for completing corrective action quickly
 */
const awardCorrectiveActionXP = async (sugarLogId, userId) => {
    try {
        const sugarLog = await SugarLog.findById(sugarLogId);
        if (!sugarLog) throw new Error('Sugar log not found');

        const now = new Date();
        const logTime = new Date(sugarLog.createdAt);
        const minutesDiff = (now - logTime) / (1000 * 60);

        // Randomized XP Reward
        // 60% -> +3 XP
        // 30% -> +5 XP
        // 10% -> +10 XP
        const rand = Math.random();
        let bonusXP = 3;
        if (rand > 0.9) bonusXP = 10;
        else if (rand > 0.6) bonusXP = 5;

        // Update log
        sugarLog.correctiveActionCompleted = true;
        sugarLog.correctiveActionCompletedAt = now;
        sugarLog.xpAwarded = bonusXP;
        await sugarLog.save();

        // Award XP
        const result = await awardXP(userId, bonusXP);

        return {
            xpGained: bonusXP,
            // wasQuick no longer needed, but keeping for frontend compatibility if needed
            wasQuick: bonusXP >= 10,
            xp: result.xp,
            level: result.level,
        };
    } catch (error) {
        console.error('Error awarding corrective action XP:', error);
        throw error;
    }
};

module.exports = {
    calculateXP,
    updateStreak,
    awardXP,
    awardCorrectiveActionXP,
    checkMilestone,
};
