import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Bookmark, Compass } from 'lucide-react';
import Layout from '../components/Layout';
import InsightCard from '../components/InsightCard';
import { getFeed } from '../utils/insightEngine';
import useUserStore from '../store/userStore';
import useLogStore from '../store/logStore';
import { pageVariants } from '../utils/animations';
import { INSIGHTS_DATA } from '../data/insightsData'; // Fallback / Source

const SugarIntelligence = () => {
    const [mode, setMode] = useState('personalized'); // 'personalized' | 'general' | 'saved'
    const [feedItems, setFeedItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const { user, bookmarks, savedInsights } = useUserStore();
    const { logs } = useLogStore();
    const observerTarget = useRef(null);

    // Initial Load & Mode Switch
    useEffect(() => {
        setFeedItems([]);
        setPage(1);
        setHasMore(true);
        loadInsights(1, mode, true);
    }, [mode]);

    const loadInsights = useCallback((pageNum, currentMode, isReset = false) => {
        setLoading(true);

        // Simulate network delay for "loading" feel
        setTimeout(() => {
            try {
                let result = { data: [], hasMore: false };

                if (currentMode === 'saved') {
                    // Safeguard against undefined data
                    const safeBookmarks = Array.isArray(bookmarks) ? bookmarks : [];
                    const safeSavedInsights = Array.isArray(savedInsights) ? savedInsights : [];
                    const safeInsightsData = Array.isArray(INSIGHTS_DATA) ? INSIGHTS_DATA : [];

                    // 1. Get static saved items
                    const staticSaved = safeInsightsData.filter(i => i && safeBookmarks.includes(i.id));

                    // 2. Get dynamic saved items from store
                    const dynamicSaved = safeSavedInsights;

                    // 3. Merge and deduplicate (prioritize dynamic over static if same ID)
                    const combined = [...dynamicSaved, ...staticSaved].filter(item => item && item.id);

                    // Deduplicate by ID using Map
                    const uniqueSaved = Array.from(new Map(combined.map(item => [item.id, item])).values())
                        .filter(item => item && item.title && item.content); // Ensure valid content

                    result = {
                        data: uniqueSaved,
                        hasMore: false
                    };
                } else {
                    result = getFeed(user, logs, currentMode, pageNum, 8) || { data: [], hasMore: false };
                }

                setFeedItems(prev => isReset ? result.data : [...prev, ...(result.data || [])]);
                setHasMore(result.hasMore);
            } catch (error) {
                console.error("Error loading insights:", error);
                setFeedItems([]);
            } finally {
                setLoading(false);
            }
        }, 500);
    }, [user, logs, bookmarks, savedInsights]);

    // Infinite Scroll Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading && mode !== 'saved') {
                    setPage(prev => {
                        const nextPage = prev + 1;
                        loadInsights(nextPage, mode);
                        return nextPage;
                    });
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, loading, mode, loadInsights]);

    return (
        <Layout>
            <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6 pb-20"
            >
                {/* Header */}
                <div className="pt-4 px-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20">
                            <Brain className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white leading-none">
                                Sugar Intelligence
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Science-backed signals using AI
                            </p>
                        </div>
                    </div>

                    {/* Enhanced Toggle */}
                    <div className="flex p-1 mt-6 bg-gray-100 dark:bg-gray-800 rounded-xl relative">
                        <motion.div
                            className="absolute top-1 bottom-1 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
                            initial={false}
                            animate={{
                                x: mode === 'personalized' ? '0%' : mode === 'general' ? '100%' : '200%',
                                width: '33.33%'
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                        <button
                            onClick={() => setMode('personalized')}
                            className={`flex-1 py-2 text-sm font-bold z-10 relative transition-colors flex items-center justify-center gap-2 ${mode === 'personalized' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}
                        >
                            <Sparkles size={16} />
                            For You
                        </button>
                        <button
                            onClick={() => setMode('general')}
                            className={`flex-1 py-2 text-sm font-bold z-10 relative transition-colors flex items-center justify-center gap-2 ${mode === 'general' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}
                        >
                            <Compass size={16} />
                            Discover
                        </button>
                        <button
                            onClick={() => setMode('saved')}
                            className={`flex-1 py-2 text-sm font-bold z-10 relative transition-colors flex items-center justify-center gap-2 ${mode === 'saved' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}
                        >
                            <Bookmark size={16} />
                            Saved
                        </button>
                    </div>
                </div>

                {/* Feed Content */}
                <div className="space-y-4 min-h-[50vh]">
                    <AnimatePresence mode="popLayout">
                        {feedItems.length > 0 ? (
                            feedItems.map((insight, index) => (
                                <motion.div
                                    key={`${insight.id}-${index}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <InsightCard
                                        insight={insight}
                                        index={index}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            !loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-20 text-gray-500"
                                >
                                    {mode === 'saved' ? (
                                        <>
                                            <Bookmark size={48} className="mx-auto mb-4 text-gray-300" />
                                            <p>No saved insights yet.</p>
                                        </>
                                    ) : (
                                        <p>No insights available right now.</p>
                                    )}
                                </motion.div>
                            )
                        )}
                    </AnimatePresence>

                    {/* Infinite Scroll Loader */}
                    {hasMore && mode !== 'saved' && (
                        <div ref={observerTarget} className="py-8 flex justify-center">
                            {loading && (
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-75" />
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-150" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </Layout>
    );
};

export default SugarIntelligence;
