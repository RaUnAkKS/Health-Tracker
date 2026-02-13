const mongoose = require('mongoose');

const sugarLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        // Type of sugar source
        type: {
            type: String,
            enum: ['CHAI', 'SWEETS', 'COLD_DRINK', 'PACKAGED_SNACK', 'CUSTOM'],
            required: true,
        },

        // Sugar amount in grams
        sugarAmount: {
            type: Number,
            required: true,
        },

        // Optional custom description
        description: String,

        // Photo URL (optional - from Cloudinary)
        photoUrl: String,

        // AI Detection Results (optional)
        aiDetectedFood: String, // e.g., "Chocolate bar, Candy"
        aiSugarEstimate: Number, // AI's sugar estimate in grams
        aiConfidence: {
            type: Number, // 0-1 confidence score
            min: 0,
            max: 1,
        },

        // XP awarded for this log
        xpAwarded: {
            type: Number,
            default: 0,
        },

        // Time of day category
        timeOfDay: {
            type: String,
            enum: ['morning', 'afternoon', 'evening', 'night'],
        },

        // Associated insight
        insightGenerated: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Insight',
        },

        // Corrective action completed
        correctiveActionCompleted: {
            type: Boolean,
            default: false,
        },

        correctiveActionCompletedAt: Date,
    },
    {
        timestamps: true,
    }
);

// Index for efficient date-based queries
sugarLogSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('SugarLog', sugarLogSchema);
