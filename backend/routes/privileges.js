import express from "express";
import {
  getPrivileges,
  addPrivilege,
  deletePrivilege
} from "../controllers/privilegeController.js";

const router = express.Router();

router.get("/", getPrivileges);
router.post("/", addPrivilege);
router.delete("/:id", deletePrivilege);

export default router;
