const Activity = require('../models/Activity');
const User = require('../models/User');
const Pet = require('../models/Pet');
const WalletTransaction = require('../models/WalletTransaction');
const AppError = require('../utils/AppError');
const { ACTIVITY_REWARDS, DAILY_ACTIVITY_REWARD_LIMIT } = require('../utils/constants');
const { getLevelFromXP } = require('../utils/xpFormula');

/**
 * Predefined activity types with display info.
 */
const ACTIVITY_TYPES = [
  { type: 'reading',   title: 'Read for 20 minutes',       icon: '📖', duration: 20 },
  { type: 'studying',  title: 'Study for 25 minutes',      icon: '📚', duration: 25 },
  { type: 'exercise',  title: 'Exercise for 15 minutes',   icon: '🏃', duration: 15 },
  { type: 'hydration', title: 'Drink water',                icon: '💧', duration: 0  },
  { type: 'cleaning',  title: 'Clean your workspace',      icon: '🧹', duration: 10 },
  { type: 'practice',  title: 'Practice a skill',          icon: '🎯', duration: 15 },
  { type: 'task',      title: 'Complete a personal task',   icon: '✅', duration: 0  },
];

/**
 * GET /api/v1/activities
 */
exports.getActivityTypes = async (req, res) => {
  const types = ACTIVITY_TYPES.map((a) => ({
    ...a,
    rewards: ACTIVITY_REWARDS[a.type],
  }));
  res.json({ success: true, activities: types });
};

/**
 * POST /api/v1/activities/complete
 */
exports.complete = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { activityType, title, note, durationMinutes, idempotencyKey } = req.body;

    if (!activityType || !idempotencyKey) {
      throw new AppError('activityType and idempotencyKey are required.', 400);
    }

    // Check idempotency — prevent duplicate rewards
    const existing = await Activity.findOne({ userId, idempotencyKey });
    if (existing) {
      return res.json({
        success: true,
        activity: existing,
        rewards: { coins: existing.rewardCoins, xp: existing.rewardXP },
        duplicate: true,
        message: 'This activity was already recorded.',
      });
    }

    // Check daily limit
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayCount = await Activity.countDocuments({
      userId,
      completionDate: { $gte: startOfDay },
    });

    if (todayCount >= DAILY_ACTIVITY_REWARD_LIMIT) {
      throw new AppError(
        `Daily reward limit reached (${DAILY_ACTIVITY_REWARD_LIMIT} activities). Come back tomorrow!`,
        429
      );
    }

    // Determine rewards (server-side, never from client)
    const rewards = ACTIVITY_REWARDS[activityType] || ACTIVITY_REWARDS.custom;

    // Create activity record
    const activity = await Activity.create({
      userId,
      activityType,
      title: title || ACTIVITY_TYPES.find((a) => a.type === activityType)?.title || activityType,
      note: note || '',
      durationMinutes: durationMinutes || 0,
      rewardCoins: rewards.coins,
      rewardXP: rewards.xp,
      idempotencyKey,
    });

    // Update user coins + XP
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { coins: rewards.coins, totalXP: rewards.xp } },
      { new: true }
    );

    // Recalculate level
    const newLevel = getLevelFromXP(user.totalXP);
    const leveledUp = newLevel > user.level;
    if (leveledUp) {
      user.level = newLevel;
      await user.save();
    }

    // Update pet XP
    await Pet.findOneAndUpdate(
      { userId },
      { $inc: { experience: rewards.xp } }
    );

    // Record wallet transaction
    await WalletTransaction.create({
      userId,
      transactionType: 'earn',
      amount: rewards.coins,
      reason: `Completed activity: ${activity.title}`,
      referenceId: activity._id,
    });

    res.status(201).json({
      success: true,
      activity,
      rewards,
      newBalance: user.coins,
      newTotalXP: user.totalXP,
      leveledUp,
      newLevel: user.level,
      message: `Great job! +${rewards.coins} coins, +${rewards.xp} XP 🎉`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/activities/history
 */
exports.getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      Activity.find({ userId: req.user._id })
        .sort({ completionDate: -1 })
        .skip(skip)
        .limit(limit),
      Activity.countDocuments({ userId: req.user._id }),
    ]);

    res.json({
      success: true,
      activities,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/activities/summary
 */
exports.getSummary = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [todayActivities, totalActivities, todayCoins, todayXP] = await Promise.all([
      Activity.countDocuments({ userId: req.user._id, completionDate: { $gte: startOfDay } }),
      Activity.countDocuments({ userId: req.user._id }),
      Activity.aggregate([
        { $match: { userId: req.user._id, completionDate: { $gte: startOfDay } } },
        { $group: { _id: null, total: { $sum: '$rewardCoins' } } },
      ]),
      Activity.aggregate([
        { $match: { userId: req.user._id, completionDate: { $gte: startOfDay } } },
        { $group: { _id: null, total: { $sum: '$rewardXP' } } },
      ]),
    ]);

    res.json({
      success: true,
      summary: {
        todayActivities,
        todayLimit: DAILY_ACTIVITY_REWARD_LIMIT,
        totalActivities,
        todayCoins: todayCoins[0]?.total || 0,
        todayXP: todayXP[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
