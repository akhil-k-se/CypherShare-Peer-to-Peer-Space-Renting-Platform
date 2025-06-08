const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const File = require("../models/file");
const jwt = require("jsonwebtoken");
const Provider = require("../models/provider");
const User = require('../models/user');

const PINATA_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2ODE0Yjc0My04NzhmLTQ1MTAtODI5Yy0xOTczYmEyMzJlYmYiLCJlbWFpbCI6ImhvdGxpbmVjbGFzaGVyMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI1ZmIzZTI0NDYxNTA5NTM2Yzg1YiIsInNjb3BlZEtleVNlY3JldCI6ImJhOGZlZGI4ODVlZDBiZmY5MTM3MDUzYTYyMGQxZjI5ZjY4M2Y3YjE1YTRmNTZiYTk2N2Y0ZTU0ZmNlMGY0NDAiLCJleHAiOjE3ODAwODYzMjV9.A_hI8yBUThABPc1T8drKdKvY7IrsN-sbyt4C1FoBM4I";

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.log("⚠️ No file found in the request");
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    console.log("▶️ File upload initiated");

    const token = req.cookies.token;
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = verify.userId;

    console.log(`🔐 Token verified. User ID: ${user_id}`);

    const tempDir = path.join(__dirname, "..", "temp_uploads");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
      console.log("📁 Created temporary directory");
    }

    const fileName = `${Date.now()}_${req.file.originalname}`;
    const tempFilePath = path.join(tempDir, fileName);
    fs.writeFileSync(tempFilePath, req.file.buffer);
    console.log(`💾 File temporarily saved at: ${tempFilePath}`);

    const fileSize = req.file.size;
    const fileSizeInGB = +(fileSize / (1024 * 1024 * 1024)).toFixed(4);
    console.log(`📏 File size: ${fileSize} bytes ≈ ${fileSizeInGB} GB`);

    const provider = await Provider.findOne({
      $expr: {
        $gte: [{ $subtract: ["$totalStorage", "$usedStorage"] }, fileSizeInGB],
      },
    });

    if (!provider) {
      console.log("❌ No provider found with enough available space");
      return res.status(400).json({
        success: false,
        message: "No provider with enough available storage found",
      });
    }

    console.log(`✅ Provider found: ${provider._id}`);
    console.log(`📊 Provider storage: ${provider.usedStorage}/${provider.totalStorage} GB`);

    // Update usedStorage before upload
    provider.usedStorage += fileSizeInGB;
    await provider.save();
    console.log(`📈 Provider usedStorage updated to: ${provider.usedStorage.toFixed(4)} GB`);

    // Prepare for IPFS upload
    const data = new FormData();
    data.append("file", fs.createReadStream(tempFilePath));

    const metadata = JSON.stringify({
      name: fileName,
      keyvalues: {
        uploadedBy: user_id,
      },
    });
    data.append("pinataMetadata", metadata);

    const headers = {
      ...data.getHeaders(),
      Authorization: `Bearer ${PINATA_JWT}`,
    };

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      { headers }
    );

    console.log(`🚀 File uploaded to Pinata. IPFS Hash: ${response.data.IpfsHash}`);

    // Save file in provider's storedFiles
    provider.storedFiles.push({
      fileName: fileName,
      fileSize: parseFloat(fileSizeInGB.toFixed(3)),
      fileType: req.file.mimetype,
      ipfsHash: response.data.IpfsHash,
      renterId: user_id,
    });

    await provider.save();
    console.log("📦 File metadata stored in provider document");

    // Save to user's uploadedFiles
    const user = await User.findById(user_id);
    if (!user) {
      console.log("⚠️ User not found, skipping user file reference");
    } else {
      user.uploadedFiles.push({
        fileName: fileName,
        fileSize: parseFloat(fileSizeInGB.toFixed(3)),
        fileType: req.file.mimetype,
        providerId: provider._id,
      });
      await user.save();
      console.log("👤 File added to user's uploadedFiles");
    }

    // Create file record in File collection
    const newFile = new File({
      fileName,
      originalName: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      uploadedBy: user_id,
      storedOnProvider: provider._id,
      path: response.data.IpfsHash,
      temporaryPath: tempFilePath,
      isSyncedToProvider: false,
      deletedFromTempServer: false,
    });

    await newFile.save();
    console.log(`📄 File saved to DB. File ID: ${newFile._id}`);

    // Clean up temporary file
    fs.unlinkSync(tempFilePath);
    console.log("🧹 Temporary file deleted");

    res.json({
      success: true,
      ipfsHash: response.data.IpfsHash,
      fileId: newFile._id,
    });
  } catch (error) {
    console.error("❌ Upload process failed:", error);
    res.status(500).json({
      success: false,
      message: "File upload failed",
      error: error.message,
    });
  }
});


module.exports = router;
