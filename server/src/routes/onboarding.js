const router = require('express').Router();
const auth = require('../middleware/auth');
const onboardingController = require('../controllers/onboardingController');

// POST /api/v1/onboarding/complete
router.post('/complete', auth, onboardingController.complete);

module.exports = router;
