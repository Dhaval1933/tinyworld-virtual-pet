const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    achievementId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    iconKey: {
      type: String,
      required: true,
    },
    requirementType: {
      type: String,
      required: true,
      enum: [
        'activities_completed',
        'items_owned',
        'items_placed',
        'level_reached',
        'coins_earned',
        'first_activity',
        'first_decoration',
        'first_purchase',
      ],
    },
    requirementValue: {
      type: Number,
      required: true,
      min: 1,
    },
    rewardCoins: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Achievement', achievementSchema);
