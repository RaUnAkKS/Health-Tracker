const HealthData = require('../models/HealthData');

/**
 * @desc    Sync health data (steps, sleep, etc.)
 * @route   POST /api/health
 * @access  Private
 */
const syncHealthData = async (req, res) => {
    try {
        const { steps, sleepHours, heartRate, waterIntake, date } = req.body;

        const dataDate = date ? new Date(date) : new Date();
        dataDate.setHours(0, 0, 0, 0);

        // Find or create health data for the date
        let healthData = await HealthData.findOne({
            user: req.user._id,
            date: dataDate,
        });

        if (healthData) {
            // Update existing
            if (steps !== undefined) healthData.steps = steps;
            if (sleepHours !== undefined) healthData.sleepHours = sleepHours;
            if (heartRate !== undefined) healthData.heartRate = heartRate;
            if (waterIntake !== undefined) healthData.waterIntake = waterIntake;

            await healthData.save();
        } else {
            // Create new
            healthData = await HealthData.create({
                user: req.user._id,
                date: dataDate,
                steps: steps || 0,
                sleepHours,
                heartRate,
                waterIntake,
            });
        }

        res.json(healthData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Get today's health data
 * @route   GET /api/health/today
 * @access  Private
 */
const getTodayHealthData = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const healthData = await HealthData.findOne({
            user: req.user._id,
            date: today,
        });

        if (!healthData) {
            return res.json({
                steps: 0,
                sleepHours: null,
                heartRate: null,
                waterIntake: null,
            });
        }

        res.json(healthData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Get health data history
 * @route   GET /api/health/history
 * @access  Private
 */
const getHealthHistory = async (req, res) => {
    try {
        const { days = 7 } = req.query;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));
        startDate.setHours(0, 0, 0, 0);

        const healthData = await HealthData.find({
            user: req.user._id,
            date: { $gte: startDate },
        }).sort({ date: -1 });

        res.json(healthData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    syncHealthData,
    getTodayHealthData,
    getHealthHistory,
};
