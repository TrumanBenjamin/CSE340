const invModel = require("../models/inventory-model")
const utilities = require("../utilities")


exports.buildByClassificationId = async function (req, res) {
  const classification_id = req.params.classificationId
  try {
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()
    const className = data[0].classification_name

    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    })
  } catch (error) {
    console.error("Error building classification view:", error)
    res.status(500).send("Server error loading classification view")
  }
}


exports.showCategory = async (req, res) => {
  const category = req.params.category
  try {
    const nav = await utilities.getNav()
    const vehicles = await invModel.getVehiclesByCategory(category)
    res.render("inventory/categoryView", { category, vehicles, nav })
  } catch (error) {
    console.error("Error loading category:", error)
    res.status(500).send("Error loading inventory")
  }
}


exports.showVehicle = async (req, res) => {
  const id = req.params.id
  try {
    const nav = await utilities.getNav()
    const vehicle = await invModel.getVehicleById(id)
    if (vehicle) {
      res.render("inventory/vehicleDetails", { vehicle, nav })
    } else {
      res.status(404).send("Vehicle not found")
    }
  } catch (error) {
    console.error("Error loading vehicle details:", error)
    res.status(500).send("Error loading vehicle details")
  }
}

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