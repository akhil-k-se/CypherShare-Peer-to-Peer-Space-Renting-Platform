const express = require('express');
const router = express.Router();
const Authentication = require('../middleware/Authentication');

router.post('/register',Authentication.register);
router.post('/login',Authentication.login);
router.post('/logout',Authentication.logout);
router.get('/me',Authentication.checkingRole);

module.exports = router;