const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    role: {
      type: String,
      enum: ["renter", "customer"], // Renter = provides storage, Customer = uploads files
      required: true,
    },
    rentedSpace: { type: Number, default: 0 }, // Space rented (GB)
    availableSpace: { type: Number, default: 0 }, // Provider’s available storage
    isOnline: { type: Boolean, default: false }, // Tracks if provider is online
    lastOnline: { type: Date, default: null }, // Last time the user was online
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
