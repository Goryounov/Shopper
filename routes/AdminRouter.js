const express = require('express');
const adminController = require('../controllers/AdminController');
const auth = require('../auth');
const router = express.Router();

router.get('/', auth.requireAuth, auth.isAdmin, adminController.index);
router.get('/orders', auth.requireAuth, auth.isAdmin, adminController.orders);
router.get('/goods', auth.requireAuth, auth.isAdmin, adminController.goods);

module.exports = router;