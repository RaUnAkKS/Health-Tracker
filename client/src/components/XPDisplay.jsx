import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap } from 'lucide-react';
import { xpGainVariants } from '../utils/animations';

const XPDisplay = ({ xp, level, latestXPGain }) => {
    const xpForNextLevel = 100;
    const currentLevelXP = xp % xpForNextLevel;
    const progress = (currentLevelXP / xpForNextLevel) * 100;

    return (
        <div className="glass-card p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 opacity-5 dark:opacity-10">
                <Trophy size={120} />
            </div>

            <div className="relative z-10">
                {/* Level */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Level
                        </div>
                        <div className="text-4xl font-bold text-gradient">
                            {level}
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Total XP
                        </div>
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1">
                            <Zap size={20} className="fill-current" />
                            {xp}
                        </div>
                    </div>
                </div>

                {/* XP Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>{currentLevelXP} XP</span>
                        <span>{xpForNextLevel - currentLevelXP} to Level {level + 1}</span>
                    </div>

                    <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-accent-500 to-secondary-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    </div>
                </div>
            </div>

            {/* Floating XP Gain Animation */}
            <AnimatePresence>
                {latestXPGain && (
                    <motion.div
                        variants={xpGainVariants}
                        initial="initial"
                        animate="animate"
                        exit={{ opacity: 0 }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    >
                        <div className="text-4xl font-bold text-yellow-500 drop-shadow-lg">
                            +{latestXPGain} XP
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default XPDisplay;
