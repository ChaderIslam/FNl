import express from "express";
import { login} from "../controllers/authController.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password required"),
  ],
  login
);

// router.post(
//   "/register",
//   [
//     body("email").isEmail().withMessage("Valid email required"),
//     body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
//     body("role").optional().isIn(["user", "admin"]).withMessage("Role must be user or admin"),
//   ],
//   register
// );

export default router;