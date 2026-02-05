import React from 'react';
import { useAuthStore, usePlayerStore } from '../store/store';
import { Link } from 'react-router-dom';

const LikedSongs = () => {
    const { user, toggleFavorite } = useAuthStore();
    const { setQueue, isPlaying, togglePlay, currentSong } = usePlayerStore();

    const likedSongs = user?.favoritesSongs || [];

    const handlePlayAll = () => {
        if (likedSongs.length > 0) {
            setQueue(likedSongs, 0);
        }
    };

    const handleLikeToggle = (e, songId) => {
        e.stopPropagation();
        toggleFavorite(songId);
    };

    const handleSongClick = (index) => {
        setQueue(likedSongs, index);
    };

    // Helper to get random "lyric" lines for the aesthetic
    const getLyricalText = (song) => {
        if (song.lyrics) {
            // Get first line or first 50 chars
            const firstLine = song.lyrics.split('\n')[0];
            return firstLine.length > 50 ? firstLine.substring(0, 47) + "..." : firstLine;
        }
        const lines = [
            "THE TIME GOES ON, BUT LIFE IS SHORT",
            "MAYBE YOU WERE NOT THE ONE I WAS LOOKING FOR",
            "I'LL BE THERE FOREVER AND A DAY, ALWAYS",
            "DARLING, YOUR LOVE IS MORE THAN WORTH ITS WEIGHT",
            "SOMETIMES THE MUSIC IS THE ONLY MEDICINE",
            "LOST IN THE RHYTHM OF THE MIDNIGHT SKY"
        ];
        return lines[song.title.length % lines.length];
    };

    return (
        <main className="flex-1 bg-[#EBE9D7] overflow-hidden flex flex-col md:flex-row relative">
            {/* Left Decor Side - Large Disk */}
            <div className="hidden md:flex w-[40%] items-center justify-end relative pr-20">
                {/* Decorative border circle */}
                <div className="absolute right-[-100px] size-[700px] border border-[#A1A892] rounded-full opacity-40">
                    <div className="absolute top-1/4 left-0 size-3 bg-[#A1A892] rounded-full translate-x-[-1.5px]"></div>
                    <div className="absolute top-1/2 left-0 size-3 bg-[#A1A892] rounded-full translate-x-[-1.5px]"></div>
                </div>

                {/* Disc Container */}
                <div className="relative group">
                    <div className={`size-[600px] rounded-full bg-black shadow-[0_0_50px_rgba(0,0,0,0.3)] flex items-center justify-center relative z-10 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                        {/* Grooves */}
                        <div className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(#111_0,#111_2px,#222_3px)] opacity-50"></div>
                        {/* Center Art */}
                        <div
                            className="size-[35%] rounded-full border-8 border-black shadow-inner z-10 bg-cover bg-center"
                            style={{ backgroundImage: `url(${currentSong?.coverImageUrl || currentSong?.coverImage || 'https://via.placeholder.com/300'})` }}
                        />
                    </div>

                    {/* Play/Pause Controls Overlayed like image */}
                    <div className="absolute bottom-10 -right-10 flex gap-4 z-20">
                        <button
                            onClick={togglePlay}
                            className="size-16 bg-[#A1A892] text-white rounded-lg flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                        >
                            <span className="material-symbols-outlined text-4xl">
                                {isPlaying ? 'pause' : 'play_arrow'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Content Side - Song List */}
            <div className="flex-1 overflow-y-auto p-12 md:p-20 scrollbar-hide">
                <div className="max-w-xl">
                    <h1 className="text-4xl md:text-5xl font-black text-[#8A9578] mb-12 tracking-tighter decoration-[#8A9578] underline underline-offset-8">
                        PLAYLIST!
                    </h1>

                    <div className="space-y-8">
                        {likedSongs.length === 0 ? (
                            <div className="py-20 text-center">
                                <span className="material-symbols-outlined text-[#8A9578]/20 text-6xl mb-4">music_note</span>
                                <p className="text-[#8A9578] font-medium italic">Songs you like will appear here...</p>
                                <Link to="/" className="mt-8 inline-block px-10 py-3 border-2 border-[#8A9578] text-[#8A9578] rounded-full font-bold hover:bg-[#8A9578] hover:text-[#EBE9D7] transition-all">
                                    Browse Songs
                                </Link>
                            </div>
                        ) : (
                            likedSongs.map((song, index) => (
                                <div key={song._id} className="flex items-center gap-8 group">
                                    {/* Song Card */}
                                    <div
                                        onClick={() => handleSongClick(index)}
                                        className={`flex-shrink-0 w-80 bg-[#A1A892] rounded-[30px] p-4 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-transform shadow-lg ${currentSong?._id === song._id ? 'ring-4 ring-white/30' : ''}`}
                                    >
                                        <div
                                            className="size-20 rounded-2xl bg-cover bg-center shadow-md flex-shrink-0"
                                            style={{ backgroundImage: `url(${song.coverImageUrl || song.coverImage})` }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-bold text-lg truncate leading-tight">
                                                {song.title?.toLowerCase()}
                                            </p>
                                            <p className="text-white/70 text-sm font-medium truncate uppercase tracking-widest">
                                                {song.artist}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Aesthetic lyric text */}
                                    <div className="hidden lg:block max-w-[200px]">
                                        <p className="text-[10px] font-black leading-tight text-[#8A9578] opacity-80 uppercase tracking-tighter italic">
                                            "{getLyricalText(song)}"
                                        </p>
                                    </div>

                                    {/* Like toggle */}
                                    <button
                                        onClick={(e) => handleLikeToggle(e, song._id)}
                                        className="text-[#8A9578] hover:scale-125 transition-transform"
                                    >
                                        <span className="material-symbols-outlined filled-icon">favorite</span>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <Link to="/" className="absolute top-8 left-8 p-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors z-30 shadow-md md:bg-transparent md:text-[#8A9578] md:shadow-none">
                <span className="material-symbols-outlined">arrow_back</span>
            </Link>
        </main>
    );
};

export default LikedSongs;
