const express = require('express');
const router = express.Router();
const questionAnswerController = require('../../controllers/question/questionAnswerController');

// POST /question_answer
router.post('/', questionAnswerController.processQuestionAnswer);

module.exports = router;
