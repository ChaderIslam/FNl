import express from "express";
import { getRequests, createRequest } from "../controllers/requestsController.js";

const router = express.Router();

router.get("/", getRequests);
router.post("/", createRequest);

export default router;
