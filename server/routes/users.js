const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getIntelligenceProfile,
    getInsightHistory,
} = require('../controllers/userController');

// @route   GET /api/users/intelligence-profile
router.get('/intelligence-profile', protect, getIntelligenceProfile);

// @route   GET /api/insights
router.get('/insights', protect, getInsightHistory);

module.exports = router;
