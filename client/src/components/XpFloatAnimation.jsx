import { motion } from 'framer-motion';
import { Plus, Flame, Sparkles } from 'lucide-react';

const XpFloatAnimation = ({ xp, streak = 0 }) => {
    // Determine style based on XP amount
    const isHighXp = xp >= 9;
    const isMediumXp = xp >= 6 && xp < 9;

    // Dynamic styles
    const containerClasses = isHighXp
        ? "bg-purple-600 text-white border-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.6)]"
        : isMediumXp
            ? "bg-orange-500 text-white border-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
            : "bg-yellow-400 text-yellow-900 border-yellow-200 shadow-lg";

    const glowColor = isHighXp ? "bg-purple-500/50" : isMediumXp ? "bg-orange-500/50" : "bg-yellow-400/30";

    return (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-1">
            {/* Combo Multiplier */}
            {streak > 3 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0, y: 10 }}
                    animate={{ opacity: 1, scale: 1.1, y: 0 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="text-xs font-black italic text-orange-500 dark:text-orange-400 drop-shadow-sm flex items-center gap-1"
                >
                    <Flame size={12} className="fill-current" />
                    COMBO x{streak}
                </motion.div>
            )}

            {/* Main XP Bubble */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, y: -20, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, y: -50, scale: 0.8 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className={`relative flex items-center gap-1 px-4 py-1.5 rounded-full border-2 font-black text-xl whitespace-nowrap ${containerClasses}`}
            >
                <Plus size={18} strokeWidth={4} />
                {xp} XP

                {/* Background Glow */}
                <div className={`absolute inset-0 ${glowColor} blur-lg rounded-full -z-10`} />

                {/* High XP Sparkles */}
                {isHighXp && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute -right-2 -top-2 text-yellow-300"
                    >
                        <Sparkles size={16} fill="currentColor" />
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default XpFloatAnimation;
