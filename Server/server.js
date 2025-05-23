const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const storageRoutes = require("./routes/storageRoutes");
const fileRoutes = require("./routes/fileRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/storage", storageRoutes);
app.use("/api/files", fileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
