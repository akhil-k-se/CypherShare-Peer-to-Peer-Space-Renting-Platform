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
  lastSeen: {
    type: Date,
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
      ipfsHash: { type: String, required: true }, 
      renterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      aesKey: { type: String, required: true }, 
      iv: { type: String, required: true },

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
  pendingDeletions: [
    {
      ipfsHash: { type: String, required: true },
      fileName: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],

  allFilesSynced: {
    type: Boolean,
    default: false,
  },
  localip: {
    type: String,
  },
  port: {
    type: Number,
  },
  publicUrl:{
    type:String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Provider", providerSchema);
