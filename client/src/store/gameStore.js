import { create } from 'zustand';
import { gamificationAPI } from '../utils/api';

const useGameStore = create((set, get) => ({
    // Gamification state
    xp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    totalLogs: 0,
    achievements: [],
    lastLogDate: null,
    loggedToday: false,
    streakAtRisk: false,

    // Latest XP gain (for animation)
    latestXPGain: null,

    // Latest achievement (for toast)
    latestAchievement: null,

    // Set gamification data
    setGamificationData: (data) => {
        set({
            xp: data.xp || 0,
            level: data.level || 1,
            currentStreak: data.currentStreak || 0,
            longestStreak: data.longestStreak || 0,
            totalLogs: data.totalLogs || 0,
            achievements: data.achievements || [],
            lastLogDate: data.lastLogDate,
        });
    },

    // Award XP (from log response)
    awardXP: (xpAmount, newAchievement = null) => {
        set((state) => ({
            xp: state.xp + xpAmount,
            level: Math.floor((state.xp + xpAmount) / 100) + 1,
            latestXPGain: xpAmount,
            latestAchievement: newAchievement,
        }));

        // Clear latest gains after animation
        setTimeout(() => {
            set({ latestXPGain: null });
        }, 2000);

        if (newAchievement) {
            setTimeout(() => {
                set({ latestAchievement: null });
            }, 5000);
        }
    },

    // Update streak
    updateStreak: (streakData) => {
        set({
            currentStreak: streakData.currentStreak,
            longestStreak: Math.max(
                get().longestStreak,
                streakData.currentStreak
            ),
        });
    },

    // Add achievement
    addAchievement: (achievement) => {
        set((state) => ({
            achievements: [...state.achievements, achievement],
            latestAchievement: achievement,
        }));

        setTimeout(() => {
            set({ latestAchievement: null });
        }, 5000);
    },

    // Fetch gamification data from API
    fetchGamificationData: async () => {
        try {
            const response = await gamificationAPI.getGamificationData();
            get().setGamificationData(response.data);
            return { success: true };
        } catch (error) {
            console.error('Error fetching gamification data:', error);
            return { success: false, error: error.message };
        }
    },

    // Fetch streak status
    fetchStreakStatus: async () => {
        try {
            const response = await gamificationAPI.getStreakStatus();
            set({
                currentStreak: response.data.currentStreak,
                loggedToday: response.data.loggedToday,
                streakAtRisk: response.data.streakAtRisk,
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching streak status:', error);
            return { success: false, error: error.message };
        }
    },

    // Clear gamification data (on logout)
    clearGameData: () => {
        set({
            xp: 0,
            level: 1,
            currentStreak: 0,
            longestStreak: 0,
            totalLogs: 0,
            achievements: [],
            lastLogDate: null,
            loggedToday: false,
            streakAtRisk: false,
            latestXPGain: null,
            latestAchievement: null,
        });
    },
}));

export default useGameStore;
