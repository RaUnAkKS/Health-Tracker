const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        // Anonymous device ID (required for signup-free experience)
        deviceId: {
            type: String,
            unique: true,
            required: true,
            index: true,
        },

        // Optional email (for account upgrade)
        email: {
            type: String,
            unique: true,
            sparse: true, // Allows null values to not conflict
            lowercase: true,
        },

        // Email verification
        emailVerification: {
            isVerified: {
                type: Boolean,
                default: false,
            },
            otp: String,
            otpExpires: Date,
        },

        password: {
            type: String,
            select: false, // Don't include in queries by default
        },

        // User profile data from onboarding
        profile: {
            dateOfBirth: Date,
            height: Number, // in cm
            weight: Number, // in kg
            gender: {
                type: String,
                enum: ['male', 'female', 'other'],
            },
            bmi: Number, // Calculated, not displayed
        },

        // Gamification data
        gamification: {
            xp: {
                type: Number,
                default: 0,
            },
            level: {
                type: Number,
                default: 1,
            },
            currentStreak: {
                type: Number,
                default: 0,
            },
            longestStreak: {
                type: Number,
                default: 0,
            },
            lastLogDate: Date,
            totalLogs: {
                type: Number,
                default: 0,
            },
            reminderSentToday: {
                type: Boolean,
                default: false,
            },
            // Milestone tracking
            milestones: {
                day3: { type: Boolean, default: false },
                day7: { type: Boolean, default: false },
                day30: { type: Boolean, default: false },
            },
            achievements: [
                {
                    milestone: Number,
                    unlockedAt: Date,
                    emoji: String,
                    message: String,
                },
            ],
        },

        // Settings
        settings: {
            darkMode: {
                type: Boolean,
                default: false,
            },
            notifications: {
                type: Boolean,
                default: true,
            },
            timezone: {
                type: String,
                default: 'UTC',
            },
        },

        // Account type
        isAnonymous: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        next();
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate and update BMI
userSchema.methods.calculateBMI = function () {
    if (this.profile.height && this.profile.weight) {
        const heightInMeters = this.profile.height / 100;
        this.profile.bmi = (
            this.profile.weight /
            (heightInMeters * heightInMeters)
        ).toFixed(1);
    }
};

module.exports = mongoose.model('User', userSchema);
