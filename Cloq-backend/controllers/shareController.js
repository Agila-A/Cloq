import crypto from "crypto";
import ShareLink from "../models/ShareLink.js";
import VaultItem from "../models/VaultItem.js";
import { decrypt } from "../utils/encrypt.js";
import { logActivity } from "./logController.js";

// Generate a Share Link
export const createShareLink = async (req, res) => {
  try {
    const { vaultItemId, expiresInHours, password } = req.body;

    // Check if the item belongs to the user
    const item = await VaultItem.findOne({ _id: vaultItemId, userId: req.user.uid });
    if (!item) {
      return res.status(404).json({ message: "Vault item not found" });
    }

    // Generate unique token
    const token = crypto.randomBytes(24).toString("hex");
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + (expiresInHours || 24));

    const shareLink = new ShareLink({
      vaultItemId,
      token,
      expiresAt,
      password, // Note: In a production environment, you should encrypt/hash this! For this scope, keeping basic.
      createdBy: req.user.uid,
    });

    await shareLink.save();

    await logActivity(req.user.uid, "SHARE_LINK", `Created share link for: ${item.title}`);

    res.status(201).json({ 
      message: "Share link created", 
      link: `/share/${token}`, // Frontend route format
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create share link" });
  }
};

// Access Shared Item (Public Route)
export const accessSharedItem = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const shareLink = await ShareLink.findOne({ token }).populate("vaultItemId");

    if (!shareLink) {
      return res.status(404).json({ message: "Invalid or expired share link" });
    }

    if (new Date() > shareLink.expiresAt) {
      return res.status(403).json({ message: "Share link has expired" });
    }

    if (shareLink.password && shareLink.password !== password) {
      return res.status(401).json({ message: "Incorrect password for this share link" });
    }

    const item = shareLink.vaultItemId;

    if (!item) {
      return res.status(404).json({ message: "Vault item no longer exists" });
    }

    // Time-lock check
    if (item.isLocked && item.unlockAt && new Date(item.unlockAt) > new Date()) {
        return res.status(403).json({ 
          message: "This item is currently time-locked and cannot be viewed yet.", 
          locked: true,
          unlockAt: item.unlockAt
        });
    }

    const decryptedContent = decrypt(item.content, item.iv);

    res.json({
      title: item.title,
      type: item.type,
      content: decryptedContent,
      createdAt: item.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to access shared item" });
  }
};
