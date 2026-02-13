const User = require('../models/User');
const SugarLog = require('../models/SugarLog');
const HealthData = require('../models/HealthData');
const { ACTIVITY, SLEEP, BMI } = require('../config/constants');

/**
 * Categorization Helper Functions
 * These convert raw health metrics into human-readable categories
 */

// Categorize BMI into user-friendly labels
const categorizeBMI = (bmi) => {
    if (!bmi || bmi === 0) return 'Unknown';
    if (bmi < BMI.UNDERWEIGHT) return 'Underweight';
    if (bmi <= BMI.NORMAL) return 'Balanced';
    return 'Higher';
};

// Categorize activity level based on steps
const categorizeActivity = (steps) => {
    if (steps === null || steps === undefined) return 'Unknown';
    if (steps < ACTIVITY.LOW) return 'Low';
    if (steps >= ACTIVITY.HIGH) return 'Active';
    return 'Moderate';
};

// Categorize recovery state based on sleep hours
const categorizeRecovery = (sleepHours) => {
    if (sleepHours === null || sleepHours === undefined) return 'Unknown';
    if (sleepHours < SLEEP.POOR) return 'Needs Rest';
    return 'Stable';
};

// Determine typical sugar timing from recent logs
const calculateSugarTiming = (logs) => {
    if (!logs || logs.length === 0) return 'Unknown';

    const timeCounts = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    logs.forEach(log => {
        if (log.timeOfDay) timeCounts[log.timeOfDay]++;
    });

    const maxTime = Object.keys(timeCounts).reduce((a, b) =>
        timeCounts[a] > timeCounts[b] ? a : b
    );

    return maxTime.charAt(0).toUpperCase() + maxTime.slice(1);
};

// Calculate personalized risk trend
const calculateRiskTrend = (context) => {
    const { sugarFrequency, bmiCategory, activityLevel, recoveryState } = context;

    let riskScore = 0;

    // High frequency of sugar logs
    if (sugarFrequency > 15) riskScore += 2;
    else if (sugarFrequency > 10) riskScore += 1;

    // BMI concerns
    if (bmiCategory === 'Higher') riskScore += 1;

    // Low activity
    if (activityLevel === 'Low') riskScore += 1;

    // Poor recovery
    if (recoveryState === 'Needs Rest') riskScore += 1;

    if (riskScore >= 3) return 'Needs Attention';
    if (riskScore >= 1) return 'Moderate';
    return 'Low';
};

// Categorize sugar amount
const categorizeSugarLevel = (amount) => {
    if (!amount) return 'Unknown';
    if (amount < 10) return 'Mild';
    if (amount <= 25) return 'Moderate';
    return 'High';
};

// ... existing helpers ...

/**
 * Insight Templates for Variation
 */
const TEMPLATES = {
    // High Sugar + Evening/Night
    SLEEP_DISRUPTION: [
        "Sugar in the evening often disrupts sleep rhythm.",
        "Consuming high sugar now may delay your deep sleep cycle.",
        "Late-day sugar spikes can reduce overall sleep quality."
    ],
    // Low Activity + High Sugar
    CRASH_RISK: [
        "Since today has been less active, this sugar amount may cause a sharper energy crash.",
        "Without recent activity, your body might store this sugar rather than burn it.",
        "Low activity paired with high sugar often leads to an energy slump soon."
    ],
    // Low Sleep + Sugar
    RECOVERY_IMPACT: [
        "On lower sleep days, sugar can affect recovery more.",
        "Your body is already stressed from lack of sleep; sugar adds to that load.",
        "Poor sleep reduces insulin sensitivity, making this sugar harder to process."
    ],
    // High Activity + Sugar
    EFFICIENT_USE: [
        "With your active day, your body may process this sugar more efficiently.",
        "Your recent activity helps buffer the impact of this sugar.",
        "Because you've been active, your muscles will likely use this glucose quickly."
    ],
    // Morning + High Sugar
    MORNING_SPIKE: [
        "A high sugar start often leads to a mid-morning energy dip.",
        "Spiking blood sugar this early can increase cravings later today.",
        "Heavy sugar in the morning can set a roller-coaster energy pattern for the day."
    ]
};

