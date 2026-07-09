const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');
const { activeOnly } = require('../middleware/statusMiddleware');

router.get('/', protect, activeOnly, getSettings);
router.put('/', protect, activeOnly, updateSettings);

module.exports = router;

module.exports = router;
