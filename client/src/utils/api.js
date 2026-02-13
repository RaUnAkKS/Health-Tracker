import axios from 'axios';
import { storage } from './storage';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = storage.get('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            storage.remove('authToken');
            storage.remove('userData');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    registerAnonymous: (data) => api.post('/auth/anonymous', data),
    upgradeAccount: (data) => api.post('/auth/upgrade', data),
    login: (data) => api.post('/auth/login', data),
    updateProfile: (data) => api.put('/auth/profile', data),
};

// Sugar Logs API
export const logsAPI = {
    createLog: async (data, photoFile = null) => {
        if (photoFile) {
            // Use FormData for file upload
            const formData = new FormData();
            formData.append('type', data.type);
            if (data.customAmount) formData.append('customAmount', data.customAmount);
            if (data.description) formData.append('description', data.description);
            if (data.healthContext) formData.append('healthContext', JSON.stringify(data.healthContext)); // Serialize object
            formData.append('photo', photoFile); // Append the actual File object

            console.log('[API] Sending FormData with photo:', {
                type: data.type,
                customAmount: data.customAmount,
                photoName: photoFile.name,
                photoSize: photoFile.size,
            });

            // Let axios handle Content-Type for multipart/form-data
            return api.post('/logs', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
            // Regular JSON request
            console.log('[API] Sending JSON without photo');
            return api.post('/logs', data);
        }
    },
    getLogs: (params) => api.get('/logs', { params }),
    getTodayLogs: () => api.get('/logs/today'),
    completeAction: (id) => api.put(`/logs/${id}/action`),
    assignTask: (id, taskId) => api.put(`/logs/${id}/task`, { taskId }),
    getMonthStats: (year, month) => api.get('/logs/stats/month', { params: { year, month } }),
};

// Gamification API
export const gamificationAPI = {
    getGamificationData: () => api.get('/gamification'),
    getStreakStatus: () => api.get('/gamification/streak'),
};

// Health Data API
export const healthAPI = {
    syncHealthData: (data) => api.post('/health', data),
    getTodayHealthData: () => api.get('/health/today'),
    getHealthHistory: (days) => api.get('/health/history', { params: { days } }),
};

export default api;
