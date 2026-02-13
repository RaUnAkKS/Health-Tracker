const express = require('express');
const router = express.Router();
const {
    getGamificationData,
    getStreakStatus,
} = require('../controllers/gamificationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getGamificationData);
router.get('/streak', protect, getStreakStatus);

module.exports = router;
