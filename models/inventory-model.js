const pool = require("../database/")


async function getClassifications(){
  try {
    const sql = 'SELECT * FROM public.classification ORDER BY classification_name'
    const data = await pool.query(sql)
    return data.rows
  } catch (error) {
  console.error('getClassifications error: ' + error)
  throw error
  }
}


async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getVehicleById(invId) {
  const sql = "SELECT * FROM inventory WHERE inv_id = $1";
  const result = await pool.query(sql, [invId]);
  return result.rows[0];
}

/**
 * Add a new classification to the database
 * @param {string} classification_name
 * @returns {Promise<object>} the inserted row
 */
async function addClassification (classification_name) {
  try {
    const sql = 'Insert INTO public.classification (classification_name) VALUES ($1) RETURNING *'
    const params = [classification_name]
    const result = await pool.query(sql, params)
    return result.rows[0]
  } catch (error) {
    console.error('addClassification error: ' + error)
    throw error
  }
}

/**
 * Insert a new inventory item
 * @param {object} invData – form fields match database columns
 * @returns {Promise<object>} the inserted row
 */
async function addInventoryItem(invData) {
  const {
    inv_make, 
    inv_model,
    inv_color,
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail,
    inv_price, 
    inv_miles,
    classification_id,
  } = invData

  const sql = `
  INSERT INTO public.inventory
  (inv_make, inv_model, inv_color, inv_year, inv_description,
  inv_image, inv_thumbnail, inv_price, inv_miles, classification_id)
  VALUES 
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING *`

  const params = [
    inv_make.trim(),
    inv_model.trim(),
    inv_color.trim(),
    inv_year, 
    inv_description.trim(),
    inv_image.trim(),
    inv_thumbnail.trim(),
    inv_price,
    inv_miles, 
    classification_id,
  ]
  const result = await pool.query(sql, params)
  return result.rows[0] 
}

/**
 * Get a single classification row by ID
 * @param {number} classification_id
 * @returns {Promise<object>} the classification (or undefined)
 */
async function getClassificationById(classification_id) {
  try {
    const sql    = 'SELECT * FROM public.classification WHERE classification_id = $1';
    const result = await pool.query(sql, [classification_id]);
    return result.rows[0];
  } catch (error) {
    console.error('getClassificationById error: ' + error);
    throw error;
  }
}



module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventoryItem, getClassificationById}

