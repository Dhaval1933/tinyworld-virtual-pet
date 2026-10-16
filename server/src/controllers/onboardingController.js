const User = require('../models/User');
const Pet = require('../models/Pet');
const World = require('../models/World');
const Inventory = require('../models/Inventory');
const AppError = require('../utils/AppError');
const { STARTER_COINS, PET_SPECIES, ROOM_THEMES } = require('../utils/constants');

/**
 * POST /api/v1/onboarding/complete
 * Creates the user's pet, world, and starter inventory.
 */
exports.complete = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { petSpecies, petName, roomTheme, focusCategory } = req.body;

    // Prevent re-onboarding
    if (req.user.onboardingCompleted) {
      throw new AppError('Onboarding already completed.', 400);
    }

    // Validate species
    if (!PET_SPECIES.includes(petSpecies)) {
      throw new AppError(`Invalid pet species. Choose from: ${PET_SPECIES.join(', ')}`, 400);
    }

    // Validate pet name
    if (!petName || petName.trim().length < 1 || petName.trim().length > 20) {
      throw new AppError('Pet name must be 1–20 characters.', 400);
    }

    // Validate room theme
    const theme = ROOM_THEMES.includes(roomTheme) ? roomTheme : 'cozy';

    // Create pet
    const pet = await Pet.create({
      userId,
      species: petSpecies,
      name: petName.trim(),
    });

    // Create world
    const world = await World.create({
      userId,
      roomTheme: theme,
    });

    // Give starter items
    const starterItems = ['small-wooden-bed', 'round-rug', 'potted-plant'];
    const inventoryOps = starterItems.map((itemId) =>
      Inventory.findOneAndUpdate(
        { userId, itemId },
        { userId, itemId, quantity: 1, acquiredAt: new Date() },
        { upsert: true, new: true }
      )
    );
    await Promise.all(inventoryOps);

    // Update user
    await User.findByIdAndUpdate(userId, {
      onboardingCompleted: true,
      coins: STARTER_COINS,
    });

    // Re-fetch user
    const user = await User.findById(userId).select('-passwordHash');

    res.status(201).json({
      success: true,
      user: user.toSafeObject(),
      pet,
      world,
      message: `Welcome to TinyWorld! ${petName} is excited to meet you! 🎉`,
    });
  } catch (error) {
    next(error);
  }
};
