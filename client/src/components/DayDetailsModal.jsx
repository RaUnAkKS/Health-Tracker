import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Utensils, Zap, Clock } from 'lucide-react';
import { logsAPI } from '../utils/api';
import useLogStore from '../store/logStore';
import LogDetailsModal from './LogDetailsModal'; // Re-use for deeper drill-down

const DayDetailsModal = ({ isOpen, onClose, date }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null); // For opening full details

    useEffect(() => {
        if (isOpen && date) {
            const fetchDayLogs = async () => {
                setLoading(true);
                try {
                    // Reuse API but we might need a specific endpoint or simple filtering
                    // Since we don't have a specific "get logs by exact date" endpoint readily handy that is optimized,
                    // we can use the main "getLogs" if it supports date filtering, OR
                    // since we usually don't have THAT many logs, we might just query the "Month" logs if we had them in store.
                    // BUT, to be clean, let's assume we want to just fetch for this day.
                    // Wait, getMonthStats only gave us counts.
                    // Let's implement a quick client-side filter if we have them, or fetch new.
                    // ACTUALLY, strict clean way: GET /logs with start/end date.
                    // Our getLogs API supports pagination.
                    // Let's iterate on this: For now, I'll assume we can pass a date range to getLogs.
                    // If not supported, I'll default to showing "No logs loaded" or update API.

                    // CHECK: logController.js getLogs uses plain find().
                    // It doesn't seem to support date range queries in the current implementation I saw.
                    // I will check logController.js again.
                    // It supports `limit` and `page`.
                    // It DOES NOT support date filtering.

                    // Hack/Optimization for now:
                    // I'll assume the user doesn't have thousands of logs per month.
                    // I'll add a 'date' query param to `getLogs` on the backend in same step?
                    // OR, better, `getTodayLogs` is for "Today".

                    // Let's add `date` param support to `getLogs` quickly in the next tool call.
                    // For now, I will write the code assuming `logsAPI.getLogs({ date: date.toISOString() })` works.

                    const response = await logsAPI.getLogs({
                        date: date.toISOString(),
                        limit: 50 // Get all logs for the day
                    });

                    setLogs(response.data.logs);
                } catch (error) {
                    console.error("Failed to load day logs", error);
                    setLogs([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchDayLogs();
        }
    }, [isOpen, date]);

    if (!isOpen || !date) return null;

    const dateStr = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const totalSugar = logs.reduce((sum, log) => sum + log.sugarAmount, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden max-h-[80vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                            <div>
                                <div className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                                    Day Summary
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                    {dateStr}
                                </h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 overflow-y-auto flex-1">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : logs.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <div className="text-4xl mb-3">📅</div>
                                    <p>No logs recorded for this day.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Daily Stats */}
                                    <div className="flex gap-4 mb-6">
                                        <div className="flex-1 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800">
                                            <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold uppercase">Total Sugar</div>
                                            <div className="text-2xl font-bold text-gray-800 dark:text-white">{totalSugar}g</div>
                                        </div>
                                        <div className="flex-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                                            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase">Logs</div>
                                            <div className="text-2xl font-bold text-gray-800 dark:text-white">{logs.length}</div>
                                        </div>
                                    </div>

                                    {/* Log List */}
                                    <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                        Timeline
                                    </h4>
                                    <div className="space-y-2">
                                        {logs.map(log => (
                                            <div
                                                key={log._id}
                                                onClick={() => setSelectedLog(log)}
                                                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                            >
                                                <div className="text-2xl">
                                                    {['CHAI', 'SWEETS'].includes(log.type) ? (log.type === 'CHAI' ? '☕' : '🍰') : '🍬'}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-800 dark:text-white text-sm">
                                                        {log.description || log.type.replace(/_/g, ' ')}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                                <div className="font-bold text-orange-600 dark:text-orange-400 text-sm">
                                                    {log.sugarAmount}g
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Nested Modal for Full Details */}
            <LogDetailsModal
                isOpen={!!selectedLog}
                log={selectedLog}
                onClose={() => setSelectedLog(null)}
            />
        </AnimatePresence>
    );
};

export default DayDetailsModal;
