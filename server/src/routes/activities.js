const router = require('express').Router();
const auth = require('../middleware/auth');
const activityController = require('../controllers/activityController');

// GET /api/v1/activities — predefined activity types
router.get('/', auth, activityController.getActivityTypes);

// POST /api/v1/activities/complete
router.post('/complete', auth, activityController.complete);

// GET /api/v1/activities/history
router.get('/history', auth, activityController.getHistory);

// GET /api/v1/activities/summary
router.get('/summary', auth, activityController.getSummary);

module.exports = router;
