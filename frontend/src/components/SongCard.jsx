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
        <div className="group bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all cursor-pointer relative">
            <div className="relative aspect-square mb-4 overflow-hidden rounded-lg shadow-2xl">
                <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${song.coverImageUrl || song.coverImage})` }}
                />

                {/* Hover Play Button */}
                <button
                    onClick={handlePlay}
                    className="absolute bottom-2 right-2 size-12 bg-primary rounded-full shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all flex items-center justify-center text-black hover:scale-110 active:scale-95 z-10"
                >
                    <span className="material-symbols-outlined filled-icon">play_arrow</span>
                </button>

                {/* Always visible or hover-only Like Button? Let's do hover-only or visible if liked */}
                <button
                    onClick={handleLike}
                    className={`absolute top-2 right-2 size-10 rounded-full flex items-center justify-center transition-all ${isLiked ? 'opacity-100 text-primary scale-110' : 'opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 text-white/70 hover:text-white hover:scale-110'
                        }`}
                >
                    <span className={`material-symbols-outlined ${isLiked ? 'filled-icon' : ''}`}>
                        {isLiked ? 'favorite' : 'favorite'}
                    </span>
                </button>
            </div>
            <p className="font-bold text-white truncate">{song.title}</p>
            <p className="text-sm text-white/50 truncate">{song.artist}</p>
        </div>
    );
};

export default SongCard;
