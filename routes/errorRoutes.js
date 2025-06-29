const express = require('express');
const router  = express.Router();
const errorController = require('../controllers/errorController');
const util            = require('../utilities');

router.get('/trigger', util.handleErrors(errorController.triggerError));

module.exports = router;
