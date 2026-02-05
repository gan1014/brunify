import React, { useRef, useState, useEffect } from 'react';
import { usePlayerStore, useAuthStore } from '../store/store';

const CircularGallery = ({ items = [] }) => {
    const { setQueue } = usePlayerStore();
    const { toggleFavorite, isSongLiked } = useAuthStore();
    const containerRef = useRef(null);
    const [rotation, setRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startRotation, setStartRotation] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);

    const radius = 300; // Radius of the circle
    const itemWidth = 200;
    const itemHeight = 280;

    // Calculate positions
    const getCardStyle = (index, totalItems) => {
        const theta = (2 * Math.PI) / totalItems;
        const angle = theta * index + (rotation * Math.PI) / 180;

        const x = radius * Math.sin(angle);
        const z = radius * Math.cos(angle);
        const y = 0; // Keep same vertical level

        const scale = (z + radius * 2) / (radius * 2);
        const opacity = (z + radius) / (2 * radius) + 0.2;

        return {
            transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${angle * (180 / Math.PI)}deg)`,
            opacity: Math.max(0.1, opacity),
            zIndex: Math.floor(z),
        };
    };

    const handleWheel = (e) => {
        setRotation(prev => prev - e.deltaY * 0.1);
    };

    const handleMouseUp = (e) => {
        setIsDragging(false);
    };

    const wasDraggingRef = useRef(false);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX);
        setStartRotation(rotation);
        wasDraggingRef.current = false;
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const deltaX = e.pageX - startX;
        if (Math.abs(deltaX) > 5) {
            wasDraggingRef.current = true;
        }
        setRotation(startRotation + deltaX * 0.5);
    };

    const handleCardClick = (item, index, e) => {
        e.stopPropagation();
        if (!wasDraggingRef.current) {
            setQueue(items, index);
        }
    };

    const handleLike = (e, songId) => {
        e.stopPropagation();
        toggleFavorite(songId);
    }

    return (
        <div
            className="relative h-[600px] w-full overflow-hidden flex items-center justify-center perspective-1000"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
        >
            <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
                {items.map((item, index) => {
                    const style = getCardStyle(index, items.length);
                    const isLiked = isSongLiked(item._id);

                    return (
                        <div
                            key={item._id || index}
                            className="absolute bg-neutral-900 rounded-xl overflow-hidden shadow-2xl cursor-pointer transition-transform duration-100 border border-white/10 group"
                            style={{
                                width: `${itemWidth}px`,
                                height: `${itemHeight}px`,
                                ...style,
                                left: `calc(50% - ${itemWidth / 2}px)`,
                                top: `calc(50% - ${itemHeight / 2}px)`,
                            }}
                            onClick={(e) => handleCardClick(item, index, e)}
                        >
                            <div
                                className="w-full h-[70%] bg-cover bg-center relative"
                                style={{ backgroundImage: `url(${item.coverImageUrl || item.coverImage || 'https://via.placeholder.com/200'})` }}
                            >
                                <button
                                    onClick={(e) => handleLike(e, item._id)}
                                    className={`absolute top-2 right-2 size-8 rounded-full flex items-center justify-center transition-all bg-black/40 backdrop-blur-md ${isLiked ? 'text-primary' : 'text-white/60 hover:text-white'
                                        }`}
                                >
                                    <span className={`material-symbols-outlined text-sm ${isLiked ? 'filled-icon' : ''}`}>
                                        {isLiked ? 'favorite' : 'favorite'}
                                    </span>
                                </button>
                            </div>
                            <div className="p-4 bg-black/80 h-[30%] flex flex-col justify-center">
                                <h3 className="text-white font-bold truncate">{item.title || item.name}</h3>
                                <p className="text-white/60 text-sm truncate">{item.artist || item.owner?.username}</p>
                            </div>

                            {/* Hover Overlay */}
                            <div
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                onClick={(e) => handleCardClick(item, index, e)}
                            >
                                <div className="bg-green-500 rounded-full p-3 shadow-xl transform scale-0 group-hover:scale-100 transition-transform">
                                    <span className="material-symbols-outlined text-black filled-icon">play_arrow</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Instructional Overlay */}
            <div className="absolute bottom-10 text-white/20 text-sm font-bold tracking-widest pointer-events-none select-none">
                DRAG OR SCROLL TO ROTATE
            </div>
        </div>
    );
};

export default CircularGallery;
