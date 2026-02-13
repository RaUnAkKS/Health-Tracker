import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Bookmark, CheckCircle2, ThumbsUp, Lightbulb } from 'lucide-react';
import useUserStore from '../store/userStore';

const InsightCard = ({ insight, index = 0 }) => {
    // Safety check
    if (!insight) return null;

    const [isExpanded, setIsExpanded] = useState(false);
    const [isHelpful, setIsHelpful] = useState(false);

    // Connect to user store for bookmarks
    const { bookmarks, toggleBookmark } = useUserStore();
    const isBookmarked = bookmarks?.includes(insight.id);

    // Icon component from the insight data
    // Fallback to Lightbulb if icon is missing or invalid type
    // React components are functions. If it's an object (likely from JSON), we CANNOT render it.
    let Icon = Lightbulb;
    if (insight.icon && typeof insight.icon === 'function') {
        Icon = insight.icon;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="glass-card overflow-hidden border border-white/20 dark:border-gray-700/50"
        >
            {/* Header / Banner */}
            <div className={`h-2 bg-gradient-to-r ${insight.color} w-full`} />

            <div className="p-5">
                {/* Top Section: Icon & Category */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${insight.color} text-white shadow-lg`}>
                            <Icon size={20} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            {insight.category}
                        </span>
                    </div>

                    <button
                        onClick={() => toggleBookmark(insight.id, insight)}
                        className={`transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${isBookmarked ? 'text-primary-500' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
                    </button>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 leading-tight">
                    {insight.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {insight.summary}
                </p>

                {/* Expandable Section */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                    {insight.content}
                                </p>

                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => setIsHelpful(!isHelpful)}
                                        className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 transition-all ${isHelpful
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                                            : 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50'
                                            }`}
                                    >
                                        <ThumbsUp size={12} className={isHelpful ? "fill-current" : ""} />
                                        {isHelpful ? 'Helpful' : 'Mark as Helpful'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Read More Button */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors"
                >
                    {isExpanded ? 'Show Less' : 'Read More'}
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                    >
                        <ChevronDown size={16} />
                    </motion.div>
                </button>
            </div>
        </motion.div>
    );
};

export default InsightCard;
