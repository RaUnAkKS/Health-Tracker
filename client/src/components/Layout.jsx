import { motion } from 'framer-motion';
import { Home, FileText, User, Moon, Sun, Brain, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useSettingsStore from '../store/settingsStore';

const Layout = ({ children }) => {
    const location = useLocation();
    const { darkMode, toggleDarkMode } = useSettingsStore();

    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Home' },
        { path: '/intelligence', icon: Brain, label: 'Feed' },
        { path: '/calendar', icon: Calendar, label: 'Calendar' },
        { path: '/history', icon: FileText, label: 'List' },
        { path: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 glass-card rounded-none border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-lg mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gradient">
                        SpikeIQ
                    </h1>

                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? (
                            <Sun size={20} className="text-yellow-400" />
                        ) : (
                            <Moon size={20} className="text-gray-600" />
                        )}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="page-container">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-none border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-lg mx-auto px-4 py-3">
                    <div className="flex justify-around items-center">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="relative flex flex-col items-center gap-1 min-w-[60px]"
                                >
                                    <div
                                        className={`p-2 rounded-xl transition-all duration-200 ${isActive
                                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <Icon size={24} />
                                    </div>

                                    <span
                                        className={`text-xs font-medium ${isActive
                                            ? 'text-primary-600 dark:text-primary-400'
                                            : 'text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        {item.label}
                                    </span>

                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Layout;
