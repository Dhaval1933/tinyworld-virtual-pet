const router = require('express').Router();
const auth = require('../middleware/auth');
const petController = require('../controllers/petController');

// GET /api/v1/pet
router.get('/', auth, petController.getPet);

// PATCH /api/v1/pet/name
router.patch('/name', auth, petController.updateName);

// POST /api/v1/pet/feed
router.post('/feed', auth, petController.feed);

// POST /api/v1/pet/pet
router.post('/pet', auth, petController.petPet);

// POST /api/v1/pet/rest
router.post('/rest', auth, petController.rest);

module.exports = router;
