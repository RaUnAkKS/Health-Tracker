import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Check, RefreshCw, Edit2 } from 'lucide-react';
import { parseVoiceInput } from '../utils/voiceParser';

const VoiceLogModal = ({ isOpen, onClose, onConfirm }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [parsedResult, setParsedResult] = useState(null);
    const [error, setError] = useState('');
    const recognitionRef = useRef(null);

    // For manual edit override
    const [isEditing, setIsEditing] = useState(false);
    const [editAmount, setEditAmount] = useState('');

    useEffect(() => {
        if (isOpen) {
            startListening();
        } else {
            stopListening();
            resetState();
        }
        return () => stopListening();
    }, [isOpen]);

    const resetState = () => {
        setTranscript('');
        setParsedResult(null);
        setError('');
        setIsEditing(false);
        setEditAmount('');
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setError('Voice recognition is not supported in this browser.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US'; // Can be configurable

        recognitionRef.current.onstart = () => {
            setIsListening(true);
            setError('');
        };

        recognitionRef.current.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                interimTranscript += event.results[i][0].transcript;
            }
            setTranscript(interimTranscript);
        };

        recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            if (event.error === 'no-speech') {
                setError('No speech detected. Try again.');
            } else if (event.error === 'not-allowed') {
                setError('Microphone permission denied.');
            } else {
                setError(`Error: ${event.error}`);
            }
            setIsListening(false);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
            // Process final transcript
            // The transcript state might be interim, but onEnd it should be final enough for us.
            // NOTE: Ideally we process event.results final flag, but for simple one-shot:
            handleProcessing();
        };

        recognitionRef.current.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const handleProcessing = () => {
        // Need to use current transcript state. 
        // We can't trust state immediately inside onend due to closure staleness unless we use a ref for transcript, 
        // BUT component re-renders on transcript update, so we might just useEffect to watch 'isListening' going from true to false?
        // Let's do it in a useEffect for clarity.
    };

    // Helper to process transcript when listening stops
    useEffect(() => {
        if (!isListening && transcript && !parsedResult && !error) {
            const result = parseVoiceInput(transcript);
            if (result) {
                setParsedResult(result);
                setEditAmount(result.sugarAmount.toString());
            } else {
                setError("Couldn't identify any food or sugar amount.");
            }
        }
    }, [isListening, transcript]);

    const handleConfirm = () => {
        if (isEditing) {
            // Use edited amount but keep type
            onConfirm({
                type: parsedResult?.type || 'CUSTOM',
                customAmount: parseInt(editAmount),
                description: parsedResult?.foodName || transcript
            });
        } else if (parsedResult) {
            onConfirm({
                type: parsedResult.type,
                customAmount: parsedResult.sugarAmount,
                description: `${parsedResult.foodName} ${parsedResult.quantity > 1 ? `(x${parsedResult.quantity})` : ''}`
            });
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, show: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden relative"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200"
                    >
                        <X size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>

                    <div className="p-8 flex flex-col items-center text-center">

                        {/* Status Icon/Animation */}
                        <div className="mb-6 relative">
                            {isListening ? (
                                <div className="relative">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="w-20 h-20 bg-primary-500/20 rounded-full absolute inset-0"
                                    />
                                    <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center z-10 relative">
                                        <Mic size={40} className="text-primary-600 dark:text-primary-400" />
                                    </div>
                                </div>
                            ) : parsedResult ? (
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                    <Check size={40} className="text-green-600 dark:text-green-400" />
                                </div>
                            ) : error ? (
                                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                    <X size={40} className="text-red-500" />
                                </div>
                            ) : (
                                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                    <Mic size={40} className="text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* Text Feedback */}
                        {isListening ? (
                            <>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Listening...</h3>
                                <p className="text-gray-500 dark:text-gray-400 min-h-[1.5rem] italic">
                                    "{transcript || 'Say something like "Had a tea"...'}"
                                </p>
                            </>
                        ) : parsedResult ? (
                            <div className="w-full">
                                <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    We Heard
                                </h3>
                                <div className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                                    {parsedResult.foodName}
                                    {parsedResult.quantity > 1 && <span className="text-primary-500 ml-2">x{parsedResult.quantity}</span>}
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl mb-6">
                                    {isEditing ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <input
                                                type="number"
                                                value={editAmount}
                                                onChange={(e) => setEditAmount(e.target.value)}
                                                className="w-24 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg px-3 py-2 text-center font-bold text-xl text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                                autoFocus
                                            />
                                            <span className="text-gray-500 dark:text-gray-400 font-medium">grams</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <span className="text-4xl font-black text-orange-500">{parsedResult.sugarAmount}g</span>
                                            <div
                                                onClick={() => setIsEditing(true)}
                                                className="mt-2 text-xs text-gray-400 flex items-center gap-1 cursor-pointer hover:text-primary-500"
                                            >
                                                <Edit2 size={10} /> Tap to edit amount
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => { resetState(); startListening(); }}
                                        className="flex-1 py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw size={18} />
                                        Retry
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Check size={18} />
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="w-full">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Oops!</h3>
                                <p className="text-red-500 mb-6">{error}</p>
                                <button
                                    onClick={() => { resetState(); startListening(); }}
                                    className="w-full py-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-bold hover:bg-primary-200 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : null}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default VoiceLogModal;
