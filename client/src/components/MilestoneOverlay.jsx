import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Flame, Star, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

const MilestoneOverlay = ({ streak, isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            // Trigger confetti explosion - Orange/Fire theme
            const duration = 2000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#FF4500', '#FFA500', '#FFD700'] // Red Orange Yellow
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#FF4500', '#FFA500', '#FFD700']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();

            // Auto close after animation
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    // Dynamic Content based on Streak
    const getTitle = () => {
        if (streak === 1) return "STREAK STARTED!";
        if (streak % 10 === 0) return "MILESTONE REACHED!";
        return "STREAK ON FIRE!";
    };

    const getMessage = () => {
        if (streak === 1) return "First step taken. Keep it going!";
        if (streak % 10 === 0) return "Incredible dedication!";
        return "Consistency is key!";
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.5, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{
                            type: "spring",
                            damping: 12,
                            stiffness: 100
                        }}
                        className="relative flex flex-col items-center"
                    >
                        {/* Glowing Background Effect */}
                        <div className="absolute inset-0 bg-orange-500/30 blur-[100px] rounded-full" />

                        {/* Streak Badge */}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative mb-6"
                        >
                            <Flame className="w-48 h-48 text-orange-500 fill-orange-500 drop-shadow-[0_0_50px_rgba(249,115,22,0.6)]" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white pt-8">
                                <span className="text-6xl font-black drop-shadow-lg">{streak}</span>
                                <span className="text-xl font-bold uppercase tracking-widest opacity-90 drop-shadow-md">Days</span>
                            </div>
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 animate-gradient text-center"
                        >
                            {getTitle()}
                        </motion.h2>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-4 text-gray-300 text-lg font-medium flex items-center gap-2"
                        >
                            <Star className="text-yellow-400 fill-yellow-400" size={20} />
                            {getMessage()}
                            <Award className="text-yellow-400 fill-yellow-400" size={20} />
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MilestoneOverlay;
