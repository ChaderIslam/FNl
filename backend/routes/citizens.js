import express from "express";
import {
  getCitizens,
  getCitizenById,
  createCitizen,
  updateCitizen,   // ✅ add this import
  deleteCitizen,
} from "../controllers/citizensController.js";

const router = express.Router();

router.get("/", getCitizens);
router.get("/:id", getCitizenById);
router.post("/", createCitizen);
router.put("/:id", updateCitizen);  // ✅ add this route
router.delete("/:id", deleteCitizen);

export default router;
