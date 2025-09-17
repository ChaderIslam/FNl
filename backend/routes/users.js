import express from "express";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  assignPrivilegeToUser,
  removePrivilegeFromUser
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", addUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser); 
router.post("/:id/privileges/:privilegeId", assignPrivilegeToUser);
router.delete("/:id/privileges/:privilegeId", removePrivilegeFromUser);

export default router;
