const mongoose = require("mongoose");

const ProviderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    totalSpace: { type: Number, required: true }, // Total storage space (GB)
    usedSpace: { type: Number, default: 0 }, // Space currently occupied (GB)
    availableSpace: { type: Number, required: true }, // Remaining space (GB)
    storagePath: { type: String, required: true }, // Local path where files are stored
    ipAddress: { type: String, required: true }, // Provider’s last known IP
    isOnline: { type: Boolean, default: false }, // Tracks if provider is online
    lastSync: { type: Date, default: null }, // Last successful sync time
  },
  { timestamps: true }
);

module.exports = mongoose.model("Provider", ProviderSchema);
