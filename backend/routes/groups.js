import express from "express";
import {
  getGroups,
  addGroup,
  deleteGroup,
  assignPrivilegeToGroup,
  removePrivilegeFromGroup
} from "../controllers/groupController.js";

const router = express.Router();

router.get("/", getGroups);
router.post("/", addGroup);
router.delete("/:id", deleteGroup);
router.post("/:id/privileges/:privilegeId", assignPrivilegeToGroup);
router.delete("/:id/privileges/:privilegeId", removePrivilegeFromGroup);

export default router;
