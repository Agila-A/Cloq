import ActivityLog from "../models/ActivityLog.js";

// Log an action
export const logActivity = async (userId, action, details) => {
  try {
    const log = new ActivityLog({ userId, action, details });
    await log.save();
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};

// Get user logs
export const getUserLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ userId: req.user.uid }).sort({ createdAt: -1 }).limit(50);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch activity logs" });
  }
};
