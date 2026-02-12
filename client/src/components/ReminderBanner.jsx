import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Reminder Banner - Context-aware daily reminder
 * Shows when user hasn't logged today
 */
const ReminderBanner = ({ streak, loggedToday, onDismiss }) => {
    if (loggedToday) return null;

    const getMessage = () => {
        if (streak === 0) {
            return {
                text: "Start your streak today.",
                icon: "🌟",
                color: "from-blue-500 to-purple-500",
            };
        } else if (streak >= 7) {
            return {
                text: `${streak} days strong 🔥 Don't break momentum.`,
                icon: "💪",
                color: "from-orange-500 to-red-500",
            };
        } else if (streak >= 3) {
            return {
                text: "You're building consistency. Protect it.",
                icon: "🔥",
                color: "from-green-500 to-teal-500",
            };
        } else {
            return {
                text: "Log today to protect your streak.",
                icon: "⚡",
                color: "from-primary-500 to-secondary-500",
            };
        }
    };

    const message = getMessage();

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`
                    relative overflow-hidden rounded-xl p-4 mb-4
                    bg-gradient-to-r ${message.color}
                    shadow-lg
                `}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                    }} />
                </div>

                {/* Content */}
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{message.icon}</span>
                        <p className="text-white font-semibold">
                            {message.text}
                        </p>
                    </div>

                    {onDismiss && (
                        <button
                            onClick={onDismiss}
                            className="text-white/80 hover:text-white transition-colors p-1"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Animated Pulse */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"
                    animate={{
                        scaleX: [0, 1, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </motion.div>
        </AnimatePresence>
    );
};

export default ReminderBanner;
