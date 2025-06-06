const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const File = require('../models/file');
const jwt = require('jsonwebtoken');

const PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2ODE0Yjc0My04NzhmLTQ1MTAtODI5Yy0xOTczYmEyMzJlYmYiLCJlbWFpbCI6ImhvdGxpbmVjbGFzaGVyMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI1ZmIzZTI0NDYxNTA5NTM2Yzg1YiIsInNjb3BlZEtleVNlY3JldCI6ImJhOGZlZGI4ODVlZDBiZmY5MTM3MDUzYTYyMGQxZjI5ZjY4M2Y3YjE1YTRmNTZiYTk2N2Y0ZTU0ZmNlMGY0NDAiLCJleHAiOjE3ODAwODYzMjV9.A_hI8yBUThABPc1T8drKdKvY7IrsN-sbyt4C1FoBM4I';

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    console.log('▶️ File upload initiated via Pinata');

    const token = req.cookies.token;

    const verify = jwt.verify(token,process.env.JWT_SECRET);

    console.log(verify);
    const user_id = verify.userId;
    

    const tempDir = path.join(__dirname, '..', 'temp_uploads');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    const fileName = `${Date.now()}_${req.file.originalname}`;
    const tempFilePath = path.join(tempDir, fileName);
    fs.writeFileSync(tempFilePath, req.file.buffer);
    console.log(`💾 File temporarily saved at: ${tempFilePath}`);

    const data = new FormData();
    data.append('file', fs.createReadStream(tempFilePath));

    const metadata = JSON.stringify({
      name: fileName,
      keyvalues: {
        uploadedBy: req.user ? req.user._id.toString() : 'anonymous',
      }
    });
    data.append('pinataMetadata', metadata);

    const headers = {
      ...data.getHeaders(),
      Authorization: `Bearer ${PINATA_JWT}`,
    };

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, { headers });

    console.log(`✅ File uploaded to Pinata with IPFS hash: ${response.data.IpfsHash}`);

    const newFile = new File({
      fileName,
      originalName: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      uploadedBy: user_id,
      // storedOnProvider: "provider",
      path: response.data.IpfsHash,
      temporaryPath: tempFilePath,
      isSyncedToProvider: false,
      deletedFromTempServer: false,
    });

    await newFile.save();

    fs.unlinkSync(tempFilePath);

    res.json({ success: true, ipfsHash: response.data.IpfsHash, fileId: newFile._id });
  } catch (error) {
    console.error('❌ Upload to Pinata failed:', error);
    res.status(500).json({ success: false, message: 'Pinata upload failed', error: error.message });
  }
});

module.exports = router;
