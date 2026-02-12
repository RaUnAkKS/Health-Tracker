import { motion } from 'framer-motion';
import { cardVariants } from '../utils/animations';

const ProgressBar = ({ current, total, showLabel = true }) => {
    const percentage = Math.min((current / total) * 100, 100);

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
        >
            {showLabel && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progress
                    </span>
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                        {current}/{total}
                    </span>
                </div>
            )}

            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>
        </motion.div>
    );
};

export default ProgressBar;
