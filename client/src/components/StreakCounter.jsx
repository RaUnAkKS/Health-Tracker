import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ShieldCheck } from 'lucide-react';
import { streakFlameVariants } from '../utils/animations';
import { useEffect, useState, useRef } from 'react';

const StreakCounter = ({ streak, loggedToday, streakAtRisk }) => {
    const prevStreak = useRef(streak);
    const [justIncreased, setJustIncreased] = useState(false);

    useEffect(() => {
        if (streak > prevStreak.current) {
            setJustIncreased(true);
            const timer = setTimeout(() => setJustIncreased(false), 2000);
            return () => clearTimeout(timer);
        }
        prevStreak.current = streak;
    }, [streak]);

    return (
        <div className="glass-card p-6 text-center relative overflow-hidden">
            {/* Background Glow for high streaks */}
            {streak > 3 && (
                <div className="absolute inset-0 bg-orange-500/5 blur-xl rounded-full pointer-events-none" />
            )}

            <motion.div
                variants={streakFlameVariants}
                animate="animate"
                className="inline-block text-6xl mb-2 relative"
            >
                {/* Glow behind flame */}
                <div className="absolute inset-0 bg-orange-500/30 blur-2xl rounded-full" />
                <span className="relative z-10">🔥</span>
            </motion.div>

            <div className="text-3xl font-bold text-gradient mb-1 flex justify-center items-center gap-2">
                <motion.span
                    key={streak} // Triggers animation on change
                    initial={{ scale: 1.5, y: -10, color: '#f97316' }}
                    animate={{ scale: 1, y: 0, color: 'inherit' }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                    {streak}
                </motion.span>
                <span>{streak === 1 ? 'Day' : 'Days'}</span>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Current Streak
            </div>

            <AnimatePresence mode="wait">
                {loggedToday ? (
                    <motion.div
                        key="logged"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium border border-green-200 dark:border-green-800"
                    >
                        <ShieldCheck size={16} />
                        Streak Protected
                    </motion.div>
                ) : (
                    streakAtRisk && streak > 0 ? (
                        <motion.div
                            key="risk"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-medium"
                        >
                            ⚠️ Log today to protect your streak!
                        </motion.div>
                    ) : (
                        streak === 0 && (
                            <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium">
                                Start your streak today! 🚀
                            </div>
                        )
                    )
                )}
            </AnimatePresence>
        </div>
    );
};

export default StreakCounter;
