import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Layout from '../components/Layout';
import StreakCounter from '../components/StreakCounter';
import XPDisplay from '../components/XPDisplay';
import SugarLogCard from '../components/SugarLogCard';
import AchievementToast from '../components/AchievementToast';
import CustomLogModal from '../components/CustomLogModal';
import useUserStore from '../store/userStore';
import useGameStore from '../store/gameStore';
import useLogStore from '../store/logStore';
import useSettingsStore from '../store/settingsStore';
import { playSuccessSound, triggerHaptic } from '../utils/sounds';
import { pageVariants } from '../utils/animations';

const SUGAR_TYPES = ['CHAI', 'SWEETS', 'COLD_DRINK', 'PACKAGED_SNACK'];

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const {
        xp,
        level,
        currentStreak,
        loggedToday,
        streakAtRisk,
        latestXPGain,
        latestAchievement,
        fetchStreakStatus,
        fetchGamificationData,
        awardXP,
        updateStreak,
    } = useGameStore();
    const { createLog, fetchTodayLogs, todayLogs, totalSugarToday } = useLogStore();
    const { soundEnabled, hapticEnabled } = useSettingsStore();

    const [loading, setLoading] = useState(false);
    const [showCustomModal, setShowCustomModal] = useState(false);

    useEffect(() => {
        fetchStreakStatus();
        fetchGamificationData();
        fetchTodayLogs();
    }, []);

    const handleLog = async (type) => {
        if (loading) return;

        setLoading(true);

        if (hapticEnabled) triggerHaptic();

        const result = await createLog({ type });

        if (result.success) {
            const { gamification, insight } = result.data;

            // Play success sound
            if (soundEnabled) playSuccessSound();

            // Update gamification
            if (gamification) {
                awardXP(gamification.xpGained, gamification.achievement);
                updateStreak({ currentStreak: gamification.currentStreak });
            }

            // Refresh data
            await fetchTodayLogs();
            await fetchStreakStatus();

            // Navigate to insight screen
            setTimeout(() => {
                navigate('/insight');
            }, 500);
        } else {
            alert(result.error);
        }

        setLoading(false);
    };

    const handleCustomLog = async (logData, photoFile) => {
        setLoading(true);
        setShowCustomModal(false);

        if (hapticEnabled) triggerHaptic();

        const result = await createLog(logData, photoFile);

        if (result.success) {
            const { gamification, insight } = result.data;

            // Play success sound
            if (soundEnabled) playSuccessSound();

            // Update gamification
            if (gamification) {
                awardXP(gamification.xpGained, gamification.achievement);
                updateStreak({ currentStreak: gamification.currentStreak });
            }

            // Refresh data
            await fetchTodayLogs();
            await fetchStreakStatus();

            // Navigate to insight screen
            setTimeout(() => {
                navigate('/insight');
            }, 500);
        } else {
            alert(result.error);
        }

        setLoading(false);
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
                {/* Welcome Message */}
                <div className="text-center pt-4">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                        Hello! 👋
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Ready to track your sugar intake?
                    </p>
                </div>

                {/* Streak Counter */}
                <StreakCounter
                    streak={currentStreak}
                    loggedToday={loggedToday}
                    streakAtRisk={streakAtRisk}
                />

                {/* XP Display */}
                <XPDisplay xp={xp} level={level} latestXPGain={latestXPGain} />

                {/* Today's Stats */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                        Today's Summary
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="text-3xl font-bold text-gray-800 dark:text-white">
                                {todayLogs.length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Logs today
                            </div>
                        </div>

                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                                {totalSugarToday}g
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Sugar today
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Log Section */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Plus size={24} className="text-primary-500" />
                        Quick Log
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        {SUGAR_TYPES.map((type) => (
                            <SugarLogCard
                                key={type}
                                type={type}
                                onClick={() => handleLog(type)}
                                disabled={loading}
                            />
                        ))}
                    </div>

                    {/* Custom Log Button */}
                    <button
                        onClick={() => setShowCustomModal(true)}
                        className="w-full mt-4 glass-card p-4 border-2 border-dashed border-primary-300 dark:border-primary-600 hover:border-primary-500 transition-all text-primary-700 dark:text-primary-300 font-semibold flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        <Plus size={20} />
                        Custom Log with Photo
                    </button>

                    {loading && (
                        <div className="text-center mt-4">
                            <div className="inline-block px-6 py-3 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-xl font-medium">
                                Generating insight...
                            </div>
                        </div>
                    )}
                </div>

                {/* Achievement Toast */}
                <AchievementToast
                    achievement={latestAchievement}
                    onClose={() => useGameStore.setState({ latestAchievement: null })}
                />

                {/* Custom Log Modal */}
                <CustomLogModal
                    isOpen={showCustomModal}
                    onClose={() => setShowCustomModal(false)}
                    onSubmit={handleCustomLog}
                    loading={loading}
                />
            </motion.div>
        </Layout>
    );
};

export default Dashboard;
