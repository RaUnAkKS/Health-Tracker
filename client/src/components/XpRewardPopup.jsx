import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { useEffect } from 'react';

const XpRewardPopup = ({ xp, onClose, isBonus = false }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 1500);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.4, type: 'spring' }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 border-2 border-yellow-400 relative overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-yellow-400/10 blur-xl rounded-full" />

                {/* Icon */}
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                    {isBonus ? (
                        <Trophy size={64} className="text-yellow-500 drop-shadow-lg" />
                    ) : (
                        <Star size={64} className="text-yellow-400 drop-shadow-lg" />
                    )}
                </motion.div>

                {/* Text */}
                <div className="text-center z-10">
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl font-black text-gray-800 dark:text-white"
                    >
                        +{xp} XP
                    </motion.h2>
                    <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mt-1 uppercase tracking-wider">
                        {isBonus ? 'Mega Bonus!' : 'Action Completed!'}
                    </p>
                </div>

                {/* Confetti Particles (Simplified CSS/Divs) */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                            animate={{
                                opacity: 0,
                                scale: 1,
                                x: (Math.random() - 0.5) * 200,
                                y: (Math.random() - 0.5) * 200,
                            }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-yellow-400"
                        />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default XpRewardPopup;
