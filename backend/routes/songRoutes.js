import express from 'express';
import {
    uploadSong,
    getAllSongs,
    getSongById,
    incrementPlayCount,
    deleteSong,
    getRecentSongs
} from '../controllers/songController.js';
import { protect, admin } from '../middleware/auth.js';
import { uploadSongWithCover } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllSongs);
router.get('/recent', getRecentSongs);
router.get('/:id', getSongById);
router.put('/:id/play', incrementPlayCount);

// Protected routes (admin only)
router.post('/upload', protect, admin, uploadSongWithCover, uploadSong);
router.delete('/:id', protect, admin, deleteSong);

export default router;
