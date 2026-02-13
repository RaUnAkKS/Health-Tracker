import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Layout from '../components/Layout';
import StreakCounter from '../components/StreakCounter';
import XPDisplay from '../components/XPDisplay';
import SugarLogCard from '../components/SugarLogCard';
import AchievementToast from '../components/AchievementToast';
import CustomLogModal from '../components/CustomLogModal';
import QuickLogModal from '../components/QuickLogModal';
import LevelUpOverlay from '../components/LevelUpOverlay';
import MilestoneOverlay from '../components/MilestoneOverlay';
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
import { playSuccessSound, playLevelUpSound, triggerHaptic } from '../utils/sounds';
import { pageVariants } from '../utils/animations';
import { shouldShowPermissionCard } from '../services/healthContext';
import { FOOD_ITEMS, getFoodItem } from '../utils/foodData';

const SUGAR_TYPES = ['CHAI', 'SWEETS', 'COLD_DRINK', 'PACKAGED_SNACK'];

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const {
        xp,
        level,
        lastSeenLevel,
        currentStreak,
        loggedToday,
        streakAtRisk,
        latestXPGain,
        latestAchievement,
        fetchStreakStatus,
        fetchGamificationData,
        awardXP,
        updateStreak,
        acknowledgeLevelUp
    } = useGameStore();
    const { createLog, fetchTodayLogs, todayLogs, totalSugarToday } = useLogStore();
    const { soundEnabled, hapticEnabled } = useSettingsStore();

    const [loading, setLoading] = useState(false);
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [selectedFoodItem, setSelectedFoodItem] = useState(null); // For QuickLogModal
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
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [showMilestoneOverlay, setShowMilestoneOverlay] = useState(false);
    const [milestoneStreak, setMilestoneStreak] = useState(0);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    // const prevLevelRef = useRef(level); // Removed in favor of store state
    const prevStreakRef = useRef(currentStreak);

    // Initial Data Fetch
    useEffect(() => {
        const initDashboard = async () => {
            await Promise.all([
                fetchStreakStatus(),
                fetchGamificationData(),
                fetchTodayLogs()
            ]);
            setIsDataLoaded(true);
            setShowHealthPermission(shouldShowPermissionCard());
        };
        initDashboard();
    }, []);

    // Level Up Detection
    useEffect(() => {
        if (!isDataLoaded) return;

        // Compare persistent lastSeenLevel with current level
        if (level > lastSeenLevel) {
            console.log(`[Dashboard] Level Up Detected! ${lastSeenLevel} -> ${level}`);
            setTimeout(() => {
                setShowLevelUp(true);
                if (soundEnabled) playLevelUpSound();
                if (hapticEnabled) triggerHaptic();
            }, 500);
        }
    }, [level, lastSeenLevel, isDataLoaded, soundEnabled, hapticEnabled]);

    // Streak Milestone Detection
    useEffect(() => {
        if (!isDataLoaded) {
            prevStreakRef.current = currentStreak;
            return;
        }

        if (currentStreak > prevStreakRef.current) {
            // Trigger for ANY streak increase (Day 1, Day 2, etc.)
            setTimeout(() => {
                setMilestoneStreak(currentStreak);
                setShowMilestoneOverlay(true);
                if (soundEnabled) playLevelUpSound();
                if (hapticEnabled) triggerHaptic();
            }, 800);
        }
        prevStreakRef.current = currentStreak;
    }, [currentStreak, isDataLoaded, soundEnabled, hapticEnabled]);

    const handleQuickLogClick = (type) => {
        const foodItem = getFoodItem(type);
        if (foodItem) {
            setSelectedFoodItem(foodItem);
        } else {
            console.error('Unknown food type:', type);
        }
    };

    const handleQuickLogConfirm = async (sugarAmount) => {
        if (!selectedFoodItem || loading) return;

        setLoading(true);
        setSelectedFoodItem(null); // Close modal immediately

        if (hapticEnabled) triggerHaptic();

        // Pass custom amount to createLog
        const result = await createLog({
            type: selectedFoodItem.id,
            customAmount: sugarAmount
        });

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
                {/* Dynamic AI Header */}
                <div className="pt-4 px-1">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-1 tracking-tight">
                            {(() => {
                                if (currentStreak >= 7) return "Strong Momentum";
                                if (currentStreak >= 3) return "Momentum Active";
                                return "Today's Signal";
                            })()}
                        </h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.6 }}
                            className="text-gray-600 dark:text-gray-400 text-base font-medium"
                        >
                            {(() => {
                                if (currentStreak >= 7) return "Your daily rhythm is stabilizing.";
                                if (currentStreak >= 3) return "Consistency is building.";
                                if (loggedToday) return "Your patterns are forming.";
                                return "Log your first intake to generate insights.";
                            })()}
                        </motion.p>
                    </motion.div>
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
                                onClick={() => handleQuickLogClick(type)}
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

                {/* Quick Log Modal */}
                <QuickLogModal
                    isOpen={!!selectedFoodItem}
                    onClose={() => setSelectedFoodItem(null)}
                    foodItem={selectedFoodItem}
                    onConfirm={handleQuickLogConfirm}
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
                {/* Level Up Overlay */}
                <LevelUpOverlay
                    level={level}
                    isVisible={showLevelUp}
                    onClose={() => {
                        setShowLevelUp(false);
                        acknowledgeLevelUp(); // Sync state so it doesn't show again
                    }}
                />
                <MilestoneOverlay
                    streak={milestoneStreak}
                    isVisible={showMilestoneOverlay}
                    onClose={() => setShowMilestoneOverlay(false)}
                />
            </motion.div>
        </Layout>
    );
};

export default Dashboard;
