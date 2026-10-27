const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    activityType: {
      type: String,
      required: true,
      enum: ['reading', 'studying', 'exercise', 'hydration', 'cleaning', 'practice', 'task', 'custom', 'mini-game'],
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    note: {
      type: String,
      default: '',
      maxlength: 500,
    },
    durationMinutes: {
      type: Number,
      default: 0,
      min: 0,
      max: 480, // Max 8 hours
    },
    rewardCoins: {
      type: Number,
      required: true,
      min: 0,
    },
    rewardXP: {
      type: Number,
      required: true,
      min: 0,
    },
    completionDate: {
      type: Date,
      default: Date.now,
    },
    idempotencyKey: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reward claims
activitySchema.index({ userId: 1, idempotencyKey: 1 }, { unique: true });
// Efficient daily activity lookups
activitySchema.index({ userId: 1, completionDate: -1 });

module.exports = mongoose.model('Activity', activitySchema);
