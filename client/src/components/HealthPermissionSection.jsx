import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Moon, Heart, CheckCircle } from 'lucide-react';
import { requestHealthPermission, getPermissionStatus, generateContextProfile } from '../services/healthContext';

/**
 * Health Permission Section for Profile Page
 * Always visible - allows entering/updating health data
 */
const HealthPermissionSection = () => {
    const initialStatus = getPermissionStatus();
    const [permissionStatus, setPermissionStatus] = useState(initialStatus);
    const [showForm, setShowForm] = useState(initialStatus !== 'granted'); // Show form by default if not granted
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [steps, setSteps] = useState('');
    const [sleep, setSleep] = useState('');
    const [heartRate, setHeartRate] = useState('');

    const handleShowForm = () => {
        setShowForm(true);
        setShowSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Convert to numbers
        const stepsNum = parseInt(steps) || 5000;
        const sleepNum = parseFloat(sleep) || 7;
        const heartRateNum = parseInt(heartRate) || 70;

        // Generate context profile from user data
        generateContextProfile(stepsNum, sleepNum, heartRateNum);

        // Grant permission
        await requestHealthPermission();
        setPermissionStatus('granted');

        setShowSuccess(true);
        setShowForm(false);
        setIsLoading(false);

        // Clear form
        setSteps('');
        setSleep('');
        setHeartRate('');
    };

    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                Health Data Sync
            </h3>

            {showSuccess ? (
                // Success Message
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-6"
                >
                    <CheckCircle className="text-green-500 mx-auto mb-3" size={48} />
                    <p className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                        Health data saved! ✨
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Your insights are now personalized
                    </p>
                    <button
                        onClick={handleShowForm}
                        className="btn-secondary text-sm"
                    >
                        Update Data
                    </button>
                </motion.div>
            ) : showForm ? (
                // Data Input Form
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Tell us about your typical day:
                    </p>

                    {/* Steps Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Activity className="inline mr-2" size={16} />
                            Daily Step Count
                        </label>
                        <input
                            type="number"
                            value={steps}
                            onChange={(e) => setSteps(e.target.value)}
                            placeholder="e.g., 8000"
                            className="input-field"
                            required
                            min="0"
                            max="50000"
                        />
                    </div>

                    {/* Sleep Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Moon className="inline mr-2" size={16} />
                            Sleep Hours (last night)
                        </label>
                        <input
                            type="number"
                            step="0.5"
                            value={sleep}
                            onChange={(e) => setSleep(e.target.value)}
                            placeholder="e.g., 7.5"
                            className="input-field"
                            required
                            min="0"
                            max="24"
                        />
                    </div>

                    {/* Heart Rate Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Heart className="inline mr-2" size={16} />
                            Resting Heart Rate (optional)
                        </label>
                        <input
                            type="number"
                            value={heartRate}
                            onChange={(e) => setHeartRate(e.target.value)}
                            placeholder="e.g., 70 bpm"
                            className="input-field"
                            min="40"
                            max="120"
                        />
                    </div>

                    {/* Privacy Note */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        🔒 We never display these numbers. They're converted to context labels for insights.
                    </p>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full"
                    >
                        {isLoading ? 'Saving...' : 'Save Health Data'}
                    </button>
                </form>
            ) : (
                // Initial Prompt (if permission granted but not showing form)
                <>
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <Activity className="text-green-500" size={28} />
                        <Moon className="text-blue-500" size={28} />
                        <Heart className="text-red-500" size={28} />
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-1 text-center">
                        Help us understand your day better 💚
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                        Enter your activity & sleep data for smarter sugar insights.
                    </p>

                    <div className="flex justify-center mb-4">
                        <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            ✓ Health Sync Enabled
                        </div>
                    </div>

                    <button
                        onClick={handleShowForm}
                        className="btn-primary w-full"
                    >
                        {permissionStatus === 'granted' ? 'Update Health Data' : 'Enter Health Data'}
                    </button>

                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4 leading-relaxed">
                        🔒 Your data is private and only used for personalized insights.
                    </p>
                </>
            )}
        </div>
    );
};

export default HealthPermissionSection;
