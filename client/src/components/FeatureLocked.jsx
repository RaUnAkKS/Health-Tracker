import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Check, ChevronRight, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';
import Layout from './Layout';

const FeatureLocked = () => {
    const navigate = useNavigate();
    const { login, upgradeAccount } = useUserStore();
    const [isLoginMode, setIsLoginMode] = useState(false); // false = marketing view, true = form view
    const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Sign Up (Upgrade)

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const features = [
        "Full Monthly Calendar",
        "Personalized Intelligence Feed",
        "Advanced History Tracking",
        "Secure Data Backup"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let result;
            if (isSignUp) {
                // Upgrade anonymous account to full account
                result = await upgradeAccount(formData.email, formData.password);
            } else {
                // Regular login
                result = await login(formData.email, formData.password);
            }

            if (result.success) {
                // The parent route wrapper will automatically re-render the actual page
                // because isAnonymous will switch to false.
                // We just need to stop loading.
            } else {
                setError(result.error || 'Authentication failed');
                setLoading(false);
            }
        } catch (err) {
            setError('An unexpected error occurred');
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <AnimatePresence mode="wait">
                    {!isLoginMode ? (
                        // MARKETING VIEW
                        <motion.div
                            key="marketing"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full max-w-sm"
                        >
                            <div className="glass-card p-8 border-2 border-primary-500/30 relative overflow-hidden">
                                {/* Decorative Blur */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />

                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center shadow-lg shadow-primary-500/20 transform rotate-3">
                                        <Lock size={40} className="text-white" />
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
                                    Members Only 🔒
                                </h2>
                                <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                                    Log in to unlock personalized insights and your full history.
                                </p>

                                <div className="space-y-3 mb-8">
                                    {features.map((feature, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                                        >
                                            <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                                <Check size={12} className="text-green-600 dark:text-green-400" />
                                            </div>
                                            <span className="text-sm font-medium">{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setIsLoginMode(true)}
                                    className="btn-primary w-full flex items-center justify-center gap-2 group mb-3"
                                >
                                    Log In & Unlock
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="w-full text-center py-3 text-gray-500 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-sm"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        // AUTH FORM VIEW
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-sm"
                        >
                            <div className="glass-card p-8">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="input-field pl-10"
                                                placeholder="you@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                className="input-field pl-10"
                                                placeholder="••••••••"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary w-full mt-4"
                                    >
                                        {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Log In')}
                                    </button>
                                </form>

                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                                    </p>
                                    <button
                                        onClick={() => {
                                            setIsSignUp(!isSignUp);
                                            setError('');
                                        }}
                                        className="text-primary-600 dark:text-primary-400 font-bold text-sm hover:underline mt-1"
                                    >
                                        {isSignUp ? 'Log In Instead' : 'Create Account'}
                                    </button>
                                </div>

                                <button
                                    onClick={() => setIsLoginMode(false)}
                                    className="w-full mt-4 text-center text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    Start Over
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};

export default FeatureLocked;
