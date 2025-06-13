const jwt = require("jsonwebtoken");
const Provider = require("../models/provider");
const File = require("../models/file");

const crypto = require("crypto");

const axios = require("axios");
const fs = require("fs");
const path = require("path");

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
    // console.log("Token from cookies:", token);

    if (!token) {
      console.warn("No token provided in cookies");
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    // console.log("Decoded userId from token:", userId);

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
      notification: provider.notificationsEnabled,
      autoStart: provider.autoStart,
      totalStorage: provider.totalStorage.toFixed(2),
      usedStorage: provider.usedStorage.toFixed(2),
      totalEarning: provider.totalEarning,
    });
  } catch (err) {
    console.error("Error in getInfo for Provider:", err.message);
    return res.status(500).json({ msg: "Server error" });
  }
};

const getInfoUsingID = async (req, res) => {
  try {
    console.log("Incoming request to /getInfousingId for Provider");

    const { providerId } = req.params;
    console.log("the Id of Provider is", providerId);

    if (!providerId) {
      console.warn("No Id Received");
      return res.status(401).json({ msg: "No id received" });
    }

    const provider = await Provider.findById(providerId);
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
      notification: provider.notificationsEnabled,
      autoStart: provider.autoStart,
      totalStorage: provider.totalStorage.toFixed(2),
      usedStorage: provider.usedStorage.toFixed(2),
      totalEarning: provider.totalEarning,
    });
  } catch (err) {
    console.error("Error in getInfo for Provider:", err.message);
    return res.status(500).json({ msg: "Server error" });
  }
};

const allFiles = async (req, res) => {
  try {
    const providerId = req.params.providerId;
    // console.log("Received providerId:", providerId);

    if (!providerId) {
      // console.warn("No providerId provided in params");
      return res.status(400).json({ msg: "providerId param is required" });
    }

    const provider = await Provider.findById(providerId);

    if (!provider) {
      // console.log("No Provider Found");
      return res.status(400).json({ msg: "Provider was not found" });
    }

    // console.log("Provider Found");

    // console.log("Provider is ", provider.name);

    const formattedFiles = await Promise.all(
      provider.storedFiles.map(async (file) => {
        const fileDoc = await File.findOne({ path: file.ipfsHash });
        if (!fileDoc || !fileDoc.isSyncedToProvider) {
          return {
            fileName: file.fileName,
            fileSize: file.fileSize,
            ipfsHash: file.ipfsHash,
            fileType: file.fileType,
            status: file.status,
            renterName: file.renterId.name,
            uploadedAt: file.uploadedAt,
          };
        }
      })
    );

    // Remove nulls (i.e., files that are synced)
    const unsyncedFiles = formattedFiles.filter((file) => file !== null);

    return res.status(200).json(formattedFiles);
  } catch (error) {
    console.error("Error fetching files for provider:", error.message);
    return res.status(500).json({ msg: "Server error" });
  }
};

const files = async (req, res) => {
  try {
    // console.log(
    //   "📥 Fetching provider's stored files with populated renter names"
    // );

    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: "Authentication required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const provider = await Provider.findById(userId).populate(
      "storedFiles.renterId",
      "name"
    );

    // console.log("Populated renterId:", provider.storedFiles[0]?.renterId);

    if (!provider) return res.status(404).json({ msg: "Provider not found" });

    const formattedFiles = provider.storedFiles.map((file) => ({
      fileName: file.fileName,
      fileSize: file.fileSize,
      ipfsHash: file.ipfsHash,
      fileType: file.fileType,
      status: file.status,
      renterName: file.renterId.name,
      uploadedAt: file.uploadedAt,
    }));

    res.json({ files: formattedFiles });
  } catch (err) {
    console.error("❌ Error fetching files:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

const sync = async (req, res) => {
  const { ipfsHash } = req.params;
  console.log(`[SYNC] Request to sync file with IPFS hash: ${ipfsHash}`);

  try {
    const file = await File.findOne({ path: ipfsHash });

    if (!file) {
      console.warn(`[SYNC] File not found with IPFS hash: ${ipfsHash}`);
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    file.isSyncedToProvider = true; // mark as synced to provider
    await file.save();

    console.log(`[SYNC] File with IPFS hash ${ipfsHash} marked as synced.`);
    return res.json({
      success: true,
      message: "File marked as synced to provider",
    });
  } catch (error) {
    console.error(
      `[SYNC] Error syncing file with IPFS hash ${ipfsHash}:`,
      error
    );
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const heartbeat = async (req, res) => {
  const { providerId, ip, port,publicUrl } = req.body;

  // console.log("📥 Heartbeat received:", req.body);

  if (!providerId) {
    console.warn("⚠️ Heartbeat received without providerId");
    return res.status(400).send({ error: "Missing providerId" });
  }

  try {
    await Provider.findByIdAndUpdate(providerId, {
      lastSeen: new Date(),
      localip:ip,
      port,
      publicUrl
    });

    // console.log(
    //   `💓 Heartbeat updated for providerId: ${providerId}, IP: ${ip}, Port: ${port}`
    // );
    return res.send({ success: true });
  } catch (err) {
    console.error("❌ Error updating heartbeat:", err);
    return res.status(500).send({ error: "Internal server error" });
  }
};

const pendingDeletion = async (req, res) => {
  try {
   const providerId = req.params.providerId;

    console.log(`📡 [PENDING DELETION] Fetching deletions for provider: ${providerId}`);

    const provider = await Provider.findById(providerId);

    if (!provider) {
      console.warn("❌ Provider not found");
      return res.status(404).json({ msg: "Provider not found" });
    }

    if (!provider.pendingDeletions || provider.pendingDeletions.length === 0) {
      console.log("🟢 No pending deletions for this provider.");
      return res.json({ pendingDeletion: [] });
    }

    console.log(`📦 Found ${provider.pendingDeletions.length} pending deletions.`);
    provider.pendingDeletions.forEach((item, idx) => {
      console.log(`  ${idx + 1}. File → IPFS Hash: ${item.ipfsHash}, File Name: ${item.fileName}`);
    });

    res.json({ pendingDeletion: provider.pendingDeletions });

  } catch (err) {
    console.error("❌ Error fetching pending deletions:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// In your Provider controller file (e.g., controllers/Provider.js)



const removePendingDeletionDB = async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const { ipfsHash } = req.body;

    console.log(`🧹 [REMOVE PENDING] Provider: ${providerId}, IPFS Hash: ${ipfsHash}`);

    if (!ipfsHash) {
      console.warn("⚠️ No ipfsHash provided in body");
      return res.status(400).json({ msg: "ipfsHash is required" });
    }

    const provider = await Provider.findById(providerId);

    if (!provider) {
      console.error("❌ Provider not found");
      return res.status(404).json({ msg: "Provider not found" });
    }

    const beforeCount = provider.pendingDeletions.length;

    provider.pendingDeletions = provider.pendingDeletions.filter(
      (item) => item.ipfsHash !== ipfsHash
    );

    const afterCount = provider.pendingDeletions.length;

    await provider.save();

    console.log(
      `✅ Removed pending deletion. Before: ${beforeCount}, After: ${afterCount}`
    );

    res.status(200).json({ msg: "Pending deletion removed successfully" });
  } catch (err) {
    console.error("❌ Error removing pending deletion:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};


module.exports = {
  updateSettings,
  getInfo,
  allFiles,
  files,
  sync,
  getInfoUsingID,
  heartbeat,
  pendingDeletion,
  removePendingDeletionDB
};
