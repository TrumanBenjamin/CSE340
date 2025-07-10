const express = require('express');
const util = require('../utilities')
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Routes 
// Inventory Management Home
router.get(
  '/',
  util.handleErrors(inventoryController.buildManagementView)
)


// show the "Add Classification" form
router.get(
  '/add-classification',
  util.handleErrors(inventoryController.buildAddClassificationView) 
)
// process the form submission
router.post(
  '/add-classification',
  util.handleErrors(inventoryController.processAddClassification) 
)

// show the Add Inventory form
router.get(
  '/add-inventory',
  util.handleErrors(inventoryController.buildAddInventoryView)
)

// process the Add Inventory submission
router.post(
  '/add-inventory',
  util.handleErrors(inventoryController.processAddInventory)
)


// Inventory list by category (e.g. Custom, SUV…)
router.get(
  '/:category',
  util.handleErrors(inventoryController.showCategory)
);


// // Single‐vehicle view
// router.get(
//   '/vehicle/:id',
//   util.handleErrors(inventoryController.showVehicle)
// );


// Classification grid
router.get(
  '/type/:classificationId',
  util.handleErrors(inventoryController.buildByClassificationId)
);


// Detail view
router.get(
  '/detail/:inv_id',
  util.handleErrors(inventoryController.buildDetailView)
);




module.exports = router;
