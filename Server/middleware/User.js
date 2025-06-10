const jwt = require('jsonwebtoken');
const Renter = require('../models/user');
const Provider = require('../models/provider');

const File = require('../models/file');

const axios = require('axios');

const JWT_SECRET = "testing";

const getInfo = async (req, res) => {
  try {
    console.log("Incoming request to /getInfo");

    const token = req.cookies.token;
    console.log("Token from cookies:", token);

    if (!token) {
      console.warn("No token provided in cookies");
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    console.log("Decoded userId from token:", userId);

    let user = await Renter.findById(userId);
    if (user) {
      console.log("User found in Renter model:", user.email);
    } else {
      console.log("User not found in Renter model. Checking Provider model...");
      user = await Provider.findById(userId);

      if (user) {
        console.log("User found in Provider model:", user.email);
      }
    }

    if (!user) {
      console.warn("No user found in either model");
      return res.status(404).json({ msg: "User not found" });
    }

    console.log("User fetched successfully:", {
      id: user._id,
      name: user.name,
      role: user.role,
    });

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("Error in getInfo:", err.message);
    return res.status(500).json({ msg: "Server error" });
  }
};


const getUserFiles = async (req, res) => {
  try {
    console.log('🔍 Request received to fetch user files');

    const token = req.cookies.token;
    console.log('📥 Token from cookies:', token ? '[FOUND]' : '[NOT FOUND]');

    if (!token) {
      console.warn('⚠️ No token provided, authorization denied');
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token successfully verified');

    const userId = decoded.userId;
    console.log('🆔 Decoded userId from token:', userId);

    const files = await File.find({ uploadedBy: userId });
    console.log(`📂 Found ${files.length} files uploaded by user ${userId}`);

    return res.status(200).json({ success: true, files });
  } catch (err) {
    console.error('❌ Error fetching user files:', err.message);
    return res.status(500).json({ msg: "Server error" });
  }
};


const downloadFile = async (req, res) => {
  const { ipfsHash } = req.body;

  if (!ipfsHash) {
    console.warn('❌ No ipfsHash provided in request');
    return res.status(400).json({ error: 'ipfsHash is required' });
  }

  try {
    console.log(`📥 Received download request for IPFS hash: ${ipfsHash}`);

    const file = await File.findOne({ path: ipfsHash });

    if (!file) {
      console.warn(`⚠️ No file found in DB with path: ${ipfsHash}`);
      return res.status(404).json({ error: 'File not found in database' });
    }

    const providerId = file.storedOnProvider;
    console.log(`📦 File stored on provider: ${providerId}`);

    const provider = await Provider.findById(providerId);

    if (!provider) {
      console.warn(`⚠️ Provider not found: ${providerId}`);
      throw new Error('Provider not found');
    }


    const now = new Date();
    const lastSeenThreshold = new Date(now.getTime() - 2 * 60 * 1000); // 30 sec ago
    const isProviderOnline = provider.lastSeen > lastSeenThreshold;

    console.log(lastSeenThreshold," ",isProviderOnline," ",provider.lastSeen);
    

    if (isProviderOnline && provider.localip && provider.port) {
      const providerUrl = `http://${provider.localip}:${provider.port}/files/${ipfsHash}`;
      console.log(`🌐 Attempting to fetch file from provider: ${providerUrl}`);

      try {
        const response = await axios.get(providerUrl, { responseType: 'stream' });

        res.setHeader('Content-Disposition', `attachment; filename="${ipfsHash}.enc"`);
        response.data.pipe(res);

        console.log(`✅ File streamed successfully from provider ${provider.localip}`);
        return;
      } catch (providerErr) {
        console.error(`❌ Failed to fetch file from provider: ${providerErr.message}`);
        console.warn('⚠️ Falling back to IPFS...');
      }
    } else {
      console.warn(`⚠️ Provider offline or missing IP/port. Falling back to IPFS.`);
    }

    // 📡 Fallback to IPFS
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    console.log(`🔗 Fetching file from IPFS gateway: ${ipfsUrl}`);

    try {
      const ipfsRes = await axios.get(ipfsUrl, { responseType: 'stream' });

      res.setHeader('Content-Disposition', `attachment; filename="${ipfsHash}.enc"`);
      ipfsRes.data.pipe(res);

      console.log(`✅ File streamed successfully from IPFS.`);
    } catch (ipfsErr) {
      console.error(`❌ Failed to fetch file from IPFS: ${ipfsErr.message}`);
      return res.status(500).json({ error: 'Failed to fetch file from both provider and IPFS' });
    }

  } catch (err) {
    console.error('❌ Unexpected error in /files/download:', err.message);
    res.status(500).json({ error: 'Unexpected server error' });
  }
};

module.exports = { downloadFile };



module.exports = { getInfo ,getUserFiles,downloadFile};
