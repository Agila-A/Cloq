import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Firebase UID
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ["CREATE_VAULT", "VIEW_VAULT", "SHARE_LINK", "DELETE_VAULT", "LOGIN"],
      required: true,
    },
    details: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);
