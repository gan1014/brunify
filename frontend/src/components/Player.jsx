import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlayerStore, useAuthStore } from '../store/store';
import { songAPI } from '../services/api';

const Player = () => {
    const {
        currentSong,
        isPlaying,
        playNext,
        playPrevious,
        togglePlay,
        currentTime,
        duration,
    } = usePlayerStore();

    const { user, toggleFavorite, isSongLiked } = useAuthStore();
    const isLiked = isSongLiked(currentSong?._id);

    // Audio control logic moved to AudioController.jsx

    // Seek to position - Need to communicate directly with audio element or use logic in store?
    // Ideally we shouldn't access DOM directly from two places.
    // For now, let's just make the UI look right, seeking is tricky with headless audio.
    // We can add a seekTo method in store that AudioController listens to, 
    // OR AudioController can expose a ref via Context (overkill).
    // Let's implement setSeekTime in store.

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const time = percent * duration;
        setSeekTime(time);
    };

    // Format time
    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!currentSong) return null;

    const progress = (currentTime / duration) * 100 || 0;

    return (
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up w-[calc(100%-2rem)] lg:w-auto">
            <div className="bg-black/80 backdrop-blur-2xl border border-white/5 rounded-2xl p-2 lg:p-3 pr-4 lg:pr-6 flex items-center gap-3 lg:gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-[500px] mx-auto">
                {/* Album Art (Overlapping) */}
                <div className="relative -mt-8 lg:-mt-10 size-12 lg:size-16 shrink-0">
                    <div className={`size-full rounded-full border-2 border-white/5 shadow-[0_0_20px_rgba(255,255,255,0.1)] ${isPlaying ? 'animate-spin-slow' : ''}`}
                        style={{
                            backgroundImage: `url(${currentSong.coverImageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute inset-0 bg-black/40 rounded-full" />
                        <div className="absolute inset-0 m-auto size-3 lg:size-4 bg-primary rounded-full border border-black/20" />
                    </div>
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-xs lg:text-sm font-bold text-primary truncate leading-tight">
                        {currentSong.title}
                    </p>
                    <p className="text-[8px] lg:text-[10px] text-primary/40 truncate uppercase tracking-widest font-bold">
                        {currentSong.artist}
                    </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2 lg:gap-3">
                    <button
                        onClick={playPrevious}
                        className="text-primary/40 hover:text-primary transition-colors hidden sm:block"
                    >
                        <span className="material-symbols-outlined text-xl lg:text-2xl">skip_previous</span>
                    </button>

                    <button
                        onClick={togglePlay}
                        className="text-primary hover:scale-110 transition-transform flex items-center justify-center p-1.5 lg:p-2 rounded-full bg-white/5"
                    >
                        <span className="material-symbols-outlined text-2xl lg:text-3xl filled-icon">
                            {isPlaying ? 'pause' : 'play_arrow'}
                        </span>
                    </button>

                    <button
                        onClick={playNext}
                        className="text-primary/40 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-xl lg:text-2xl">skip_next</span>
                    </button>

                    <div className="flex items-center gap-1 ml-1 lg:ml-2">
                        {/* Like Button */}
                        <button
                            className={`transition-colors ${isLiked ? 'text-primary' : 'text-primary/20 hover:text-primary'}`}
                            onClick={() => toggleFavorite(currentSong._id)}
                        >
                            <span className="material-symbols-outlined text-lg lg:text-xl">{isLiked ? 'favorite' : 'favorite_border'}</span>
                        </button>

                        <Link to="/player">
                            <button className="text-primary/20 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-lg lg:text-xl">open_in_full</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Progress Bar (Mini) */}
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Player;
