const express = require("express");
const orderController = require("../controllers/OrderController.js");
const router = express.Router();

router.get("/order", orderController.order);
router.post("/finish-order", orderController.finishOrder);

module.exports = router;