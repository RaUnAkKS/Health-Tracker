import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, TrendingUp, CheckCircle2 } from 'lucide-react';
import Layout from '../components/Layout';
import useLogStore from '../store/logStore';
import useGameStore from '../store/gameStore';
import useSettingsStore from '../store/settingsStore';
import XpRewardPopup from '../components/XpRewardPopup';
import { playSuccessSound, triggerHaptic } from '../utils/sounds';
import { pageVariants, listItemVariants } from '../utils/animations';

import LogDetailsModal from '../components/LogDetailsModal';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { getTaskForAction, TASKS_DATA } from '../data/tasksData';

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
    const { logs, totalLogs, fetchLogs, completeAction } = useLogStore();
    const { awardXP, xp, fetchGamificationData } = useGameStore();
    const { soundEnabled, hapticEnabled } = useSettingsStore();

    const [showReward, setShowReward] = useState(false);
    const [rewardXP, setRewardXP] = useState(0);
    const [isBonus, setIsBonus] = useState(false);
    const [completingLogId, setCompletingLogId] = useState(null);
    const [selectedLog, setSelectedLog] = useState(null); // For details modal

    useEffect(() => {
        fetchLogs();
        fetchGamificationData();
    }, []);

    const handleCompleteAction = async (logId) => {
        if (completingLogId) return;
        setCompletingLogId(logId);

        console.log('[History] Completing action for log:', logId);
        const result = await completeAction(logId);

        if (result.success) {
            const { gamification } = result.data;

            // Show XP reward popup!
            if (gamification) {
                setRewardXP(gamification.xpGained);
                setIsBonus(gamification.wasQuick || gamification.xpGained >= 10);
                setShowReward(true);

                // Update local game store state
                awardXP(gamification.xpGained);
            }

            // Play sound and haptic
            if (soundEnabled) playSuccessSound();
            if (hapticEnabled) triggerHaptic();

            // Refresh logs to update UI
            await fetchLogs();
            await fetchGamificationData();
        } else {
            alert(result.error || 'Failed to complete action');
        }
        setCompletingLogId(null);
    };

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
                                {totalLogs}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Total Logs
                            </div>
                        </div>

                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                {xp}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Total XP
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
                            {logs.map((log, index) => {
                                // 1. Try to find task by persisted ID first
                                let task = null;
                                if (log.correctiveActionTaskId) {
                                    task = TASKS_DATA.find(t => t.id === log.correctiveActionTaskId);
                                }

                                // 2. Fallback to text matching
                                if (!task && log.insightGenerated?.action) {
                                    task = getTaskForAction(log.insightGenerated.action);
                                }

                                // Determine Display Title
                                let displayTitle = PRESET_NAMES[log.type] || 'Custom Log';
                                if (log.type === 'CUSTOM') {
                                    displayTitle = log.description || 'Custom Sugar Log';
                                }

                                return (
                                    <motion.div
                                        key={log._id}
                                        custom={index}
                                        variants={listItemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="glass-card p-4 hover:shadow-lg transition-all cursor-pointer active:scale-95"
                                        onClick={() => setSelectedLog(log)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {/* Icon / Thumbnail */}
                                                <div className="relative">
                                                    {log.photoUrl ? (
                                                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600 shadow-sm">
                                                            <img
                                                                src={log.photoUrl}
                                                                alt="Log"
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '📷'; }}
                                                            />
                                                            <div className="absolute bottom-0 right-0 p-0.5 bg-black/50 rounded-tl-md">
                                                                <Camera size={8} className="text-white" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-3xl w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                                            {PRESET_ICONS[log.type] || '🍬'}
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <div className="font-semibold text-gray-800 dark:text-white line-clamp-1">
                                                        {displayTitle}
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        {formatDate(log.createdAt)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right flex flex-col items-end gap-1">
                                                <div className="text-orange-600 dark:text-orange-400 font-semibold">
                                                    {log.sugarAmount}g
                                                </div>
                                                {log.xpAwarded > 0 && (
                                                    <div className="text-xs text-primary-600 dark:text-primary-400">
                                                        +{log.xpAwarded} XP
                                                    </div>
                                                )}

                                                {/* Action Display */}
                                                {log.correctiveActionCompleted ? (
                                                    <div className="flex flex-col items-end gap-1 mt-1">
                                                        <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">
                                                            <CheckCircle2 size={12} />
                                                            <span className="font-medium">Complete</span>
                                                        </div>
                                                        {task && (
                                                            <div className="flex items-center gap-1 opacity-70">
                                                                <task.icon size={10} className="text-gray-500 dark:text-gray-400" />
                                                                <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[80px]">
                                                                    {task.title}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-end gap-2 mt-2">
                                                        {task && (
                                                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r ${task.color} bg-opacity-10 text-white shadow-sm`}>
                                                                <task.icon size={12} className="text-white" />
                                                                <span className="text-[10px] font-bold text-white max-w-[80px] truncate">
                                                                    {task.title}
                                                                </span>
                                                            </div>
                                                        )}

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent modal open
                                                                handleCompleteAction(log._id);
                                                            }}
                                                            disabled={completingLogId === log._id}
                                                            className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-full font-bold hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors flex items-center gap-1"
                                                        >
                                                            {completingLogId === log._id ? 'Doing...' : 'Action'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* XP Reward Popup */}
                <AnimatePresence>
                    {showReward && (
                        <XpRewardPopup
                            xp={rewardXP}
                            isBonus={isBonus}
                            onClose={() => setShowReward(false)}
                        />
                    )}
                </AnimatePresence>

                {/* Log Details Modal */}
                <LogDetailsModal
                    isOpen={!!selectedLog}
                    log={selectedLog}
                    onClose={() => setSelectedLog(null)}
                />
            </motion.div>
        </Layout>
    );
};

export default History;
