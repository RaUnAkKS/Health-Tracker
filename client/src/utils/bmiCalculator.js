/**
 * Calculate BMI from height and weight
 * @param {number} height - Height in cm
 * @param {number} weight - Weight in kg
 * @returns {number} BMI value
 */
export const calculateBMI = (height, weight) => {
    if (!height || !weight) return null;

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    return parseFloat(bmi.toFixed(1));
};

/**
 * Get BMI category (for internal use, not shown to user)
 * @param {number} bmi 
 * @returns {string} Category
 */
export const getBMICategory = (bmi) => {
    if (!bmi) return 'unknown';
    if (bmi < 18.5) return 'underweight';
    if (bmi <= 24.9) return 'normal';
    if (bmi <= 29.9) return 'overweight';
    return 'obese';
};
