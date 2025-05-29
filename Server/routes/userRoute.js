const express = require('express');
const router = express.Router();
const User = require('../middleware/User');

router.get('/getInfo',User.getInfo);
router.get('/allFiles',User.getUserFiles);

module.exports = router;