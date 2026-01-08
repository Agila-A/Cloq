import User from "../models/User.js";

export const ensureUserExists = async (req, res, next) => {
  try {
    const { uid, email } = req.user;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        vault: [],
      });
    }

    req.dbUser = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "User creation failed" });
  }
};
