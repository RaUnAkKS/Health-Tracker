import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { streakFlameVariants } from '../utils/animations';

const StreakCounter = ({ streak, loggedToday, streakAtRisk }) => {
    return (
        <div className="glass-card p-6 text-center">
            <motion.div
                variants={streakFlameVariants}
                animate="animate"
                className="inline-block text-6xl mb-2"
            >
                🔥
            </motion.div>

            <div className="text-3xl font-bold text-gradient mb-1">
                {streak} {streak === 1 ? 'Day' : 'Days'}
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Current Streak
            </div>

            {loggedToday && (
                <div className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium">
                    ✅ Logged today!
                </div>
            )}

            {streakAtRisk && !loggedToday && streak > 0 && (
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-medium"
                >
                    ⚠️ Log today to protect your streak!
                </motion.div>
            )}

            {!loggedToday && streak === 0 && (
                <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium">
                    Start your streak today! 🚀
                </div>
            )}
        </div>
    );
};

export default StreakCounter;
