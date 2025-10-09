import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./db/db.js";

import usersRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import groupsRoutes from "./routes/groups.js";
import privilegesRoutes from "./routes/privileges.js";
import projectsRoutes from "./routes/projects.js";
import requestsRoutes from "./routes/requests.js";


dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ✅ Routes
app.use("/api/requests", requestsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/privileges", privilegesRoutes);
app.use("/api/projects", projectsRoutes);

const PORT = process.env.BACKEND_PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);

  pool.connect()
    .then((client) => {
      console.log("✅ PostgreSQL connected...");
      client.release();
    })
    .catch((err) => {
      console.error("❌ Database connection error:", err.message);
    });
});
