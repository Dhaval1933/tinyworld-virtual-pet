const router = require('express').Router();
const auth = require('../middleware/auth');
const subscriptionController = require('../controllers/subscriptionController');

// POST /api/v1/subscription/create-order (Protected)
router.post('/create-order', auth, subscriptionController.createOrder);

// POST /api/v1/subscription/verify-payment (Protected)
router.post('/verify-payment', auth, subscriptionController.verifyPayment);

// GET /api/v1/subscription/status (Protected)
router.get('/status', auth, subscriptionController.getStatus);

module.exports = router;
