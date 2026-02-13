const express = require('express');
const router = express.Router();
const {
    createLog,
    getLogs,
    getTodayLogs,
    completeAction,
    assignTask,
    getMonthStats
} = require('../controllers/logController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, upload.single('photo'), createLog);
router.get('/', protect, getLogs);
router.get('/today', protect, getTodayLogs);
router.put('/:id/action', protect, completeAction);
router.put('/:id/task', protect, assignTask);
router.get('/stats/month', protect, getMonthStats);

module.exports = router;
