// controllers/projectsController.js
import db from "../db/db.js";
// Save all citizens/requests from the frontend wizard
export const finishProject = async (req, res) => {
  try {
    const { requests } = req.body; // array from frontend

    if (!Array.isArray(requests) || requests.length === 0) {
      return res.status(400).json({ error: "No request data provided" });
    }

    const inserted = [];

    for (const r of requests) {
      const result = await db.query(
        `INSERT INTO requests 
          (step1, step2, nin, lastNameAr, firstNameAr, lastNameLat, firstNameLat, wilaya, municipality, status, progress, result) 
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) 
         RETURNING *`,
        [
          r.step1,
          r.step2,
          r.nin,
          r.lastNameAr,
          r.firstNameAr,
          r.lastNameLat || null,
          r.firstNameLat || null,
          r.wilaya,
          r.municipality,
          r.status || "pending",
          r.progress || 0,
          r.result || null,
        ]
      );
      inserted.push(result.rows[0]);
    }

    res.status(201).json({ success: true, data: inserted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch all saved requests
export const getRequests = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM requests ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
