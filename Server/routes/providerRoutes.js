const express = require('express');
const router = express.Router();
const Provider = require('../middleware/Provider');

router.get('/getInfo',Provider.getInfo);
router.post('/updateSettings',Provider.updateSettings);
router.get('/files',Provider.files)
router.get('/allFiles/:providerId',Provider.allFiles);
router.post('/files/mark-synced/:ipfsHash',Provider.sync)


module.exports = router;