const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Uploader
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true }, // Space rented from
    filename: { type: String, required: true },
    fileSize: { type: Number, required: true }, // Size in MB
    storagePath: { type: String, required: true }, // Actual path on provider’s PC
    isEncrypted: { type: Boolean, default: true }, // Encryption status
    encryptionKey: { type: String, required: true }, // AES key for file decryption
    ipfsHash: { type: String, default: null }, // Cached version in IPFS (if offline)
    isCached: { type: Boolean, default: false }, // If file is temporarily stored
    downloadCount: { type: Number, default: 0 }, // Tracks number of downloads
    status: {
      type: String,
      enum: ["available", "cached", "pending-deletion"],
      default: "available",
    }, // Tracks file status
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", FileSchema);
