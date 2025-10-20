import express from "express";
import {
  getControls,
  createControl,
  getControlsByCitizen,
} from "../controllers/controlsController.js";

const router = express.Router();

router.get("/", getControls);
router.post("/", createControl);
router.get("/citizen/:citizenId", getControlsByCitizen);

export default router;
