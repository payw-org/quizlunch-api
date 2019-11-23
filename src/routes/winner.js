
const express = require('express');
const router = express.Router();


const winnerController = require('../controllers/winnerController');

router.post('/', winnerController.create);



module.exports = router