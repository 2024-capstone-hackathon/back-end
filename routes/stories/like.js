const express = require('express');
const router = express.Router();
const likeController = require('../../controllers/stories/likeController');

// POST /like - 특정 id의 vote 증가 및 isLiked 업데이트
router.post('/', likeController.incrementVoteAndSetLike);

module.exports = router;
