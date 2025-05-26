const express = require('express');
const router = express.Router();
const Provider = require('../middleware/Provider');

router.get('/getInfo',Provider.getInfo);
router.post('/updateSettings',Provider.updateSettings);

module.exports = router;