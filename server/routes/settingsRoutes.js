const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { adminOnly } = require('../middleware/authMiddleware');

router.get('/', getSettings);
router.put('/', adminOnly, updateSettings);

module.exports = router;
