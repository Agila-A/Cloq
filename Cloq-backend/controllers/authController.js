import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// --------------------- SIGNUP ---------------------
export const registerUser = async (req, res) => {
  try {
    const { email, masterPassword } = req.body;

    // check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash master password
    const hashedPassword = await bcrypt.hash(masterPassword, 10);

    // create new user
    const user = new User({
      email,
      masterPassword: hashedPassword,
    });

    await user.save();

    return res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------- LOGIN ---------------------
export const loginUser = async (req, res) => {
  try {
    const { email, masterPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(masterPassword, user.masterPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
