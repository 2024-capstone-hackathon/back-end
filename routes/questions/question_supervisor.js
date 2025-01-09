const express = require('express');
const router = express.Router();
const questionSupervisorController = require('../../controllers/question/questionSupervisorController');

// POST /question_supervisor
router.post('/', questionSupervisorController.processSupervisor);

module.exports = router;