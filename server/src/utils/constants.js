/**
 * Game constants — single source of truth for balancing.
 */
module.exports = {
  // Pet stat bounds
  PET_STAT_MIN: 0,
  PET_STAT_MAX: 100,

  // Pet decay rates (per hour)
  PET_HUNGER_DECAY: 2,        // loses 2 hunger/hr
  PET_HAPPINESS_DECAY: 1.5,   // loses 1.5 happiness/hr
  PET_ENERGY_RECOVERY: 3,     // gains 3 energy/hr (resting)

  // Pet interaction effects
  FEED_HUNGER_GAIN: 25,
  FEED_HAPPINESS_GAIN: 10,
  PET_HAPPINESS_GAIN: 15,
  REST_ENERGY_GAIN: 30,

  // Interaction cooldowns (in milliseconds)
  FEED_COOLDOWN: 30 * 60 * 1000,   // 30 minutes
  PET_COOLDOWN: 5 * 60 * 1000,     // 5 minutes
  REST_COOLDOWN: 60 * 60 * 1000,   // 1 hour

  // Economy
  STARTER_COINS: 200,
  DAILY_ACTIVITY_REWARD_LIMIT: 10,  // max rewarded activities per day
  MAX_CUSTOM_ACTIVITY_REWARD_COINS: 15,
  MAX_CUSTOM_ACTIVITY_REWARD_XP: 20,

  // Room
  MAX_ROOM_ITEMS: 30,

  // Predefined activity rewards
  ACTIVITY_REWARDS: {
    reading:   { coins: 15, xp: 20 },
    studying:  { coins: 20, xp: 25 },
    exercise:  { coins: 15, xp: 20 },
    hydration: { coins: 5,  xp: 5  },
    cleaning:  { coins: 10, xp: 15 },
    practice:  { coins: 15, xp: 20 },
    task:      { coins: 10, xp: 15 },
    custom:    { coins: 10, xp: 10 },
    'mini-game': { coins: 25, xp: 30 },
  },

  // Pet species
  PET_SPECIES: ['mochi', 'pebble', 'sprout'],

  // Room themes
  ROOM_THEMES: ['cozy', 'forest', 'cloud', 'ocean'],

  // Item categories
  ITEM_CATEGORIES: ['furniture', 'plants', 'decorations', 'wallpaper', 'flooring', 'food'],

  // Balcony views: 'sunset' is free, others are unlockable with level and coins
  BALCONY_VIEWS: {
    sunset: { name: 'Sunset Horizon', cost: 0, levelReq: 1, free: true },
    'cherry-blossom': { name: 'Cherry Blossom Grove', cost: 100, levelReq: 2 },
    ocean: { name: 'Ocean Breeze', cost: 150, levelReq: 2 },
    'rainy-garden': { name: 'Rainy Garden', cost: 200, levelReq: 3 },
    city: { name: 'Night Cityscape', cost: 250, levelReq: 3 },
    galaxy: { name: 'Cosmic Galaxy', cost: 350, levelReq: 4 },
  },
};
