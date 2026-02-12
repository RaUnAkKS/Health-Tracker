import { motion } from 'framer-motion';
import { cardVariants } from '../utils/animations';

const PRESET_ICONS = {
    CHAI: '☕',
    SWEETS: '🍰',
    COLD_DRINK: '🥤',
    PACKAGED_SNACK: '🍪',
};

const PRESET_NAMES = {
    CHAI: 'Chai',
    SWEETS: 'Sweets',
    COLD_DRINK: 'Cold Drink',
    PACKAGED_SNACK: 'Packaged Snack',
};

const SugarLogCard = ({ type, onClick, disabled = false }) => {
    return (
        <motion.button
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={!disabled ? "hover" : {}}
            whileTap={!disabled ? "tap" : {}}
            onClick={onClick}
            disabled={disabled}
            className={`preset-card flex flex-col items-center justify-center gap-3 min-h-[140px] w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
        >
            <div className="text-5xl">
                {PRESET_ICONS[type]}
            </div>

            <div className="text-lg font-semibold text-gray-800 dark:text-white">
                {PRESET_NAMES[type]}
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                Tap to log
            </div>
        </motion.button>
    );
};

export default SugarLogCard;
