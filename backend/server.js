// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import requestsRoutes from "./routes/requests.js";
import pool from "./db/db.js"; // 👈 force DB import

dotenv.config();
const app = express();

// ✅ Enable CORS (allow frontend on Vite:5173 to call backend:5000)
app.use(cors({
  origin: "http://localhost:5173", // allow only frontend
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ Routes
app.use("/api/requests", requestsRoutes);

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
