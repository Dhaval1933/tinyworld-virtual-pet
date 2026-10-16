const User = require('../models/User');
const AppError = require('../utils/AppError');

/**
 * PATCH /api/v1/users/me
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { displayName, username } = req.body;
    const update = {};

    if (displayName !== undefined) {
      if (displayName.trim().length < 2 || displayName.trim().length > 30) {
        throw new AppError('Display name must be 2–30 characters.', 400);
      }
      update.displayName = displayName.trim();
    }

    if (username !== undefined) {
      if (username && (username.length < 3 || username.length > 20 || !/^[a-z0-9_]+$/.test(username))) {
        throw new AppError('Username: 3–20 chars, lowercase letters, numbers, underscores.', 400);
      }
      // Check uniqueness
      if (username) {
        const existing = await User.findOne({ username, _id: { $ne: req.user._id } });
        if (existing) {
          throw new AppError('This username is already taken.', 409);
        }
      }
      update.username = username || undefined;
    }

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-passwordHash');
    res.json({ success: true, user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};
