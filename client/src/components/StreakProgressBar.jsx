import { motion } from 'framer-motion';
import { Flame, Target } from 'lucide-react';

/**
 * Streak Progress Bar - Visual progress to next milestone
 */
const StreakProgressBar = ({ currentStreak, nextMilestone, daysRemaining, progress }) => {
    // Determine next milestone if not provided
    let actualNextMilestone = nextMilestone;
    let actualDaysRemaining = daysRemaining;
    let actualProgress = progress;

    if (!nextMilestone) {
        if (currentStreak < 3) {
            actualNextMilestone = 3;
            actualDaysRemaining = 3 - currentStreak;
            actualProgress = (currentStreak / 3) * 100;
        } else if (currentStreak < 7) {
            actualNextMilestone = 7;
            actualDaysRemaining = 7 - currentStreak;
            actualProgress = ((currentStreak - 3) / 4) * 100;
        } else if (currentStreak < 30) {
            actualNextMilestone = 30;
            actualDaysRemaining = 30 - currentStreak;
            actualProgress = ((currentStreak - 7) / 23) * 100;
        } else {
            // After 30, milestones are every 10 days
            const base = Math.floor((currentStreak - 30) / 10) * 10 + 30;
            actualNextMilestone = base + 10;
            actualDaysRemaining = actualNextMilestone - currentStreak;
            actualProgress = ((currentStreak - base) / 10) * 100;
        }
    }

    return (
        <div className="glass-card p-5 mb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Flame className="text-orange-500" size={20} />
                    <span className="font-semibold text-gray-800 dark:text-white">
                        {currentStreak}-Day Streak
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Target size={16} />
                    <span>{actualDaysRemaining} to next milestone</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
                {/* Background */}
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    {/* Animated Fill */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${actualProgress}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                        className="relative h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full overflow-hidden"
                    >
                        {/* Shimmer Effect */}
                        <motion.div
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full h-full"
                        />
                    </motion.div>
                </div>

                {/* Milestone Indicator */}
                <div className="absolute -top-1 right-0 transform translate-x-1/2">
                    <div className="bg-purple-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {actualNextMilestone}
                    </div>
                </div>
            </div>

            {/* Label */}
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                <span className="font-semibold">Day {currentStreak} of {actualNextMilestone}</span>
                {' '} · {actualDaysRemaining === 1 ? 'One more day!' : `${actualDaysRemaining} days to go`}
            </p>

            {/* Motivational Microcopy */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2 italic">
                {actualDaysRemaining <= 1
                    ? "You're so close!"
                    : "Keep going — you're almost there."}
            </p>
        </div>
    );
};

export default StreakProgressBar;
