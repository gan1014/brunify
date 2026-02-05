import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { songAPI } from '../services/api';
import SongCard from '../components/SongCard';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryTerm = searchParams.get('q') || '';
    const [searchTerm, setSearchTerm] = useState(queryTerm);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);

    // Sync searchTerm with query parameter if it changes externally
    useEffect(() => {
        if (queryTerm !== searchTerm) {
            setSearchTerm(queryTerm);
        }
    }, [queryTerm]);

    // Simple debounce implementation inside useEffect
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.trim()) {
                handleSearch();
                // Update URL parameter
                setSearchParams({ q: searchTerm }, { replace: true });
            } else {
                setSongs([]);
                setSearchParams({}, { replace: true });
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSearch = async () => {
        try {
            setLoading(true);
            const response = await songAPI.getAllSongs({ search: searchTerm });
            setSongs(response.data.data);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 p-8 text-white overflow-y-auto bg-gradient-to-b from-background-dark via-background-dark to-black h-full">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-black mb-8">Search</h2>

                <div className="relative mb-12">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-black/50">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="What do you want to listen to?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 rounded-full bg-white text-black font-medium text-lg focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all"
                        autoFocus
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin material-symbols-outlined text-4xl text-primary">
                            refresh
                        </div>
                    </div>
                ) : songs.length > 0 ? (
                    <div>
                        <h3 className="text-2xl font-bold mb-6">Top Results</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {songs.map((song) => (
                                <SongCard key={song._id} song={song} />
                            ))}
                        </div>
                    </div>
                ) : searchTerm ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-white/60">No results found for "{searchTerm}"</p>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-6xl text-white/20 mb-4 block">
                            music_note
                        </span>
                        <p className="text-xl text-white/60">Search for songs, artists, or albums</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
