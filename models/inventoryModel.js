exports.getVehicleById = async (id) => {
    try {
        const query = "SELECT * FROM inventory WHERE id = ?";
        const [result] = await db.execute(query, [id]);
        return result.length ? result[0] : null;
    } catch (error) {
        console.error("Database error:", error);
        throw error;
    }
};
