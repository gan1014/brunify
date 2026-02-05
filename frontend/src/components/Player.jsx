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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 pr-6 flex items-center gap-4 shadow-2xl min-w-[350px]">
                {/* Album Art (Overlapping) */}
                <div className="relative -mt-8 size-16 shrink-0">
                    <div className={`size-full rounded-full border-2 border-white/20 shadow-lg ${isPlaying ? 'animate-spin-slow' : ''}`}
                        style={{
                            backgroundImage: `url(${currentSong.coverImageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute inset-0 bg-black/20 rounded-full" />
                        <div className="absolute inset-0 m-auto size-4 bg-neutral-900 rounded-full border border-white/20" />
                    </div>
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center mr-2">
                    <p className="text-sm font-bold text-white truncate leading-tight">
                        {currentSong.title}
                    </p>
                    <p className="text-xs text-white/60 truncate">
                        {currentSong.artist}
                    </p>
                </div>

                {/* Progress Bar (Mini) */}
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={playPrevious}
                        className="text-white/70 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-2xl">skip_previous</span>
                    </button>

                    <button
                        onClick={togglePlay}
                        className="text-white hover:scale-105 transition-transform"
                    >
                        <span className="material-symbols-outlined text-3xl filled-icon">
                            {isPlaying ? 'play_arrow' : 'play_arrow'}
                        </span>
                    </button>

                    <button
                        onClick={playNext}
                        className="text-white/70 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-2xl">skip_next</span>
                    </button>

                    {/* Like Button */}
                    <button
                        className={`transition-colors ml-2 ${isLiked ? 'text-primary' : 'text-white/50 hover:text-primary'}`}
                        onClick={() => toggleFavorite(currentSong._id)}
                    >
                        <span className="material-symbols-outlined text-xl">{isLiked ? 'favorite' : 'favorite_border'}</span>
                    </button>

                    <Link to="/player">
                        <button className="text-white/50 hover:text-white transition-colors ml-1">
                            <span className="material-symbols-outlined text-xl">open_in_full</span>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Player;
