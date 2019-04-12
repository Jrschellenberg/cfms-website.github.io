const express = require('express');
const router = express.Router();

import tweets from './tweets';

router.use('/tweets', tweets);


export default router
