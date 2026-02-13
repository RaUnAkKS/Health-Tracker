import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

const InsightHistory = () => {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInsightHistory();
    }, []);

    const fetchInsightHistory = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/users/insights?limit=5`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setInsights(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching insight history:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="glass-card p-6 mb-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (insights.length === 0) {
        return (
            <div className="glass-card p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <Lightbulb className="text-primary-600 dark:text-primary-400" size={24} />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Recent AI Insights
                    </h3>
                </div>
                <div className="text-center py-8">
                    <Sparkles className="mx-auto mb-3 text-gray-400" size={48} />
                    <p className="text-gray-600 dark:text-gray-400">
                        Start logging your sugar intake to receive personalized AI insights!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6 mb-6"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="text-primary-600 dark:text-primary-400" size={24} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Recent AI Insights
                </h3>
            </div>

            {/* Insight Cards */}
            <div className="space-y-4">
                <AnimatePresence>
                    {insights.map((insight, index) => (
                        <motion.div
                            key={insight._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 hover:shadow-md transition-shadow"
                        >
                            {/* Date */}
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar size={14} className="text-gray-500 dark:text-gray-400" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {format(new Date(insight.createdAt), 'MMM d, yyyy • h:mm a')}
                                </span>
                            </div>

                            {/* Insight Message */}
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                {insight.message}
                            </p>

                            {/* Suggested Action */}
                            <div className="flex items-start gap-2 p-3 bg-white dark:bg-gray-800/50 rounded-lg">
                                <ArrowRight
                                    size={16}
                                    className="text-accent-600 dark:text-accent-400 mt-0.5 flex-shrink-0"
                                />
                                <div>
                                    <p className="text-xs font-semibold text-accent-900 dark:text-accent-100 mb-1">
                                        Suggested Action:
                                    </p>
                                    <p className="text-xs text-gray-700 dark:text-gray-300">
                                        {insight.action}
                                    </p>
                                </div>
                            </div>

                            {/* Reasoning (optional, can be toggled) */}
                            {insight.reasoning && (
                                <details className="mt-2">
                                    <summary className="text-xs text-primary-600 dark:text-primary-400 cursor-pointer hover:underline">
                                        Why this matters
                                    </summary>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 ml-4">
                                        {insight.reasoning}
                                    </p>
                                </details>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default InsightHistory;
