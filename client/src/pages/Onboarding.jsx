import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Scale, Ruler, Users, ChevronLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import useUserStore from '../store/userStore';
import ProgressBar from '../components/ProgressBar';
import { pageVariants, cardVariants } from '../utils/animations';
import { calculateAge } from '../utils/healthCalculations';

const TOTAL_STEPS = 4;

const Onboarding = () => {
    const navigate = useNavigate();
    const { onboardingData, updateOnboardingData, completeOnboarding } = useUserStore();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);

    const validateStep = () => {
        setError('');
        switch (currentStep) {
            case 1: // Age Validation
                if (!onboardingData.dateOfBirth) return false;
                const age = calculateAge(onboardingData.dateOfBirth);
                if (age <= 10 || age >= 150) {
                    setError('Age must be between 10 and 150 years.');
                    return false;
                }
                return true;

            case 2: // Height Validation
                if (!onboardingData.height) return false;
                if (onboardingData.height < 60 || onboardingData.height > 305) {
                    setError('Height must be between 60 cm and 305 cm.');
                    return false;
                }
                return true;

            case 3: // Weight Validation
                if (!onboardingData.weight) return false;
                if (onboardingData.weight < 20 || onboardingData.weight > 500) {
                    setError('Weight must be between 20kg and 500kg.');
                    return false;
                }
                return true;

            case 4: // Gender Validation
                if (!onboardingData.gender) {
                    setError('Please select a gender.');
                    return false;
                }
                return true;

            default:
                return false;
        }
    };

    const handleNext = () => {
        if (validateStep()) {
            if (currentStep < TOTAL_STEPS) {
                setShake(false);
                setCurrentStep(currentStep + 1);
            } else {
                handleComplete();
            }
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setError('');
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = async () => {
        setLoading(true);
        const result = await completeOnboarding();
        setLoading(false);

        if (result.success) {
            navigate('/dashboard');
        } else {
            alert(result.error);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <StepCard
                        icon={<Calendar className="text-primary-500" size={48} />}
                        title="When were you born?"
                        description="Age must be between 10 and 150 years"
                    >
                        <input
                            type="date"
                            className={`input-field text-center text-lg ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                            value={onboardingData.dateOfBirth || ''}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => {
                                updateOnboardingData({ dateOfBirth: e.target.value });
                                setError('');
                            }}
                        />
                    </StepCard>
                );

            case 2:
                return (
                    <StepCard
                        icon={<Ruler className="text-primary-500" size={48} />}
                        title="What's your height?"
                        description="Enter height in centimeters (60-305 cm)"
                    >
                        <div className="relative">
                            <input
                                type="number"
                                className={`input-field text-center text-3xl font-bold ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                                placeholder="170"
                                value={onboardingData.height || ''}
                                onChange={(e) => {
                                    updateOnboardingData({ height: Number(e.target.value) });
                                    setError('');
                                }}
                            />
                            <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xl">
                                cm
                            </span>
                        </div>
                    </StepCard>
                );

            case 3:
                return (
                    <StepCard
                        icon={<Scale className="text-primary-500" size={48} />}
                        title="What's your weight?"
                        description="Enter weight in kilograms (20-500 kg)"
                    >
                        <div className="relative">
                            <input
                                type="number"
                                className={`input-field text-center text-3xl font-bold ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                                placeholder="70"
                                value={onboardingData.weight || ''}
                                onChange={(e) => {
                                    updateOnboardingData({ weight: Number(e.target.value) });
                                    setError('');
                                }}
                            />
                            <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xl">
                                kg
                            </span>
                        </div>
                    </StepCard>
                );

            case 4:
                return (
                    <StepCard
                        icon={<Users className="text-primary-500" size={48} />}
                        title="Select your gender"
                        description="Select one to proceed"
                    >
                        <div className="grid grid-cols-3 gap-4">
                            {['male', 'female', 'other'].map((gender) => (
                                <motion.button
                                    key={gender}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        updateOnboardingData({ gender });
                                        setError('');
                                    }}
                                    className={`p-4 rounded-xl border-2 font-semibold capitalize transition-all relative overflow-hidden ${onboardingData.gender === gender
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-md'
                                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300'
                                        }`}
                                >
                                    {gender}
                                    {onboardingData.gender === gender && (
                                        <div className="absolute top-2 right-2 text-primary-500">
                                            <CheckCircle2 size={16} />
                                        </div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </StepCard>
                );

            default:
                return null;
        }
    };

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="page-container flex flex-col justify-center min-h-screen relative"
        >
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gradient text-center mb-2">
                    Let's get started! 🚀
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                    Quick setup, no email required
                </p>
            </div>

            <div className="mb-8 max-w-md mx-auto w-full">
                <ProgressBar current={currentStep} total={TOTAL_STEPS} />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md mx-auto"
                >
                    <motion.div
                        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                        transition={{ duration: 0.4 }}
                    >
                        {renderStep()}
                    </motion.div>

                    {/* Inline Validation Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2 text-sm font-medium"
                            >
                                <AlertCircle size={16} />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-center mt-8 max-w-md mx-auto w-full gap-4">
                {currentStep > 1 ? (
                    <button
                        onClick={handleBack}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <ChevronLeft size={20} />
                        Back
                    </button>
                ) : (
                    <div className="w-24"></div> // Spacer
                )}

                <button
                    onClick={handleNext}
                    disabled={loading}
                    className="btn-primary flex-1 shadow-lg shadow-primary-500/20"
                >
                    {loading ? 'Setting up...' : currentStep === TOTAL_STEPS ? 'Complete Setup' : 'Next Step'}
                </button>
            </div>
        </motion.div>
    );
};

const StepCard = ({ icon, title, description, children }) => {
    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="glass-card p-8"
        >
            <div className="flex flex-col items-center text-center mb-6">
                {icon}
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-4">
                    {title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                    {description}
                </p>
            </div>

            {children}
        </motion.div>
    );
};

export default Onboarding;
