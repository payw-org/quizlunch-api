const express = require('express');
const router = express.Router();

const quizRouter = require('./quiz')
const winnerRouter = require('./winner')
const commentRouter = require('./comment')

router.use('/quiz',quizRouter)
router.use('/winner',winnerRouter)
router.use('/comment',commentRouter)

module.exports = router