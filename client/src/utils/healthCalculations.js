/**
 * Calculate BMI from weight (kg) and height (cm)
 * @param {number} weightKg 
 * @param {number} heightCm 
 * @returns {number} BMI rounded to 1 decimal place
 */
export const calculateBMI = (weightKg, heightCm) => {
    if (!weightKg || !heightCm) return 0;
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return Math.round(bmi * 10) / 10;
};

/**
 * Get BMI Category and Color
 * @param {number} bmi 
 * @returns {object} { category, color, description }
 */
export const getBMInCategory = (bmi) => {
    if (bmi < 18.5) {
        return {
            category: 'Underweight',
            color: 'text-blue-500',
            description: 'You might need to eat more nutrient-rich foods.'
        };
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        return {
            category: 'Balanced',
            color: 'text-green-500',
            description: 'Great job! You are in a healthy weight range.'
        };
    } else if (bmi >= 25 && bmi <= 29.9) {
        return {
            category: 'Higher Weight',
            color: 'text-orange-500',
            description: 'A balanced diet and exercise can help.'
        };
    } else {
        return {
            category: 'Needs Attention',
            color: 'text-red-500',
            description: 'Consult a health professional for guidance.'
        };
    }
};

/**
 * Calculate Age from Date of Birth
 * @param {string} dob - Date string YYYY-MM-DD
 * @returns {number} Age in years
 */
export const calculateAge = (dob) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};
