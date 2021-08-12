const express = require('express');
const adminController = require('../controllers/AdminController');
const homeController = require('../controllers/HomeController');
const auth = require('../auth');
const router = express.Router();

const bodyParser = require('body-parser')

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', urlencodedParser, auth.requireAuth, auth.isAdmin, adminController.index);
router.get('/orders', urlencodedParser, auth.requireAuth, auth.isAdmin, adminController.orders);
router.get('/goods', urlencodedParser, auth.requireAuth, auth.isAdmin, adminController.goods);

module.exports = router;