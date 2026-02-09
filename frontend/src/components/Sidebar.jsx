import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore, useUIStore, usePlaylistStore } from '../store/store';

const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const { playlists, fetchUserPlaylists } = usePlaylistStore();
    const { sidebarCollapsed, toggleSidebar } = useUIStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50 flex items-center justify-around p-3 glass-effect rounded-2xl border border-white/10 shadow-2xl">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className={`flex flex-col items-center gap-1 transition-all ${isActive(item.path) ? 'text-primary scale-110' : 'text-white/60'}`}
                    >
                        <span className={`material-symbols-outlined text-2xl ${isActive(item.path) ? 'filled-icon' : ''}`}>
                            {item.icon}
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-widest">{item.label.split(' ')[0]}</span>
                    </Link>
                ))}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className={`flex flex-col items-center gap-1 transition-all ${isMobileMenuOpen ? 'text-primary' : 'text-white/60'}`}
                >
                    <span className="material-symbols-outlined text-2xl">
                        {isMobileMenuOpen ? 'close' : 'menu'}
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-widest">Menu</span>
                </button>
            </div>

            {/* Mobile Full Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-[49] bg-black/95 backdrop-blur-xl animate-fadeIn p-8 flex flex-col pt-20">
                    <div className="flex flex-col gap-1 mb-12">
                        <h1 className="text-white text-4xl font-bold tracking-tight flex items-center gap-3 font-skull">
                            <span className="material-symbols-outlined text-primary text-5xl filled-icon">skull</span>
                            Brunify
                        </h1>
                        <p className="text-primary/60 text-xs font-bold tracking-[0.2em] uppercase pl-1">
                            Audio Remains
                        </p>
                    </div>

                    <div className="space-y-8 overflow-y-auto pb-40 custom-scrollbar">
                        {/* Mobile Playlists Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                    Your Playlists
                                </p>
                                <button
                                    onClick={() => {
                                        useUIStore.getState().setShowCreatePlaylistModal(true);
                                        closeMobileMenu();
                                    }}
                                    className="text-primary"
                                >
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    to="/liked-songs"
                                    onClick={closeMobileMenu}
                                    className="bg-white/5 p-4 rounded-xl flex flex-col gap-3"
                                >
                                    <div className="size-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white text-xs filled-icon">favorite</span>
                                    </div>
                                    <span className="font-bold text-sm">Liked Songs</span>
                                </Link>
                                {playlists.map((playlist) => (
                                    <Link
                                        key={playlist._id}
                                        to={`/playlist/${playlist._id}`}
                                        onClick={closeMobileMenu}
                                        className="bg-white/5 p-4 rounded-xl flex flex-col gap-3"
                                    >
                                        <div className="size-8 bg-white/10 rounded-lg flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white text-xs">queue_music</span>
                                        </div>
                                        <span className="font-bold text-sm truncate">{playlist.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Actions */}
                        <div className="space-y-4">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                Quick Actions
                            </p>
                            <div className="flex flex-col gap-2">
                                {user?.role === 'admin' && (
                                    <Link
                                        to="/upload"
                                        onClick={closeMobileMenu}
                                        className="w-full py-4 px-6 bg-white/5 text-white font-bold rounded-2xl flex items-center gap-4"
                                    >
                                        <span className="material-symbols-outlined text-primary filled-icon">upload</span>
                                        Upload Song
                                    </Link>
                                )}
                                {user && !user.isPremium && (
                                    <button
                                        className="w-full py-4 px-6 bg-primary text-black font-bold rounded-2xl flex items-center gap-4"
                                    >
                                        <span className="material-symbols-outlined filled-icon">bolt</span>
                                        Upgrade to Pro
                                    </button>
                                )}
                                {user ? (
                                    <button
                                        onClick={() => {
                                            logout();
                                            closeMobileMenu();
                                        }}
                                        className="w-full py-4 px-6 border border-white/10 text-white font-bold rounded-2xl flex items-center gap-4"
                                    >
                                        <span className="material-symbols-outlined">logout</span>
                                        Logout
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={closeMobileMenu}
                                        className="w-full py-4 px-6 bg-white text-black font-bold rounded-2xl flex items-center gap-4"
                                    >
                                        <span className="material-symbols-outlined">login</span>
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex flex-shrink-0 bg-black/40 border-r border-white/5 flex-col justify-between p-6 transition-all duration-300 relative ${sidebarCollapsed ? 'w-24' : 'w-64'}`}>
                {/* Collapse Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-10 size-6 bg-primary text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg z-50"
                >
                    <span className="material-symbols-outlined text-sm font-bold">
                        {sidebarCollapsed ? 'chevron_right' : 'chevron_left'}
                    </span>
                </button>

                <div className="space-y-8">
                    {/* Logo */}
                    <div className={`flex flex-col gap-1 px-2 ${sidebarCollapsed ? 'items-center' : ''}`}>
                        <h1 className="text-white text-3xl font-bold tracking-tight flex items-center gap-2 font-skull">
                            <span className="material-symbols-outlined text-primary text-4xl filled-icon">skull</span>
                            {!sidebarCollapsed && 'Brunify'}
                        </h1>
                        {!sidebarCollapsed && (
                            <p className="text-primary/60 text-[10px] font-bold tracking-[0.2em] uppercase pl-1">
                                Audio Remains
                            </p>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                title={sidebarCollapsed ? item.label : ''}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                    } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                            >
                                <span className={`material-symbols-outlined ${isActive(item.path) ? 'filled-icon' : ''}`}>
                                    {item.icon}
                                </span>
                                {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                            </Link>
                        ))}
                    </nav>

                    {/* Playlists */}
                    <div className={`pt-4 flex-1 overflow-y-auto ${sidebarCollapsed ? 'hidden' : 'block'}`}>
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
                <div className={`space-y-4 ${sidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
                    {/* Admin Upload Button */}
                    {user?.role === 'admin' && (
                        <Link
                            to="/upload"
                            title={sidebarCollapsed ? 'Upload Song' : ''}
                            className={`w-full py-3 px-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 ${sidebarCollapsed ? 'px-0 size-12' : ''}`}
                        >
                            <span className="material-symbols-outlined filled-icon">upload</span>
                            {!sidebarCollapsed && 'Upload Song'}
                        </Link>
                    )}

                    {/* Upgrade Button - Only for non-premium users */}
                    {user && !user.isPremium && (
                        <button
                            title={sidebarCollapsed ? 'Upgrade to Pro' : ''}
                            className={`w-full py-3 px-4 bg-primary text-black font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2 ${sidebarCollapsed ? 'px-0 size-12' : ''}`}
                        >
                            <span className="material-symbols-outlined text-xl filled-icon">bolt</span>
                            {!sidebarCollapsed && 'Upgrade to Pro'}
                        </button>
                    )}

                    {/* Login / Logout */}
                    {user ? (
                        <button
                            onClick={logout}
                            title={sidebarCollapsed ? 'Logout' : ''}
                            className={`w-full py-3 px-4 border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 ${sidebarCollapsed ? 'px-0 size-12' : ''}`}
                        >
                            <span className="material-symbols-outlined">logout</span>
                            {!sidebarCollapsed && 'Logout'}
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            title={sidebarCollapsed ? 'Login' : ''}
                            className={`w-full py-3 px-4 bg-white text-black font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2 ${sidebarCollapsed ? 'px-0 size-12' : ''}`}
                        >
                            <span className="material-symbols-outlined">login</span>
                            {!sidebarCollapsed && 'Login'}
                        </Link>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
