const express = require('express');
const util = require('../utilities')
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Routes 
// Inventory list by category (e.g. Custom, SUV…)
router.get(
  '/:category',
  util.handleErrors(inventoryController.showCategory)
);

// Single‐vehicle view
router.get(
  '/vehicle/:id',
  util.handleErrors(inventoryController.showVehicle)
);

// Classification grid
router.get(
  '/type/:classificationId',
  util.handleErrors(inventoryController.buildByClassificationId)
);

// Detail view (legacy/detail route)
router.get(
  '/detail/:inv_id',
  util.handleErrors(inventoryController.buildDetailView)
);

module.exports = router;

module.exports = router;