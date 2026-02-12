import { motion } from 'framer-motion';

/**
 * Animated Flame Icon - Visual indicator for streak
 * Changes appearance based on streak length
 */
const AnimatedFlame = ({ streak = 0 }) => {
    // Determine flame characteristics based on streak
    const getFlameConfig = () => {
        if (streak >= 30) {
            return {
                size: 'w-12 h-12',
                color: 'from-yellow-400 via-orange-500 to-red-600',
                glow: 'drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]',
                particles: true,
                animation: 'animate-bounce',
            };
        } else if (streak >= 7) {
            return {
                size: 'w-10 h-10',
                color: 'from-orange-400 via-red-500 to-orange-600',
                glow: 'drop-shadow-[0_0_6px_rgba(251,146,60,0.6)]',
                particles: false,
                animation: 'animate-pulse',
            };
        } else if (streak >= 3) {
            return {
                size: 'w-8 h-8',
                color: 'from-orange-500 to-red-500',
                glow: 'drop-shadow-[0_0_4px_rgba(249,115,22,0.4)]',
                particles: false,
                animation: '',
            };
        } else {
            return {
                size: 'w-6 h-6',
                color: 'from-orange-400 to-orange-500',
                glow: '',
                particles: false,
                animation: '',
            };
        }
    };

    const config = getFlameConfig();

    return (
        <div className="relative flex items-center justify-center">
            {/* Particles for 30+ days */}
            {config.particles && (
                <>
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                            animate={{
                                y: [-20, -40],
                                x: [0, (i - 1) * 10],
                                opacity: [1, 0],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.3,
                            }}
                        />
                    ))}
                </>
            )}

            {/* Flame SVG */}
            <motion.svg
                className={`${config.size} ${config.glow} ${config.animation}`}
                viewBox="0 0 24 24"
                fill="none"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
            >
                <defs>
                    <linearGradient id={`flameGradient-${streak}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" className="text-yellow-400" stopColor="currentColor" />
                        <stop offset="50%" className="text-orange-500" stopColor="currentColor" />
                        <stop offset="100%" className="text-red-600" stopColor="currentColor" />
                    </linearGradient>
                </defs>

                {/* Main Flame */}
                <motion.path
                    d="M12 2C12 2 6 7 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 7 12 2 12 2Z"
                    fill={`url(#flameGradient-${streak})`}
                    animate={streak >= 7 ? {
                        scale: [1, 1.1, 1],
                    } : {}}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                {/* Inner Flame */}
                <motion.path
                    d="M12 6C12 6 9 9 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 9 12 6 12 6Z"
                    fill="#FEF3C7"
                    opacity="0.8"
                    animate={streak >= 3 ? {
                        opacity: [0.6, 0.9, 0.6],
                    } : {}}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                {/* Core */}
                {streak >= 7 && (
                    <motion.circle
                        cx="12"
                        cy="12"
                        r="2"
                        fill="#FFFFFF"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                )}
            </motion.svg>

            {/* Streak Number Badge */}
            {streak > 0 && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`
                        absolute -bottom-1 -right-1 
                        ${streak >= 30 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-orange-500'}
                        text-white text-xs font-bold 
                        rounded-full w-5 h-5 
                        flex items-center justify-center
                        shadow-lg
                    `}
                >
                    {streak}
                </motion.div>
            )}
        </div>
    );
};

export default AnimatedFlame;
