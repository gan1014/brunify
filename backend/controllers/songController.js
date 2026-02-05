import Song from '../models/Song.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

// @desc    Upload a new song
// @route   POST /api/songs/upload
// @access  Protected (Admin)
export const uploadSong = async (req, res) => {
    try {
        const { title, artist, album, genre, year, lyrics } = req.body;

        // Validate required fields
        if (!title || !artist) {
            return res.status(400).json({
                success: false,
                message: 'Title and artist are required'
            });
        }

        // Check if audio file is provided
        if (!req.files || !req.files.audio || req.files.audio.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Audio file is required'
            });
        }

        const audioFile = req.files.audio[0];

        console.log('📤 Uploading audio to Cloudinary...');
        console.log('File details:', {
            originalname: audioFile.originalname,
            mimetype: audioFile.mimetype,
            size: `${(audioFile.size / 1024 / 1024).toFixed(2)} MB`
        });

        // Upload audio to Cloudinary using upload_stream
        const audioUploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto', // Use 'auto' to let Cloudinary detect it
                    folder: 'spotify_clone/songs',
                    // format: 'mp3', // Removed strict format to avoid conflicts
                    transformation: [
                        { quality: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) {
                        console.error('❌ Cloudinary Upload Error Details:', JSON.stringify(error, null, 2));
                        reject(error);
                    } else {
                        console.log('✅ Audio uploaded successfully:', result.secure_url);
                        resolve(result);
                    }
                }
            );

            // Handle stream errors directly
            uploadStream.on('error', (error) => {
                console.error('❌ Cloudinary stream failure:', error);
                reject(error);
            });

            // Convert buffer to stream and pipe to Cloudinary
            const bufferStream = new Readable();
            bufferStream.on('error', (error) => {
                console.error('❌ Buffer stream error:', error);
                reject(error);
            });

            bufferStream.push(audioFile.buffer);
            bufferStream.push(null);
            bufferStream.pipe(uploadStream);
        });

        const audioResult = await audioUploadPromise;

        // Upload cover image if provided
        let coverImageUrl = 'https://via.placeholder.com/300x300.png?text=No+Cover';
        let coverImagePublicId = null;

        if (req.files && req.files.coverImage && req.files.coverImage.length > 0) {
            const coverFile = req.files.coverImage[0];

            console.log('📤 Uploading cover image to Cloudinary...');

            const coverUploadPromise = new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        folder: 'spotify_clone/covers',
                        transformation: [
                            { width: 500, height: 500, crop: 'fill' },
                            { quality: 'auto' }
                        ]
                    },
                    (error, result) => {
                        if (error) {
                            console.error('❌ Cloudinary cover callback error:', error);
                            reject(error);
                        } else resolve(result);
                    }
                );

                uploadStream.on('error', (error) => {
                    console.error('❌ Cloudinary cover stream error:', error);
                    reject(error);
                });

                const bufferStream = new Readable();
                bufferStream.on('error', (error) => {
                    console.error('❌ Buffer cover stream error:', error);
                    reject(error);
                });

                bufferStream.push(coverFile.buffer);
                bufferStream.push(null);
                bufferStream.pipe(uploadStream);
            });

            const coverResult = await coverUploadPromise;
            coverImageUrl = coverResult.secure_url;
            coverImagePublicId = coverResult.public_id;

            console.log('✅ Cover image uploaded successfully');
        }

        // Get audio duration from Cloudinary response
        const duration = audioResult.duration ? Math.round(audioResult.duration) : 0;

        // Create song document in MongoDB
        const song = await Song.create({
            title,
            artist,
            album: album || 'Unknown Album',
            genre: genre || 'Unknown',
            year: year ? parseInt(year) : null,
            audioUrl: audioResult.secure_url,
            audioPublicId: audioResult.public_id,
            coverImageUrl,
            coverImagePublicId,
            duration,
            lyrics: lyrics || '',
            uploadedBy: req.user ? req.user._id : null
        });

        console.log('✅ Song saved to database:', song._id);

        res.status(201).json({
            success: true,
            message: 'Song uploaded successfully',
            data: song
        });

    } catch (error) {
        console.error('❌ Error uploading song:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload song',
            error: error.message
        });
    }
};

// @desc    Get all songs
// @route   GET /api/songs
// @access  Public
export const getAllSongs = async (req, res) => {
    try {
        const {
            search,
            genre,
            artist,
            sort = '-createdAt',
            page = 1,
            limit = 20
        } = req.query;

        // Build query
        let query = {};

        // Search by title, artist, or album
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { artist: { $regex: search, $options: 'i' } },
                { album: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by genre
        if (genre) {
            query.genre = genre;
        }

        // Filter by artist
        if (artist) {
            query.artist = { $regex: artist, $options: 'i' };
        }

        // Execute query with pagination
        const songs = await Song.find(query)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        // Get total count for pagination
        const count = await Song.countDocuments(query);

        res.status(200).json({
            success: true,
            data: songs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch songs',
            error: error.message
        });
    }
};

// @desc    Get single song by ID
// @route   GET /api/songs/:id
// @access  Public
export const getSongById = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);

        if (!song) {
            return res.status(404).json({
                success: false,
                message: 'Song not found'
            });
        }

        res.status(200).json({
            success: true,
            data: song
        });

    } catch (error) {
        console.error('Error fetching song:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch song',
            error: error.message
        });
    }
};

// @desc    Increment play count
// @route   PUT /api/songs/:id/play
// @access  Public
export const incrementPlayCount = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);

        if (!song) {
            return res.status(404).json({
                success: false,
                message: 'Song not found'
            });
        }

        await song.incrementPlayCount();

        res.status(200).json({
            success: true,
            data: song
        });

    } catch (error) {
        console.error('Error updating play count:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update play count',
            error: error.message
        });
    }
};

// @desc    Delete a song
// @route   DELETE /api/songs/:id
// @access  Protected (Admin)
export const deleteSong = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);

        if (!song) {
            return res.status(404).json({
                success: false,
                message: 'Song not found'
            });
        }

        // Delete audio from Cloudinary
        if (song.audioPublicId) {
            await cloudinary.uploader.destroy(song.audioPublicId, { resource_type: 'video' });
        }

        // Delete cover image from Cloudinary
        if (song.coverImagePublicId) {
            await cloudinary.uploader.destroy(song.coverImagePublicId);
        }

        await song.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Song deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting song:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete song',
            error: error.message
        });
    }
};

// @desc    Get recently played songs
// @route   GET /api/songs/recent
// @access  Public
export const getRecentSongs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 12;

        const songs = await Song.find()
            .sort({ playCount: -1, createdAt: -1 })
            .limit(limit)
            .lean();

        res.status(200).json({
            success: true,
            data: songs
        });

    } catch (error) {
        console.error('Error fetching recent songs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent songs',
            error: error.message
        });
    }
};
