const express = require('express');
const router = express.Router();
const {
    syncHealthData,
    getTodayHealthData,
    getHealthHistory,
} = require('../controllers/healthController');
const { protect } = require('../middleware/auth');

router.post('/', protect, syncHealthData);
router.get('/today', protect, getTodayHealthData);
router.get('/history', protect, getHealthHistory);

module.exports = router;
