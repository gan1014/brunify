import api from '../utils/api';

// Song API
export const songAPI = {
    // Get all songs
    getAllSongs: (params = {}) => api.get('/songs', { params }),

    // Get recent songs
    getRecentSongs: (limit = 12) => api.get('/songs/recent', { params: { limit } }),

    // Get song by ID
    getSongById: (id) => api.get(`/songs/${id}`),

    // Upload song
    uploadSong: (formData) => api.post('/songs/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),

    // Increment play count
    incrementPlayCount: (id) => api.put(`/songs/${id}/play`),

    // Delete song
    deleteSong: (id) => api.delete(`/songs/${id}`),
};

// Auth API
export const authAPI = {
    // Register
    register: (data) => api.post('/auth/register', data),

    // Login
    login: (data) => api.post('/auth/login', data),

    // Get current user
    getMe: () => api.get('/auth/me'),

    // Update profile
    updateProfile: (data) => api.put('/auth/profile', data),
};

// Playlist API
export const playlistAPI = {
    // Get all playlists
    getAllPlaylists: (params = {}) => api.get('/playlists', { params }),

    // Get user's playlists
    getUserPlaylists: () => api.get('/playlists/my-playlists'),

    // Get playlist by ID
    getPlaylistById: (id) => api.get(`/playlists/${id}`),

    // Create playlist
    createPlaylist: (data) => api.post('/playlists', data),

    // Add song to playlist
    addSongToPlaylist: (playlistId, songId) =>
        api.put(`/playlists/${playlistId}/songs`, { songId }),

    // Remove song from playlist
    removeSongFromPlaylist: (playlistId, songId) =>
        api.delete(`/playlists/${playlistId}/songs/${songId}`),

    // Delete playlist
    deletePlaylist: (id) => api.delete(`/playlists/${id}`),
};

export default {
    songAPI,
    authAPI,
    playlistAPI,
};
