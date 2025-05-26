const express = require('express');
const router = express.Router();
const User = require('../middleware/User');

router.get('/getInfo',User.getInfo);

module.exports = router;