const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController'); 

router.get('/:category', inventoryController.showCategory);
router.get('/vehicle/:id', inventoryController.showVehicle);


module.exports = router;