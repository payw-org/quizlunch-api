
const express = require('express');
const router = express.Router();


const quizController = require('../controllers/quizController');

router.get('/:quizID', quizController.get);

router.get('/:quizID/:answer', quizController.correctCheck);

router.post('/', quizController.create);

router.put('/', quizController.updateGotAnswer);

module.exports =router