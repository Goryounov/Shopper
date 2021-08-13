const express = require('express');
const goodsController = require('../controllers/GoodsController');
const router = express.Router();

router.post('/get-good-info', goodsController.getInfo);

module.exports = router;
