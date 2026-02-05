import express from 'express';
import {
    createPlaylist,
    getAllPlaylists,
    getUserPlaylists,
    getPlaylistById,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist
} from '../controllers/playlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllPlaylists);

// Protected routes - Specific routes MUST come before dynamic /:id routes
router.get('/my-playlists', protect, getUserPlaylists);
router.post('/', protect, createPlaylist);
router.put('/:id/songs', protect, addSongToPlaylist);
router.delete('/:id/songs/:songId', protect, removeSongFromPlaylist);
router.delete('/:id', protect, deletePlaylist);

// Dynamic routes
router.get('/:id', getPlaylistById);

export default router;
