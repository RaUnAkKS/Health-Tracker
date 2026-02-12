import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { cardVariants } from '../utils/animations';

const InsightCard = ({ insight }) => {
    if (!insight) return null;

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="glass-card p-6"
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="text-yellow-500" size={24} />
                <span className="font-bold text-lg text-gray-800 dark:text-white">
                    Personalized Insight
                </span>
            </div>

            {/* Main Insight Message */}
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                    {insight.message}
                </p>
            </div>

            {/* Recommended Action */}
            <div className="space-y-3">
                <div className="flex items-start gap-2">
                    <ArrowRight className="text-primary-500 mt-1 flex-shrink-0" size={20} />
                    <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Recommended Action:
                        </div>
                        <div className="font-semibold text-primary-600 dark:text-primary-400 text-lg">
                            {insight.action}
                        </div>
                    </div>
                </div>

                {/* Reasoning */}
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Why this action?
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        {insight.reasoning}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default InsightCard;
