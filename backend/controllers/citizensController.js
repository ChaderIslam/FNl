import pool from "../db/db.js";

// ================================
// GET all citizens
// ================================
export const getCitizens = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM citizens ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching citizens:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// ================================
// GET citizen by ID
// ================================
export const getCitizenById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM citizens WHERE citizen_id = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Citizen not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching citizen:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// ================================
// CREATE new citizen
// ================================
export const createCitizen = async (req, res) => {
  const {
    nin,
    lastname_ar,
    firstname_ar,
    lastname_lat,
    firstname_lat,
    wilaya,
    municipality,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO citizens 
        (nin, last_name_ar, first_name_ar, last_name_lat, first_name_lat, wilaya, municipality)
       VALUES ($1,$2,$3,$4,$5,$6,$7) 
       RETURNING *`,
      [nin, lastname_ar, firstname_ar, lastname_lat, firstname_lat, wilaya, municipality]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting citizen:", err);
    res.status(500).json({ error: "Insert failed" });
  }
};

// ================================
// UPDATE citizen
// ================================
export const updateCitizen = async (req, res) => {
  const { id } = req.params;
  const {
    nin,
    lastname_ar,
    firstname_ar,
    lastname_lat,
    firstname_lat,
    wilaya,
    municipality,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE citizens 
       SET nin=$1, 
           last_name_ar=$2, 
           first_name_ar=$3, 
           last_name_lat=$4, 
           first_name_lat=$5, 
           wilaya=$6, 
           municipality=$7
       WHERE citizen_id=$8 
       RETURNING *`,
      [nin, lastname_ar, firstname_ar, lastname_lat, firstname_lat, wilaya, municipality, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Citizen not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating citizen:", err);
    res.status(500).json({ error: "Update failed" });
  }
};

// ================================
// DELETE citizen
// ================================
export const deleteCitizen = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM citizens WHERE citizen_id=$1 RETURNING *", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Citizen not found" });

    res.json({ message: "Citizen deleted successfully" });
  } catch (err) {
    console.error("Error deleting citizen:", err);
    res.status(500).json({ error: "Delete failed" });
  }
};
