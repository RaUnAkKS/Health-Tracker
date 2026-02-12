import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Moon, Heart, CheckCircle } from 'lucide-react';
import { requestHealthPermission, declineHealthPermission, generateContextProfile } from '../services/healthContext';

/**
 * Health Permission Card - Shown once on Dashboard
 * Shows form inline when Allow Access is clicked
 */
const HealthPermissionCard = ({ onPermissionGranted, onPermissionDeclined }) => {
    const [showForm, setShowForm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [steps, setSteps] = useState('');
    const [sleep, setSleep] = useState('');
    const [heartRate, setHeartRate] = useState('');

    const handleAllowClick = () => {
        setShowForm(true);
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

        setShowSuccess(true);
        setIsLoading(false);

        // Call parent callback after animation
        setTimeout(() => {
            onPermissionGranted();
        }, 2000);
    };

    const handleDecline = () => {
        declineHealthPermission();
        onPermissionDeclined();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-6 mb-6 border-2 border-primary-500/30"
            >
                {showSuccess ? (
                    // Success Animation Animation
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-8"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                        >
                            <CheckCircle className="text-green-500 mx-auto mb-3" size={56} />
                        </motion.div>

                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                            You're all set! ✨
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Your insights are now personalized
                        </p>
                    </motion.div>
                ) : showForm ? (
                    // Data Input Form
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 text-center">
                            Tell us about your day 💚
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
                            This helps us give you better insights
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
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
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                    🔒 We never display these numbers. They're converted to context labels for insights.
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-primary flex-1"
                                >
                                    {isLoading ? 'Saving...' : 'Enable Health Sync'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Back
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    // Initial Prompt
                    <>
                        {/* Header */}
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                Help us understand your day better 💚
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Share your activity & sleep data for smarter sugar insights
                            </p>
                        </div>

                        {/* Icons */}
                        <div className="flex items-center justify-center gap-6 mb-6">
                            <div className="text-center">
                                <Activity className="text-green-500 mx-auto mb-2" size={32} />
                                <span className="text-xs text-gray-600 dark:text-gray-400">Activity</span>
                            </div>
                            <div className="text-center">
                                <Moon className="text-blue-500 mx-auto mb-2" size={32} />
                                <span className="text-xs text-gray-600 dark:text-gray-400">Sleep</span>
                            </div>
                            <div className="text-center">
                                <Heart className="text-red-500 mx-auto mb-2" size={32} />
                                <span className="text-xs text-gray-600 dark:text-gray-400">Heart</span>
                            </div>
                        </div>

                        {/* Privacy Note */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 mb-4">
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                🔒 We never display your raw numbers. Data is converted to context labels for personalized insights.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleAllowClick}
                                className="btn-primary flex-1"
                            >
                                Allow Access
                            </button>
                            <button
                                onClick={handleDecline}
                                className="btn-secondary flex-1"
                            >
                                Maybe Later
                            </button>
                        </div>
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default HealthPermissionCard;
