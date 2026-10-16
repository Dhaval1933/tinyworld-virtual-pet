const World = require('../models/World');
const Inventory = require('../models/Inventory');
const AppError = require('../utils/AppError');
const { MAX_ROOM_ITEMS } = require('../utils/constants');

/**
 * GET /api/v1/world
 */
exports.getWorld = async (req, res, next) => {
  try {
    const world = await World.findOne({ userId: req.user._id });
    if (!world) {
      throw new AppError('World not found. Complete onboarding first.', 404);
    }
    res.json({ success: true, world });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/world/layout
 * Saves the room layout. Validates item ownership and positions.
 */
exports.updateLayout = async (req, res, next) => {
  try {
    const { roomLayout } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(roomLayout)) {
      throw new AppError('roomLayout must be an array.', 400);
    }

    if (roomLayout.length > MAX_ROOM_ITEMS) {
      throw new AppError(`Room cannot have more than ${MAX_ROOM_ITEMS} items.`, 400);
    }

    // Validate each item
    for (const item of roomLayout) {
      if (!item.placementId || !item.itemId) {
        throw new AppError('Each item must have a placementId and itemId.', 400);
      }
      if (typeof item.x !== 'number' || typeof item.y !== 'number') {
        throw new AppError('Each item must have numeric x and y coordinates.', 400);
      }
      if (item.x < 0 || item.x > 1 || item.y < 0 || item.y > 1) {
        throw new AppError('Item coordinates must be between 0 and 1.', 400);
      }
    }

    // Verify user owns all items
    const itemIds = [...new Set(roomLayout.map((i) => i.itemId))];
    const owned = await Inventory.find({ userId, itemId: { $in: itemIds } });
    const ownedIds = new Set(owned.map((i) => i.itemId));

    for (const id of itemIds) {
      if (!ownedIds.has(id)) {
        throw new AppError(`You do not own item: ${id}`, 403);
      }
    }

    const world = await World.findOneAndUpdate(
      { userId },
      { roomLayout },
      { new: true, runValidators: true }
    );

    if (!world) {
      throw new AppError('World not found.', 404);
    }

    res.json({ success: true, roomLayout: world.roomLayout });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/world/theme
 */
exports.updateTheme = async (req, res, next) => {
  try {
    const { roomTheme, wallStyle, floorStyle } = req.body;
    const update = {};
    if (roomTheme) update.roomTheme = roomTheme;
    if (wallStyle) update.wallStyle = wallStyle;
    if (floorStyle) update.floorStyle = floorStyle;

    const world = await World.findOneAndUpdate(
      { userId: req.user._id },
      update,
      { new: true }
    );

    if (!world) {
      throw new AppError('World not found.', 404);
    }

    res.json({ success: true, world });
  } catch (error) {
    next(error);
  }
};
