import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, X } from 'lucide-react';

/**
 * Badge Unlock - Celebration modal for badge achievements
 */
const BadgeUnlock = ({ badge, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Trigger confetti
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#FFD700', '#FFA500', '#4ADE80', '#60A5FA'],
        });

        // Auto-dismiss after 5 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onDismiss, 300);
        }, 5000);

        return () => clearTimeout(timer);
    }, [onDismiss]);

    if (!badge) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onDismiss, 300);
                    }}
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: 'spring', duration: 0.8 }}
                        className="glass-card p-8 max-w-sm w-full text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => {
                                setIsVisible(false);
                                setTimeout(onDismiss, 300);
                            }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <X size={20} />
                        </button>

                        {/* Badge Unlocked Header */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mb-4"
                        >
                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                                Badge Unlocked!
                            </h2>
                        </motion.div>

                        {/* Badge Icon */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="flex justify-center mb-6"
                        >
                            <div className="relative">
                                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl">
                                    <Award size={48} className="text-white" />
                                </div>

                                {/* Glow Effect */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.5, 0.8, 0.5],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                    className="absolute inset-0 bg-yellow-400 rounded-full blur-xl -z-10"
                                />
                            </div>
                        </motion.div>

                        {/* Badge Info */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                {badge.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {badge.description}
                            </p>
                        </motion.div>

                        {/* Sparkles */}
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute text-yellow-400 text-xl"
                                style={{
                                    left: `${20 + i * 10}%`,
                                    top: `${30 + (i % 2) * 40}%`,
                                }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 0],
                                    rotate: [0, 360],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                            >
                                ✨
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BadgeUnlock;
