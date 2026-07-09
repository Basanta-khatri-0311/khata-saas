import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: { message: 'Too many login attempts from this IP, please try again after 15 minutes' }
});

router.post('/register', registerUser);
router.post('/login', loginLimiter, loginUser);
router.get('/me', protect, getMe);

export default router;
