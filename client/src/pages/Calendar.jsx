import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Zap } from 'lucide-react';
import Layout from '../components/Layout';
import useLogStore from '../store/logStore';
import { pageVariants } from '../utils/animations';
import DayDetailsModal from '../components/DayDetailsModal';

const Calendar = () => {
    const { fetchMonthStats } = useLogStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [monthStats, setMonthStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    // Load stats when month changes
    useEffect(() => {
        const loadStats = async () => {
            setLoading(true);
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1; // 1-indexed
            const result = await fetchMonthStats(year, month);

            if (result.success) {
                // Convert array to object map for easier lookup: { "2024-02-14": { ... } }
                const statsMap = result.data.reduce((acc, stat) => {
                    acc[stat.date] = stat;
                    return acc;
                }, {});
                setMonthStats(statsMap);
            }
            setLoading(false);
        };

        loadStats();
    }, [currentDate, fetchMonthStats]);

    // Navigation handlers
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleYearChange = (e) => {
        const year = parseInt(e.target.value);
        setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    };

    // Calendar Generation Logic
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

        const days = [];

        // Padding for previous month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({ type: 'padding', key: `pad-${i}` });
        }

        // Days of current month
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            days.push({
                type: 'day',
                day: i,
                dateStr,
                key: dateStr,
                stats: monthStats[dateStr]
            });
        }

        return days;
    };

    const days = getDaysInMonth(currentDate);
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    const todayStr = new Date().toISOString().split('T')[0];

    // Generate year options (past 5 years + next 1 year)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);

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
                <div className="flex items-center justify-between pt-4 px-2">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <CalendarIcon size={24} className="text-primary-500" />
                            Calendar
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Your logging history
                        </p>
                    </div>

                    {/* Year Selector */}
                    <div className="relative">
                        <select
                            value={year}
                            onChange={handleYearChange}
                            className="appearance-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white py-1 px-3 pr-8 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 border border-gray-200 dark:border-gray-700"
                        >
                            {yearOptions.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center justify-between glass-card p-4">
                    <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <ChevronLeft size={24} className="text-gray-600 dark:text-gray-300" />
                    </button>

                    <h3 className="text-xl font-bold text-gray-800 dark:text-white w-40 text-center">
                        {monthName}
                    </h3>

                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <ChevronRight size={24} className="text-gray-600 dark:text-gray-300" />
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="glass-card p-4">
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="text-center text-xs font-semibold text-gray-400 uppercase py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                        <AnimatePresence mode='wait'>
                            {days.map((item, index) => {
                                if (item.type === 'padding') {
                                    return <div key={item.key} className="aspect-square" />;
                                }

                                const isToday = item.dateStr === todayStr;
                                const hasData = item.stats && item.stats.logCount > 0;
                                const hasHighSugar = item.stats && item.stats.totalSugar > 50; // Threshold

                                return (
                                    <motion.button
                                        key={item.key}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedDate(new Date(item.dateStr))}
                                        className={`
                                            aspect-square rounded-xl flex flex-col items-center justify-center relative transition-colors
                                            ${isToday ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900 bg-primary-50 dark:bg-primary-900/10' : ''}
                                            ${hasData ? 'bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700' : 'bg-transparent hover:bg-gray-50 dark:hover:bg-white/5'}
                                        `}
                                    >
                                        <span className={`text-sm font-medium ${isToday ? 'text-primary-600 dark:text-primary-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {item.day}
                                        </span>

                                        {/* Status Dots */}
                                        <div className="flex gap-0.5 mt-1">
                                            {hasData && (
                                                <div className={`w-1.5 h-1.5 rounded-full ${hasHighSugar ? 'bg-orange-500' : 'bg-green-500'}`} />
                                            )}
                                            {item.stats?.hasCrash && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                            )}
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500" /> Logged
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-orange-500" /> High Sugar
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500" /> Sugar Crash
                    </div>
                </div>

                <DayDetailsModal
                    isOpen={!!selectedDate}
                    onClose={() => setSelectedDate(null)}
                    date={selectedDate}
                />
            </motion.div>
        </Layout>
    );
};

export default Calendar;
