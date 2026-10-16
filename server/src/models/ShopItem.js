const mongoose = require('mongoose');
const { ITEM_CATEGORIES } = require('../utils/constants');

const shopItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
      unique: true, // Stable slug, e.g. 'small-wooden-bed'
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ITEM_CATEGORIES,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    rarity: {
      type: String,
      enum: ['common', 'uncommon', 'rare'],
      default: 'common',
    },
    assetKey: {
      type: String,
      required: true, // Key used to look up the SVG/CSS asset on frontend
    },
    itemType: {
      type: String,
      enum: ['placeable', 'consumable', 'theme'],
      default: 'placeable',
    },
    stackable: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    unlockRequirements: {
      level: { type: Number, default: 1 },
    },
  },
  {
    timestamps: true,
  }
);

shopItemSchema.index({ category: 1, active: 1 });

module.exports = mongoose.model('ShopItem', shopItemSchema);
