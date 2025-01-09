const express = require('express');
const router = express.Router();
const ecoController = require('../../controllers/counsels/ecoController');

// POST /eco
router.post('/', ecoController.addCounsel);

// GET /eco
router.get('/', ecoController.getCounsels);

module.exports = router;
