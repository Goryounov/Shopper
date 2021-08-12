const express = require('express');
const userController = require('../controllers/UserController');
const homeController = require('../controllers/HomeController');
const router = express.Router();
const auth = require('../auth');

const bodyParser = require('body-parser')

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/signup', urlencodedParser, homeController.signup);//call for signup page
router.post('/signup', urlencodedParser, userController.signup);//call for signup post
router.get('/login', urlencodedParser, homeController.login);//call for login page
router.post('/login', urlencodedParser, userController.login);//call for login post
router.get('/logout', userController.logout);//call for logout
router.get('/user', auth.requireAuth, userController.index);//to render users profile
router.post('/user/update', urlencodedParser, userController.update);

module.exports = router;