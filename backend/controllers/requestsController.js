// backend/controllers/requestsController.js
import pool from "../db/db.js";

// GET all requests
export const getRequests = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM requests ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// CREATE a new request
export const createRequest = async (req, res) => {
  const {
    step1,
    step2,
    nin,
    lastNameAr,
    firstNameAr,
    lastNameLat,
    firstNameLat,
    wilaya,
    municipality,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO requests 
        (step1, step2, nin, lastnamear, firstnamear, lastnamelat, firstnamelat, wilaya, municipality)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) 
       RETURNING *`,
      [
        step1,
        step2,
        nin,
        lastNameAr,
        firstNameAr,
        lastNameLat,
        firstNameLat,
        wilaya,
        municipality,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting request:", err);
    res.status(500).json({ error: "Insert failed" });
  }
};
