import express from "express";
import { firebaseAuth } from "../middlewares/authMiddleware.js";
import { getUserLogs } from "../controllers/logController.js";

const router = express.Router();

router.get("/", firebaseAuth, getUserLogs);

export default router;
