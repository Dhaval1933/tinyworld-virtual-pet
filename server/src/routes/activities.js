const router = require('express').Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const activityController = require('../controllers/activityController');

// GET /api/v1/activities — predefined activity types
router.get('/', auth, activityController.getActivityTypes);

// POST /api/v1/activities/complete
router.post(
  '/complete',
  auth,
  [
    body('activityType')
      .isIn(['reading', 'studying', 'exercise', 'hydration', 'cleaning', 'practice', 'task', 'custom'])
      .withMessage('Invalid activity type'),
    body('idempotencyKey')
      .trim()
      .notEmpty()
      .withMessage('idempotencyKey is required to prevent duplicate rewards'),
    body('durationMinutes')
      .optional()
      .isInt({ min: 0, max: 480 })
      .withMessage('Duration must be between 0 and 480 minutes'),
  ],
  validate,
  activityController.complete
);

// GET /api/v1/activities/history
router.get('/history', auth, activityController.getHistory);

// GET /api/v1/activities/summary
router.get('/summary', auth, activityController.getSummary);

module.exports = router;
