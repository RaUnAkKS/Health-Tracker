const SugarLog = require('../models/SugarLog');
const Insight = require('../models/Insight');
const { SUGAR_PRESETS } = require('../config/constants');
const { calculateXP, updateStreak, awardXP } = require('../services/gamificationEngine');
const { generateInsight } = require('../services/insightEngine');
const { uploadToCloudinary } = require('../services/cloudinaryService');
const { detectFood } = require('../services/foodDetectionService');

/**
 * @desc    Create sugar log (with optional photo)
 * @route   POST /api/logs
 * @access  Private
 */
const createLog = async (req, res) => {
    try {
        const reqStart = Date.now();
        console.log(`[PERF] Request started at ${reqStart}`);
        console.log('[LOG] Create log request received');
        console.log('[LOG] Body:', req.body);
        console.log('[LOG] Body fields:', Object.keys(req.body));
        console.log('[LOG] Has file:', !!req.file);
        if (req.file) {
            console.log('[LOG] File received:', {
                fieldname: req.file.fieldname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                originalname: req.file.originalname,
            });
        }

        // Debug Cloudinary Config
        console.log('[LOG] Cloudinary Configured:', !!process.env.CLOUDINARY_CLOUD_NAME);

        const { type, description, customAmount } = req.body;
        const photoFile = req.file; // From multer upload middleware

        if (!type) {
            return res.status(400).json({ message: 'Type is required' });
        }

        // Determine time of day
        const hour = new Date().getHours();
        let timeOfDay;
        if (hour >= 5 && hour < 12) timeOfDay = 'morning';
        else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
        else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
        else timeOfDay = 'night';

        // Update streak and get achievement
        const streakStart = Date.now();
        const streakResult = await updateStreak(req.user._id);
        console.log(`[PERF] Streak update took ${Date.now() - streakStart}ms`);

        // XP is NO LONGER awarded for just logging.
        // It is awarded only when user completes the corrective action.
        const xpAmount = 0;
        const xpResult = { xpGained: 0 };

        // Extract health context from request (privacy-first labels only)
        let healthContext = req.body.healthContext || null;

        // When using FormData (file upload), nested objects come as JSON strings
        if (typeof healthContext === 'string') {
            try {
                healthContext = JSON.parse(healthContext);
            } catch (e) {
                console.warn('Failed to parse healthContext:', e);
                healthContext = null;
            }
        }

        if (healthContext) {
            console.log('[LOG] Health context received:', {
                activityLevel: healthContext.activityLevel,
                recoveryState: healthContext.recoveryState,
                energyState: healthContext.energyState,
            });
        }

        // Upload photo to Cloudinary if provided
        let photoUrl = null;
        let aiDetection = null;

        if (photoFile) {
            try {
                const startTime = Date.now();
                console.log('[LOG] Starting parallel Upload + AI...');

                // Parallel Processing: Maximize utilization of server I/O
                const [uploadedUrl, aiResult] = await Promise.all([
                    uploadToCloudinary(photoFile.buffer),
                    detectFood(photoFile.buffer).catch(err => {
                        console.error('AI detection slight error (ignoring):', err.message);
                        return null;
                    })
                ]);

                console.log(`[LOG] Parallel processing done in ${Date.now() - startTime}ms`);

                photoUrl = uploadedUrl;
                aiDetection = aiResult;

            } catch (error) {
                console.error('Error in photo processing:', error);
                // If upload fails, we can't really proceed with the photo part
            }
        }

        // Determine sugar amount
        let sugarAmount = customAmount || (SUGAR_PRESETS[type]?.sugar) || 20;

        // If AI detected food and user didn't provide custom amount, use AI estimate
        if (aiDetection && aiDetection.isFood && !customAmount) {
            sugarAmount = aiDetection.sugarEstimate;
        }

        // Generate AI insight (enhanced with health context)
        // Optimization: Pass full req.user to avoid DB refetch
        const insightStart = Date.now();
        const insightData = await generateInsight(req.user, {
            timeOfDay,
            sugarAmount,
        }, healthContext);
        console.log(`[PERF] Insight generation took ${Date.now() - insightStart}ms`);

        // Create sugar log (XP is NO LONGER awarded here)
        const sugarLog = await SugarLog.create({
            user: req.user._id,
            type,
            sugarAmount,
            description,
            photoUrl,
            aiDetectedFood: aiDetection?.isFood ? aiDetection.foodItems?.map(f => f.name).join(', ') : null,
            aiSugarEstimate: aiDetection?.sugarEstimate,
            aiConfidence: aiDetection?.confidence,
            xpAwarded: 0, // XP awarded on corrective action
            timeOfDay,
        });

        // Save insight
        const insight = await Insight.create({
            user: req.user._id,
            sugarLog: sugarLog._id,
            message: insightData.message,
            action: insightData.action,
            reasoning: insightData.reasoning,
            context: insightData.context,
        });

        // Update sugar log with insight reference
        sugarLog.insightGenerated = insight._id;
        const dbSaveStart = Date.now();
        await sugarLog.save();
        console.log(`[PERF] DB Save took ${Date.now() - dbSaveStart}ms`);
        console.log(`[PERF] Total Request took ${Date.now() - reqStart}ms`);

        // Check for milestone achievements (using result from updateStreak)
        // We do NOT need to call checkMilestone again, as updateStreak already checks it.
        const { sendMilestoneEmail } = require('../services/emailService');
        const { getMotivationalMessage } = require('../services/streakService');

        // Check if a new achievement was unlocked in this very request
        const newAchievement = streakResult.achievement;

        // Send milestone email if achieved and email verified (FIRE AND FORGET - Non-blocking)
        if (newAchievement) {
            if (req.user.emailVerification?.isVerified) {
                // specific milestone value is in the achievement object
                const milestoneValue = newAchievement.milestone;
                console.log(`[LOG] Sending milestone email for day ${milestoneValue} (Background)`);
                sendMilestoneEmail(req.user, milestoneValue).catch(err =>
                    console.error('[LOG] Background email failed:', err.message)
                );
            }
        }

        // Get motivational message
        // Use the current streak from the updateResult
        const motivationalMessage = getMotivationalMessage({
            streak: streakResult.currentStreak,
            activityLevel: healthContext?.activityLevel,
            recoveryState: healthContext?.recoveryState,
            energyState: healthContext?.energyState,
            sugarAmount,
        });
        // Return response
        res.status(201).json({
            success: true,
            data: {
                sugarLog,
                insight,
                gamification: {
                    currentStreak: streakResult.currentStreak,
                    xpGained: xpResult.xpGained,
                    baseXP: 0, // XP now awarded on action completion
                    isBonus: false,
                    achievement: streakResult.achievement || null,
                },
                streak: {
                    current: streakResult.currentStreak,
                    longest: req.user.gamification.longestStreak, // Available on req.user
                    milestone: streakResult.achievement ? streakResult.achievement.milestone : null,
                },
                motivationalMessage,
            },
        });
    } catch (error) {
        console.error('Error creating log:', error);
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Get user's sugar logs
 * @route   GET /api/logs
 * @access  Private
 */
const getLogs = async (req, res) => {
    try {
        const { limit = 20, page = 1, date } = req.query;

        let query = { user: req.user._id };

        // Date filter (specific day)
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            query.createdAt = { $gte: startDate, $lte: endDate };
        }

        const logs = await SugarLog.find(query)
            .populate('insightGenerated')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const totalLogs = await SugarLog.countDocuments(query);

        res.json({
            logs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalLogs,
                pages: Math.ceil(totalLogs / parseInt(limit)),
            },
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Get today's logs and stats
 * @route   GET /api/logs/today
 * @access  Private
 */
const getTodayLogs = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const logs = await SugarLog.find({
            user: req.user._id,
            createdAt: { $gte: today },
        }).populate('insightGenerated');

        const totalSugar = logs.reduce((sum, log) => sum + log.sugarAmount, 0);

        res.json({
            logs,
            totalSugar,
            count: logs.length,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Mark corrective action as completed
 * @route   PUT /api/logs/:id/action
 * @access  Private
 */
const completeAction = async (req, res) => {
    try {
        const { awardCorrectiveActionXP } = require('../services/gamificationEngine');

        const result = await awardCorrectiveActionXP(req.params.id, req.user._id);

        res.json({
            success: true,
            data: {
                gamification: result,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Assign a specific task ID to a log
 * @route   PUT /api/logs/:id/task
 * @access  Private
 */
const assignTask = async (req, res) => {
    try {
        const { taskId } = req.body;

        if (!taskId) {
            return res.status(400).json({ success: false, message: 'TaskId is required' });
        }

        const log = await SugarLog.findOne({ _id: req.params.id, user: req.user._id });

        if (!log) {
            return res.status(404).json({ success: false, message: 'Log not found' });
        }

        log.correctiveActionTaskId = taskId;
        await log.save();

        res.json({
            success: true,
            data: log
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get monthly statistics (daily aggregation)
 * @route   GET /api/logs/stats/month
 * @access  Private
 */
const getMonthStats = async (req, res) => {
    try {
        const { year, month } = req.query; // month is 1-indexed (1=Jan, 12=Dec)

        if (!year || !month) {
            return res.status(400).json({ message: 'Year and month are required' });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        // Aggregate logs by day
        const dailyStats = await SugarLog.aggregate([
            {
                $match: {
                    user: req.user._id,
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalSugar: { $sum: "$sugarAmount" },
                    logCount: { $sum: 1 },
                    hasCrash: {
                        $max: {
                            $cond: [{ $eq: ["$type", "SUGAR_CRASH"] }, true, false]
                        }
                    }
                }
            },
            {
                $project: {
                    date: "$_id",
                    totalSugar: 1,
                    logCount: 1,
                    hasCrash: 1,
                    _id: 0
                }
            },
            { $sort: { date: 1 } }
        ]);

        res.json({
            success: true,
            data: dailyStats
        });
    } catch (error) {
        console.error('Error fetching month stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createLog,
    getLogs,
    getTodayLogs,
    completeAction,
    assignTask,
    getMonthStats
};
