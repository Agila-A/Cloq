import User from "../models/User.js";
import encrypt from "../utils/encrypt.js";

// ADD PASSWORD
export const addPassword = async (req, res) => {
  try {
    const { site, username, password } = req.body;

    if (!site || !username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const encryptedPassword = encrypt(password);

    req.dbUser.vault.push({
      site,
      username,
      password: encryptedPassword,
    });

    await req.dbUser.save();

    res.status(201).json({ message: "Password added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add password" });
  }
};

// GET VAULT
export const getVault = async (req, res) => {
  try {
    res.json(req.dbUser.vault);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vault" });
  }
};
