const express = require('express');
const router = express.Router();

const CTRWinners = require('../apps/controller/CTRWinners');

router.patch('/', CTRWinners.update);

module.exports = router