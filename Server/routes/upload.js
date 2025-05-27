const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const FLEEK_API_KEY = process.env.FLEEK_API_KEY;
const FLEEK_API_SECRET = process.env.FLEEK_API_SECRET;

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const form = new FormData();
    form.append('file', req.file.buffer, {
      filename: req.file.originalname
    });

    const response = await axios.post(
      'https://storageapi.fleek.co/' + FLEEK_API_KEY + '/basic/file',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Basic ${Buffer.from(`${FLEEK_API_KEY}:${FLEEK_API_SECRET}`).toString('base64')}`
        }
      }
    );

    const { hash } = response.data;

    res.json({
      success: true,
      cid: hash,
      publicURL: `https://ipfs.fleek.co/ipfs/${hash}`
    });
  } catch (error) {
    console.error('❌ Upload error to Fleek:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Upload to Fleek failed' });
  }
});

module.exports = router;
