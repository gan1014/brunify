import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username, email, and password'
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: userExists.email === email ? 'Email already registered' : 'Username already taken'
            });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                isPremium: user.isPremium,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to register user',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user (include password for comparison)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                isPremium: user.isPremium,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to login',
            error: error.message
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Protected
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('favoritesSongs')
            .populate('playlists');

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
            error: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Protected
export const updateProfile = async (req, res) => {
    try {
        const { username, email, profileImage } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields
        if (username) user.username = username;
        if (email) user.email = email;
        if (profileImage) user.profileImage = profileImage;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
};

// @desc    Toggle favorite song
// @route   PUT /api/auth/profile/favorites/:songId
// @access  Protected
export const toggleFavoriteSong = async (req, res) => {
    try {
        const { songId } = req.params;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if song is already in favorites
        const isFavorite = user.favoritesSongs.some(id => id.toString() === songId);

        if (isFavorite) {
            // Remove from favorites
            user.favoritesSongs = user.favoritesSongs.filter(
                id => id.toString() !== songId
            );
        } else {
            // Add to favorites
            user.favoritesSongs.push(songId);
        }

        await user.save();

        // Return updated favorites list
        const updatedUser = await User.findById(req.user._id)
            .populate('favoritesSongs')
            .populate('playlists');

        res.status(200).json({
            success: true,
            message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
            data: updatedUser.favoritesSongs,
            isFavorite: !isFavorite
        });

    } catch (error) {
        console.error('Toggle favorite error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle favorite',
            error: error.message
        });
    }
};

