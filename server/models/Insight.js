const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        sugarLog: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SugarLog',
            required: true,
        },

        // The main insight message (cause-effect)
        message: {
            type: String,
            required: true,
        },

        // Corrective action recommendation
        action: {
            type: String,
            required: true,
        },

        // Why this action was recommended
        reasoning: {
            type: String,
            required: true,
        },

        // Context used to generate insight
        context: {
            bmi: Number,
            age: Number,
            steps: Number,
            sleepHours: Number,
            timeOfDay: String,
            sugarFrequency: Number, // Logs this week
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Insight', insightSchema);
