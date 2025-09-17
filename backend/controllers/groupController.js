import pool from "../db/db.js";

// GET all groups with privileges
export async function getGroups(req, res) {
  try {
    const result = await pool.query(`
      SELECT g.group_id, g.group_name,
             ARRAY_REMOVE(ARRAY_AGG(DISTINCT p.privilege_name), NULL) AS privileges
      FROM groups g
      LEFT JOIN group_privileges gp ON g.group_id = gp.group_id
      LEFT JOIN privileges p ON gp.privilege_id = p.privilege_id
      GROUP BY g.group_id
      ORDER BY g.group_id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST add new group
export async function addGroup(req, res) {
  const { groupName, description } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO groups (group_name, description)
       VALUES ($1, $2) RETURNING *`,
      [groupName, description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE a group
export async function deleteGroup(req, res) {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM groups WHERE group_id = $1`, [id]);
    res.json({ message: "Group deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST assign privilege to group
export async function assignPrivilegeToGroup(req, res) {
  const { id, privilegeId } = req.params;
  try {
    await pool.query(
      `INSERT INTO group_privileges (group_id, privilege_id)
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [id, privilegeId]
    );
    res.json({ message: "Privilege assigned to group" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE remove privilege from group
export async function removePrivilegeFromGroup(req, res) {
  const { id, privilegeId } = req.params;
  try {
    await pool.query(
      `DELETE FROM group_privileges WHERE group_id = $1 AND privilege_id = $2`,
      [id, privilegeId]
    );
    res.json({ message: "Privilege removed from group" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
