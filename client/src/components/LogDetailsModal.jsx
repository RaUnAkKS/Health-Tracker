import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Droplets, Utensils, Zap, Image as ImageIcon } from 'lucide-react';

const LogDetailsModal = ({ isOpen, onClose, log }) => {
    if (!isOpen || !log) return null;

    // Format Date & Time
    const dateObj = new Date(log.createdAt);
    const dateStr = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const timeStr = dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });

    const getIconForType = (type) => {
        switch (type) {
            case 'CHAI': return '☕';
            case 'SWEETS': return '🍰';
            case 'COLD_DRINK': return '🥤';
            case 'PACKAGED_SNACK': return '🍪';
            default: return '🍬';
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Photo Header (if exists) */}
                    {log.photoUrl ? (
                        <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-700">
                            <img
                                src={log.photoUrl}
                                alt="Log content"
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="relative p-6 pt-12 pb-8 bg-gradient-to-br from-primary-500 to-purple-600 text-white text-center">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="text-6xl mb-4 transform hover:scale-110 transition-transform duration-300 inline-block">
                                {getIconForType(log.type)}
                            </div>
                            <h2 className="text-2xl font-bold">
                                {Number(log.sugarAmount)}g Sugar
                            </h2>
                        </div>
                    )}

                    {/* Content Body */}
                    <div className="p-6 space-y-6 overflow-y-auto">

                        {/* Title / Description */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                {log.description || (log.type === 'CUSTOM' ? 'Custom Log' : log.type.replace(/_/g, ' '))}
                            </h3>
                            {log.aiDetectedFood && (
                                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium flex items-center gap-1.5 bg-primary-50 dark:bg-primary-900/20 py-1 px-2 rounded-lg inline-block mb-2">
                                    <Zap size={12} />
                                    AI Detected: {log.aiDetectedFood}
                                </p>
                            )}
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                                {log.insightGenerated?.message || "No specific details recorded for this log."}
                            </p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                                    <Clock size={14} />
                                    <span className="text-xs font-medium uppercase tracking-wider">Time</span>
                                </div>
                                <div className="font-semibold text-gray-800 dark:text-gray-200">
                                    {timeStr}
                                </div>
                            </div>

                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                                    <Calendar size={14} />
                                    <span className="text-xs font-medium uppercase tracking-wider">Date</span>
                                </div>
                                <div className="font-semibold text-gray-800 dark:text-gray-200">
                                    {dateStr}
                                </div>
                            </div>

                            {Number(log.sugarAmount) > 0 && (
                                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl col-span-2">
                                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
                                        <Utensils size={14} />
                                        <span className="text-xs font-medium uppercase tracking-wider">Sugar Load</span>
                                    </div>
                                    <div className="font-bold text-lg text-gray-800 dark:text-gray-200">
                                        {log.sugarAmount}g
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Corrective Action Status */}
                        {log.correctiveActionCompleted ? (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full text-green-600 dark:text-green-300">
                                    <Zap size={18} />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                                        Action Completed
                                    </div>
                                    <div className="text-xs text-green-600 dark:text-green-400">
                                        + {log.xpAwarded} XP Earned
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center text-gray-500 dark:text-gray-400 text-sm">
                                No corrective action taken yet.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LogDetailsModal;
