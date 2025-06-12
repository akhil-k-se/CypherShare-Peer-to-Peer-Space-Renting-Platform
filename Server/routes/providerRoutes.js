const express = require('express');
const router = express.Router();
const Provider = require('../middleware/Provider');

router.get('/getInfo',Provider.getInfo);
router.get('/getInfo/:providerId',Provider.getInfoUsingID);

router.post('/updateSettings',Provider.updateSettings);
router.get('/files',Provider.files)
router.get('/allFiles/:providerId',Provider.allFiles);
router.post('/files/mark-synced/:ipfsHash',Provider.sync)

router.post('/heartbeat',Provider.heartbeat);
router.get('/pendingDeletions/:providerId',Provider.pendingDeletion);

router.post('/removePendingDeletionDB/:providerId',Provider.removePendingDeletionDB);



module.exports = router;