import pool from "../db/db.js";

// GET all privileges
export async function getPrivileges(req, res) {
  try {
    const result = await pool.query(`SELECT * FROM privileges ORDER BY privilege_id ASC`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST add new privilege
export async function addPrivilege(req, res) {
  const { privilegeName, description } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO privileges (privilege_name, description)
       VALUES ($1, $2) RETURNING *`,
      [privilegeName, description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE a privilege
export async function deletePrivilege(req, res) {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM privileges WHERE privilege_id = $1`, [id]);
    res.json({ message: "Privilege deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
