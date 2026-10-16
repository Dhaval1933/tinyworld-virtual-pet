const ShopItem = require('../models/ShopItem');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const WalletTransaction = require('../models/WalletTransaction');
const AppError = require('../utils/AppError');

/**
 * GET /api/v1/shop
 */
exports.getShopItems = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { active: true };
    if (category) filter.category = category;

    const items = await ShopItem.find(filter).sort({ category: 1, price: 1 });
    res.json({ success: true, items });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/shop/inventory  (mapped from /api/v1/inventory)
 */
exports.getInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.find({ userId: req.user._id });

    // Enrich with shop item details
    const itemIds = inventory.map((i) => i.itemId);
    const shopItems = await ShopItem.find({ itemId: { $in: itemIds } });
    const shopMap = {};
    shopItems.forEach((si) => { shopMap[si.itemId] = si; });

    const enriched = inventory.map((inv) => ({
      ...inv.toObject(),
      item: shopMap[inv.itemId] || null,
    }));

    res.json({ success: true, inventory: enriched });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/shop/purchase
 * Uses atomic $inc with $gte guard to prevent race conditions.
 */
exports.purchase = async (req, res, next) => {
  try {
    const { itemId } = req.body;
    const userId = req.user._id;

    if (!itemId) {
      throw new AppError('itemId is required.', 400);
    }

    // Fetch item
    const shopItem = await ShopItem.findOne({ itemId, active: true });
    if (!shopItem) {
      throw new AppError('Item not found or not available.', 404);
    }

    // Check level requirement
    if (shopItem.unlockRequirements?.level > req.user.level) {
      throw new AppError(`You need level ${shopItem.unlockRequirements.level} to buy this.`, 403);
    }

    // Check if already owned (non-stackable)
    if (!shopItem.stackable) {
      const existing = await Inventory.findOne({ userId, itemId });
      if (existing) {
        throw new AppError('You already own this item.', 409);
      }
    }

    // Atomic coin deduction — fails if insufficient
    const result = await User.findOneAndUpdate(
      { _id: userId, coins: { $gte: shopItem.price } },
      { $inc: { coins: -shopItem.price } },
      { new: true }
    );

    if (!result) {
      throw new AppError('Insufficient coins.', 400);
    }

    // Add to inventory
    await Inventory.findOneAndUpdate(
      { userId, itemId },
      { $inc: { quantity: 1 }, $setOnInsert: { acquiredAt: new Date() } },
      { upsert: true, new: true }
    );

    // Record transaction
    await WalletTransaction.create({
      userId,
      transactionType: 'spend',
      amount: shopItem.price,
      reason: `Purchased ${shopItem.name}`,
    });

    res.json({
      success: true,
      item: shopItem,
      newBalance: result.coins,
      message: `You bought ${shopItem.name}! 🛍️`,
    });
  } catch (error) {
    next(error);
  }
};
