import express from "express";
import { firebaseAuth } from "../middlewares/authMiddleware.js";
import { createShareLink, accessSharedItem } from "../controllers/shareController.js";

const router = express.Router();

// Generate a link (requires auth)
router.post("/generate", firebaseAuth, createShareLink);

// Access a link (public, requires token and optional body password)
router.post("/access/:token", accessSharedItem);

export default router;
