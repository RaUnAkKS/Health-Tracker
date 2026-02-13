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
import HealthPermissionCard from '../components/HealthPermissionCard';
import StreakProgressBar from '../components/StreakProgressBar';
import MilestoneBadge from '../components/MilestoneBadge';
import WeeklyProgressTracker from '../components/WeeklyProgressTracker';
import ReminderBanner from '../components/ReminderBanner';
import RewardPopup from '../components/RewardPopup';
import BadgeUnlock from '../components/BadgeUnlock';
import useUserStore from '../store/userStore';
import useGameStore from '../store/gameStore';
import useLogStore from '../store/logStore';
import useSettingsStore from '../store/settingsStore';
import { playSuccessSound, triggerHaptic } from '../utils/sounds';
import { pageVariants } from '../utils/animations';
import { shouldShowPermissionCard } from '../services/healthContext';

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
    const [showHealthPermission, setShowHealthPermission] = useState(false);
    const [showMilestone, setShowMilestone] = useState(false);
    const [achievedMilestone, setAchievedMilestone] = useState(null);
    const [motivationalMessage, setMotivationalMessage] = useState('');
    const [showReward, setShowReward] = useState(false);
    const [rewardXP, setRewardXP] = useState(0);
    const [isRewardBonus, setIsRewardBonus] = useState(false);
    const [showBadge, setShowBadge] = useState(false);
    const [unlockedBadge, setUnlockedBadge] = useState(null);
    const [showReminder, setShowReminder] = useState(true);

    useEffect(() => {
        fetchStreakStatus();
        fetchGamificationData();
        fetchTodayLogs();

        // Check if we should show health permission card
        setShowHealthPermission(shouldShowPermissionCard());
    }, []);

    const handleLog = async (type) => {
        if (loading) return;

        setLoading(true);

        if (hapticEnabled) triggerHaptic();

        const result = await createLog({ type });

        if (result.success) {
            const { gamification, insight, streak, motivationalMessage } = result.data;

            // Play success sound
            if (soundEnabled) playSuccessSound();

            // Update gamification (XP popup shows on Insight page when action completed)
            if (gamification) {
                awardXP(gamification.xpGained, gamification.achievement);
                updateStreak({ currentStreak: gamification.currentStreak });
            }

            // Check for milestone achievement
            if (streak?.milestone) {
                setAchievedMilestone(streak.milestone);
                setShowMilestone(true);
            }

            // Check for badge unlock (3, 7, 30 days)
            if (streak?.current === 3) {
                setUnlockedBadge({ name: 'Consistency Starter', description: '3 days of tracking!' });
                setShowBadge(true);
            } else if (streak?.current === 7) {
                setUnlockedBadge({ name: 'Sugar Aware', description: '7 days strong!' });
                setShowBadge(true);
            } else if (streak?.current === 30) {
                setUnlockedBadge({ name: 'Metabolic Guardian', description: '30 days of dedication!' });
                setShowBadge(true);
            }

            // Set motivational message
            if (motivationalMessage) {
                setMotivationalMessage(motivationalMessage);
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
        console.log('[Dashboard] handleCustomLog called', {
            logData,
            hasPhoto: !!photoFile,
            photoName: photoFile?.name,
            photoSize: photoFile?.size,
        });

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

    const handleHealthPermissionGranted = () => {
        setShowHealthPermission(false);
        // Permission is already stored in localStorage by the service
    };

    const handleHealthPermissionDeclined = () => {
        setShowHealthPermission(false);
        // Decline is already stored in localStorage by the service
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

                {/* Health Permission Card */}
                {showHealthPermission && (
                    <HealthPermissionCard
                        onPermissionGranted={handleHealthPermissionGranted}
                        onPermissionDeclined={handleHealthPermissionDeclined}
                    />
                )}

                {/* Reminder Banner - Shows when not logged today */}
                {showReminder && (
                    <ReminderBanner
                        streak={currentStreak}
                        loggedToday={loggedToday}
                        onDismiss={() => setShowReminder(false)}
                    />
                )}

                {/* Weekly Progress Tracker */}
                <WeeklyProgressTracker logs={todayLogs} />

                {/* Streak Progress Bar */}
                {currentStreak > 0 && (
                    <StreakProgressBar currentStreak={currentStreak} />
                )}

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

                {/* Reward Popup - Variable XP Display */}
                {showReward && (
                    <RewardPopup
                        xp={rewardXP}
                        isBonus={isRewardBonus}
                        onClose={() => setShowReward(false)}
                    />
                )}

                {/* Badge Unlock - Milestone Celebrations */}
                {showBadge && unlockedBadge && (
                    <BadgeUnlock
                        badge={unlockedBadge}
                        onDismiss={() => {
                            setShowBadge(false);
                            setUnlockedBadge(null);
                        }}
                    />
                )}

                {/* Milestone Badge - Existing streak milestones */}
                {showMilestone && achievedMilestone && (
                    <MilestoneBadge
                        milestone={achievedMilestone}
                        onDismiss={() => {
                            setShowMilestone(false);
                            setAchievedMilestone(null);
                        }}
                    />
                )}
            </motion.div>
        </Layout>
    );
};

export default Dashboard;
