const User = require('../models/User');
const Pet = require('../models/Pet');
const Activity = require('../models/Activity');
const Inventory = require('../models/Inventory');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const WalletTransaction = require('../models/WalletTransaction');
const { getLevelProgress } = require('../utils/xpFormula');

/**
 * GET /api/v1/progress
 */
exports.getProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [user, pet, totalActivities, totalItems, recentActivities, transactions] =
      await Promise.all([
        User.findById(userId).select('-passwordHash'),
        Pet.findOne({ userId }),
        Activity.countDocuments({ userId }),
        Inventory.countDocuments({ userId }),
        Activity.find({ userId }).sort({ completionDate: -1 }).limit(5),
        WalletTransaction.find({ userId }).sort({ createdAt: -1 }).limit(10),
      ]);

    const levelProgress = getLevelProgress(user.totalXP);
    const achievements = await UserAchievement.find({ userId });

    res.json({
      success: true,
      progress: {
        user: user.toSafeObject(),
        levelProgress,
        pet: pet
          ? { name: pet.name, species: pet.species, level: pet.level }
          : null,
        stats: {
          totalActivities,
          totalItems,
          achievementsUnlocked: achievements.length,
        },
        recentActivities,
        recentTransactions: transactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/progress/achievements
 */
exports.getAchievements = async (req, res, next) => {
  try {
    const [allAchievements, unlockedAchievements] = await Promise.all([
      Achievement.find({}),
      UserAchievement.find({ userId: req.user._id }),
    ]);

    const unlockedSet = new Set(unlockedAchievements.map((a) => a.achievementId));

    const achievements = allAchievements.map((a) => ({
      ...a.toObject(),
      unlocked: unlockedSet.has(a.achievementId),
      unlockedAt: unlockedAchievements.find((u) => u.achievementId === a.achievementId)?.unlockedAt,
    }));

    res.json({ success: true, achievements });
  } catch (error) {
    next(error);
  }
};
