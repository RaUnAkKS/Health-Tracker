/**
 * Health Context Service
 * 
 * Converts raw health data (steps, sleep, heart rate) into friendly context labels.
 * NEVER exposes raw numbers to the UI - only context profiles.
 */

const PERMISSION_STATUS_KEY = 'healthPermissionStatus';
const PERMISSION_DECLINED_COUNT_KEY = 'healthPermissionDeclinedCount';
const HEALTH_CONTEXT_KEY = 'healthContextProfile';

/**
 * Request health data permission from user
 * @returns {Promise<boolean>} Permission granted
 */
export const requestHealthPermission = async () => {
    try {
        // Check if browser APIs are available
        const hasAPIs = checkBrowserAPIs();

        if (!hasAPIs) {
            console.log('[Health] Browser APIs not available, using simulation');
        }

        // Store permission
        localStorage.setItem(PERMISSION_STATUS_KEY, 'granted');
        localStorage.setItem(PERMISSION_DECLINED_COUNT_KEY, '0');

        return true;
    } catch (error) {
        console.error('[Health] Permission request failed:', error);
        return false;
    }
};

/**
 * Decline health data permission
 */
export const declineHealthPermission = () => {
    const currentCount = parseInt(localStorage.getItem(PERMISSION_DECLINED_COUNT_KEY) || '0');
    localStorage.setItem(PERMISSION_STATUS_KEY, 'declined');
    localStorage.setItem(PERMISSION_DECLINED_COUNT_KEY, String(currentCount + 1));
};

/**
 * Get current permission status
 * @returns {string} 'not_asked' | 'granted' | 'declined'
 */
export const getPermissionStatus = () => {
    return localStorage.getItem(PERMISSION_STATUS_KEY) || 'not_asked';
};

/**
 * Check if we should show permission card again
 */
export const shouldShowPermissionCard = () => {
    const status = getPermissionStatus();

    if (status === 'granted') return false;
    if (status === 'not_asked') return true;

    // Re-ask after 3 declined sessions
    const declinedCount = parseInt(localStorage.getItem(PERMISSION_DECLINED_COUNT_KEY) || '0');
    if (declinedCount >= 3) {
        // Reset count and ask again
        localStorage.setItem(PERMISSION_DECLINED_COUNT_KEY, '0');
        return true;
    }

    return false;
};

/**
 * Check if browser APIs are available
 */
const checkBrowserAPIs = () => {
    // Check for various health/sensor APIs
    const hasGeolocation = 'geolocation' in navigator;
    const hasGenericSensor = 'Accelerometer' in window;

    return hasGeolocation || hasGenericSensor;
};

/**
 * Get real health data from browser APIs (if available)
 */
const getRealHealthData = async () => {
    // Most browsers don't expose detailed health data
    // This is a placeholder for future API support
    return null;
};

/**
 * Simulate realistic health data
 * @returns {Object} Simulated health metrics
 */
export const simulateHealthData = () => {
    const hour = new Date().getHours();

    // Simulate based on time of day for realism
    const isNightTime = hour < 6 || hour > 22;
    const isMorning = hour >= 6 && hour < 12;

    // Simulate steps (lower at night, higher during day)
    const baseSteps = isNightTime ? 500 : isMorning ? 3000 : 6000;
    const steps = baseSteps + Math.random() * 3000;

    // Simulate sleep (6-9 hours)
    const sleep = 6 + Math.random() * 3;

    // Simulate heart rate (60-100 bpm)
    const heartRate = 60 + Math.random() * 40;

    return {
        steps: Math.round(steps),
        sleep: parseFloat(sleep.toFixed(1)),
        heartRate: Math.round(heartRate)
    };
};

/**
 * Get health data (real or simulated)
 */
export const getHealthData = async () => {
    const permission = getPermissionStatus();

    if (permission !== 'granted') {
        return null;
    }

    // Try to get real data first
    const realData = await getRealHealthData();

    if (realData) {
        return realData;
    }

    // Fallback to simulation
    return simulateHealthData();
};

/**
 * Convert raw health data to friendly context profile
 * CRITICAL: This is where we hide the raw numbers
 * 
 * @param {number} steps - Step count
 * @param {number} sleep - Sleep hours
 * @param {number} heartRate - Heart rate BPM
 * @returns {Object} Context profile with labels only
 */
export const generateContextProfile = (steps, sleep, heartRate) => {
    // Activity Level
    let activityLevel = 'moderate';
    if (steps < 4000) activityLevel = 'low';
    else if (steps > 8000) activityLevel = 'high';

    // Recovery State (based on sleep)
    let recoveryState = 'normal';
    if (sleep < 6) recoveryState = 'needs_rest';
    else if (sleep > 8) recoveryState = 'recovered';

    // Energy State (combined metric)
    let energyState = 'stable';
    if (sleep < 6 && heartRate > 80) {
        energyState = 'low';
    } else if (sleep > 7 && heartRate < 70) {
        energyState = 'high';
    } else if (sleep < 6 || heartRate > 85) {
        energyState = 'low';
    }

    const profile = {
        activityLevel,
        recoveryState,
        energyState,
        timestamp: new Date().toISOString(),
    };

    console.log('[Health] Generated context profile:', profile);

    // Store in localStorage
    localStorage.setItem(HEALTH_CONTEXT_KEY, JSON.stringify(profile));

    return profile;
};

/**
 * Fetch and generate current health context profile
 */
export const fetchHealthContext = async () => {
    try {
        const permission = getPermissionStatus();

        if (permission !== 'granted') {
            console.log('[Health] Permission not granted, skipping context fetch');
            return null;
        }

        // Get health data
        const healthData = await getHealthData();

        if (!healthData) {
            console.log('[Health] No health data available');
            return null;
        }

        // Generate context profile (hiding raw numbers)
        const context = generateContextProfile(
            healthData.steps,
            healthData.sleep,
            healthData.heartRate
        );

        return context;
    } catch (error) {
        console.error('[Health] Error fetching health context:', error);
        return null;
    }
};

/**
 * Get cached health context from localStorage
 */
export const getCachedHealthContext = () => {
    try {
        const cached = localStorage.getItem(HEALTH_CONTEXT_KEY);
        return cached ? JSON.parse(cached) : null;
    } catch (error) {
        return null;
    }
};

/**
 * Clear health data (for logout or revoke permission)
 */
export const clearHealthData = () => {
    localStorage.removeItem(PERMISSION_STATUS_KEY);
    localStorage.removeItem(PERMISSION_DECLINED_COUNT_KEY);
    localStorage.removeItem(HEALTH_CONTEXT_KEY);
};
