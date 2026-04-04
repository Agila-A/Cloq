import express from "express";
import { firebaseAuth } from "../middlewares/authMiddleware.js";
import { createVaultItem, getVaultItems, getVaultItemById, deleteVaultItem } from "../controllers/vaultController.js";

const router = express.Router();

// CRUD
router.post("/add", firebaseAuth, createVaultItem);
router.get("/", firebaseAuth, getVaultItems);
router.get("/:id", firebaseAuth, getVaultItemById);
router.delete("/:id", firebaseAuth, deleteVaultItem);

export default router;
