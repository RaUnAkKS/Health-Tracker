import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Weekly Progress Tracker - Shows Mon-Sun logging status
 */
const WeeklyProgressTracker = ({ logs = [] }) => {
    const [weekData, setWeekData] = useState([]);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    useEffect(() => {
        generateWeekData();
    }, [logs]);

    const generateWeekData = () => {
        const today = new Date();
        const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Calculate Monday of current week
        const monday = new Date(today);
        const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
        monday.setDate(today.getDate() - daysToMonday);
        monday.setHours(0, 0, 0, 0);

        const week = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);

            const dateStr = date.toISOString().split('T')[0];
            const hasLog = logs.some(log => {
                const logDate = new Date(log.createdAt).toISOString().split('T')[0];
                return logDate === dateStr;
            });

            const isToday = dateStr === today.toISOString().split('T')[0];
            const isFuture = date > today;

            week.push({
                day: days[i],
                date: dateStr,
                hasLog,
                isToday,
                isFuture,
            });
        }

        setWeekData(week);
    };

    const getCircleClass = (day) => {
        if (day.isFuture) {
            return 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700';
        }
        if (day.hasLog) {
            return 'bg-gradient-to-br from-green-400 to-green-600 border-2 border-green-500';
        }
        if (day.isToday) {
            return 'bg-white dark:bg-gray-800 border-2 border-primary-500';
        }
        return 'bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600';
    };

    return (
        <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                This Week
            </h3>

            <div className="grid grid-cols-7 gap-2">
                {weekData.map((day, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                        {/* Day Label */}
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {day.day}
                        </span>

                        {/* Status Circle */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.05, type: 'spring', stiffness: 300 }}
                            className={`
                                w-10 h-10 rounded-full flex items-center justify-center
                                ${getCircleClass(day)}
                                ${day.isToday && !day.hasLog ? 'animate-pulse' : ''}
                                transition-all duration-300
                            `}
                        >
                            {day.hasLog && (
                                <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            )}

                            {day.isToday && !day.hasLog && (
                                <div className="w-3 h-3 rounded-full bg-primary-500" />
                            )}
                        </motion.div>

                        {/* Date */}
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(day.date).getDate()}
                        </span>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-green-600" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Logged</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Missed</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-white dark:bg-gray-800 border-2 border-primary-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Today</span>
                </div>
            </div>
        </div>
    );
};

export default WeeklyProgressTracker;
