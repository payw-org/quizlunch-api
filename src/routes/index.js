const express = require('express');
const router = express.Router();

const quizRouter = require('./routes/quiz')
const winnerRouter = require('./routes/winner')
const commentRouter = require('./routes/comment')

router.use('/quiz',quizRouter)
router.use('/winner',winnerRouter)
router.use('/comment',commentRouter)

module.exports = router