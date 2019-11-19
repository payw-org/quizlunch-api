
const express = require('express');
const router = express.Router();


const commentController = require('../controllers/commentController');

// router.get('/:quizID', commentController.getOneQuizComments);

router.post('/', commentController.create);

router.delete('/', commentController.delete);

module.exports = router