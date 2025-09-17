// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import requestsRoutes from "./routes/requests.js";
import pool from "./db/db.js"; // 👈 ensure DB initializes
import usersRoutes from "./routes/users.js";
import groupsRoutes from "./routes/groups.js";
import privilegesRoutes from "./routes/privileges.js";

dotenv.config();
const app = express();

// ✅ Enable CORS (frontend at Vite:5173)
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // added OPTIONS
  allowedHeaders: ["Content-Type", "Authorization"], // allow auth headers too
}));

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ Routes
app.use("/api/requests", requestsRoutes);
app.use("/api/users", usersRoutes);        // includes PUT /api/users/:id
app.use("/api/groups", groupsRoutes);
app.use("/api/privileges", privilegesRoutes);

const PORT = process.env.BACKEND_PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
  console.log("ENV CHECK:", {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD, // 👀 should be "fnl_pass"
    port: process.env.POSTGRES_PORT,
  });

  // ✅ Test DB connection on startup
  pool.connect()
    .then((client) => {
      console.log("✅ PostgreSQL connected...");
      client.release();
    })
    .catch((err) => {
      console.error("❌ Database connection error:", err.message);
    });
});
