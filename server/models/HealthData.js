const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        date: {
            type: Date,
            required: true,
            index: true,
        },

        // Step count
        steps: {
            type: Number,
            default: 0,
        },

        // Sleep duration in hours
        sleepHours: Number,

        // Heart rate (optional)
        heartRate: Number,

        // Water intake in ml (optional)
        waterIntake: Number,
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient user + date queries
healthDataSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('HealthData', healthDataSchema);
