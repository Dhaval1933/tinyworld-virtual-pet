const router = require('express').Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// PATCH /api/v1/users/me
router.patch('/me', auth, userController.updateProfile);

// PATCH /api/v1/users/change-password
router.patch('/change-password', auth, userController.changePassword);

module.exports = router;
