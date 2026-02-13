import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '../utils/storage';
import { authAPI } from '../utils/api';
import { getDeviceId } from '../utils/deviceId';
import { calculateBMI } from '../utils/healthCalculations';

const useUserStore = create(
    persist(
        (set, get) => ({
            // User state
            user: null,
            token: null,
            isAnonymous: true,
            isOnboarded: false,
            onboardingData: {
                dateOfBirth: null,
                height: null,
                weight: null,
                weight: null,
                gender: null,
            },
            bookmarks: [], // Store bookmarked insight IDs
            savedInsights: [], // Store full objects for dynamic insights

            // Set user data
            setUser: (userData) => {
                set({ user: userData, isAnonymous: userData.isAnonymous });
            },

            // Set token
            setToken: (token) => {
                set({ token });
                storage.set('authToken', token);
            },

            // Update onboarding data
            updateOnboardingData: (data) => {
                set((state) => ({
                    onboardingData: { ...state.onboardingData, ...data },
                }));
            },

            // Toggle bookmark for an insight
            toggleBookmark: (insightId, insightData = null) => {
                set((state) => {
                    const bookmarks = state.bookmarks || [];
                    const savedInsights = state.savedInsights || [];

                    const isBookmarked = bookmarks.includes(insightId);

                    let newBookmarks;
                    let newSavedInsights = [...savedInsights];

                    if (isBookmarked) {
                        // Remove
                        newBookmarks = bookmarks.filter(id => id !== insightId);
                        // Also remove from savedInsights if present
                        newSavedInsights = savedInsights.filter(i => i.id !== insightId);
                    } else {
                        // Add
                        newBookmarks = [...bookmarks, insightId];
                        // If data provided and not already in static list (or just always for safety), save it
                        if (insightData) {
                            // Check if it's already there to be safe
                            if (!newSavedInsights.find(i => i.id === insightId)) {
                                newSavedInsights.push(insightData);
                            }
                        }
                    }

                    return {
                        bookmarks: newBookmarks,
                        savedInsights: newSavedInsights
                    };
                });
            },

            // Complete onboarding and register anonymous user
            completeOnboarding: async () => {
                try {
                    const { onboardingData } = get();
                    const deviceId = getDeviceId();

                    const bmi = calculateBMI(onboardingData.weight, onboardingData.height);

                    const response = await authAPI.registerAnonymous({
                        deviceId,
                        profile: {
                            ...onboardingData,
                            bmi,
                        },
                    });

                    const { token, ...userData } = response.data;

                    set({
                        user: userData,
                        token,
                        isAnonymous: true,
                        isOnboarded: true,
                    });

                    storage.set('authToken', token);
                    storage.set('userData', userData);

                    return { success: true, data: userData };
                } catch (error) {
                    console.error('Onboarding error:', error);
                    return { success: false, error: error.response?.data?.message || 'Failed to complete onboarding' };
                }
            },

            // Upgrade to registered account
            upgradeAccount: async (email, password) => {
                try {
                    const response = await authAPI.upgradeAccount({ email, password });
                    const { token, ...userData } = response.data;

                    set({
                        user: userData,
                        token,
                        isAnonymous: false,
                    });

                    storage.set('authToken', token);
                    storage.set('userData', userData);

                    return { success: true };
                } catch (error) {
                    console.error('Upgrade error:', error);
                    return { success: false, error: error.response?.data?.message || 'Failed to upgrade account' };
                }
            },

            // Login with email/password
            login: async (email, password) => {
                try {
                    const response = await authAPI.login({ email, password });
                    const { token, ...userData } = response.data;

                    set({
                        user: userData,
                        token,
                        isAnonymous: false,
                        isOnboarded: true,
                    });

                    storage.set('authToken', token);
                    storage.set('userData', userData);

                    return { success: true };
                } catch (error) {
                    console.error('Login error:', error);
                    return { success: false, error: error.response?.data?.message || 'Failed to login' };
                }
            },

            // Update profile
            updateProfile: async (profileData) => {
                try {
                    const response = await authAPI.updateProfile(profileData);
                    const updatedUser = response.data;

                    set({ user: updatedUser });
                    storage.set('userData', updatedUser);

                    return { success: true, data: updatedUser };
                } catch (error) {
                    console.error('Update profile error:', error);
                    return { success: false, error: error.response?.data?.message || 'Failed to update profile' };
                }
            },

            // Logout
            logout: () => {
                console.log('[Logout] Starting logout process...');

                // Clear user data first
                set({
                    user: null,
                    token: null,
                    isAnonymous: true,
                    isOnboarded: false,
                    onboardingData: {
                        dateOfBirth: null,
                        height: null,
                        weight: null,
                        gender: null,
                    },
                });

                // Clear storage
                storage.remove('authToken');
                storage.remove('userData');

                // Clear ALL localStorage except settings
                const keysToKeep = ['theme', 'soundEnabled', 'hapticEnabled'];
                const allKeys = Object.keys(localStorage);

                console.log('[Logout] Clearing localStorage keys:', allKeys.filter(k => !keysToKeep.includes(k)));

                allKeys.forEach(key => {
                    // Keep user settings, but clear everything else including zustand stores
                    if (!keysToKeep.includes(key)) {
                        localStorage.removeItem(key);
                    }
                });

                console.log('[Logout] All data cleared, reloading page...');

                // Force reload to clear all stores
                setTimeout(() => {
                    window.location.href = '/';
                    window.location.reload();
                }, 100);
            },

            // Initialize from storage (check if already logged in)
            initializeFromStorage: () => {
                const token = storage.get('authToken');
                const userData = storage.get('userData');

                if (token && userData) {
                    set({
                        user: userData,
                        token,
                        isAnonymous: userData.isAnonymous,
                        isOnboarded: true,
                    });
                }
            },
        }),
        {
            name: 'user-storage',
            getStorage: () => localStorage,
        }
    )
);

export default useUserStore;
