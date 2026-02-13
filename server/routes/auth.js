const express = require('express');
const router = express.Router();
const {
    registerAnonymous,
    upgradeAccount,
    login,
    updateProfile,
    sendOTP,
    verifyOTP,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/anonymous', registerAnonymous);
router.post('/upgrade', protect, upgradeAccount);
router.post('/login', login);
router.put('/profile', protect, updateProfile);
router.post('/send-otp', protect, sendOTP);
router.post('/verify-otp', protect, verifyOTP);

module.exports = router;
