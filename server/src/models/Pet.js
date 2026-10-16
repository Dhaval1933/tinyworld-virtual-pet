const mongoose = require('mongoose');
const { PET_SPECIES, PET_STAT_MIN, PET_STAT_MAX } = require('../utils/constants');

const petSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One pet per user
    },
    species: {
      type: String,
      required: true,
      enum: PET_SPECIES,
    },
    name: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
      minlength: [1, 'Pet name must be at least 1 character'],
      maxlength: [20, 'Pet name cannot exceed 20 characters'],
    },
    hunger: {
      type: Number,
      default: 80,
      min: PET_STAT_MIN,
      max: PET_STAT_MAX,
    },
    happiness: {
      type: Number,
      default: 80,
      min: PET_STAT_MIN,
      max: PET_STAT_MAX,
    },
    energy: {
      type: Number,
      default: 80,
      min: PET_STAT_MIN,
      max: PET_STAT_MAX,
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    lastFedAt: {
      type: Date,
      default: null,
    },
    lastPettedAt: {
      type: Date,
      default: null,
    },
    lastRestedAt: {
      type: Date,
      default: null,
    },
    lastNeedsUpdateAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Pet', petSchema);
