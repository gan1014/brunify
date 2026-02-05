import { create } from 'zustand';
import api from '../utils/api';

// Auth Store
export const useAuthStore = create((set, get) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),

    setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, isAuthenticated: true });
    },

    setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },

    toggleFavorite: async (songId) => {
        const { user } = get();
        if (!user) return;

        // Optimistic update
        const favorites = user.favoritesSongs || [];
        const isFavorite = favorites.some(song => {
            const id = typeof song === 'string' ? song : (song._id || song);
            return id.toString() === songId;
        });

        let newFavorites;
        if (isFavorite) {
            newFavorites = favorites.filter(song => {
                const id = typeof song === 'string' ? song : (song._id || song);
                return id.toString() !== songId;
            });
        } else {
            newFavorites = [...favorites, songId];
        }

        set({ user: { ...user, favoritesSongs: newFavorites } });

        try {
            const response = await api.put(`/auth/profile/favorites/${songId}`);
            // Update with the actual data from server (populated)
            set({ user: { ...user, favoritesSongs: response.data.data } });
            localStorage.setItem('user', JSON.stringify({ ...user, favoritesSongs: response.data.data }));
        } catch (error) {
            // Revert on error
            console.error('Failed to toggle favorite:', error);
            set({ user }); // Revert to old user state
        }
    },

    fetchMe: async () => {
        try {
            const response = await api.get('/auth/me');
            set({ user: response.data.data, isAuthenticated: true });
            localStorage.setItem('user', JSON.stringify(response.data.data));
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    },

    isSongLiked: (songId) => {
        if (!songId) return false;
        const state = get();
        const favorites = state.user?.favoritesSongs || [];
        return favorites.some(song => {
            const id = typeof song === 'string' ? song : (song._id || song);
            return id?.toString() === songId.toString();
        });
    }
}));

// Player Store
export const usePlayerStore = create((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: 0,
    volume: 70,
    repeat: false,
    shuffle: false,
    currentTime: 0,
    duration: 0,

    setCurrentSong: (song) => set({ currentSong: song, isPlaying: true }),

    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

    playNext: () => {
        const { queue, currentIndex, shuffle } = get();
        if (queue.length === 0) return;

        let nextIndex;
        if (shuffle) {
            nextIndex = Math.floor(Math.random() * queue.length);
        } else {
            nextIndex = (currentIndex + 1) % queue.length;
        }

        set({
            currentSong: queue[nextIndex],
            currentIndex: nextIndex,
            isPlaying: true
        });
    },

    playPrevious: () => {
        const { queue, currentIndex } = get();
        if (queue.length === 0) return;

        const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
        set({
            currentSong: queue[prevIndex],
            currentIndex: prevIndex,
            isPlaying: true
        });
    },

    setQueue: (songs, startIndex = 0) => set({
        queue: songs,
        currentIndex: startIndex,
        currentSong: songs[startIndex],
        isPlaying: true
    }),

    setVolume: (volume) => set({ volume }),
    setProgress: (time) => set({ currentTime: time }),
    setDuration: (duration) => set({ duration }),
    seekTime: null,
    setSeekTime: (time) => set({ seekTime: time }),
    resetSeekTime: () => set({ seekTime: null }),

    toggleRepeat: () => set((state) => ({ repeat: !state.repeat })),

    toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),

    clearQueue: () => set({
        currentSong: null,
        queue: [],
        currentIndex: 0,
        isPlaying: false
    }),
}));

// Playlist Store
export const usePlaylistStore = create((set, get) => ({
    playlists: [],
    loading: false,
    error: null,

    fetchUserPlaylists: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/playlists/my-playlists');
            set({ playlists: response.data.data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch playlists', loading: false });
        }
    },

    createPlaylist: async ({ name, description }) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('/playlists', { name, description });
            const newPlaylist = response.data.data;
            set((state) => ({
                playlists: [...state.playlists, newPlaylist],
                loading: false
            }));
            return newPlaylist;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to create playlist', loading: false });
            throw error;
        }
    },
}));

// UI Store
export const useUIStore = create((set) => ({
    showUploadModal: false,
    showCreatePlaylistModal: false,
    sidebarCollapsed: false,

    setShowUploadModal: (show) => set({ showUploadModal: show }),
    setShowCreatePlaylistModal: (show) => set({ showCreatePlaylistModal: show }),
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
