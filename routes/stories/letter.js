const express = require('express');
const router = express.Router();
const letterController = require('../../controllers/stories/letterController');

// POST /letter - story 추가
router.post('/', letterController.addStory);

// GET /letter - 전체 story 목록 가져오기
router.get('/', letterController.getStories);

module.exports = router;
