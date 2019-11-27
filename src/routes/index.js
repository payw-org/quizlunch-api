const express = require('express');
const router = express.Router();

const RTQuiz = require('./quiz')
const RTWinner = require('./winner')
const RTComment = require('./comment')

router.use('/quiz',RTQuiz)
router.use('/winner',RTWinner)
router.use('/comment',RTComment)

module.exports = router