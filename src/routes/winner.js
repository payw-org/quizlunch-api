const express = require('express');
const router = express.Router();

const CTRWinners = require('../apps/controller/CTRWinners');

router.post('/', CTRWinners.create);

module.exports = router