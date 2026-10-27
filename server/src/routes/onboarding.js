const router = require('express').Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const onboardingController = require('../controllers/onboardingController');
const { PET_SPECIES, ROOM_THEMES } = require('../utils/constants');

const onboardingValidation = [
  body('petSpecies')
    .isIn(PET_SPECIES)
    .withMessage(`Pet species must be one of: ${PET_SPECIES.join(', ')}`),
  body('petName')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Pet name must be between 1 and 20 characters'),
  body('roomTheme')
    .optional()
    .isIn(ROOM_THEMES)
    .withMessage(`Room theme must be one of: ${ROOM_THEMES.join(', ')}`),
];

// POST /api/v1/onboarding/complete & POST /api/v1/onboarding/setup
router.post('/complete', auth, onboardingValidation, validate, onboardingController.complete);
router.post('/setup', auth, onboardingValidation, validate, onboardingController.complete);

module.exports = router;
