const pool = require("../database/")


async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
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

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById};