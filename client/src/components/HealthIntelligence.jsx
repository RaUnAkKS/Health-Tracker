import { motion } from 'framer-motion';
import { Brain, Activity, Moon, Clock, TrendingUp, Sparkles } from 'lucide-react';

const HealthIntelligence = ({
    age,
    bmiCategory,
    activityPattern,
    recoveryPattern,
    sugarTiming,
    riskTrend,
}) => {
    const getRiskColor = (trend) => {
        if (trend === 'Low') return 'text-green-600 dark:text-green-400';
        if (trend === 'Moderate') return 'text-yellow-600 dark:text-yellow-400';
        return 'text-orange-600 dark:text-orange-400';
    };

    const getRiskBg = (trend) => {
        if (trend === 'Low') return 'bg-green-50 dark:bg-green-900/20';
        if (trend === 'Moderate') return 'bg-yellow-50 dark:bg-yellow-900/20';
        return 'bg-orange-50 dark:bg-orange-900/20';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 mb-6"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg">
                    <Brain className="text-white" size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gradient">Your Health Intelligence</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        AI-powered insights based on your patterns
                    </p>
                </div>
            </div>

            {/* Intelligence Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Age */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={16} className="text-primary-600 dark:text-primary-400" />
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Age</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {age ? `${age} years` : 'Not set'}
                    </p>
                </motion.div>

                {/* BMI Category */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">BMI Category</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {bmiCategory}
                    </p>
                </motion.div>

                {/* Activity Pattern */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-lg"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Activity size={16} className="text-green-600 dark:text-green-400" />
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Activity Pattern</p>
                    </div>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {activityPattern}
                    </p>
                </motion.div>

                {/* Recovery Pattern */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-lg"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Moon size={16} className="text-purple-600 dark:text-purple-400" />
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Recovery Pattern</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {recoveryPattern}
                    </p>
                </motion.div>

                {/* Sugar Timing */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 rounded-lg"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Clock size={16} className="text-orange-600 dark:text-orange-400" />
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Typical Sugar Timing</p>
                    </div>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                        {sugarTiming}
                    </p>
                </motion.div>

                {/* Risk Trend */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg ${getRiskBg(riskTrend)}`}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className={getRiskColor(riskTrend)} />
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Risk Trend</p>
                    </div>
                    <p className={`text-2xl font-bold ${getRiskColor(riskTrend)}`}>
                        {riskTrend}
                    </p>
                </motion.div>
            </div>

            {/* Explainability Section */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    <span className="font-semibold text-gray-900 dark:text-white">How this works:</span>{' '}
                    Your insights are generated using your activity pattern, sleep trends, and logging behavior.
                    We analyze these patterns to provide personalized recommendations that help you make
                    better choices. All data stays private and is processed locally.
                </p>
            </div>
        </motion.div>
    );
};

export default HealthIntelligence;
