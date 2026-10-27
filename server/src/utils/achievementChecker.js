const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const User = require('../models/User');
const Activity = require('../models/Activity');
const Inventory = require('../models/Inventory');
const World = require('../models/World');
const WalletTransaction = require('../models/WalletTransaction');

/**
 * Evaluates achievement requirements for a user and unlocks any newly earned achievements.
 * Awards bonus coins and creates wallet ledger entries automatically.
 *
 * @param {ObjectId} userId
 * @returns {Promise<Array>} List of newly unlocked achievements
 */
async function checkAchievements(userId) {
  try {
    const [allAchievements, userAchievements, user, activityCount, itemsOwnedCount, world, spendCount] =
      await Promise.all([
        Achievement.find({}),
        UserAchievement.find({ userId }),
        User.findById(userId),
        Activity.countDocuments({ userId }),
        Inventory.countDocuments({ userId }),
        World.findOne({ userId }),
        WalletTransaction.countDocuments({ userId, transactionType: 'spend' }),
      ]);

    if (!user) return [];

    const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));
    const itemsPlacedCount =
      (world?.roomLayout?.length || 0) + (world?.balconyLayout?.length || 0);

    const newlyUnlocked = [];

    for (const achievement of allAchievements) {
      if (unlockedIds.has(achievement.achievementId)) continue;

      let satisfied = false;

      switch (achievement.requirementType) {
        case 'first_activity':
          satisfied = activityCount >= 1;
          break;
        case 'activities_completed':
          satisfied = activityCount >= achievement.requirementValue;
          break;
        case 'first_purchase':
          satisfied = spendCount >= 1;
          break;
        case 'items_owned':
          satisfied = itemsOwnedCount >= achievement.requirementValue;
          break;
        case 'first_decoration':
          satisfied = itemsPlacedCount >= 1;
          break;
        case 'items_placed':
          satisfied = itemsPlacedCount >= achievement.requirementValue;
          break;
        case 'level_reached':
          satisfied = (user.level || 1) >= achievement.requirementValue;
          break;
        default:
          break;
      }

      if (satisfied) {
        // Unlock achievement
        await UserAchievement.create({
          userId,
          achievementId: achievement.achievementId,
        });

        // Award bonus coins if applicable
        if (achievement.rewardCoins > 0) {
          await User.findByIdAndUpdate(userId, {
            $inc: { coins: achievement.rewardCoins },
          });

          await WalletTransaction.create({
            userId,
            transactionType: 'earn',
            amount: achievement.rewardCoins,
            reason: `Unlocked Achievement: ${achievement.name}`,
          });
        }

        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  } catch (error) {
    console.error('Error in checkAchievements:', error);
    return [];
  }
}

module.exports = { checkAchievements };
