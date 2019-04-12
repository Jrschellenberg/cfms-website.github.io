const express = require('express');
const router = express.Router();

router.use('/tweets', require('./tweets'));

module.exports = router;
