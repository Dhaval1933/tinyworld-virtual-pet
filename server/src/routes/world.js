const router = require('express').Router();
const auth = require('../middleware/auth');
const worldController = require('../controllers/worldController');

// GET /api/v1/world
router.get('/', auth, worldController.getWorld);

// PATCH /api/v1/world/layout
router.patch('/layout', auth, worldController.updateLayout);

// PATCH /api/v1/world/theme
router.patch('/theme', auth, worldController.updateTheme);

// POST /api/v1/world/unlock-balcony-view
router.post('/unlock-balcony-view', auth, worldController.unlockBalconyView);

module.exports = router;
