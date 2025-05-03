const inventoryModel = require('../models/inventoryModel');

exports.showCategory = async (req, res) => {
    const category = req.params.category;
    try {
        const vehicles = await inventoryModel.getVehiclesByCategory(category);
        res.render('inventory/categoryView', { category, vehicles });
    } catch (error) {
        res.status(500).send("Error loading inventory");
    }
};

exports.showVehicle = async (req, res) => {
    const id = req.params.id;
    try {
        const vehicle = await inventoryModel.getVehicleById(id);
        if (vehicle) {
            res.render('inventory/vehicleDetail', { vehicle });
        } else {
            res.status(404).send("Vehicle not found");
        }
    } catch (error) {
        res.status(500).send("Error loading vehicle details");
    }
};
