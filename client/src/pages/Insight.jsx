import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, Zap, Clock } from 'lucide-react';
import Layout from '../components/Layout';
// import InsightCard from '../components/InsightCard'; // Removed
import XpFloatAnimation from '../components/XpFloatAnimation';
import useLogStore from '../store/logStore';
import useGameStore from '../store/gameStore';
import useSettingsStore from '../store/settingsStore';
import { playSuccessSound, triggerHaptic } from '../utils/sounds';
import { pageVariants, cardVariants } from '../utils/animations';
import { getTaskForAction } from '../data/tasksData'; // Keep for fail-safe or remove if unused
import { selectCorrectiveTask, markTaskAsSeen } from '../utils/taskEngine';

const Insight = () => {
    const navigate = useNavigate();
    const { latestInsight, latestLog, completeAction, assignTaskToLog } = useLogStore(); // Get assignTaskToLog
    const { awardXP, currentStreak } = useGameStore();
    const { soundEnabled, hapticEnabled } = useSettingsStore();

    // Select task ONCE when latestLog changes
    const [task, setTask] = useState(null);

    useEffect(() => {
        if (latestLog && !task) {
            // Determine context
            const hour = new Date().getHours();
            let timeOfDay = 'afternoon';
            if (hour >= 5 && hour < 12) timeOfDay = 'morning';
            else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
            else if (hour >= 21 || hour < 5) timeOfDay = 'night';

            const context = {
                sugarAmount: latestLog.sugarAmount,
                currentStreak: currentStreak || 0,
                timeOfDay
            };

            const selected = selectCorrectiveTask(context);
            setTask(selected);
            markTaskAsSeen(selected.id);

            // Persist selection to backend so History matches
            if (latestLog._id) {
                assignTaskToLog(latestLog._id, selected.id);
            }
        }
    }, [latestLog, currentStreak, task, assignTaskToLog]);

    const [showReward, setShowReward] = useState(false);
    const [rewardXP, setRewardXP] = useState(0);
    const [actionCompleted, setActionCompleted] = useState(false);

    // Sync local state with log state
    useEffect(() => {
        if (latestLog?.correctiveActionCompleted) {
            setActionCompleted(true);
        }
    }, [latestLog]);

    const generateRandomXP = () => {
        const rand = Math.random();
        if (rand < 0.6) return Math.floor(Math.random() * (5 - 3 + 1)) + 3; // 3-5 XP (60%)
        if (rand < 0.9) return Math.floor(Math.random() * (8 - 6 + 1)) + 6; // 6-8 XP (30%)
        return Math.floor(Math.random() * (10 - 9 + 1)) + 9; // 9-10 XP (10%)
    };

    const handleCompleteAction = async () => {
        if (!latestLog?._id || actionCompleted) return;

        console.log('[Insight] Completing action for log:', latestLog._id);

        // 1. Generate Random XP
        const xpAmount = generateRandomXP();
        setRewardXP(xpAmount);

        // 2. Play Effects
        if (soundEnabled) playSuccessSound();
        if (hapticEnabled) triggerHaptic();

        // 3. Show Animation
        setShowReward(true);

        // 4. Update UI State Immediately (Optimistic)
        setActionCompleted(true);

        // 5. Award XP in Game Store
        awardXP(xpAmount);

        // 6. Call Backend
        const result = await completeAction(latestLog._id);

        if (result.success) {
            // Backend update successful
            // Navigate back to dashboard after a short delay
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } else {
            console.error('Failed to complete action:', result.error);
            // Revert state if needed, but for now we keep it optimistic
        }
    };

    const handleSkip = () => {
        navigate('/dashboard');
    };

    if (!latestInsight) {
        return (
            <Layout>
                <div className="page-container flex flex-col items-center justify-center min-h-[60vh]">
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                        No insight available. Log some sugar to get personalized recommendations!
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="btn-primary mt-6">
                        Go to Dashboard
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
            >
                {/* Back Button */}
                <button
                    onClick={handleSkip}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>

                {/* Success Message */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center pt-8"
                >
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                        Sugar Logged!
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400">
                        Here's your personalized insight
                    </p>
                </motion.div>

                {/* Task Card (Replaces Insight Card for Action) */}
                {task ? (
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className="glass-card overflow-hidden border border-white/20 dark:border-gray-700/50"
                    >
                        <div className={`h-2 bg-gradient-to-r ${task.color} w-full`} />
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${task.color} text-white shadow-lg`}>
                                    <task.icon size={28} />
                                </div>
                                <div>
                                    <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                                        Recommended Action
                                    </h3>
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                        {task.title}
                                    </h2>
                                </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-4">
                                {task.description}
                            </p>

                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                                <Clock size={16} />
                                <span>Estimated duration: <strong>{task.duration}</strong></span>
                            </div>

                            {/* Insight Snippet (Small Context) */}
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-xs text-gray-500 italic">
                                    "{latestInsight.message}"
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="glass-card p-8 flex justify-center">
                        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    </div>
                )}

                {/* Action Buttons */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3 relative"
                >
                    {/* Floating XP Animation */}
                    <AnimatePresence>
                        {showReward && (
                            <XpFloatAnimation
                                xp={rewardXP}
                                streak={useGameStore.getState().currentStreak} // Get fresh streak
                            />
                        )}
                    </AnimatePresence>

                    <button
                        onClick={handleCompleteAction}
                        disabled={actionCompleted}
                        className={`w-full flex items-center justify-center gap-2 p-4 rounded-xl font-bold transition-all transform active:scale-95 duration-300 ${actionCompleted
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800 cursor-default'
                            : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                            }`}
                    >
                        {actionCompleted ? (
                            <>
                                <CheckCircle2 size={24} className="text-green-600 dark:text-green-400" />
                                Action Logged ✅
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={24} />
                                I'll do this now!
                            </>
                        )}
                    </button>

                    {!actionCompleted && (
                        <button
                            onClick={handleSkip}
                            className="btn-secondary w-full"
                        >
                            Maybe later
                        </button>
                    )}
                </motion.div>

                {/* Screen Flash Effect */}
                <AnimatePresence>
                    {showReward && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="fixed inset-0 bg-white dark:bg-white pointer-events-none z-[60] mix-blend-overlay"
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </Layout >
    );
};

export default Insight;
