const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');
const userController = require('../controllers/userController');
const tradeController = require('../controllers/tradeController');
const authController = require('../controllers/authController');

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', bookController.homePage);

router.get('/login', userController.loginForm);
router.get('/signup', userController.registerForm);
/*
router.get('/settings', userController.settingsPage);

router.get('/allbooks', bookController.getBooks);
router.get('/mybooks', bookController.getUserBooks);
*/

module.exports = router;
