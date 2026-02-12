import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import useUserStore from '../store/userStore';

/**
 * Daily Ritual Card - Duolingo-style daily prompt
 * Shows when user hasn't logged today
 */
const DailyRitualCard = ({ hasLoggedToday, currentStreak }) => {
    const { user } = useUserStore();
    const [showCard, setShowCard] = useState(!hasLoggedToday);

    useEffect(() => {
        setShowCard(!hasLoggedToday);
    }, [hasLoggedToday]);

    if (!showCard || hasLoggedToday) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="glass-card p-6 mb-6 border-2 border-primary-500 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20"
            >
                {/* Flame Icon with Streak */}
                <div className="flex items-center justify-center mb-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="relative"
                    >
                        <Flame className="text-orange-500" size={48} />
                        {currentStreak > 0 && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                            >
                                {currentStreak}
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 text-center">
                    Lower your sugar. Protect your energy.
                </h3>

                {/* Subtitle */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                    {currentStreak > 0
                        ? `Log today to protect your ${currentStreak}-day streak 🔥`
                        : 'Start your daily habit — track your sugar in 10 seconds'}
                </p>

                {/* CTA Button */}
                <Link to="/log" className="block">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
                    >
                        <Clock size={20} />
                        <span>Log Now (10 sec)</span>
                    </motion.button>
                </Link>

                {/* Motivational Microcopy */}
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4 italic">
                    Small steps. Big impact.
                </p>
            </motion.div>
        </AnimatePresence>
    );
};

export default DailyRitualCard;
