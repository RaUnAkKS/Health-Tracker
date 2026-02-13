import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Trophy, Star, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const LevelUpOverlay = ({ level, isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            // Trigger confetti explosion
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#FFD700', '#FFA500', '#FF4500']
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#00BFFF', '#1E90FF', '#4169E1']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();

            // Auto close after animation
            const timer = setTimeout(() => {
                onClose();
            }, 3500);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

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
                        initial={{ scale: 0.5, y: 100 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{
                            type: "spring",
                            damping: 12,
                            stiffness: 100
                        }}
                        className="relative flex flex-col items-center"
                    >
                        {/* Glowing Background Effect */}
                        <div className="absolute inset-0 bg-primary-500/30 blur-[100px] rounded-full" />

                        {/* Level Badge */}
                        <motion.div
                            animate={{
                                rotate: [0, -5, 5, 0],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative"
                        >
                            <Star className="w-64 h-64 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.6)]" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white pt-4">
                                <span className="text-xl font-bold uppercase tracking-widest opacity-90">Level</span>
                                <span className="text-7xl font-black">{level}</span>
                            </div>
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-8 text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 bg-300% animate-gradient"
                        >
                            LEVEL UP!
                        </motion.h2>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-4 text-gray-300 text-lg font-medium flex items-center gap-2"
                        >
                            <Sparkles className="text-yellow-400" size={20} />
                            New limits unlocked
                            <Sparkles className="text-yellow-400" size={20} />
                        </motion.p>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="mt-12 px-8 py-3 bg-white text-primary-600 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
                        >
                            Continue
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LevelUpOverlay;
