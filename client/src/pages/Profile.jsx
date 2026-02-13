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
import { calculateBMI, getBMInCategory, calculateAge } from '../utils/healthCalculations';
import { pageVariants } from '../utils/animations';

const Profile = () => {
    const { user, isAnonymous, upgradeAccount, logout, updateProfile } = useUserStore();
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

    // Edit Profile State
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [editData, setEditData] = useState({ height: 0, weight: 0, gender: '' });

    const handleSaveProfile = async () => {
        // Validate inputs before saving
        if (editData.height < 60 || editData.height > 300) return alert('Invalid height');
        if (editData.weight < 20 || editData.weight > 500) return alert('Invalid weight');

        // Update user store (and backend via store action)
        await updateProfile(editData);
        setShowEditProfile(false);
    };

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

                {/* Health Summary - Cards Grid */}
                {user?.profile && (() => {
                    try {
                        const weight = Number(user.profile.weight) || 0;
                        const height = Number(user.profile.height) || 0;
                        const dob = user.profile.dateOfBirth;

                        const bmi = calculateBMI(weight, height);
                        const bmiInfo = getBMInCategory(bmi);
                        const age = calculateAge(dob);

                        return (
                            <div className="grid grid-cols-2 gap-4">
                                <HealthCard
                                    label="BMI"
                                    value={bmi}
                                    subtext={bmiInfo.category}
                                    color={bmiInfo.color}
                                />
                                <HealthCard
                                    label="Age"
                                    value={age}
                                    subtext="Years"
                                />
                                <HealthCard
                                    label="Weight"
                                    value={weight}
                                    subtext="kg"
                                />
                                <HealthCard
                                    label="Height"
                                    value={height}
                                    subtext="cm"
                                />
                            </div>
                        );
                    } catch (err) {
                        console.error("Profile Health Summary Error:", err);
                        return <div className="text-red-500">Error loading health data.</div>;
                    }
                })()}

                {/* Edit Profile Button */}
                <button
                    onClick={() => {
                        setEditData({
                            height: user.profile.height,
                            weight: user.profile.weight,
                            gender: user.profile.gender
                        });
                        setShowEditProfile(true);
                    }}
                    className="w-full glass-card p-3 border border-gray-200 dark:border-gray-700 text-primary-600 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    <Settings2 size={16} />
                    Edit Health Profile
                </button>

                {/* Edit Profile Modal */}
                {showEditProfile && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl"
                        >
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Update Profile</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Height (cm)</label>
                                    <input
                                        type="number"
                                        value={editData.height}
                                        onChange={(e) => setEditData({ ...editData, height: Number(e.target.value) })}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (kg)</label>
                                    <input
                                        type="number"
                                        value={editData.weight}
                                        onChange={(e) => setEditData({ ...editData, weight: Number(e.target.value) })}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowEditProfile(false)}
                                    className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-600 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    className="flex-1 py-2 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600"
                                >
                                    Save
                                </button>
                            </div>
                        </motion.div>
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

const HealthCard = ({ label, value, subtext, color }) => (
    <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
        <span className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">{label}</span>
        <span className={`text-2xl font-black ${color || 'text-gray-800 dark:text-white'}`}>{value}</span>
        <span className={`text-xs ${color ? 'font-medium ' + color : 'text-gray-500'}`}>{subtext}</span>
    </div>
);
