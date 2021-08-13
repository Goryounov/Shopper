const express = require('express');
const userController = require('../controllers/UserController');
const homeController = require('../controllers/HomeController');
const router = express.Router();
const auth = require('../auth');

router.get('/signup', homeController.signup);
router.post('/signup', userController.signup);
router.get('/login', homeController.login);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/user', auth.requireAuth, userController.index);
router.post('/user/update', userController.update);

module.exports = router;