import mongoose from "mongoose";

const vaultItemSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Firebase UID
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["note", "password", "file"],
      required: true,
    },
    content: {
      type: String, // Encrypted content (either password json, or note text)
      required: true,
    },
    iv: {
      type: String, // Initialization vector for decryption
      required: true,
    },
    fileUrl: {
      type: String,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    unlockAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("VaultItem", vaultItemSchema);
