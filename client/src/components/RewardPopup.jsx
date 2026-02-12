import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

/**
 * Reward Popup - Displays XP rewards with confetti for bonuses
 */
const RewardPopup = ({ xp, isBonus = false, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Trigger confetti for bonus rewards
        if (isBonus) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#FFA500', '#FF6347'],
            });
        }

        // Auto-close after 3 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, 3000);

        return () => clearTimeout(timer);
    }, [isBonus, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -50 }}
                    className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                >
                    <div className="pointer-events-auto">
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: 2,
                            }}
                            className={`
                                glass-card p-6 
                                ${isBonus ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500' : 'bg-gradient-to-br from-primary-500 to-secondary-500'}
                                shadow-2xl
                                rounded-2xl
                                text-white
                            `}
                        >
                            {isBonus && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center mb-2"
                                >
                                    <span className="text-sm font-bold uppercase tracking-wider">
                                        🎉 Surprise Bonus! 🎉
                                    </span>
                                </motion.div>
                            )}

                            <div className="text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                    className="text-6xl font-bold mb-2"
                                >
                                    +{xp}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-xl font-semibold"
                                >
                                    XP
                                </motion.div>
                            </div>

                            {/* Animated Stars */}
                            {isBonus && (
                                <>
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute text-yellow-300 text-2xl"
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{
                                                opacity: [0, 1, 0],
                                                scale: [0, 1, 0],
                                                x: [0, (i - 2) * 30],
                                                y: [0, -50],
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                delay: i * 0.1,
                                            }}
                                        >
                                            ✨
                                        </motion.div>
                                    ))}
                                </>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RewardPopup;
