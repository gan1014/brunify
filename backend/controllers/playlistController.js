import Playlist from '../models/Playlist.js';
import Song from '../models/Song.js';

// @desc    Create a new playlist
// @route   POST /api/playlists
// @access  Protected
export const createPlaylist = async (req, res) => {
    try {
        const { name, description, coverImage, isPublic } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Playlist name is required'
            });
        }

        const playlist = await Playlist.create({
            name,
            description,
            coverImage,
            isPublic: isPublic !== undefined ? isPublic : true,
            owner: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Playlist created successfully',
            data: playlist
        });

    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create playlist',
            error: error.message
        });
    }
};

// @desc    Get all playlists
// @route   GET /api/playlists
// @access  Public
export const getAllPlaylists = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const playlists = await Playlist.find({ isPublic: true })
            .populate('owner', 'username profileImage')
            .populate('songs')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort('-createdAt');

        const count = await Playlist.countDocuments({ isPublic: true });

        res.status(200).json({
            success: true,
            data: playlists,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching playlists:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch playlists',
            error: error.message
        });
    }
};

// @desc    Get user's playlists
// @route   GET /api/playlists/my-playlists
// @access  Protected
export const getUserPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({ owner: req.user._id })
            .populate('songs')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            data: playlists
        });

    } catch (error) {
        console.error('Error fetching user playlists:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch playlists',
            error: error.message
        });
    }
};

// @desc    Get playlist by ID
// @route   GET /api/playlists/:id
// @access  Public
export const getPlaylistById = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id)
            .populate('owner', 'username profileImage')
            .populate('songs');

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: 'Playlist not found'
            });
        }

        // Check if playlist is private and user is not the owner
        if (!playlist.isPublic && (!req.user || playlist.owner._id.toString() !== req.user._id.toString())) {
            return res.status(403).json({
                success: false,
                message: 'This playlist is private'
            });
        }

        res.status(200).json({
            success: true,
            data: playlist
        });

    } catch (error) {
        console.error('Error fetching playlist:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch playlist',
            error: error.message
        });
    }
};

// @desc    Add song to playlist
// @route   PUT /api/playlists/:id/songs
// @access  Protected
export const addSongToPlaylist = async (req, res) => {
    try {
        const { songId } = req.body;

        if (!songId) {
            return res.status(400).json({
                success: false,
                message: 'Song ID is required'
            });
        }

        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: 'Playlist not found'
            });
        }

        // Check if user is the owner
        if (playlist.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to modify this playlist'
            });
        }

        // Check if song exists
        const song = await Song.findById(songId);
        if (!song) {
            return res.status(404).json({
                success: false,
                message: 'Song not found'
            });
        }

        // Check if song is already in playlist
        if (playlist.songs.includes(songId)) {
            return res.status(400).json({
                success: false,
                message: 'Song already in playlist'
            });
        }

        playlist.songs.push(songId);
        await playlist.save();

        const updatedPlaylist = await Playlist.findById(playlist._id).populate('songs');

        res.status(200).json({
            success: true,
            message: 'Song added to playlist',
            data: updatedPlaylist
        });

    } catch (error) {
        console.error('Error adding song to playlist:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add song to playlist',
            error: error.message
        });
    }
};

// @desc    Remove song from playlist
// @route   DELETE /api/playlists/:id/songs/:songId
// @access  Protected
export const removeSongFromPlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: 'Playlist not found'
            });
        }

        // Check if user is the owner
        if (playlist.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to modify this playlist'
            });
        }

        playlist.songs = playlist.songs.filter(
            song => song.toString() !== req.params.songId
        );

        await playlist.save();

        const updatedPlaylist = await Playlist.findById(playlist._id).populate('songs');

        res.status(200).json({
            success: true,
            message: 'Song removed from playlist',
            data: updatedPlaylist
        });

    } catch (error) {
        console.error('Error removing song from playlist:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove song from playlist',
            error: error.message
        });
    }
};

// @desc    Delete playlist
// @route   DELETE /api/playlists/:id
// @access  Protected
export const deletePlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: 'Playlist not found'
            });
        }

        // Check if user is the owner
        if (playlist.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this playlist'
            });
        }

        await playlist.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Playlist deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting playlist:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete playlist',
            error: error.message
        });
    }
};
