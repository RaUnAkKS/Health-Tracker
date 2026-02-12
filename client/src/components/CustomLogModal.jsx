import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import PhotoUpload from './PhotoUpload';

const CustomLogModal = ({ isOpen, onClose, onSubmit, loading }) => {
    const [description, setDescription] = useState('');
    const [sugarAmount, setSugarAmount] = useState('');
    const [photoFile, setPhotoFile] = useState(null);

    const handleSubmit = () => {
        console.log('[Modal] handleSubmit called', {
            sugarAmount,
            hasPhoto: !!photoFile,
            photoFile,
        });

        if (!sugarAmount || sugarAmount <= 0) {
            alert('Please enter a valid sugar amount');
            return;
        }

        onSubmit({
            type: 'CUSTOM',
            customAmount: Number(sugarAmount),
            description: description.trim() || undefined,
        }, photoFile);

        // Reset form
        setDescription('');
        setSugarAmount('');
        setPhotoFile(null);
    };

    const handleClose = () => {
        setDescription('');
        setSugarAmount('');
        setPhotoFile(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/50 backdrop-blur-sm">
                <div className="min-h-screen flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-md glass-card my-8 max-h-[85vh] flex flex-col"
                    >
                        {/* Fixed Header */}
                        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                                Custom Log
                            </h3>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                type="button"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 pt-4">
                            <div className="space-y-4">
                                {/* Sugar Amount */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Sugar Amount (grams) *
                                    </label>
                                    <input
                                        type="number"
                                        value={sugarAmount}
                                        onChange={(e) => setSugarAmount(e.target.value)}
                                        className="input-field"
                                        placeholder="e.g., 25"
                                        min="0"
                                        step="1"
                                        disabled={loading}
                                    />
                                </div>

                                {/* Description (Optional) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description (optional)
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="input-field min-h-[80px] resize-none"
                                        placeholder="What did you have?"
                                        disabled={loading}
                                    />
                                </div>

                                {/* Photo Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Photo (optional)
                                    </label>
                                    <PhotoUpload
                                        onPhotoSelect={setPhotoFile}
                                        selectedPhoto={photoFile}
                                        onClear={() => setPhotoFile(null)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Fixed Footer */}
                        <div className="flex gap-3 p-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !sugarAmount}
                                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                type="button"
                            >
                                {loading ? 'Logging...' : 'Log Sugar'}
                            </button>

                            <button
                                onClick={handleClose}
                                disabled={loading}
                                className="btn-secondary flex-1"
                                type="button"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
};

export default CustomLogModal;
