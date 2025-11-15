import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  masterPassword: {
    type: String,
    required: true, // hashed password
  },

  vault: [
    {
      site: String,        // e.g., "Gmail"
      username: String,    // e.g., "myemail@gmail.com"
      password: String,    // encrypted password
      sharedWith: [
        {
          email: String,
          expiresAt: Date,
          accessed: { type: Boolean, default: false },
        },
      ],
    },
  ],
}, { timestamps: true });

export default mongoose.model("User", userSchema);
