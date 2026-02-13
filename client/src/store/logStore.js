import { create } from 'zustand';
import { logsAPI } from '../utils/api';

const useLogStore = create((set, get) => ({
    // Sugar logs
    logs: [],
    todayLogs: [],
    totalSugarToday: 0,
    isLogging: false,
    latestLog: null,
    latestInsight: null,

    // Set logs
    setLogs: (logs) => {
        set({ logs });
    },

    // Set today's logs
    setTodayLogs: (logs, totalSugar) => {
        set({ todayLogs: logs, totalSugarToday: totalSugar });
    },

    // Create sugar log (with optional photo)
    createLog: async (logData, photoFile = null) => {
        set({ isLogging: true });
        try {
            // Fetch current health context (if permission granted)
            const healthContext = await import('../services/healthContext').then(m =>
                m.getCachedHealthContext()
            );

            // Prepare request data
            const requestData = {
                ...logData,
                healthContext, // Send health context to backend
            };

            console.log('[LogStore] Creating log with health context:', healthContext);

            const response = await logsAPI.createLog(requestData, photoFile);

            // Backend now returns { success: true, data: { sugarLog, insight, gamification, streak, motivationalMessage } }
            const { sugarLog, insight, gamification, streak, motivationalMessage } = response.data.data || response.data;

            set((state) => ({
                logs: [sugarLog, ...state.logs],
                todayLogs: [sugarLog, ...state.todayLogs],
                totalSugarToday: state.totalSugarToday + sugarLog.sugarAmount,
                latestLog: sugarLog,
                latestInsight: insight,
                isLogging: false,
            }));

            return {
                success: true,
                data: { sugarLog, insight, gamification, streak, motivationalMessage },
            };
        } catch (error) {
            set({ isLogging: false });
            console.error('Error creating log:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to create log',
            };
        }
    },

    // Fetch logs
    fetchLogs: async (page = 1, limit = 20) => {
        try {
            const response = await logsAPI.getLogs({ page, limit });
            set({ logs: response.data.logs });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching logs:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch logs',
            };
        }
    },

    // Fetch today's logs
    fetchTodayLogs: async () => {
        try {
            const response = await logsAPI.getTodayLogs();
            set({
                todayLogs: response.data.logs,
                totalSugarToday: response.data.totalSugar,
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching today logs:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch today logs',
            };
        }
    },

    // Complete corrective action
    completeAction: async (logId) => {
        try {
            console.log('[LogStore] Completing action for log ID:', logId);
            const response = await logsAPI.completeAction(logId);
            console.log('[LogStore] Complete action response:', response);

            // Update the log in state
            set((state) => ({
                latestLog: { ...state.latestLog, correctiveActionCompleted: true },
                todayLogs: state.todayLogs.map((log) =>
                    log._id === logId
                        ? { ...log, correctiveActionCompleted: true }
                        : log
                ),
            }));

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            console.error('[LogStore] Error completing action:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to complete action',
            };
        }
    },

    // Clear latest log and insight
    clearLatest: () => {
        set({ latestLog: null, latestInsight: null });
    },

    // Clear log data (on logout)
    clearLogData: () => {
        set({
            logs: [],
            todayLogs: [],
            totalSugarToday: 0,
            latestLog: null,
            latestInsight: null,
        });
    },
}));

export default useLogStore;
