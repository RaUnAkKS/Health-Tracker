import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { gamificationAPI } from '../utils/api';

const useGameStore = create(
    persist(
        (set, get) => ({
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
            lastSeenLevel: 1, // Track the last level the user saw validated

            // Latest XP gain (for animation)
            latestXPGain: null,

            // Latest achievement (for toast)
            latestAchievement: null,

            // Set gamification data
            setGamificationData: (data) => {
                set({
                    xp: data.xp || 0,
                    level: data.level || 1,
                    // lastSeenLevel: data.level || 1, // Don't auto-sync, let persistence handle it
                    currentStreak: data.currentStreak || 0,
                    longestStreak: data.longestStreak || 0,
                    totalLogs: data.totalLogs || 0,
                    achievements: data.achievements || [],
                    lastLogDate: data.lastLogDate,
                });
            },

            // Acknowledge level up
            acknowledgeLevelUp: () => {
                set((state) => ({ lastSeenLevel: state.level }));
            },

            // Award XP (from log response)
            awardXP: (xpAmount, newAchievement = null) => {
                set((state) => {
                    const newXP = state.xp + xpAmount;

                    // Progressive Leveling Formula:
                    // L1 -> L2: 25 XP
                    // L2 -> L3: 50 XP (Total: 75)
                    // L3 -> L4: 75 XP (Total: 150)
                    //
                    // XP required for Level L = 12.5 * L * (L - 1)
                    // Level L = (1 + sqrt(1 + 0.32 * XP)) / 2  (Derived quadratic formula approximation)
                    // Using a simpler loop or iterative approach for accuracy with small numbers:

                    let level = 1;
                    let xpForNext = 25;
                    let currentTotal = 0;

                    while (newXP >= currentTotal + xpForNext) {
                        currentTotal += xpForNext;
                        level++;
                        xpForNext += 25;
                    }

                    return {
                        xp: newXP,
                        level: level,
                        latestXPGain: xpAmount,
                        latestAchievement: newAchievement,
                    };
                });

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
                set((state) => ({
                    currentStreak: streakData.currentStreak || state.currentStreak,
                    streakAtRisk: false,
                    loggedToday: true
                }));
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
                    const { data } = await gamificationAPI.getGamificationData();

                    // Calculate level from backend XP using same formula
                    let level = 1;
                    let xpForNext = 25;
                    let currentTotal = 0;
                    const xp = data.xp || 0;

                    while (xp >= currentTotal + xpForNext) {
                        currentTotal += xpForNext;
                        level++;
                        xpForNext += 25;
                    }

                    // On initial fetch ONLY (if level is 1 and data says >1), we might want to sync
                    // BUT with persistence, level will be restored.
                    // If we blindly update level here, it's fine.

                    set({
                        xp: xp,
                        level: level, // Use calculated level
                        currentStreak: data.currentStreak
                    });
                } catch (error) {
                    console.error('Failed to fetch gamification data:', error);
                }
            },
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
                    lastSeenLevel: 1,
                    latestXPGain: null,
                    latestAchievement: null,
                });
            },
        }),
        {
            name: 'health-tracker-game-storage',
            getStorage: () => localStorage,
        }
    )
);

export default useGameStore;
