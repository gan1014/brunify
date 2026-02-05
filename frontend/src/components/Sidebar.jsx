import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore, useUIStore, usePlaylistStore } from '../store/store';

const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const { playlists, fetchUserPlaylists } = usePlaylistStore();

    useEffect(() => {
        if (user) {
            fetchUserPlaylists();
        }
    }, [user, fetchUserPlaylists]);

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', icon: 'home', label: 'Home' },
        { path: '/search', icon: 'search', label: 'Search' },
        { path: '/library', icon: 'library_music', label: 'Your Library' },
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-black/40 border-r border-white/5 flex flex-col justify-between p-6">
            <div className="space-y-8">
                {/* Logo */}
                <div className="flex flex-col gap-1 px-2">
                    <h1 className="text-white text-xl font-bold tracking-tight flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-3xl filled-icon">graphic_eq</span>
                        Brunify
                    </h1>
                    <p className="text-primary text-xs font-semibold tracking-widest uppercase opacity-80">
                        Premium Audio
                    </p>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                                ? 'bg-primary/10 text-primary'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className={`material-symbols-outlined ${isActive(item.path) ? 'filled-icon' : ''}`}>
                                {item.icon}
                            </span>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Playlists */}
                <div className="pt-4 flex-1 overflow-y-auto">
                    <div className="px-4 mb-2 flex items-center justify-between group">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">
                            Playlists
                        </p>
                        <button
                            onClick={() => useUIStore.getState().setShowCreatePlaylistModal(true)}
                            className="text-white/40 hover:text-white transition-colors"
                            title="Create Playlist"
                        >
                            <span className="material-symbols-outlined text-xl">add</span>
                        </button>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Link
                            to="/liked-songs"
                            className="px-4 py-2 text-sm text-white/60 hover:text-white truncate flex items-center gap-3 group"
                        >
                            <div className="size-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-sm flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-white text-[10px] filled-icon">favorite</span>
                            </div>
                            Liked Songs
                        </Link>
                        {playlists.length === 0 ? (
                            <div className="px-4 py-4 text-center">
                                <p className="text-xs text-zinc-500 mb-2">No playlists yet</p>
                                <button
                                    onClick={() => useUIStore.getState().setShowCreatePlaylistModal(true)}
                                    className="text-xs bg-white text-black px-3 py-1 rounded-full font-bold hover:scale-105 transition-transform"
                                >
                                    Create One
                                </button>
                            </div>
                        ) : (
                            playlists.map((playlist) => (
                                <Link
                                    key={playlist._id}
                                    to={`/playlist/${playlist._id}`}
                                    className="px-4 py-2 text-sm text-white/60 hover:text-white truncate block"
                                >
                                    {playlist.name}
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* User Actions */}
            <div className="space-y-4">
                {/* Admin Upload Button */}
                {user?.role === 'admin' && (
                    <Link
                        to="/upload"
                        className="w-full py-3 px-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined filled-icon">upload</span>
                        Upload Song
                    </Link>
                )}

                {/* Upgrade Button - Only for non-premium users */}
                {user && !user.isPremium && (
                    <button className="w-full py-3 px-4 bg-primary text-black font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-xl filled-icon">bolt</span>
                        Upgrade to Pro
                    </button>
                )}

                {/* Login / Logout */}
                {user ? (
                    <button
                        onClick={logout}
                        className="w-full py-3 px-4 border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Logout
                    </button>
                ) : (
                    <Link
                        to="/login"
                        className="w-full py-3 px-4 bg-white text-black font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">login</span>
                        Login
                    </Link>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
