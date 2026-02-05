import React, { useRef, useEffect } from 'react';
import { usePlayerStore } from '../store/store';
import { songAPI } from '../services/api';

const AudioController = () => {
    const {
        currentSong,
        isPlaying,
        volume,
        repeat,
        shuffle,
        playNext,
        setProgress,
        setDuration,
        setIsPlaying // We might need to sync "real" pause events
    } = usePlayerStore();

    const audioRef = useRef(null);

    // Initial setup
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    // Handle song changes
    useEffect(() => {
        if (!audioRef.current) return;

        if (currentSong) {
            const isSameSong = audioRef.current.src === currentSong.audioUrl;
            if (!isSameSong) {
                audioRef.current.src = currentSong.audioUrl;
                audioRef.current.load();
            }

            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(err => console.error("Playback failed", err));
                }
            }
            // Increment play count
            if (!isSameSong) {
                songAPI.incrementPlayCount(currentSong._id).catch(err =>
                    console.error('Failed to increment play count:', err)
                );
            }
        } else {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [currentSong]);

    // Handle play/pause toggle
    useEffect(() => {
        if (!audioRef.current || !currentSong) return;

        if (isPlaying) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => console.error("Playback failed", err));
            }
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, currentSong]);

    // Handle seeking
    const { seekTime, resetSeekTime } = usePlayerStore();
    useEffect(() => {
        if (seekTime !== null && audioRef.current) {
            audioRef.current.currentTime = seekTime;
            resetSeekTime();
        }
    }, [seekTime, resetSeekTime]);


    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleEnded = () => {
        if (repeat) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        } else {
            playNext();
        }
    };

    return (
        <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            className="hidden" // Headless
        />
    );
};

export default AudioController;
