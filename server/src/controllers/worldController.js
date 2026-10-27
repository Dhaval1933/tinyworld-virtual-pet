const World = require('../models/World');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const WalletTransaction = require('../models/WalletTransaction');
const AppError = require('../utils/AppError');
const { MAX_ROOM_ITEMS, BALCONY_VIEWS } = require('../utils/constants');

/**
 * Validate a layout array (bounds 0–1, max capacity, schema).
 */
function validateLayout(layoutArray, layoutName = 'Room') {
  if (!Array.isArray(layoutArray)) {
    throw new AppError(`${layoutName} layout must be an array.`, 400);
  }

  if (layoutArray.length > MAX_ROOM_ITEMS) {
    throw new AppError(`${layoutName} cannot have more than ${MAX_ROOM_ITEMS} items.`, 400);
  }

  for (const item of layoutArray) {
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
}

/**
 * GET /api/v1/world
 */
exports.getWorld = async (req, res, next) => {
  try {
    let world = await World.findOne({ userId: req.user._id });
    if (!world) {
      throw new AppError('World not found. Complete onboarding first.', 404);
    }

    let needsSave = false;

    // Ensure unlockedBalconyViews has at least 'sunset' (free default)
    if (!world.unlockedBalconyViews || world.unlockedBalconyViews.length === 0) {
      world.unlockedBalconyViews = ['sunset'];
      needsSave = true;
    }

    // Ensure balconyLayout is an array
    if (!world.balconyLayout) {
      world.balconyLayout = [];
      needsSave = true;
    }

    // If room is empty, auto-initialize starter items if owned
    if (!world.roomLayout || world.roomLayout.length === 0) {
      const owned = await Inventory.find({
        userId: req.user._id,
        itemId: { $in: ['small-wooden-bed', 'round-rug', 'potted-plant'] },
      });
      if (owned.length > 0) {
        const ownedMap = new Set(owned.map((o) => o.itemId));
        const starterLayout = [];
        if (ownedMap.has('small-wooden-bed')) {
          starterLayout.push({ placementId: `bed-${req.user._id}`, itemId: 'small-wooden-bed', x: 0.22, y: 0.62, rotation: 0, layer: 1 });
        }
        if (ownedMap.has('round-rug')) {
          starterLayout.push({ placementId: `rug-${req.user._id}`, itemId: 'round-rug', x: 0.50, y: 0.72, rotation: 0, layer: 0 });
        }
        if (ownedMap.has('potted-plant')) {
          starterLayout.push({ placementId: `plant-${req.user._id}`, itemId: 'potted-plant', x: 0.80, y: 0.58, rotation: 0, layer: 1 });
        }
        if (starterLayout.length > 0) {
          world.roomLayout = starterLayout;
          needsSave = true;
        }
      }
    }

    if (needsSave) {
      await world.save();
    }

    res.json({ success: true, world });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/world/layout
 * Saves roomLayout or balconyLayout independently. Validates item ownership and coordinates.
 */
exports.updateLayout = async (req, res, next) => {
  try {
    const { roomLayout, balconyLayout, scene, layout } = req.body;
    const userId = req.user._id;

    let targetRoomLayout = roomLayout;
    let targetBalconyLayout = balconyLayout;

    // Handle generic layout parameter based on scene
    if (layout !== undefined) {
      if (scene === 'balcony') {
        targetBalconyLayout = layout;
      } else {
        targetRoomLayout = layout;
      }
    }

    if (targetRoomLayout === undefined && targetBalconyLayout === undefined) {
      throw new AppError('roomLayout or balconyLayout must be provided.', 400);
    }

    // Validate whichever layout is being updated
    if (targetRoomLayout !== undefined) {
      validateLayout(targetRoomLayout, 'Room');
    }
    if (targetBalconyLayout !== undefined) {
      validateLayout(targetBalconyLayout, 'Balcony');
    }

    // Collect all itemIds to verify ownership
    const allItemIds = [
      ...(targetRoomLayout ? targetRoomLayout.map((i) => i.itemId) : []),
      ...(targetBalconyLayout ? targetBalconyLayout.map((i) => i.itemId) : []),
    ];
    const uniqueItemIds = [...new Set(allItemIds)];

    if (uniqueItemIds.length > 0) {
      const owned = await Inventory.find({ userId, itemId: { $in: uniqueItemIds } });
      const ownedIds = new Set(owned.map((i) => i.itemId));

      for (const id of uniqueItemIds) {
        if (!ownedIds.has(id)) {
          throw new AppError(`You do not own item: ${id}`, 403);
        }
      }
    }

    const updateFields = {};
    if (targetRoomLayout !== undefined) updateFields.roomLayout = targetRoomLayout;
    if (targetBalconyLayout !== undefined) updateFields.balconyLayout = targetBalconyLayout;

    const world = await World.findOneAndUpdate(
      { userId },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!world) {
      throw new AppError('World not found.', 404);
    }

    // Check & unlock decoration achievements
    const { checkAchievements } = require('../utils/achievementChecker');
    const unlockedAchievements = await checkAchievements(userId);

    res.json({
      success: true,
      roomLayout: world.roomLayout,
      balconyLayout: world.balconyLayout,
      world,
      unlockedAchievements,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/world/theme
 */
exports.updateTheme = async (req, res, next) => {
  try {
    const { roomTheme, wallStyle, floorStyle, activeScene, balconyView } = req.body;
    const update = {};
    if (roomTheme) update.roomTheme = roomTheme;
    if (wallStyle) update.wallStyle = wallStyle;
    if (floorStyle) update.floorStyle = floorStyle;
    if (activeScene) update.activeScene = activeScene;

    if (balconyView) {
      const currentWorld = await World.findOne({ userId: req.user._id });
      const unlocked = currentWorld?.unlockedBalconyViews || ['sunset'];
      if (!unlocked.includes(balconyView)) {
        throw new AppError(`The "${balconyView}" balcony view is locked. Unlock it first!`, 403);
      }
      update.balconyView = balconyView;
    }

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

/**
 * POST /api/v1/world/unlock-balcony-view
 * Unlocks an outdoor scenic view with coins if user meets level requirement.
 */
exports.unlockBalconyView = async (req, res, next) => {
  try {
    const { viewId } = req.body;
    const userId = req.user._id;

    if (!viewId || !BALCONY_VIEWS[viewId]) {
      throw new AppError(`Invalid balcony view: ${viewId}`, 400);
    }

    const viewConfig = BALCONY_VIEWS[viewId];
    let world = await World.findOne({ userId });
    if (!world) {
      throw new AppError('World not found. Complete onboarding first.', 404);
    }

    const unlockedViews = world.unlockedBalconyViews || ['sunset'];

    // If already unlocked, simply activate and return
    if (unlockedViews.includes(viewId)) {
      world.balconyView = viewId;
      await world.save();
      return res.json({
        success: true,
        message: `${viewConfig.name} is already unlocked!`,
        world,
      });
    }

    // Check user level requirement
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found.', 404);

    if (viewConfig.levelReq && (user.level || 1) < viewConfig.levelReq) {
      throw new AppError(
        `You need Level ${viewConfig.levelReq} to unlock ${viewConfig.name}. (Current Level: ${user.level || 1})`,
        403
      );
    }

    // Deduct coins if cost > 0
    if (viewConfig.cost > 0) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId, coins: { $gte: viewConfig.cost } },
        { $inc: { coins: -viewConfig.cost } },
        { new: true }
      );

      if (!updatedUser) {
        throw new AppError(
          `Insufficient coins. You need ${viewConfig.cost} coins to unlock ${viewConfig.name}.`,
          400
        );
      }

      await WalletTransaction.create({
        userId,
        transactionType: 'spend',
        amount: viewConfig.cost,
        reason: `Unlocked ${viewConfig.name} Balcony View`,
      });
    }

    // Add to unlocked list and set active
    world.unlockedBalconyViews.push(viewId);
    world.balconyView = viewId;
    await world.save();

    const freshUser = await User.findById(userId);

    res.json({
      success: true,
      message: `Unlocked ${viewConfig.name}! 🌅✨`,
      world,
      unlockedBalconyViews: world.unlockedBalconyViews,
      newBalance: freshUser.coins,
    });
  } catch (error) {
    next(error);
  }
};
