import pool from "../db/db.js";

// GET all users with groups and privileges
export async function getUsers(req, res) {
  try {
    const result = await pool.query(`
      SELECT u.user_id, u.username, u.email, g.group_name AS group,
             ARRAY_REMOVE(ARRAY_AGG(DISTINCT p.privilege_name), NULL) AS privileges
      FROM users u
      LEFT JOIN user_groups ug ON u.user_id = ug.user_id
      LEFT JOIN groups g ON ug.group_id = g.group_id
      LEFT JOIN user_privileges up ON u.user_id = up.user_id
      LEFT JOIN privileges p ON up.privilege_id = p.privilege_id
      GROUP BY u.user_id, g.group_name
      ORDER BY u.user_id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST add a new user
export async function addUser(req, res) {
  const { username, email, passwordHash, groupId } = req.body;
  try {
    const userResult = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [username, email, passwordHash]
    );

    const user = userResult.rows[0];

    if (groupId) {
      await pool.query(
        `INSERT INTO user_groups (user_id, group_id) VALUES ($1, $2)`,
        [user.user_id, groupId]
      );
    }

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUT update a user
export async function updateUser(req, res) {
  const { id } = req.params;
  const { username, email, groupId } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET username = $1, email = $2
       WHERE user_id = $3
       RETURNING *`,
      [username, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    if (groupId) {
      await pool.query(
        `INSERT INTO user_groups (user_id, group_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id) DO UPDATE SET group_id = $2`,
        [id, groupId]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE a user
export async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM users WHERE user_id = $1`, [id]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST assign privilege to user
export async function assignPrivilegeToUser(req, res) {
  const { id, privilegeId } = req.params;
  try {
    await pool.query(
      `INSERT INTO user_privileges (user_id, privilege_id)
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [id, privilegeId]
    );
    res.json({ message: "Privilege assigned to user" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE remove privilege from user
export async function removePrivilegeFromUser(req, res) {
  const { id, privilegeId } = req.params;
  try {
    await pool.query(
      `DELETE FROM user_privileges WHERE user_id = $1 AND privilege_id = $2`,
      [id, privilegeId]
    );
    res.json({ message: "Privilege removed from user" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
