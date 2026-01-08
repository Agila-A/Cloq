import express from "express";
import { firebaseAuth } from "../middlewares/authMiddleware.js";
import { ensureUserExists } from "../controllers/userController.js";
import { addPassword, getVault } from "../controllers/vaultController.js";

const router = express.Router();

// Add a password to vault
router.post(
  "/add",
  firebaseAuth,
  ensureUserExists,
  addPassword
);

// Get all vault entries
router.get(
  "/",
  firebaseAuth,
  ensureUserExists,
  getVault
);

export default router;
