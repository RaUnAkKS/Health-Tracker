import { motion } from 'framer-motion';

/**
 * Toggle Setting Component
 * Simple on/off toggle for settings
 */
const ToggleSetting = ({ label, enabled, onToggle, description }) => {
    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <p className="font-medium text-gray-800 dark:text-white">{label}</p>
                {description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {description}
                    </p>
                )}
            </div>

            <button
                onClick={onToggle}
                className={`
                    relative inline-flex h-7 w-14 items-center rounded-full
                    transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    ${enabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}
                `}
            >
                <motion.span
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`
                        inline-block h-5 w-5 transform rounded-full bg-white shadow-lg
                        ${enabled ? 'translate-x-8' : 'translate-x-1'}
                    `}
                />
            </button>
        </div>
    );
};

export default ToggleSetting;
