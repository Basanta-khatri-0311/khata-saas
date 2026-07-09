import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { protect } from '../middleware/authMiddleware';
import { activeOnly } from '../middleware/statusMiddleware';

const router = express.Router();

router.get('/', protect, activeOnly, getSettings);
router.put('/', protect, activeOnly, updateSettings);

export default router;
