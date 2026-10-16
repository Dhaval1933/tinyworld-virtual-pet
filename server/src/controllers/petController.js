const Pet = require('../models/Pet');
const AppError = require('../utils/AppError');
const {
  PET_STAT_MIN, PET_STAT_MAX,
  PET_HUNGER_DECAY, PET_HAPPINESS_DECAY, PET_ENERGY_RECOVERY,
  FEED_HUNGER_GAIN, FEED_HAPPINESS_GAIN, PET_HAPPINESS_GAIN, REST_ENERGY_GAIN,
  FEED_COOLDOWN, PET_COOLDOWN, REST_COOLDOWN,
} = require('../utils/constants');

/**
 * Recalculate pet stats based on elapsed time since last update.
 */
function recalculateStats(pet) {
  const now = new Date();
  const elapsed = (now - pet.lastNeedsUpdateAt) / 3600000; // hours

  if (elapsed > 0) {
    pet.hunger = clamp(pet.hunger - elapsed * PET_HUNGER_DECAY);
    pet.happiness = clamp(pet.happiness - elapsed * PET_HAPPINESS_DECAY);
    pet.energy = clamp(pet.energy + elapsed * PET_ENERGY_RECOVERY);
    pet.lastNeedsUpdateAt = now;
  }
  return pet;
}

function clamp(value) {
  return Math.round(Math.max(PET_STAT_MIN, Math.min(PET_STAT_MAX, value)));
}

function checkCooldown(lastActionAt, cooldownMs, actionName) {
  if (lastActionAt) {
    const elapsed = Date.now() - new Date(lastActionAt).getTime();
    if (elapsed < cooldownMs) {
      const remaining = Math.ceil((cooldownMs - elapsed) / 60000);
      throw new AppError(`${actionName} is on cooldown. Try again in ${remaining} minute(s).`, 429);
    }
  }
}

/**
 * GET /api/v1/pet
 */
exports.getPet = async (req, res, next) => {
  try {
    let pet = await Pet.findOne({ userId: req.user._id });
    if (!pet) {
      throw new AppError('Pet not found. Complete onboarding first.', 404);
    }

    pet = recalculateStats(pet);
    await pet.save();

    res.json({ success: true, pet });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/pet/name
 */
exports.updateName = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 1 || name.trim().length > 20) {
      throw new AppError('Pet name must be 1–20 characters.', 400);
    }

    const pet = await Pet.findOneAndUpdate(
      { userId: req.user._id },
      { name: name.trim() },
      { new: true }
    );

    if (!pet) throw new AppError('Pet not found.', 404);

    res.json({ success: true, pet });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/pet/feed
 */
exports.feed = async (req, res, next) => {
  try {
    let pet = await Pet.findOne({ userId: req.user._id });
    if (!pet) throw new AppError('Pet not found.', 404);

    pet = recalculateStats(pet);
    checkCooldown(pet.lastFedAt, FEED_COOLDOWN, 'Feeding');

    pet.hunger = clamp(pet.hunger + FEED_HUNGER_GAIN);
    pet.happiness = clamp(pet.happiness + FEED_HAPPINESS_GAIN);
    pet.lastFedAt = new Date();
    await pet.save();

    res.json({
      success: true,
      pet,
      message: `${pet.name} enjoyed the meal! 🍽️`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/pet/pet
 */
exports.petPet = async (req, res, next) => {
  try {
    let pet = await Pet.findOne({ userId: req.user._id });
    if (!pet) throw new AppError('Pet not found.', 404);

    pet = recalculateStats(pet);
    checkCooldown(pet.lastPettedAt, PET_COOLDOWN, 'Petting');

    pet.happiness = clamp(pet.happiness + PET_HAPPINESS_GAIN);
    pet.lastPettedAt = new Date();
    await pet.save();

    res.json({
      success: true,
      pet,
      message: `${pet.name} loves the attention! 💕`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/pet/rest
 */
exports.rest = async (req, res, next) => {
  try {
    let pet = await Pet.findOne({ userId: req.user._id });
    if (!pet) throw new AppError('Pet not found.', 404);

    pet = recalculateStats(pet);
    checkCooldown(pet.lastRestedAt, REST_COOLDOWN, 'Resting');

    pet.energy = clamp(pet.energy + REST_ENERGY_GAIN);
    pet.lastRestedAt = new Date();
    await pet.save();

    res.json({
      success: true,
      pet,
      message: `${pet.name} had a nice rest! 😴`,
    });
  } catch (error) {
    next(error);
  }
};
