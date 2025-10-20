import pool from "../db/db.js";

// Get all controls
export const getControls = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM controls ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching controls:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// Create control
export const createControl = async (req, res) => {
  const { citizen_id, control_list_id, status, notes } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO controls (citizen_id, control_list_id, status, notes)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [citizen_id, control_list_id, status, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating control:", err);
    res.status(500).json({ error: "Insert failed" });
  }
};

// Get controls by citizen
export const getControlsByCitizen = async (req, res) => {
  const { citizenId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM controls WHERE citizen_id = $1", [citizenId]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching citizen controls:", err);
    res.status(500).json({ error: "Database error" });
  }
};
