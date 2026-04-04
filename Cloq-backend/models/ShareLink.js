import mongoose from "mongoose";

const shareLinkSchema = new mongoose.Schema(
  {
    vaultItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VaultItem",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    password: {
      type: String, // Optional hashed password or encrypted password
    },
    createdBy: {
      type: String, // Firebase UID
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ShareLink", shareLinkSchema);
