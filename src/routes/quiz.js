const express = require('express');
const router = express.Router();

const CTRQuizs = require('../apps/controller/CTRQuizs');

router.get('/:quizID/left', CTRQuizs.getPreviousPage);
router.get('/:quizID/right', CTRQuizs.getNextPage);
router.get('/:quizID/:answer', CTRQuizs.checkAnswer);
router.post('/', CTRQuizs.createQuiz);

module.exports = router