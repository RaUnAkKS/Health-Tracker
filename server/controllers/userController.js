const User = require('../models/User');
const SugarLog = require('../models/SugarLog');
const HealthData = require('../models/HealthData');
const Insight = require('../models/Insight');
const {
    categorizeBMI,
    categorizeActivity,
    categorizeRecovery,
    calculateSugarTiming,
    calculateRiskTrend,
} = require('../services/insightEngine');

/**
 * @desc    Get user's intelligence profile
 * @route   GET /api/users/intelligence-profile
 * @access  Private
 */
const getIntelligenceProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Calculate age
        const age = user.profile.dateOfBirth
            ? Math.floor(
                (new Date() - new Date(user.profile.dateOfBirth)) /
                (365.25 * 24 * 60 * 60 * 1000)
            )
            : null;

        // Get today's health data
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const healthData = await HealthData.findOne({
            user: req.user._id,
            date: { $gte: today },
        });

        // Get recent sugar logs (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recentLogs = await SugarLog.find({
            user: req.user._id,
            createdAt: { $gte: weekAgo },
        }).select('timeOfDay createdAt');

        // Categorize metrics
        const bmiCategory = categorizeBMI(user.profile.bmi);
        const activityPattern = categorizeActivity(healthData?.steps || 0);
        const recoveryPattern = categorizeRecovery(healthData?.sleepHours || null);
        const sugarTiming = calculateSugarTiming(recentLogs);

        // Calculate risk trend
        const riskTrend = calculateRiskTrend({
            sugarFrequency: recentLogs.length,
            bmiCategory,
            activityLevel: activityPattern,
            recoveryState: recoveryPattern,
        });

        res.json({
            age,
            bmiCategory,
            activityPattern,
            recoveryPattern,
            sugarTiming,
            riskTrend,
        });
    } catch (error) {
        console.error('Error fetching intelligence profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Get user's insight history
 * @route   GET /api/insights
 * @access  Private
 */
const getInsightHistory = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;

        const insights = await Insight.find({
            user: req.user._id,
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('message action reasoning createdAt');

        res.json({
            success: true,
            data: insights,
        });
    } catch (error) {
        console.error('Error fetching insight history:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getIntelligenceProfile,
    getInsightHistory,
};
