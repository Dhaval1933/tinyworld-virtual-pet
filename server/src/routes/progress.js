const router = require('express').Router();
const auth = require('../middleware/auth');
const progressController = require('../controllers/progressController');

// GET /api/v1/progress
router.get('/', auth, progressController.getProgress);

// GET /api/v1/achievements
router.get('/achievements', auth, progressController.getAchievements);

module.exports = router;