const getRandomTemplate = (key) => {
    const templates = TEMPLATES[key];
    if (!templates) return "Sugar intake noted. Stay mindful!";
    return templates[Math.floor(Math.random() * templates.length)];
};

/**
 * Action Recommendations for Variation
 */
const ACTIONS = {
    // Light Movement (Low energy/time)
    LIGHT_MOVEMENT: [
        "Take a brief 10-minute walk",
        "Do 5 minutes of stretching",
        "Pace around the room for a few minutes",
        "Stand up and do a few calf raises"
    ],
    // Active Movement (High sugar/sedentary)
    ACTIVE_MOVEMENT: [
        "Go for a brisk 15-minute jog",
        "Do a quick set of squats or lunges",
        "Climb a flight of stairs twice",
        "Take a power walk around the block",
        "Do 10 jumping jacks to wake up your metabolism"
    ],
    // Hydration
    HYDRATION: [
        "Drink a large glass of water",
        "Sip on some warm lemon water",
        "Drink a glass of water before eating anything else"
    ],
    // Diet/Correction
    PROTEIN_CORRECTION: [
        "Eat a handful of almonds or walnuts",
        "Have a slice of cheese or hard-boiled egg",
        "Balance this with some Greek yogurt"
    ],
    // Rest/Sleep
    REST: [
        "Avoid screens and dim the lights",
        "Practice 2 minutes of deep breathing",
        "Put your phone away 30 minutes before bed"
    ]
};

const getRandomAction = (key) => {
    const actions = ACTIONS[key];
    if (!actions) return "Drink water";
    return actions[Math.floor(Math.random() * actions.length)];
};

/**
 * Rule-based AI insight generation engine
 * Generates personalized insights based on user context AND health data context
 */

const generateInsight = async (userOrId, sugarLogData, healthContext = null) => {
    try {
        // Get user data (handle both ID and full object)
        let user = userOrId;
        // If it's an ID (string or ObjectId), fetch the user
        if (typeof userOrId === 'string' || (userOrId.constructor && userOrId.constructor.name === 'ObjectId')) {
            user = await User.findById(userOrId);
        }

        if (!user) {
            throw new Error('User not found');
        }

        // Calculate age safely with validation
        let age = user.profile?.dateOfBirth
            ? Math.floor(
                (new Date() - new Date(user.profile.dateOfBirth)) /
                (365.25 * 24 * 60 * 60 * 1000)
            )
            : 30;

        // Sanity check for age (handle bad data like 1970 or negative)
        if (age < 0 || age > 120) {
            console.log(`[Insight] Invalid calculated age: ${age}. Defaulting to 30.`);
            age = 30;
        }

        // Get today's health data
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let healthData = null;
        try {
            healthData = await HealthData.findOne({
                user: userId,
                date: { $gte: today },
            });
        } catch (err) {
            console.log('Error fetching health data, using defaults');
        }

        // Get sugar logs from this week
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekLogs = await SugarLog.countDocuments({
            user: userId,
            createdAt: { $gte: weekAgo },
        });

        // Safe Health Context Extraction
        const currentActivity = healthContext?.activityLevel || categorizeActivity(healthData?.steps);
        const currentRecovery = healthContext?.recoveryState || categorizeRecovery(healthData?.sleepHours);
        const currentEnergy = healthContext?.energyState || 'Stable';
        const currentBMI = categorizeBMI(user.profile?.bmi);
        const currentSugarLevel = categorizeSugarLevel(sugarLogData.sugarAmount);

        // Build context object
        const context = {
            bmi: user.profile?.bmi || 0,
            bmiCategory: currentBMI,
            age: age,
            steps: healthData?.steps || 0,
            sleepHours: healthData?.sleepHours || 0,
            timeOfDay: sugarLogData.timeOfDay,
            sugarAmount: sugarLogData.sugarAmount || 0,
            sugarLevel: currentSugarLevel,
            sugarFrequency: weekLogs,
            gender: user.profile?.gender || 'unknown',
            activityLevel: currentActivity,
            recoveryState: currentRecovery,
            energyState: currentEnergy,
        };

        console.log('[Insight] Generated Context:', context);

        // Generate insight using rule-based logic
        const insight = applyInsightRules(context);

        return {
            message: insight.message,
            action: insight.action,
            reasoning: insight.reasoning,
            context: context,
        };
    } catch (error) {
        console.error('Error generating insight:', error);
        // Return a safe default insight instead of throwing to prevent log creation failure
        return {
            message: 'Sugar intake noted. Stay hydrated!',
            action: 'Drink a glass of water',
            reasoning: 'Hydration aids metabolism.',
            context: {},
        };
    }
};

