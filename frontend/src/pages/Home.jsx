import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { songAPI } from '../services/api';
import SongCard from '../components/SongCard';
import CircularGallery from '../components/CircularGallery';
import { usePlayerStore } from '../store/store';
import toast from 'react-hot-toast';

const Home = () => {
    const [recentSongs, setRecentSongs] = useState([]);
    const [allSongs, setAllSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setQueue } = usePlayerStore();

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async (retries = 2) => {
        try {
            setLoading(true);
            const [recentResponse, allResponse] = await Promise.all([
                songAPI.getRecentSongs(6),
                songAPI.getAllSongs({ limit: 20 })
            ]);

            setRecentSongs(recentResponse.data?.data || []);
            setAllSongs(allResponse.data?.data || []);
        } catch (error) {
            if (retries > 0) {
                console.log(`Retrying fetch... (${retries} left)`);
                setTimeout(() => fetchSongs(retries - 1), 2000);
                return;
            }
            console.error('Error fetching songs:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Check your connection';
            toast.error(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayAll = () => {
        if (allSongs.length > 0) {
            setQueue(allSongs, 0);
            toast.success('Playing all songs');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin material-symbols-outlined text-primary text-6xl mb-4">
                        refresh
                    </div>
                    <p className="text-white/60">Loading your music...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-background-dark via-background-dark to-black scroll-smooth pb-40 lg:pb-32">
            {/* Hero Section */}
            <div className="p-4 lg:p-8">
                <div className="relative group h-64 lg:h-80 w-full overflow-hidden rounded-2xl">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{
                            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0) 60%), url("https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=1200&h=600&fit=crop")`
                        }}
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-10">
                        <div className="glass-effect w-fit px-3 py-1 rounded-full mb-3 lg:mb-4">
                            <span className="text-[10px] lg:text-xs font-bold tracking-widest uppercase text-white/80">Featured Playlist</span>
                        </div>
                        <h2 className="text-4xl lg:text-7xl font-black tracking-tighter mb-2 lg:mb-4 font-skull leading-none">
                            Sound from the Grave
                        </h2>
                        <p className="text-primary/60 max-w-lg text-sm lg:text-lg font-bold tracking-wide leading-relaxed mb-4 lg:mb-6 line-clamp-2 lg:line-clamp-none">
                            Experience the eternal collection of audio remains.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={handlePlayAll}
                                className="px-8 py-3 bg-primary text-black font-bold rounded-full hover:scale-105 transition-transform"
                            >
                                Play Now
                            </button>
                            <Link to="/search">
                                <button className="px-8 py-3 glass-effect text-white font-bold rounded-full hover:bg-white/10 transition-all border border-white/20">
                                    Explore
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recently Played Section (Circular Gallery) */}
            <section className="px-4 lg:px-8 mb-10 overflow-hidden">
                <div className="flex items-center justify-between mb-0 px-2">
                    <h3 className="text-xl lg:text-2xl font-bold tracking-tight z-10 relative">Recently Added</h3>
                    <Link to="/library" className="text-sm font-bold text-white/40 hover:text-primary transition-colors z-10 relative">
                        Show all
                    </Link>
                </div>

                {recentSongs.length === 0 ? (
                    <div className="text-center py-12 text-white/60">
                        <p className="text-lg">No songs available yet</p>
                        <p className="text-sm mt-2">Upload some music to get started!</p>
                    </div>
                ) : (
                    <div className="-mt-10">
                        <CircularGallery items={recentSongs} />
                    </div>
                )}
            </section>

            {/* Curated for You Section */}
            <section className="px-4 lg:px-8 pb-20 lg:pb-0">
                <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="text-xl lg:text-2xl font-bold tracking-tight">Featured Artists</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {allSongs.length > 0 ? (
                        // Get unique artists and their first song's cover as the artist image
                        Array.from(new Set(allSongs.map(s => s.artist))).slice(0, 6).map((artistName) => {
                            const artistSong = allSongs.find(s => s.artist === artistName);
                            return (
                                <Link
                                    to={`/search?q=${encodeURIComponent(artistName)}`}
                                    key={artistName}
                                    className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-2 pr-6 rounded-xl cursor-pointer transition-all group"
                                >
                                    <div
                                        className="size-20 rounded-lg bg-cover bg-center flex-shrink-0 shadow-lg"
                                        style={{ backgroundImage: `url(${artistSong?.coverImageUrl || artistSong?.coverImage || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop'})` }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold truncate group-hover:text-primary transition-colors">
                                            {artistName}
                                        </p>
                                        <p className="text-xs text-white/50 font-medium">Artist • Browse library</p>
                                    </div>
                                    <span className="material-symbols-outlined text-white/20 group-hover:text-primary transition-colors">
                                        arrow_forward_ios
                                    </span>
                                </Link>
                            );
                        })
                    ) : (
                        // Fallback placeholders if no songs yet
                        ['Harris Jayaraj', 'Vijay Antony', 'A.R. Rahman'].map((artist) => (
                            <Link
                                to={`/search?q=${encodeURIComponent(artist)}`}
                                key={artist}
                                className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-2 pr-6 rounded-xl cursor-pointer transition-all group"
                            >
                                <div className="size-20 rounded-lg bg-neutral-900 border border-white/5 flex items-center justify-center text-primary/20">
                                    <span className="material-symbols-outlined text-4xl filled-icon">skull</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold truncate group-hover:text-primary transition-colors">{artist}</p>
                                    <p className="text-xs text-white/50 font-medium">Discover more songs</p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
};

export default Home;
