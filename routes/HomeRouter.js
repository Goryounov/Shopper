const express = require("express");
const homeController = require("../controllers/HomeController.js");
const router = express.Router();

router.get("/", homeController.index);
router.get("/category", homeController.category);
router.get("/goods", homeController.goods);
router.get('/payment', homeController.payment);
router.get('/shipping', homeController.shipping);

module.exports = router;