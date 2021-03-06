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
router.post(
  '/updateinfo',
  authController.isLoggedIn,
  catchErrors(userController.updateProfile)
);

router.get(
  '/allbooks',
  authController.isLoggedIn,
  catchErrors(bookController.allBooks)
);
router.get(
  '/mybooks',
  authController.isLoggedIn,
  catchErrors(bookController.userBooks)
);

router.get('/logout', authController.logout);

/*
 * API
*/
router.post(
  '/api/addbook',
  authController.isLoggedIn,
  catchErrors(bookController.addBook)
);

router.get(
  '/api/delete/:id',
  authController.isLoggedIn,
  catchErrors(bookController.deleteBook)
);

router.get(
  '/api/trade/:id',
  authController.isLoggedIn,
  catchErrors(tradeController.addTrade)
);

router.get(
  '/api/cancel/:id',
  authController.isLoggedIn,
  catchErrors(tradeController.cancelTrade)
);

router.get(
  '/api/accept/:id',
  authController.isLoggedIn,
  catchErrors(tradeController.acceptTrade)
);

module.exports = router;
