import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Login from './pages/Login';
import Search from './pages/Search';
import Library from './pages/Library';
import VinylPlayer from './pages/VinylPlayer';
import LikedSongs from './pages/LikedSongs';

import AudioController from './components/AudioController';
import CreatePlaylistModal from './components/CreatePlaylistModal';
import Loader from './components/Loader';
import { useAuthStore } from './store/store';

// Protected Route wrapper
const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Layout wrapper for pages with sidebar and player
const Layout = ({ children }) => {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            {children}
            <Player />
        </div>
    );
};

function App() {
    const { isAuthenticated, user, setUser, setToken } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    setToken(token);
                    await useAuthStore.getState().fetchMe();
                } catch (error) {
                    console.error('Auth check failed:', error);
                    useAuthStore.getState().logout();
                }
            }
            // Simulate a minimum load time for branding experience
            setTimeout(() => setIsLoading(false), 1500);
        };

        checkAuth();
    }, [setToken]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <Router>
            <div className="App">
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#1a1a1a',
                            color: '#fff',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        },
                        success: {
                            iconTheme: {
                                primary: '#1db954',
                                secondary: '#fff',
                            },
                        },
                    }}
                />


                <CreatePlaylistModal />
                <AudioController />
                <Routes>
                    {/* Auth Route */}
                    <Route path="/login" element={<Login />} />

                    {/* Public Routes with Layout */}
                    <Route
                        path="/"
                        element={
                            <Layout>
                                <Home />
                            </Layout>
                        }
                    />

                    <Route
                        path="/search"
                        element={
                            <Layout>
                                <Search />
                            </Layout>
                        }
                    />

                    <Route
                        path="/library"
                        element={
                            <Layout>
                                <Library />
                            </Layout>
                        }
                    />

                    <Route
                        path="/liked-songs"
                        element={
                            <Layout>
                                <LikedSongs />
                            </Layout>
                        }
                    />

                    <Route path="/player" element={<VinylPlayer />} />

                    {/* Protected Routes */}
                    <Route
                        path="/upload"
                        element={
                            <ProtectedRoute requireAdmin={true}>
                                <Layout>
                                    <Upload />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Catch all - redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
