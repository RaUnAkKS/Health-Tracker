import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

const QuickLogModal = ({ isOpen, onClose, foodItem, onConfirm }) => {
    const [customAmount, setCustomAmount] = useState('');
    const [mode, setMode] = useState('default'); // 'default' or 'custom'

    useEffect(() => {
        if (foodItem) {
            setCustomAmount(foodItem.defaultSugar.toString());
            setMode('default');
        }
    }, [foodItem, isOpen]);

    const handleSubmit = () => {
        const amount = mode === 'default'
            ? foodItem.defaultSugar
            : parseInt(customAmount, 10);

        if (!isNaN(amount) && amount > 0) {
            onConfirm(amount);
        }
    };

    if (!isOpen || !foodItem) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {/* Header */}
                            <div className="flex flex-col items-center mb-6">
                                <span className="text-5xl mb-3">{foodItem.icon}</span>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {foodItem.name}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    How much sugar is in this?
                                </p>
                            </div>

                            {/* Options */}
                            <div className="space-y-3 mb-6">
                                {/* Option 1: Default */}
                                <button
                                    onClick={() => setMode('default')}
                                    className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${mode === 'default'
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                                        }`}
                                >
                                    <div className="text-left">
                                        <div className="font-semibold text-gray-800 dark:text-white">
                                            Default Amount
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Standard serving
                                        </div>
                                    </div>
                                    <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
                                        {foodItem.defaultSugar}g
                                    </div>
                                    {mode === 'default' && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <Check className="text-primary-500" />
                                        </div>
                                    )}
                                </button>

                                {/* Option 2: Custom */}
                                <div
                                    className={`w-full p-4 rounded-xl border-2 transition-all ${mode === 'custom'
                                            ? 'border-primary-500 bg-white dark:bg-gray-800 ring-2 ring-primary-100 dark:ring-primary-900/30'
                                            : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                    onClick={() => setMode('custom')}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="font-semibold text-gray-800 dark:text-white">
                                            Custom Amount
                                        </div>
                                        {mode === 'custom' && <Check size={16} className="text-primary-500" />}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={customAmount}
                                            onChange={(e) => {
                                                setCustomAmount(e.target.value);
                                                setMode('custom');
                                            }}
                                            onFocus={() => setMode('custom')}
                                            placeholder="0"
                                            className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-xl font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            autoFocus={mode === 'custom'}
                                        />
                                        <span className="text-gray-500 font-medium">grams</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/30 transition-all active:scale-95"
                            >
                                Log {mode === 'default' ? foodItem.defaultSugar : (customAmount || 0)}g Sugar
                            </button>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default QuickLogModal;
