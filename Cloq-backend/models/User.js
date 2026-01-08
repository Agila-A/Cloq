import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    vault: [
      {
        site: String,
        username: String,
        password: String, // encrypted
        sharedWith: [
          {
            email: String,
            expiresAt: Date,
            accessed: { type: Boolean, default: false },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
