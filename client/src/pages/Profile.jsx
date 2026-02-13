import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User2, Mail, Lock, Settings2, LogOut } from 'lucide-react';
import Layout from '../components/Layout';
import ToggleSetting from '../components/ToggleSetting';
import HealthPermissionSection from '../components/HealthPermissionSection';
import AccountUpgradeForm from '../components/AccountUpgradeForm';
import HealthIntelligence from '../components/HealthIntelligence';
import InsightHistory from '../components/InsightHistory';
import useUserStore from '../store/userStore';
import useGameStore from '../store/gameStore';
import useLogStore from '../store/logStore';
import useSettingsStore from '../store/settingsStore';
import { pageVariants } from '../utils/animations';

const Profile = () => {
    const { user, isAnonymous, upgradeAccount, logout } = useUserStore();
    const { clearGameData } = useGameStore();
    const { clearLogData } = useLogStore();
    const {
        darkMode,
        notifications,
        soundEnabled,
        hapticEnabled,
        toggleDarkMode,
        toggleNotifications,
        toggleSound,
        toggleHaptic,
    } = useSettingsStore();

    const [showUpgrade, setShowUpgrade] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [intelligenceProfile, setIntelligenceProfile] = useState(null);

    // Fetch intelligence profile when user is available
    useEffect(() => {
        if (user && !isAnonymous) {
            fetchIntelligenceProfile();
        }
    }, [user, isAnonymous]);

    const fetchIntelligenceProfile = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/intelligence-profile`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setIntelligenceProfile(data);
            }
        } catch (error) {
            console.error('Error fetching intelligence profile:', error);
        }
    };

    const handleUpgrade = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await upgradeAccount(email, password);

        if (result.success) {
            alert('Account upgraded successfully! 🎉');
            setShowUpgrade(false);
            setEmail('');
            setPassword('');
        } else {
            alert(result.error);
        }

        setLoading(false);
    };

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            logout();
            clearGameData();
            clearLogData();
            window.location.href = '/';
        }
    };

    return (
        <Layout>
            <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
            >
                {/* Header */}
                <div className="text-center pt-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <User2 size={40} className="text-white" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {isAnonymous ? 'Anonymous User' : user?.email}
                    </h2>

                    {isAnonymous && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Upgrade to unlock more features
                        </p>
                    )}
                </div>

                {/* Profile Info */}
                {user?.profile && (
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                            Profile Information
                        </h3>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Gender</span>
                                <span className="font-semibold text-gray-800 dark:text-white capitalize">
                                    {user.profile.gender}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Height</span>
                                <span className="font-semibold text-gray-800 dark:text-white">
                                    {user.profile.height} cm
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Weight</span>
                                <span className="font-semibold text-gray-800 dark:text-white">
                                    {user.profile.weight} kg
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Health Permission Section */}
                <HealthPermissionSection />

                {/* Upgrade Section */}
                {isAnonymous && !showUpgrade && (
                    <div className="glass-card p-6 border-2 border-primary-500">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                            Upgrade Account 🚀
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Add email & password to secure your data
                        </p>

                        <button
                            onClick={() => setShowUpgrade(true)}
                            className="btn-primary w-full"
                        >
                            Upgrade Now
                        </button>
                    </div>
                )}

                {/* Upgrade Form */}
                {showUpgrade && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-6"
                    >
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                            Create Your Account
                        </h3>

                        <form onSubmit={handleUpgrade} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field"
                                    required
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field"
                                    required
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary flex-1"
                                >
                                    {loading ? 'Upgrading...' : 'Create Account'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowUpgrade(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Settings */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Settings2 size={20} />
                        Settings
                    </h3>

                    <div className="space-y-4">
                        <ToggleSetting
                            label="Dark Mode"
                            enabled={darkMode}
                            onToggle={toggleDarkMode}
                        />

                        <ToggleSetting
                            label="Notifications"
                            enabled={notifications}
                            onToggle={toggleNotifications}
                        />

                        <ToggleSetting
                            label="Sound Effects"
                            enabled={soundEnabled}
                            onToggle={toggleSound}
                        />

                        <ToggleSetting
                            label="Haptic Feedback"
                            enabled={hapticEnabled}
                            onToggle={toggleHaptic}
                        />
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full glass-card p-4 text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </motion.div>
        </Layout>
    );
};

export default Profile;
