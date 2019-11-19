
const express = require('express');
const router = express.Router();


const quizController = require('../controllers/quizController');

// router.get('/:quizID', quizController.get);

router.get('/:quizID/:answer', quizController.checkAnswer);

router.post('/', quizController.createQuiz);

// router.put('/', quizController.updateAnswer);

module.exports = router