const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');
const userController = require('../controllers/userController');
const tradeController = require('../controllers/tradeController');
const authController = require('../controllers/authController');

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', bookController.homePage);

router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/signup', userController.registerForm);
router.post(
  '/signup',
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get('/settings', authController.isLoggedIn, userController.settingsPage);

router.get('/allbooks', authController.isLoggedIn, bookController.getBooks);
router.get('/mybooks', authController.isLoggedIn, bookController.getUserBooks);

router.get('/logout', authController.logout);

module.exports = router;
