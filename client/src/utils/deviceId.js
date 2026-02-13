import { v4 as uuidv4 } from 'uuid';

/**
 * Get or generate device ID for anonymous users
 */
export const getDeviceId = () => {
    let deviceId = localStorage.getItem('deviceId');

    if (!deviceId) {
        deviceId = uuidv4();
        localStorage.setItem('deviceId', deviceId);
    }

    return deviceId;
};
