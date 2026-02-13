const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

/**
 * @desc    Register anonymous user (device-based)
 * @route   POST /api/auth/anonymous
 * @access  Public
 */
const registerAnonymous = async (req, res) => {
    try {
        const { deviceId, profile } = req.body;

        // Check if device already exists
        let user = await User.findOne({ deviceId });

        if (user) {
            // Return existing user
            return res.json({
                _id: user._id,
                deviceId: user.deviceId,
                isAnonymous: user.isAnonymous,
                profile: user.profile,
                gamification: user.gamification,
                token: generateToken(user._id),
            });
        }

        // Create new anonymous user
        user = await User.create({
            deviceId: deviceId || uuidv4(),
            isAnonymous: true,
            profile: profile || {},
        });

        // Calculate BMI if height and weight provided
        if (profile?.height && profile?.weight) {
            user.calculateBMI();
            await user.save();
        }

        res.status(201).json({
            _id: user._id,
            deviceId: user.deviceId,
            isAnonymous: user.isAnonymous,
            profile: user.profile,
            gamification: user.gamification,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Upgrade anonymous user to registered account
 * @route   POST /api/auth/upgrade
 * @access  Private
 */
const upgradeAccount = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if email already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Upgrade account
        user.email = email;
        user.password = password;
        user.isAnonymous = false;

        await user.save();

        res.json({
            _id: user._id,
            email: user.email,
            deviceId: user.deviceId,
            isAnonymous: user.isAnonymous,
            profile: user.profile,
            gamification: user.gamification,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Login with email/password
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                email: user.email,
                deviceId: user.deviceId,
                isAnonymous: user.isAnonymous,
                profile: user.profile,
                gamification: user.gamification,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update profile fields
        if (req.body.dateOfBirth) user.profile.dateOfBirth = req.body.dateOfBirth;
        if (req.body.height) user.profile.height = req.body.height;
        if (req.body.weight) user.profile.weight = req.body.weight;
        if (req.body.gender) user.profile.gender = req.body.gender;

        // Recalculate BMI
        user.calculateBMI();

        // Update settings
        if (req.body.settings) {
            user.settings = { ...user.settings, ...req.body.settings };
        }

        await user.save();

        res.json({
            _id: user._id,
            email: user.email,
            deviceId: user.deviceId,
            isAnonymous: user.isAnonymous,
            profile: user.profile,
            gamification: user.gamification,
            settings: user.settings,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Send OTP for email verification
 * @route   POST /api/auth/send-otp
 * @access  Private
 */
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if email already exists for another user
        const emailExists = await User.findOne({
            email,
            _id: { $ne: req.user._id }
        });

        if (emailExists) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP (expires in 10 minutes)
        user.emailVerification = {
            otp,
            otpExpires: Date.now() + 600000, // 10 minutes
            isVerified: false,
        };

        // Temporarily store email (not saved until verified)
        user.email = email;

        await user.save();

        // Send OTP email
        const { sendOTPEmail } = require('../services/emailService');
        const emailResult = await sendOTPEmail(email, otp, user.email?.split('@')[0]);

        if (!emailResult.success) {
            return res.status(500).json({
                message: 'Failed to send OTP email. Please try again.'
            });
        }

        res.json({
            message: 'OTP sent to your email',
            email,
            expiresIn: 600, // seconds
        });
    } catch (error) {
        console.error('[Auth] Send OTP error:', error);
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Verify OTP and confirm email
 * @route   POST /api/auth/verify-otp
 * @access  Private
 */
const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({ message: 'OTP is required' });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if OTP exists
        if (!user.emailVerification?.otp) {
            return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
        }

        // Check if OTP expired
        if (Date.now() > user.emailVerification.otpExpires) {
            return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
        }

        // Verify OTP
        if (user.emailVerification.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Mark email as verified
        user.emailVerification.isVerified = true;
        user.emailVerification.otp = undefined;
        user.emailVerification.otpExpires = undefined;

        await user.save();

        res.json({
            message: 'Email verified successfully',
            email: user.email,
            isVerified: true,
        });
    } catch (error) {
        console.error('[Auth] Verify OTP error:', error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    registerAnonymous,
    upgradeAccount,
    login,
    updateProfile,
    sendOTP,
    verifyOTP,
};
