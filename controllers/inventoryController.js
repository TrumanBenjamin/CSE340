const invModel = require("../models/inventory-model")
const utilities = require("../utilities")


exports.buildByClassificationId = async function (req, res) {
  try {
    const classificationId = req.params.classificationId
    const className = (await invModel.getClassificationById(classificationId)
    )?.classification_name ?? 'Vehicles';
    const vehicles = await invModel.getInventoryByClassificationId(classificationId)
    const grid = await utilities.buildClassificationGrid(vehicles)
    const nav = await utilities.getNav()

    res.render("inventory/classification", {
      title: `${className} Vehicles`,
      nav,
      grid,
    })
  } catch (error) {
    console.error("Error building classification view:", error)
    res.status(500).send("Server error loading classification view")
  }
}


// exports.showCategory = async (req, res) => {
//   const category = req.params.category
//   try {
//     const nav = await utilities.getNav()
//     const vehicles = await invModel.getVehiclesByCategory(category)
//     res.render("inventory/categoryView", { category, vehicles, nav })
//   } catch (error) {
//     console.error("Error loading category:", error)
//     res.status(500).send("Error loading inventory")
//   }
// }



exports.buildDetailView = async function (req, res, next) {
  const invId = req.params.inv_id;
  try {
    const nav = await utilities.getNav()
    const vehicleData = await invModel.getVehicleById(invId);
    const detailHtml = utilities.buildVehicleDetail(vehicleData);
    res.render("inventory/detail", {
      title: `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      detail: detailHtml,
    });
  } catch (error) {
    next(error);
  }
}


exports.buildManagementView = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    const message = req.query.message || null
    res.render('inventory/management', {
      title : 'Inventory Management',
      nav,
      message,
    })
  } catch (error) {
    next(error)
  }
}


exports.buildAddClassificationView = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    res.render('inventory/add-classification', {
      title : 'Add New Classification',
      nav,
      errors : null,
      classification_name : null,
    })
  } catch (error) {
    next(error)
  }
}


exports.processAddClassification = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    let {classification_name} = req.body
    const errors = []

    //server-side validation
    if (!classification_name) {
      errors.push('Classification name is required.')
    } else if (!/^[A-Za-z0-9]+$/.test(classification_name)) {
      errors.push('Only letters and numbers allowed- no spaces or special characters.')
    }

    if (errors.length) {
      //re-render form with errors and sticky input
      return res.status(400).render('inventory/add-classification', {
        title : 'Add New Classification', 
        nav,
        errors,
        classification_name,
      })
    }

    // insert into DB
    await invModel.addClassification(classification_name.trim())

    // redirect back to management with a sucess message
    const msg = encodeURIComponent('Classification added successfully.')
    return res.redirect('/inv?message=' + msg)
  } catch (error) {
    return next(error)
  }
}


// Render the Add Inventory Form
exports.buildAddInventoryView = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    res.render('inventory/add-inventory', {
      title : 'Add New Inventory Item',
      nav,
      classificationList,
      errors : null,
      invData : {},
    })
  } catch (error) {
    next(error)
  }
}


// Handle Add Inventory POST
exports.processAddInventory = async (req, res, next) => {
  try {
    const nav     = await utilities.getNav();

    const invData = { ...req.body }; 

    const classificationList =
      await utilities.buildClassificationList(invData.classification_id);

    const errors = [];
    if (!invData.classification_id) errors.push('Please select a classification.');
    if (!invData.inv_make)          errors.push('Make is required.');
    if (!invData.inv_model)         errors.push('Model is required.');
    if (!invData.inv_color) {
      errors.push('Color is required.')
    } else if (!/^[A-Za-z0-9 ]+$/.test(invData.inv_color)) {
      errors.push('Color may only contain letters, numbers and spaces.')
    }
    if (!invData.inv_year || isNaN(invData.inv_year))
      errors.push('Valid year is required.');
    if (!invData.inv_description)   errors.push('Description is required.');
    if (!invData.inv_image)         errors.push('Image URL is required.');
    if (!invData.inv_thumbnail)     errors.push('Thumbnail URL is required.');
    if (!invData.inv_price || isNaN(invData.inv_price))
      errors.push('Valid price is required.');
    if (!invData.inv_miles || isNaN(invData.inv_miles))
      errors.push('Valid mileage is required.');

    if (errors.length) {
      return res.status(400).render('inventory/add-inventory', {
        title              : 'Add New Inventory Item',
        nav,
        classificationList,
        errors,
        invData,
      });
    }

    await invModel.addInventoryItem(invData);
    const msg = encodeURIComponent('Inventory item added successfully.');
    return res.redirect('/inv?message=' + msg);

  } catch (error) {
    next(error);
  }
};
