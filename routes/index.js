const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');

//const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', bookController.homePage);

module.exports = router;
