import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

/**
 * Milestone Badge - Celebration component when milestone is achieved
 * Shows animated badge with confetti effect
 * Auto-dismisses after 5 seconds
 */
const MilestoneBadge = ({ milestone, onDismiss }) => {
    const [visible, setVisible] = useState(true);

    const milestoneData = {
        3: {
            emoji: '🔥',
            icon: Star,
            title: '3-Day Milestone!',
            message: 'Your discipline is building.',
            color: 'from-orange-400 to-red-500',
            iconColor: 'text-orange-500',
        },
        7: {
            emoji: '💪',
            icon: Trophy,
            title: '7-Day Milestone!',
            message: 'Your body is thanking you.',
            color: 'from-blue-400 to-purple-500',
            iconColor: 'text-purple-500',
        },
        30: {
            emoji: '🎉',
            icon: Sparkles,
            title: '30-Day Milestone!',
            message: "You're officially sugar-aware.",
            color: 'from-purple-400 to-pink-500',
            iconColor: 'text-pink-500',
        },
    };

    const data = milestoneData[milestone] || milestoneData[3];
    const Icon = data.icon;

    useEffect(() => {
        // Trigger confetti
        const duration = 3000;
        const animationEnd = Date.now() + duration;

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                particleCount,
                startVelocity: 30,
                spread: 360,
                origin: {
                    x: randomInRange(0.1, 0.3),
                    y: Math.random() - 0.2,
                },
            });
            confetti({
                particleCount,
                startVelocity: 30,
                spread: 360,
                origin: {
                    x: randomInRange(0.7, 0.9),
                    y: Math.random() - 0.2,
                },
            });
        }, 250);

        // Auto-dismiss after 5 seconds
        const timeout = setTimeout(() => {
            handleDismiss();
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    const handleDismiss = () => {
        setVisible(false);
        setTimeout(() => {
            if (onDismiss) onDismiss();
        }, 300);
    };

    // Play sound effect (optional)
    useEffect(() => {
        if (localStorage.getItem('soundEnabled') === 'true') {
            // Create a simple success sound
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        }
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={handleDismiss}
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="relative glass-card p-8 max-w-md mx-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleDismiss}
                            className="absolute top-4 right-4 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>

                        {/* Badge Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                            className="mb-6"
                        >
                            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${data.color} mb-4`}>
                                <Icon className="text-white" size={48} />
                            </div>
                        </motion.div>

                        {/* Emoji */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
                            className="text-6xl mb-4"
                        >
                            {data.emoji}
                        </motion.div>

                        {/* Title */}
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-3xl font-bold text-gray-800 dark:text-white mb-3"
                        >
                            {data.title}
                        </motion.h3>

                        {/* Message */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="text-lg text-gray-600 dark:text-gray-300 mb-6"
                        >
                            {data.message}
                        </motion.p>

                        {/* Dismiss Button */}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            onClick={handleDismiss}
                            className="btn-primary"
                        >
                            Awesome! 🎉
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MilestoneBadge;
