import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Trophy, Zap } from 'lucide-react';
import { xpGainVariants } from '../utils/animations';
import { useEffect, useState, useRef } from 'react';

const XPDisplay = ({ xp, level, latestXPGain }) => {
    // Progressive Leveling Logic
    // L1 -> L2 requires 25 XP
    // L2 -> L3 requires 50 XP
    // Requirement increases by 25 XP per level

    // Calculate XP required to reach the START of current level
    // Sum of arithmetic series: n/2 * (2a + (n-1)d)
    // where n = level-1, a = 25, d = 25
    const xpAtCurrentLevelStart = (12.5 * (level - 1) * level);

    // XP required to complete current level and reach next level
    // This level's specific requirement = 25 * level
    const xpRequiredForThisLevel = 25 * level;

    // XP needed to reach next level total
    const xpAtNextLevelStart = xpAtCurrentLevelStart + xpRequiredForThisLevel;

    // Progress within this specific level
    const xpInCurrentLevel = xp - xpAtCurrentLevelStart;
    const progress = Math.min(100, Math.max(0, (xpInCurrentLevel / xpRequiredForThisLevel) * 100));
    const xpRemaining = xpRequiredForThisLevel - xpInCurrentLevel;

    // Animation control for the progress bar
    const controls = useAnimation();
    const prevLevel = useRef(level);

    useEffect(() => {
        const animateProgress = async () => {
            if (level > prevLevel.current) {
                // Level Up Logic:
                // 1. Fill to 100%
                await controls.start({
                    width: '100%',
                    transition: { duration: 0.3, ease: 'easeOut' }
                });

                // 2. Instant reset to 0 (no transition)
                await controls.start({
                    width: '0%',
                    transition: { duration: 0 }
                });

                // 3. Fill to new progress
                await controls.start({
                    width: `${progress}%`,
                    transition: { duration: 0.6, ease: 'easeOut', delay: 0.1 }
                });
            } else {
                // Normal progress update
                controls.start({
                    width: `${progress}%`,
                    transition: { duration: 0.5, ease: 'easeOut' }
                });
            }
            prevLevel.current = level;
        };

        animateProgress();
    }, [xp, level, progress, controls]);

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
                        <motion.div
                            key={level} // Triggers animation on change
                            initial={{ scale: 1.5, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 inline-block origin-left"
                        >
                            {level}
                        </motion.div>
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
                        <span>{Math.floor(xpInCurrentLevel)} / {xpRequiredForThisLevel} XP</span>
                        <span>{Math.ceil(xpRemaining)} XP to Level {level + 1}</span>
                    </div>

                    <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-accent-500 to-secondary-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={controls}
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
