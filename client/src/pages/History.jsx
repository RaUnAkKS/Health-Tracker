import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp } from 'lucide-react';
import Layout from '../components/Layout';
import useLogStore from '../store/logStore';
import { pageVariants, listItemVariants } from '../utils/animations';

const PRESET_ICONS = {
    CHAI: '☕',
    SWEETS: '🍰',
    COLD_DRINK: '🥤',
    PACKAGED_SNACK: '🍪',
    CUSTOM: '🍬',
};

const PRESET_NAMES = {
    CHAI: 'Chai',
    SWEETS: 'Sweets',
    COLD_DRINK: 'Cold Drink',
    PACKAGED_SNACK: 'Packaged Snack',
    CUSTOM: 'Custom',
};

const History = () => {
    const { logs, fetchLogs } = useLogStore();

    useEffect(() => {
        fetchLogs();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
        } else if (date.toDateString() === yesterday.toDateString()) {
            return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
        }
    };

    return (
        <Layout>
            <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
            >
                {/* Header */}
                <div className="text-center pt-4">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                        Your History 📊
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Track your sugar logging journey
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-primary-500" />
                        Overview
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="text-3xl font-bold text-gray-800 dark:text-white">
                                {logs.length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Total Logs
                            </div>
                        </div>

                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                {logs.reduce((sum, log) => sum + (log.xpAwarded || 0), 0)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                XP Earned
                            </div>
                        </div>
                    </div>
                </div>

                {/* Log List */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Calendar size={20} className="text-primary-500" />
                        Recent Logs
                    </h3>

                    {logs.length === 0 ? (
                        <div className="glass-card p-8 text-center">
                            <div className="text-6xl mb-4">📝</div>
                            <p className="text-gray-600 dark:text-gray-400">
                                No logs yet. Start tracking your sugar intake!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {logs.map((log, index) => (
                                <motion.div
                                    key={log._id}
                                    custom={index}
                                    variants={listItemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="glass-card p-4 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="text-3xl">
                                                {PRESET_ICONS[log.type]}
                                            </div>

                                            <div>
                                                <div className="font-semibold text-gray-800 dark:text-white">
                                                    {PRESET_NAMES[log.type]}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {formatDate(log.createdAt)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-orange-600 dark:text-orange-400 font-semibold">
                                                {log.sugarAmount}g
                                            </div>
                                            {log.xpAwarded > 0 && (
                                                <div className="text-xs text-primary-600 dark:text-primary-400">
                                                    +{log.xpAwarded} XP
                                                </div>
                                            )}
                                            {log.correctiveActionCompleted && (
                                                <div className="text-xs text-green-600 dark:text-green-400">
                                                    ✓ Action done
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </Layout>
    );
};

export default History;
