import React, { useState, useEffect } from 'react';
import { playlistAPI } from '../services/api';
import { Link } from 'react-router-dom';

const Library = () => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            const response = await playlistAPI.getUserPlaylists();
            setPlaylists(response.data.data);
        } catch (error) {
            console.error('Error fetching playlists:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 p-4 lg:p-8 text-white overflow-y-auto bg-gradient-to-b from-background-dark via-background-dark to-black h-full pb-40">
            <h2 className="text-2xl lg:text-4xl font-black mb-6 lg:mb-8">Your Library</h2>

            <div className="mb-8 overflow-x-auto custom-scrollbar">
                <div className="flex gap-3 lg:gap-4 min-w-max pb-2">
                    <button className="px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-xs lg:text-sm font-bold">
                        Playlists
                    </button>
                    <button className="px-4 py-2 bg-transparent rounded-full hover:bg-white/10 transition-colors text-xs lg:text-sm font-bold disabled:opacity-50">
                        Albums
                    </button>
                    <button className="px-4 py-2 bg-transparent rounded-full hover:bg-white/10 transition-colors text-xs lg:text-sm font-bold disabled:opacity-50">
                        Artists
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin material-symbols-outlined text-4xl text-primary">
                        refresh
                    </div>
                </div>
            ) : playlists.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {/* Like Songs Card (Static for now) */}
                    <div className="col-span-2 aspect-[2/1] bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-lg p-6 flex flex-col justify-end group cursor-pointer hover:shadow-lg transition-all">
                        <h3 className="text-3xl font-bold mb-2">Liked Songs</h3>
                        <p className="text-white/70 font-medium">0 liked songs</p>
                        <div className="absolute right-6 bottom-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <div className="size-12 bg-green-500 rounded-full flex items-center justify-center shadow-xl">
                                <span className="material-symbols-outlined text-black fill-current">play_arrow</span>
                            </div>
                        </div>
                    </div>

                    {playlists.map((playlist) => (
                        <div key={playlist._id} className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer">
                            <div className="aspect-square bg-neutral-800 rounded-md mb-4 overflow-hidden relative shadow-lg">
                                {playlist.coverImage ? (
                                    <img src={playlist.coverImage} alt={playlist.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl text-neutral-500">music_note</span>
                                    </div>
                                )}
                            </div>
                            <h4 className="font-bold truncate mb-1">{playlist.name}</h4>
                            <p className="text-sm text-neutral-400 truncate">By {playlist.owner?.username || 'You'}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="p-10 inline-block bg-white/5 rounded-2xl mb-6">
                        <span className="material-symbols-outlined text-6xl text-white/20">library_music</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Create your first playlist</h3>
                    <p className="text-white/60 mb-6">It's easy, we'll help you.</p>
                    <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
                        Create Playlist
                    </button>
                </div>
            )}
        </div>
    );
};

export default Library;
