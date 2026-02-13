/**
 * Common Framer Motion animation variants
 */

export const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.2,
        },
    },
};

export const cardVariants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.2,
            ease: 'easeOut',
        },
    },
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.2,
        },
    },
    tap: {
        scale: 0.95,
    },
};

export const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.3,
        },
    }),
};

export const xpGainVariants = {
    initial: {
        opacity: 0,
        y: 0,
        scale: 0.5,
    },
    animate: {
        opacity: [0, 1, 1, 0],
        y: [0, -50, -80, -100],
        scale: [0.5, 1.2, 1, 0.8],
        transition: {
            duration: 1.5,
            times: [0, 0.2, 0.8, 1],
            ease: 'easeOut',
        },
    },
};

export const streakFlameVariants = {
    animate: {
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

export const slideUpVariants = {
    hidden: {
        y: '100%',
        opacity: 0,
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
        },
    },
    exit: {
        y: '100%',
        opacity: 0,
        transition: {
            duration: 0.2,
        },
    },
};
