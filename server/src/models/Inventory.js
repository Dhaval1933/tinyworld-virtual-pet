const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemId: {
      type: String,
      required: true, // References ShopItem.itemId
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    acquiredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate entries for the same user + item
inventorySchema.index({ userId: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', inventorySchema);
