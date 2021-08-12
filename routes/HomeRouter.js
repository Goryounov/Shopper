const express = require("express");
const homeController = require("../controllers/HomeController.js");
const router = express.Router();

router.get("/", homeController.index);
router.get("/category", homeController.category);
router.get("/goods", homeController.goods);
router.get('/profile', homeController.profile);

module.exports = router;