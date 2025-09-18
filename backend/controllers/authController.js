import pool from "../db/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

    // async function hashPassword(plainTextPassword) {
    //     try {
    //         const saltRounds = 10;
    //         const salt = await bcrypt.genSalt(saltRounds);
    //         const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
    //         return hashedPassword;
    //     } catch (error) {
    //         console.error('Error hashing password:', error);
    //         throw error;
    //     }
    // }

export const login = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Please enter a valid email and password." });
  }

  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: "No account found for this email." });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Incorrect password." });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      "tests",
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "An unexpected error occurred. Please try again." });
  }
};