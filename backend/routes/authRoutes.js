import express from 'express';
import {
    register,
    login,
    getMe,
    updateProfile,
    toggleFavoriteSong
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/profile/favorites/:songId', protect, toggleFavoriteSong);

export default router;
