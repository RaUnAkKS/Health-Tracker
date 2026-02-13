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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="relative w-full max-w-sm"
                    >
                        <div className="glass-card p-6 border-2 border-yellow-400 dark:border-yellow-500 shadow-2xl relative overflow-hidden">
                            {/* Background Glow */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 via-orange-500 to-yellow-300" />
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />

                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors z-10"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex flex-col items-center text-center gap-4 pt-2">
                                <motion.div
                                    animate={{
                                        rotate: [0, 10, -10, 0],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
                                    className="text-6xl drop-shadow-md"
                                >
                                    {achievement.emoji}
                                </motion.div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-400 font-bold uppercase tracking-wider text-sm">
                                        <PartyPopper size={18} />
                                        Achievement Unlocked
                                        <PartyPopper size={18} />
                                    </div>

                                    <h3 className="text-2xl font-black text-gray-800 dark:text-white leading-tight">
                                        {achievement.milestone}-Day Streak!
                                    </h3>

                                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                                        {achievement.message}
                                    </p>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="mt-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                                >
                                    Awesome!
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AchievementToast;
