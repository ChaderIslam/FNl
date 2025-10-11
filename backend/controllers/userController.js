import pool from "../db/db.js";
import bcrypt from "bcrypt";

// ✅ GET all users with groups and privileges
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
    console.error("❌ getUsers error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

// ✅ POST add new user (with duplicate check + hashed password)
export async function addUser(req, res) {
  const { username, email, password, groupId } = req.body;

  try {
    if (!username || !email || !password || !groupId) {
      return res.status(400).json({ error: "Username, email, password, and group are required." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING user_id, username, email`,
      [username, email, hashedPassword]
    );

    const user = userResult.rows[0];

    await pool.query(
      `INSERT INTO user_groups (user_id, group_id) VALUES ($1, $2)`,
      [user.user_id, groupId]
    );

    res.status(201).json({
      message: "✅ User created successfully",
      user,
    });
  } catch (err) {
    console.error("❌ addUser error:", err);

    // Handle unique constraint (duplicate username/email)
    if (err.code === "23505") {
      if (err.detail.includes("username")) {
        return res.status(409).json({ error: "Username already exists." });
      }
      if (err.detail.includes("email")) {
        return res.status(409).json({ error: "Email already exists." });
      }
    }

    res.status(500).json({ error: "Internal server error while creating user." });
  }
}

// ✅ PUT update a user (with duplicate check + fixed group logic)
export async function updateUser(req, res) {
  const { id } = req.params;
  const { username, email, groupId } = req.body;

  try {
    if (!username || !email) {
      return res.status(400).json({ error: "Username and email are required." });
    }

    // Try updating user
    const result = await pool.query(
      `UPDATE users
       SET username = $1, email = $2
       WHERE user_id = $3
       RETURNING user_id, username, email`,
      [username, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    // Fix: handle group update correctly
    if (groupId) {
      // Check if user already has a group
      const groupCheck = await pool.query(
        `SELECT * FROM user_groups WHERE user_id = $1`,
        [id]
      );

      if (groupCheck.rows.length > 0) {
        await pool.query(
          `UPDATE user_groups SET group_id = $1 WHERE user_id = $2`,
          [groupId, id]
        );
      } else {
        await pool.query(
          `INSERT INTO user_groups (user_id, group_id) VALUES ($1, $2)`,
          [id, groupId]
        );
      }
    }

    res.json({
      message: "✅ User updated successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("❌ updateUser error:", err);

    // Handle unique constraint
    if (err.code === "23505") {
      if (err.detail.includes("username")) {
        return res.status(409).json({ error: "Username already exists." });
      }
      if (err.detail.includes("email")) {
        return res.status(409).json({ error: "Email already exists." });
      }
    }

    res.status(500).json({ error: "Internal server error while updating user." });
  }
}

// ✅ DELETE a user
export async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM users WHERE user_id = $1`, [id]);
    res.json({ message: "🗑️ User deleted successfully" });
  } catch (err) {
    console.error("❌ deleteUser error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

// ✅ POST assign privilege to user
export async function assignPrivilegeToUser(req, res) {
  const { id, privilegeId } = req.params;
  try {
    await pool.query(
      `INSERT INTO user_privileges (user_id, privilege_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [id, privilegeId]
    );
    res.json({ message: "✅ Privilege assigned successfully" });
  } catch (err) {
    console.error("❌ assignPrivilegeToUser error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

// ✅ DELETE remove privilege from user
export async function removePrivilegeFromUser(req, res) {
  const { id, privilegeId } = req.params;
  try {
    await pool.query(
      `DELETE FROM user_privileges WHERE user_id = $1 AND privilege_id = $2`,
      [id, privilegeId]
    );
    res.json({ message: "🗑️ Privilege removed successfully" });
  } catch (err) {
    console.error("❌ removePrivilegeFromUser error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
