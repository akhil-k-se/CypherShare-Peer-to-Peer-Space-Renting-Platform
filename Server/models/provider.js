const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  role: {
    type: String,
    enum: ["provider", "renter"],
    default: "provider",
  },

  totalStorage: {
    type: Number,
    required: true,
    default: 500,
  },

  usedStorage: {
    type: Number,
    required: true,
    default: 0,
  },

  totalEarning: {
    type: Number,
    required: true,
    default: 0,
  },

  autoStart: {
    type: Boolean,
    default: false,
  },

  notificationsEnabled: {
    type: Boolean,
    default: false,
  },

  storedFiles: [
    {
      fileName: { type: String, required: true },
      fileSize: { type: Number, required: true },
      fileType: { type: String, required: true },
      ipfsHash: { type: String, required: true }, // ✅ New field
      renterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      aesKey: { type: String, required: true }, // base64 encoded
      iv: { type: String, required: true }, // base64 encoded

      uploadedAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["available", "pending", "deleted"],
        default: "available",
      },
    },
  ],

  /** ✅ New field to indicate if all assigned files are synced */
  allFilesSynced: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Provider", providerSchema);
