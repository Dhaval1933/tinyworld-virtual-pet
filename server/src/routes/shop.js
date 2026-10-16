const router = require('express').Router();
const auth = require('../middleware/auth');
const shopController = require('../controllers/shopController');

// GET /api/v1/shop
router.get('/', shopController.getShopItems);

// GET /api/v1/inventory
router.get('/inventory', auth, shopController.getInventory);

// POST /api/v1/shop/purchase
router.post('/purchase', auth, shopController.purchase);

module.exports = router;
