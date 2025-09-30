// routes/projects.js
import express from "express";
import { finishProject, getRequests } from "../controllers/projectsController.js";

const router = express.Router();

// POST /api/projects/finish
router.post("/finish", finishProject);

// GET /api/projects
router.get("/", getRequests);

export default router;
