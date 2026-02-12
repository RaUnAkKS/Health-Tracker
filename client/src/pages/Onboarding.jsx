import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Scale, Ruler, Users } from 'lucide-react';
import useUserStore from '../store/userStore';
import ProgressBar from '../components/ProgressBar';
import { pageVariants, cardVariants } from '../utils/animations';

const TOTAL_STEPS = 4;

const Onboarding = () => {
    const navigate = useNavigate();
    const { onboardingData, updateOnboardingData, completeOnboarding } = useUserStore();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleNext = () => {
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
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
                        description="Help us personalize your experience"
                    >
                        <input
                            type="date"
                            className="input-field text-center text-lg"
                            value={onboardingData.dateOfBirth || ''}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => updateOnboardingData({ dateOfBirth: e.target.value })}
                        />
                    </StepCard>
                );

            case 2:
                return (
                    <StepCard
                        icon={<Ruler className="text-primary-500" size={48} />}
                        title="What's your height?"
                        description="In centimeters"
                    >
                        <div className="relative">
                            <input
                                type="number"
                                className="input-field text-center text-3xl font-bold"
                                placeholder="170"
                                value={onboardingData.height || ''}
                                onChange={(e) => updateOnboardingData({ height: Number(e.target.value) })}
                                min="100"
                                max="250"
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
                        description="In kilograms"
                    >
                        <div className="relative">
                            <input
                                type="number"
                                className="input-field text-center text-3xl font-bold"
                                placeholder="70"
                                value={onboardingData.weight || ''}
                                onChange={(e) => updateOnboardingData({ weight: Number(e.target.value) })}
                                min="30"
                                max="300"
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
                        description="This helps us provide better insights"
                    >
                        <div className="grid grid-cols-3 gap-4">
                            {['male', 'female', 'other'].map((gender) => (
                                <motion.button
                                    key={gender}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => updateOnboardingData({ gender })}
                                    className={`p-4 rounded-xl border-2 font-semibold capitalize transition-all ${onboardingData.gender === gender
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-400'
                                        }`}
                                >
                                    {gender}
                                </motion.button>
                            ))}
                        </div>
                    </StepCard>
                );

            default:
                return null;
        }
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1:
                return !!onboardingData.dateOfBirth;
            case 2:
                return !!onboardingData.height && onboardingData.height >= 100;
            case 3:
                return !!onboardingData.weight && onboardingData.weight >= 30;
            case 4:
                return !!onboardingData.gender;
            default:
                return false;
        }
    };

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="page-container flex flex-col justify-center min-h-screen"
        >
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gradient text-center mb-2">
                    Let's get started! 🚀
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                    Quick setup, no email required
                </p>
            </div>

            <div className="mb-8">
                <ProgressBar current={currentStep} total={TOTAL_STEPS} />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderStep()}
                </motion.div>
            </AnimatePresence>

            <button
                onClick={handleNext}
                disabled={!isStepValid() || loading}
                className="btn-primary mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Setting up...' : currentStep === TOTAL_STEPS ? 'Complete' : 'Next'}
            </button>
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
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {description}
                </p>
            </div>

            {children}
        </motion.div>
    );
};

export default Onboarding;
