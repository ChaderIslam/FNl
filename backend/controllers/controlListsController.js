import pool from "../db/db.js";

// Get all control lists
export const getControlLists = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM control_lists ORDER BY control_list_id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching control lists:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// Get one control list by ID
export const getControlListById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM control_lists WHERE control_list_id = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Control list not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching control list:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// Create new control list
export const createControlList = async (req, res) => {
  const { name, description, created_by } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO control_lists (name, description, created_by)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, description, created_by || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting control list:", err);
    res.status(500).json({ error: "Insert failed" });
  }
};

// Update control list
export const updateControlList = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const result = await pool.query(
      `UPDATE control_lists
       SET name = $1, description = $2
       WHERE control_list_id = $3
       RETURNING *`,
      [name, description, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Control list not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating control list:", err);
    res.status(500).json({ error: "Update failed" });
  }
};

// Delete control list
export const deleteControlList = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM control_lists WHERE control_list_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Control list not found" });

    res.json({ message: "Control list deleted successfully" });
  } catch (err) {
    console.error("Error deleting control list:", err);
    res.status(500).json({ error: "Delete failed" });
  }
};
