import VaultItem from "../models/VaultItem.js";
import { encrypt, decrypt } from "../utils/encrypt.js";
import { logActivity } from "./logController.js";

// Create a new Vault Item (Password, Note, File)
export const createVaultItem = async (req, res) => {
  try {
    const { title, type, content, isLocked, unlockAt } = req.body;

    if (!title || !type || !content) {
      return res.status(400).json({ message: "Title, type, and content are required" });
    }

    const { encryptedData, iv } = encrypt(content);

    const newItem = new VaultItem({
      userId: req.user.uid,
      title,
      type,
      content: encryptedData,
      iv,
      isLocked: isLocked || false,
      unlockAt: isLocked ? unlockAt : null,
    });

    await newItem.save();
    
    // Log
    await logActivity(req.user.uid, "CREATE_VAULT", `Created a ${type} vault item: ${title}`);

    res.status(201).json({ message: "Vault item added successfully", item: newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add vault item" });
  }
};

// Get all Vault Items (without decrypting content for security array view)
export const getVaultItems = async (req, res) => {
  try {
    const items = await VaultItem.find({ userId: req.user.uid }).select("-content -iv").sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vault items" });
  }
};

// Get Vault Item by ID and decrypt content (respecting time lock)
export const getVaultItemById = async (req, res) => {
  try {
    const item = await VaultItem.findOne({ _id: req.params.id, userId: req.user.uid });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.isLocked && item.unlockAt && new Date(item.unlockAt) > new Date()) {
      // Locked, do not decrypt
      return res.status(403).json({ 
        message: "This item is time-locked", 
        locked: true, 
        unlockAt: item.unlockAt 
      });
    }

    const decryptedContent = decrypt(item.content, item.iv);

    // Track access log
    await logActivity(req.user.uid, "VIEW_VAULT", `Viewed vault item: ${item.title}`);

    res.json({
      _id: item._id,
      title: item.title,
      type: item.type,
      content: decryptedContent,
      isLocked: item.isLocked,
      unlockAt: item.unlockAt,
      createdAt: item.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch vault item details" });
  }
};

// Delete Vault Item
export const deleteVaultItem = async (req, res) => {
  try {
    const item = await VaultItem.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    await logActivity(req.user.uid, "DELETE_VAULT", `Deleted vault item: ${item.title}`);

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete vault item" });
  }
};
