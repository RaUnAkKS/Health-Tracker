import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';
import InsightCard from '../components/InsightCard';
import useLogStore from '../store/logStore';
import useGameStore from '../store/gameStore';
import useSettingsStore from '../store/settingsStore';
import { playSuccessSound, triggerHaptic } from '../utils/sounds';
import { pageVariants, cardVariants } from '../utils/animations';

const Insight = () => {
    const navigate = useNavigate();
    const { latestInsight, latestLog, completeAction } = useLogStore();
    const { awardXP } = useGameStore();
    const { soundEnabled, hapticEnabled } = useSettingsStore();

    const handleCompleteAction = async () => {
        if (!latestLog?._id) return;

        const result = await completeAction(latestLog._id);

        if (result.success) {
            const { gamification } = result.data;

            // Award bonus XP
            if (gamification) {
                awardXP(gamification.xpGained);
            }

            // Play sound and haptic
            if (soundEnabled) playSuccessSound();
            if (hapticEnabled) triggerHaptic();

            // Navigate back to dashboard after a moment
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } else {
            alert(result.error);
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
                    className="text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        className="inline-block text-7xl mb-4"
                    >
                        ✅
                    </motion.div>

                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                        Sugar Logged!
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400">
                        Here's your personalized insight
                    </p>
                </motion.div>

                {/* Insight Card */}
                <InsightCard insight={latestInsight} />

                {/* Action Buttons */}
                {!latestLog?.correctiveActionCompleted && (
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-3"
                    >
                        <button
                            onClick={handleCompleteAction}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 size={20} />
                            I'll do this now! (+bonus XP)
                        </button>

                        <button
                            onClick={handleSkip}
                            className="btn-secondary w-full"
                        >
                            Maybe later
                        </button>
                    </motion.div>
                )}

                {latestLog?.correctiveActionCompleted && (
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className="glass-card p-4 text-center bg-green-50 dark:bg-green-900/20 border-green-500"
                    >
                        <div className="text-green-700 dark:text-green-400 font-semibold">
                            ✨ Action completed! Great job!
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </Layout>
    );
};

export default Insight;
