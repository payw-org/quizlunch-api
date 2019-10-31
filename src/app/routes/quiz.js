
const express = require('express');
const router = express.Router();


const quizController = require('../controllers/quizController');

router.get('/', quizController.get);

router.get('/correctCheck', quizController.correctCheck);

router.post('/', quizController.create);

router.put('/', quizController.updateGotAnswer);

module.exports =router