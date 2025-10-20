import express from "express";
import {
  getControlLists,
  getControlListById,
  createControlList,
  updateControlList,
  deleteControlList,
} from "../controllers/controlListsController.js";

const router = express.Router();

router.get("/", getControlLists);
router.get("/:id", getControlListById);
router.post("/", createControlList);
router.put("/:id", updateControlList);
router.delete("/:id", deleteControlList);

export default router;
