import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
    persist(
        (set) => ({
            // Settings
            darkMode: false,
            notifications: true,
            soundEnabled: true,
            hapticEnabled: true,

            // Toggle dark mode
            toggleDarkMode: () => {
                set((state) => {
                    const newDarkMode = !state.darkMode;

                    // Update HTML class
                    if (newDarkMode) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }

                    return { darkMode: newDarkMode };
                });
            },

            // Set dark mode
            setDarkMode: (enabled) => {
                if (enabled) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                set({ darkMode: enabled });
            },

            // Toggle notifications
            toggleNotifications: () => {
                set((state) => ({ notifications: !state.notifications }));
            },

            // Toggle sound
            toggleSound: () => {
                set((state) => ({ soundEnabled: !state.soundEnabled }));
            },

            // Toggle haptic
            toggleHaptic: () => {
                set((state) => ({ hapticEnabled: !state.hapticEnabled }));
            },

            // Initialize dark mode from system preference
            initializeDarkMode: () => {
                set((state) => {
                    // Only use system preference if not already set
                    if (state.darkMode === undefined) {
                        const prefersDark = window.matchMedia(
                            '(prefers-color-scheme: dark)'
                        ).matches;

                        if (prefersDark) {
                            document.documentElement.classList.add('dark');
                        }

                        return { darkMode: prefersDark };
                    }

                    // Apply existing preference
                    if (state.darkMode) {
                        document.documentElement.classList.add('dark');
                    }

                    return state;
                });
            },
        }),
        {
            name: 'settings-storage',
            getStorage: () => localStorage,
        }
    )
);

export default useSettingsStore;
