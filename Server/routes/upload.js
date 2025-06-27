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
const User = require("../models/user");

const crypto = require("crypto");
const { Readable } = require("stream");

const PINATA_JWT =process.env.PINATA_JWT

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const fileSize = req.file.size;

    // Find a provider with enough space
    const fileSizeInGB = fileSize / (1024 * 1024 * 1024);
    const provider = await Provider.findOne({
      $expr: {
        $gte: [{ $subtract: ["$totalStorage", "$usedStorage"] }, fileSizeInGB],
      },
    });

    if (!provider) {
      console.log("No provider with enough available storage found");

      return res.status(400).json({
        success: false,
        message: "No provider with enough available storage found",
      });
    }

    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    if (!req.file) {
      console.log("⚠️ No file found in the request");
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
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

    // Generate AES-256-CBC key & IV

    // Encrypt function
    function encryptBuffer(buffer, key, iv) {
      const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
      return Buffer.concat([cipher.update(buffer), cipher.final()]);
    }

    // Encrypt the uploaded file buffer
    const encryptedBuffer = encryptBuffer(req.file.buffer, aesKey, iv);

    const sha256 = crypto
      .createHash("sha256")
      .update(encryptedBuffer)
      .digest("hex");
    console.log("🔒 SHA256 of encrypted file:", sha256);

    // Create a Readable stream from encrypted buffer (for Pinata upload)
    const bufferStream = new Readable();
    bufferStream.push(encryptedBuffer);
    bufferStream.push(null);

    // const fileName = `${Date.now()}_${req.file.originalname}`;

    // Prepare form-data for Pinata
    const data = new FormData();
    data.append("file", bufferStream, { filename: fileName });
    data.append(
      "pinataMetadata",
      JSON.stringify({ name: fileName, keyvalues: { uploadedBy: user_id } })
    );

    const headers = {
      ...data.getHeaders(),
      Authorization: `Bearer ${PINATA_JWT}`,
    };

    // Upload encrypted file to Pinata
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      { headers }
    );

    console.log(
      `🚀 Encrypted file uploaded to Pinata. IPFS Hash: ${response.data.IpfsHash}`
    );

    // Use your existing logic below to find a provider, update storage etc.

    // fileSize remains the original req.file.size, no need to calculate GB here again

    // Update provider usedStorage
    provider.usedStorage += fileSizeInGB;
    console.log("Pushing to provider");

    console.log(aesKey.toString("base64"), " ", iv.toString("base64"));

    // Save file metadata including encryption key and IV (as base64 strings)
    provider.storedFiles.push({
      fileName,
      fileSize,
      fileType: req.file.mimetype,
      ipfsHash: response.data.IpfsHash,
      renterId: user_id,
      aesKey: aesKey.toString("base64"),
      iv: iv.toString("base64"),
    });

    await provider.save();

    console.log("📦 Encrypted file metadata saved in provider");
    // Save to user's uploadedFiles
    const user = await User.findById(user_id);
    if (!user) {
      console.log("⚠️ User not found, skipping user file reference");
    } else {
      user.uploadedFiles.push({
        fileName: fileName,
        fileSize: parseFloat(fileSize.toFixed(3)),
        fileType: req.file.mimetype,
        providerId: provider._id,
        ipfsHash: response.data.IpfsHash,
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
      sha256,
      aesKey: aesKey.toString("base64"),
      iv: iv.toString("base64"),
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
