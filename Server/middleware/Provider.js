const jwt = require('jsonwebtoken');
const Provider = require('../models/provider');

const JWT_SECRET = "testing";

const updateSettings = async (req, res) => {
  try {
    console.log("Incoming request to /updateSettings for Provider");

    const token = req.cookies.token;
    console.log("Token from cookies:", token);

    if (!token) {
      console.warn("No token provided in cookies");
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    console.log("Decoded userId from token:", userId);

    const { storage, autoStart, notificationsEnabled } = req.body;

    if (
      storage == null ||
      typeof autoStart !== "boolean" ||
      typeof notificationsEnabled !== "boolean"
    ) {
      return res.status(400).json({ msg: "Invalid input data" });
    }

    const provider = await Provider.findById(userId);
    if (!provider) {
      console.warn("Provider not found with ID:", userId);
      return res.status(404).json({ msg: "Provider not found" });
    }

    provider.totalStorage = storage;
    provider.autoStart = autoStart;
    provider.notificationsEnabled = notificationsEnabled;

    await provider.save();

    console.log("Provider settings updated successfully");

    return res.status(200).json({ msg: "Settings updated successfully" });
  } catch (err) {
    console.error("Error in updateSettings for Provider:", err.message);
    return res.status(500).json({ msg: "Server error" });
  }
};


const getInfo = async (req, res) => {
  try {
    console.log("Incoming request to /getInfo for Provider");

    const token = req.cookies.token;
    console.log("Token from cookies:", token);

    if (!token) {
      console.warn("No token provided in cookies");
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    console.log("Decoded userId from token:", userId);

    const provider = await Provider.findById(userId);
    if (!provider) {
      console.warn("Provider not found with ID:", userId);
      return res.status(404).json({ msg: "Provider not found" });
    }

    console.log("Provider fetched successfully:", {
      id: provider._id,
      name: provider.name,
      email: provider.email,
    });

    return res.status(200).json({
      id: provider._id,
      name: provider.name,
      email: provider.email,
      role: provider.role,
      notification:provider.notificationsEnabled,
      autoStart: provider.autoStart,
      totalStorage: provider.totalStorage,
      usedStorage: provider.usedStorage,
      totalEarning: provider.totalEarning
    });
  } catch (err) {
    console.error("Error in getInfo for Provider:", err.message);
    return res.status(500).json({ msg: "Server error" });
  }
};


module.exports = { updateSettings,getInfo };
