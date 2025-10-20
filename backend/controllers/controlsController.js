import pool from "../db/db.js";

// =====================================
// Get all controls
// =====================================
export const getControls = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM controls ORDER BY control_id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching controls:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// =====================================
// Create a new control
// =====================================
export const createControl = async (req, res) => {
  const { citizen_id, control_list_id, type, status, progress, result } = req.body;

  try {
    const query = `
      INSERT INTO controls (
        citizen_id,
        control_list_id,
        type,
        status,
        progress,
        result
      )
      VALUES ($1, $2, $3, COALESCE($4, 'pending'), COALESCE($5, 0), $6)
      RETURNING *;
    `;

    const values = [citizen_id, control_list_id, type, status, progress, result];
    const resultQuery = await pool.query(query, values);

    res.status(201).json(resultQuery.rows[0]);
  } catch (err) {
    console.error("Error creating control:", err);
    res.status(500).json({ error: "Insert failed" });
  }
};

// =====================================
// Get all controls for a specific citizen
// =====================================
export const getControlsByCitizen = async (req, res) => {
  const { citizenId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM controls WHERE citizen_id = $1 ORDER BY control_id DESC",
      [citizenId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching citizen controls:", err);
    res.status(500).json({ error: "Database error" });
  }
};
