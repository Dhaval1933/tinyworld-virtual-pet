const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// POST /api/v1/auth/register
router.post(
  '/register',
  authLimiter,
  [
    body('displayName')
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage('Display name must be 2–30 characters'),
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3, max: 20 })
      .matches(/^[a-z0-9_]+$/)
      .withMessage('Username: 3–20 chars, lowercase letters, numbers, underscores only'),
  ],
  validate,
  authController.register
);

// POST /api/v1/auth/login
router.post(
  '/login',
  authLimiter,
  [
    body('email').trim().isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  authController.login
);

// POST /api/v1/auth/logout
router.post('/logout', authController.logout);

// GET /api/v1/auth/me
router.get('/me', auth, authController.getMe);

module.exports = router;