/**
 * Rule-based decision tree for insights
 */
const applyInsightRules = (context) => {
    const {
        timeOfDay,
        activityLevel,
        recoveryState,
        sugarLevel,
        sugarAmount
    } = context;

    // 1. High Sugar + Evening/Night -> Sleep Impact
    if ((timeOfDay === 'evening' || timeOfDay === 'night') && (sugarLevel === 'High' || sugarLevel === 'Moderate')) {
        return {
            message: getRandomTemplate('SLEEP_DISRUPTION'),
            action: getRandomAction('REST'),
            reasoning: `Processing ${sugarAmount}g of sugar late in the day keeps your metabolism active when it should be resting.`
        };
    }

    // 2. Low Activity + High/Moderate Sugar -> Crash Risk (Needs Active Movement)
    if (activityLevel === 'Low' && (sugarLevel === 'High' || sugarLevel === 'Moderate')) {
        return {
            message: getRandomTemplate('CRASH_RISK'),
            action: getRandomAction('ACTIVE_MOVEMENT'),
            reasoning: 'Movement activates your muscles to soak up this extra glucose immediately.'
        };
    }

    // 3. Poor Sleep + Any Significant Sugar -> Recovery Impact
    if (recoveryState === 'Needs Rest' && sugarLevel !== 'Mild') {
        return {
            message: getRandomTemplate('RECOVERY_IMPACT'),
            action: getRandomAction('REST'),
            reasoning: 'Lack of sleep impairs your body\'s ability to regulate blood sugar efficiently.'
        };
    }

    // 4. High Activity -> Efficiency (Positive Reinforcement)
    if (activityLevel === 'Active') {
        return {
            message: getRandomTemplate('EFFICIENT_USE'),
            action: getRandomAction('HYDRATION'),
            reasoning: 'Your active metabolism is well-primed to handle this intake.'
        };
    }

    // 5. Morning + High Sugar -> Energy Rollercoaster
    if (timeOfDay === 'morning' && sugarLevel === 'High') {
        return {
            message: getRandomTemplate('MORNING_SPIKE'),
            action: getRandomAction('PROTEIN_CORRECTION'),
            reasoning: 'Protein slows down sugar absorption and prevents the upcoming energy crash.'
        };
    }

    // 6. Mild Sugar (Low Impact) - General positive/maintenance
    if (sugarLevel === 'Mild') {
        return {
            message: `A small treat of ${sugarAmount}g fits well within a balanced day.`,
            action: getRandomAction('LIGHT_MOVEMENT'),
            reasoning: 'Small, occasional indulgences help maintain long-term consistency.'
        };
    }

    // Default Fallback
    return {
        message: `You've logged ${sugarAmount}g of sugar. Awareness is the first step.`,
        action: getRandomAction('HYDRATION'),
        reasoning: 'Water helps your kidneys flush out excess sugar naturally.'
    };
};

module.exports = {
    generateInsight,
    categorizeBMI,
    categorizeActivity,
    categorizeRecovery,
    calculateSugarTiming,
    calculateRiskTrend,
};
