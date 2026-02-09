import React from 'react';
import { usePlayerStore, useAuthStore } from '../store/store';

const SongCard = ({ song }) => {
    const { setCurrentSong, setQueue, queue } = usePlayerStore();
    const { user, toggleFavorite, isSongLiked } = useAuthStore();

    const isLiked = isSongLiked(song._id);

    const handlePlay = (e) => {
        e.stopPropagation();
        // If song is not in queue, create a new queue with just this song
        if (!queue.find(s => s._id === song._id)) {
            setQueue([song], 0);
        } else {
            setCurrentSong(song);
        }
    };

    const handleLike = (e) => {
        e.stopPropagation();
        toggleFavorite(song._id);
    };

    return (
        <div
            className="group bg-white/5 p-3 lg:p-4 rounded-xl hover:bg-white/10 transition-all cursor-pointer relative"
            onClick={handlePlay}
        >
            <div className="relative aspect-square mb-3 lg:mb-4 overflow-hidden rounded-lg shadow-2xl">
                <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${song.coverImageUrl || song.coverImage})` }}
                />

                {/* Play Button - Visible on mobile if not group-hover */}
                <button
                    onClick={handlePlay}
                    className="absolute bottom-2 right-2 size-10 lg:size-12 bg-primary rounded-full shadow-lg opacity-100 lg:opacity-0 lg:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all flex items-center justify-center text-black hover:scale-110 active:scale-95 z-10"
                >
                    <span className="material-symbols-outlined filled-icon">play_arrow</span>
                </button>

                {/* Like Button */}
                <button
                    onClick={handleLike}
                    className={`absolute top-2 right-2 size-8 lg:size-10 rounded-full flex items-center justify-center transition-all bg-black/40 backdrop-blur-md lg:bg-transparent ${isLiked ? 'opacity-100 text-primary scale-110' : 'opacity-100 lg:opacity-0 lg:translate-y-[-10px] lg:group-hover:opacity-100 lg:group-hover:translate-y-0 text-white/70 hover:text-white hover:scale-110'
                        }`}
                >
                    <span className={`material-symbols-outlined text-sm lg:text-base ${isLiked ? 'filled-icon' : ''}`}>
                        {isLiked ? 'favorite' : 'favorite'}
                    </span>
                </button>
            </div>
            <p className="font-bold text-white truncate text-sm lg:text-base">{song.title}</p>
            <p className="text-[10px] lg:text-sm text-white/50 truncate uppercase tracking-widest font-bold lg:font-medium">{song.artist}</p>
        </div>
    );
};

export default SongCard;
