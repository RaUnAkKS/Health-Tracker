import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Shield } from 'lucide-react';

/**
 * Account Upgrade Form with Email OTP Verification
 */
const AccountUpgradeForm = ({ onSuccess, onCancel }) => {
    const [step, setStep] = useState(1); // 1: Email & Password, 2: OTP Verification
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`OTP sent to ${email}! Check your inbox.`);
                setStep(2);
            } else {
                alert(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            console.error('Send OTP error:', error);
            alert('Failed to send OTP. Please try again.');
        }

        setLoading(false);
    };

    const handleVerifyAndUpgrade = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Step 1: Verify OTP
            const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ otp }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
                alert(verifyData.message || 'Invalid OTP');
                setLoading(false);
                return;
            }

            // Step 2: Upgrade account with password
            const upgradeResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/upgrade`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ email, password }),
            });

            const upgradeData = await upgradeResponse.json();

            if (upgradeResponse.ok) {
                // Update local storage with new token
                if (upgradeData.token) {
                    localStorage.setItem('token', upgradeData.token);
                }

                alert('Account upgraded successfully! 🎉');
                onSuccess(upgradeData);
            } else {
                alert(upgradeData.message || 'Failed to upgrade account');
            }
        } catch (error) {
            console.error('Upgrade error:', error);
            alert('Failed to upgrade account. Please try again.');
        }

        setLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
        >
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                {step === 1 ? 'Create Your Account' : 'Verify Your Email'}
            </h3>

            {step === 1 ? (
                // Step 1: Email & Password
                <form onSubmit={handleSendOTP} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Mail className="inline mr-2" size={16} />
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            required
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Lock className="inline mr-2" size={16} />
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            required
                            placeholder="••••••••"
                            minLength={6}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Minimum 6 characters
                        </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            🔒 We'll send a verification code to your email before creating your account.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1"
                        >
                            {loading ? 'Sending OTP...' : 'Send Verification Code'}
                        </button>

                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                // Step 2: OTP Verification
                <form onSubmit={handleVerifyAndUpgrade} className="space-y-4">
                    <div className="text-center mb-4">
                        <Shield className="text-primary-500 mx-auto mb-2" size={48} />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            We sent a 6-digit code to
                        </p>
                        <p className="font-semibold text-gray-800 dark:text-white">
                            {email}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                            Enter Verification Code
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="input-field text-center text-2xl tracking-widest font-mono"
                            required
                            placeholder="000000"
                            maxLength={6}
                            pattern="\d{6}"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                            Code expires in 10 minutes
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="btn-primary flex-1"
                        >
                            {loading ? 'Verifying...' : 'Verify & Create Account'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="btn-secondary flex-1"
                        >
                            Back
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={loading}
                        className="text-sm text-primary-500 hover:text-primary-600 w-full text-center"
                    >
                        Didn't receive code? Resend
                    </button>
                </form>
            )}
        </motion.div>
    );
};

export default AccountUpgradeForm;
