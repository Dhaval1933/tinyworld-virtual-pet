const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { JWT_SECRET, JWT_EXPIRES_IN, COOKIE_SECURE, COOKIE_SAME_SITE, NODE_ENV } = require('../config/env');

/**
 * Helper: set JWT as HTTP-only cookie on the response.
 */
const setTokenCookie = (res, userId) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  res.cookie('token', token, {
    httpOnly: true,
    secure: COOKIE_SECURE || NODE_ENV === 'production',
    sameSite: COOKIE_SAME_SITE,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * POST /api/v1/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { displayName, email, password, username } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('An account with this email already exists.', 409);
    }

    // Check username uniqueness if provided
    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        throw new AppError('This username is already taken.', 409);
      }
    }

    const user = await User.create({
      displayName,
      email,
      passwordHash: password, // Pre-save hook handles hashing
      username: username || undefined,
    });

    setTokenCookie(res, user._id);

    res.status(201).json({
      success: true,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include passwordHash for comparison
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    setTokenCookie(res, user._id);

    res.json({
      success: true,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/logout
 */
exports.logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: COOKIE_SECURE || NODE_ENV === 'production',
    sameSite: COOKIE_SAME_SITE,
  });
  res.json({ success: true, message: 'Logged out successfully.' });
};

/**
 * GET /api/v1/auth/me
 */
exports.getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};
