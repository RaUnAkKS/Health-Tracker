import { motion, AnimatePresence } from 'framer-motion';
import { X, PartyPopper } from 'lucide-react';
import { slideUpVariants } from '../utils/animations';
import { playStreakSound } from '../utils/sounds';
import { useEffect } from 'react';

const AchievementToast = ({ achievement, onClose }) => {
    useEffect(() => {
        if (achievement) {
            playStreakSound();
        }
    }, [achievement]);

    return (
        <AnimatePresence>
            {achievement && (
                <motion.div
                    variants={slideUpVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full px-4"
                >
                    <div className="glass-card p-6 border-2 border-yellow-400 dark:border-yellow-500 shadow-2xl">
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-4">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: 3, duration: 0.3 }}
                                className="text-5xl"
                            >
                                {achievement.emoji}
                            </motion.div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <PartyPopper size={20} className="text-yellow-500" />
                                    <span className="font-bold text-yellow-600 dark:text-yellow-400">
                                        Achievement Unlocked!
                                    </span>
                                </div>

                                <div className="text-lg font-semibold text-gray-800 dark:text-white">
                                    {achievement.milestone}-Day Streak!
                                </div>

                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {achievement.message}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AchievementToast;
