const express = require('express');
const router = express.Router();
const selectedController = require('../../controllers/stories/selectedController');

// GET /selected
router.get('/', selectedController.getHighestVotedStory);

module.exports = router;
