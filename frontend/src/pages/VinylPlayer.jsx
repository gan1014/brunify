import React, { useEffect, useState } from 'react';
import { usePlayerStore, useAuthStore } from '../store/store';
import { useNavigate, Link } from 'react-router-dom';
import { songAPI } from '../services/api';

const VinylPlayer = () => {
    const navigate = useNavigate();
    const {
        currentSong,
        isPlaying,
        togglePlay,
        playNext,
        playPrevious,
        currentTime,
        duration,
        shuffle,
        toggleShuffle,
        repeatMode,
        toggleRepeat
    } = usePlayerStore();

    const { toggleFavorite, isSongLiked } = useAuthStore();
    const isLiked = isSongLiked(currentSong?._id);

    // Format time helper
    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Parse LRC format lyrics: [mm:ss.xx] Lyric
    const parseLyrics = (rawLyrics) => {
        if (!rawLyrics) return { lines: [], hasTimestamps: false };
        const lines = rawLyrics.split('\n');
        let hasTimestamps = false;

        const parsed = lines.map(line => {
            const regex = /\[(\d+):(\d+\.?\d*)\](.*)/;
            const match = line.match(regex);
            if (match) {
                hasTimestamps = true;
                const minutes = parseInt(match[1]);
                const seconds = parseFloat(match[2]);
                const text = match[3].trim();
                return { time: minutes * 60 + seconds, text };
            }
            return { time: null, text: line.trim() };
        }).filter(item => item.text !== '');

        return {
            lines: hasTimestamps ? parsed.filter(l => l.time !== null).sort((a, b) => a.time - b.time) : parsed,
            hasTimestamps
        };
    };

    const [lyricsData, setLyricsData] = useState({ lines: [], hasTimestamps: false });
    const [activeLineIdx, setActiveLineIdx] = useState(-1);

    useEffect(() => {
        if (currentSong?.lyrics) {
            setLyricsData(parseLyrics(currentSong.lyrics));
        } else {
            setLyricsData({ lines: [], hasTimestamps: false });
        }
    }, [currentSong]);

    useEffect(() => {
        if (lyricsData.hasTimestamps) {
            const idx = lyricsData.lines.findIndex((line, i) => {
                const nextLine = lyricsData.lines[i + 1];
                return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
            });
            setActiveLineIdx(idx);
        }
    }, [currentTime, lyricsData]);

    if (!currentSong) {
        useEffect(() => navigate('/'), [navigate]);
        return null;
    }

    return (
        <div className="fixed inset-0 bg-[#060606] flex flex-col items-center z-50 overflow-hidden font-sans">
            {/* 1. Background Collage Layer */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center grayscale-[30%] contrast-[1.2] brightness-[0.4]"
                style={{ backgroundImage: `url('/player-bg.webp')` }}
            />

            {/* 2. Premium Design Elements (Native CSS) */}
            {/* Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] size-[600px] bg-emerald-500/10 rounded-full blur-[120px] z-0 animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] size-[500px] bg-indigo-500/10 rounded-full blur-[100px] z-0" />

            {/* Blueprint Grid / Dot Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Floating Decorative Elements (Unique Animated Aesthetic) */}
            <div className="absolute top-[15%] left-[5%] z-0 opacity-10 scale-[2.5] animate-float">
                <span className="material-symbols-outlined text-white text-9xl">headphones</span>
            </div>
            <div className="absolute top-[10%] right-[10%] z-0 opacity-[0.08] scale-[2] animate-sway">
                <span className="material-symbols-outlined text-white text-8xl">flutter_dash</span>
            </div>
            <div className="absolute bottom-[25%] left-[8%] z-0 opacity-[0.12] scale-[3] animate-pulse-slow">
                <span className="material-symbols-outlined text-white text-9xl">guitar</span>
            </div>
            <div className="absolute top-[40%] right-[15%] z-0 opacity-[0.05] scale-[4] animate-float-delayed">
                <span className="material-symbols-outlined text-white text-9xl">dark_mode</span>
            </div>
            <div className="absolute bottom-[10%] right-[5%] z-0 opacity-[0.1] scale-[2.2] animate-sway-delayed">
                <span className="material-symbols-outlined text-white text-9xl">favorite</span>
            </div>

            {/* Saturn Planet (Custom SVG for Unique Design) */}
            <div className="absolute top-[25%] right-[25%] z-0 opacity-[0.15] size-24 md:size-32 animate-rotate-slow">
                <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                    <circle cx="50" cy="50" r="18" />
                    <ellipse cx="50" cy="50" rx="40" ry="8" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(-20 50 50)" />
                </svg>
            </div>

            {/* Stars (Twinkling Cluster) */}
            <div className="absolute top-[5%] left-[30%] z-0 opacity-[0.3] scale-[0.5] animate-sparkle">
                <span className="material-symbols-outlined text-white text-2xl">star</span>
            </div>
            <div className="absolute top-[45%] left-[5%] z-0 opacity-[0.2] scale-[0.3] animate-sparkle-delayed">
                <span className="material-symbols-outlined text-white text-2xl">star</span>
            </div>
            <div className="absolute bottom-[40%] right-[30%] z-0 opacity-[0.25] scale-[0.4] animate-sparkle">
                <span className="material-symbols-outlined text-white text-2xl">star</span>
            </div>
            <div className="absolute top-[60%] right-[5%] z-0 opacity-[0.15] scale-[0.6] animate-sparkle-delayed">
                <span className="material-symbols-outlined text-white text-2xl">star</span>
            </div>
            <div className="absolute bottom-[60%] left-[40%] z-0 opacity-[0.2] scale-[0.4] animate-sparkle">
                <span className="material-symbols-outlined text-white text-2xl">star</span>
            </div>

            {/* 3. Immersive Vignette & Grain */}
            <div className="absolute inset-0 z-[1] opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/60 via-transparent to-black" />
            <div className="absolute inset-0 z-[2] shadow-[inset_0_0_200px_rgba(0,0,0,1)]" />

            {/* Top Navigation */}
            <div className="w-full max-w-lg flex items-center justify-between p-6 z-10">
                <button onClick={() => navigate(-1)} className="text-white/40 hover:text-white transition-all transform hover:scale-110">
                    <span className="material-symbols-outlined text-4xl">expand_more</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 px-8 py-4 flex-1 z-10">

                {/* Turntable Section (The "White Square") */}
                <div className="w-full max-w-md flex flex-col items-center">
                    {/* Turntable Card - STAINLESS STEEL LOOK */}
                    <div className="w-full aspect-square bg-[#e5e5e5] rounded-[48px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] p-8 relative overflow-hidden border-[10px] border-white/5">
                        {/* Realistic Details */}
                        <div className="absolute top-8 left-8 size-10 text-black/20">
                            <span className="material-symbols-outlined text-4xl">album</span>
                        </div>

                        {/* The Record */}
                        <div className={`size-full rounded-full bg-zinc-950 flex items-center justify-center relative shadow-2xl border-[16px] border-zinc-900 ${isPlaying ? 'animate-spin-slow' : 'animate-spin-paused'}`}>
                            {/* Grooves & Shine */}
                            <div className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle_at_center,#111_0,#111_1px,#222_2px)] opacity-80" />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent mix-blend-overlay" />

                            {/* Custom Label Area */}
                            <div className="size-[35%] rounded-full border-4 border-black/80 bg-cover bg-center relative z-10 shadow-lg overflow-hidden"
                                style={{ backgroundImage: `url(${currentSong.coverImageUrl || currentSong.coverImage})` }}>
                                <div className="absolute inset-0 bg-black/10" />
                                <div className="size-5 bg-zinc-800 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white/20 shadow-inner" />
                            </div>
                        </div>

                        {/* Tone Arm (THE STICK) - INTERACTIVE */}
                        <div
                            onClick={togglePlay}
                            className={`absolute top-0 right-10 h-72 w-12 z-30 origin-top cursor-pointer transform transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)
                                ${isPlaying ? 'rotate-[25deg] translate-x-4' : 'rotate-[-2deg] translate-x-1'}`}
                        >
                            {/* Metal Texture Stick */}
                            <div className="h-full w-2.5 mx-auto bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 rounded-full shadow-2xl relative">
                                {/* Stylus & Pivot */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 size-12 bg-[#222] rounded-full border-4 border-[#333] shadow-lg flex items-center justify-center">
                                    <div className="size-2 bg-zinc-600 rounded-full" />
                                </div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-20 bg-[#1a1a1a] rounded-sm shadow-2xl flex flex-col items-center justify-center border border-white/10">
                                    <div className="w-1.5 h-10 bg-zinc-400 rounded-full mb-1 opacity-50" />
                                    <div className="text-[8px] font-black text-white/20 tracking-tighter">STEREO</div>
                                </div>
                            </div>
                        </div>

                        {/* Status Lights */}
                        <div className="absolute bottom-12 left-12 flex items-center gap-4">
                            <div className={`size-3.5 rounded-full shadow-[0_0_15px] transition-all duration-700 ${isPlaying ? 'bg-emerald-500 shadow-emerald-500/80 scale-125' : 'bg-rose-500 shadow-rose-500/80 scale-100'}`} />
                            <div className="w-1.5 h-12 bg-zinc-300 rounded-full shadow-inner" />
                        </div>
                    </div>

                    {/* Meta Data */}
                    <div className="w-full mt-10 space-y-2 text-center lg:text-left px-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">{currentSong.title}</h1>
                            <button
                                onClick={() => toggleFavorite(currentSong._id)}
                                className={`text-5xl transition-all ${isLiked ? 'text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)] scale-110' : 'text-white/20 hover:text-white/50 hover:scale-110'}`}
                            >
                                <span className="material-symbols-outlined text-5xl filled-icon">{isLiked ? 'favorite' : 'favorite_border'}</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-4 opacity-70">
                            <p className="text-xl font-bold text-white/80">{currentSong.artist}</p>
                            <span className="px-3 py-1 bg-white/10 rounded-full text-[12px] font-black tracking-widest text-white/50 border border-white/20 uppercase">High-Fidelity</span>
                        </div>
                    </div>
                </div>

                {/* Lyrics Display Section */}
                <div className="w-full max-w-2xl h-[50vh] lg:h-[60vh] flex flex-col relative mask-lyrics-edges">
                    <div className="flex-1 overflow-y-auto custom-scrollbar-hidden py-16 px-8 space-y-12 scroll-smooth">
                        {lyricsData.lines.length > 0 ? (
                            lyricsData.lines.map((line, i) => {
                                if (lyricsData.hasTimestamps && i < activeLineIdx) return null;
                                const isActive = lyricsData.hasTimestamps && i === activeLineIdx;
                                return (
                                    <p
                                        key={i}
                                        className={`transition-all duration-1000 text-4xl md:text-6xl font-black leading-[1.15] tracking-tight transform
                                            ${isActive
                                                ? 'text-[#48bcb0] scale-[1.03] opacity-100 drop-shadow-[0_0_20px_rgba(72,188,176,0.5)]'
                                                : lyricsData.hasTimestamps
                                                    ? 'text-white/5 opacity-5 blur-[2px]'
                                                    : 'text-white/90 opacity-100'}`}
                                    >
                                        {line.text}
                                    </p>
                                );
                            })
                        ) : (
                            <div className="h-full flex flex-col justify-center items-center text-white/10 scale-150">
                                <span className="material-symbols-outlined text-8xl mb-4 italic">format_quote</span>
                                <p className="font-bold tracking-widest uppercase opacity-20">Instrumental Only</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Playback Section */}
            <div className="w-full max-w-3xl px-8 mb-12 z-20">
                <div className="bg-black/30 backdrop-blur-3xl rounded-[40px] p-8 shadow-2xl border border-white/10 ring-1 ring-white/5">
                    {/* Progress */}
                    <div className="space-y-4 mb-8">
                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={currentTime || 0}
                            onChange={(e) => usePlayerStore.getState().setSeekTime(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-emerald-400 transition-all"
                        />
                        <div className="flex justify-between text-[11px] font-extrabold text-white/30 tracking-widest uppercase">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Functional Controls */}
                    <div className="flex items-center justify-between px-6">
                        <button onClick={toggleRepeat} className={`transition-all hover:scale-125 ${repeatMode !== 'off' ? 'text-emerald-400' : 'text-white/20'}`}>
                            <span className="material-symbols-outlined text-3xl">repeat_one</span>
                        </button>

                        <div className="flex items-center gap-14">
                            <button onClick={playPrevious} className="text-white hover:scale-125 transition-all drop-shadow-xl">
                                <span className="material-symbols-outlined text-7xl">skip_previous</span>
                            </button>

                            {/* Central Interactive Feedback */}
                            <div onClick={togglePlay} className="flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="text-white/30 text-[10px] font-black tracking-[0.3em] uppercase group-hover:text-emerald-400 transition-colors">
                                    {isPlaying ? 'Pause' : 'Play'}
                                </div>
                                <div className="size-2 rounded-full bg-emerald-400 motion-safe:animate-ping" />
                            </div>

                            <button onClick={playNext} className="text-white hover:scale-125 transition-all drop-shadow-xl">
                                <span className="material-symbols-outlined text-7xl">skip_next</span>
                            </button>
                        </div>

                        <button onClick={toggleShuffle} className={`transition-all hover:scale-125 ${shuffle ? 'text-emerald-400' : 'text-white/20'}`}>
                            <span className="material-symbols-outlined text-3xl">shuffle</span>
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar-hidden::-webkit-scrollbar {
                    display: none;
                }
                .mask-lyrics-edges {
                    mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(-12deg); }
                    50% { transform: translateY(-30px) rotate(-8deg); }
                }
                @keyframes sway {
                    0%, 100% { transform: translateX(0) scale(2) rotate(45deg); }
                    50% { transform: translateX(20px) scale(2.1) rotate(50deg); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.12; transform: scale(3) rotate(-35deg); }
                    50% { opacity: 0.2; transform: scale(3.1) rotate(-30deg); }
                }
                @keyframes sparkle {
                    0%, 100% { opacity: 0.1; transform: scale(0.5); }
                    50% { opacity: 0.5; transform: scale(0.8); }
                }
                @keyframes rotate-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
                .animate-float { animation: float 8s ease-in-out infinite; }
                .animate-float-delayed { animation: float 10s ease-in-out infinite 2s; }
                .animate-sway { animation: sway 9s ease-in-out infinite; }
                .animate-sway-delayed { animation: sway 11s ease-in-out infinite 1.5s; }
                .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
                .animate-sparkle { animation: sparkle 4s ease-in-out infinite; }
                .animate-sparkle-delayed { animation: sparkle 5s ease-in-out infinite 1.5s; }
                .animate-rotate-slow { animation: rotate-slow 60s linear infinite; }
                .animate-spin-paused {
                    animation-play-state: paused;
                }
                .cubic-bezier {
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>
        </div>
    );
};

export default VinylPlayer;
