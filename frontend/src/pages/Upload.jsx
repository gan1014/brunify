import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { songAPI } from '../services/api';
import toast from 'react-hot-toast';

const Upload = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        album: '',
        genre: '',
        year: '',
        lyrics: '',
    });
    const [audioFile, setAudioFile] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAudioChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('audio/')) {
            setAudioFile(file);
            toast.success(`Selected: ${file.name}`);
        } else {
            toast.error('Please select a valid audio file');
        }
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setCoverImage(file);
            toast.success(`Cover image selected`);
        } else {
            toast.error('Please select a valid image file');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.artist) {
            toast.error('Title and artist are required');
            return;
        }

        if (!audioFile) {
            toast.error('Please select an audio file');
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('artist', formData.artist);
        if (formData.album) data.append('album', formData.album);
        if (formData.genre) data.append('genre', formData.genre);
        if (formData.year) data.append('year', formData.year);
        if (formData.lyrics) data.append('lyrics', formData.lyrics);
        data.append('audio', audioFile);
        if (coverImage) data.append('coverImage', coverImage);

        try {
            setUploading(true);
            setProgress(30);

            toast.loading('Uploading to cloud storage...', { id: 'upload' });

            setProgress(60);
            const response = await songAPI.uploadSong(data);

            setProgress(100);
            toast.success('Song uploaded successfully!', { id: 'upload' });

            // Reset form
            setFormData({ title: '', artist: '', album: '', genre: '', year: '' });
            setAudioFile(null);
            setCoverImage(null);

            // Navigate to home after 2 seconds
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to upload song';
            const detailedError = error.response?.data?.error ? `: ${error.response.data.error}` : '';
            toast.error(`${errorMessage}${detailedError}`, { id: 'upload', duration: 5000 });
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-background-dark via-background-dark to-black pb-32">
            <div className="max-w-4xl mx-auto p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-black tracking-tight mb-2">Upload Song</h1>
                    <p className="text-white/60">Share your music with the world</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Audio File Upload */}
                    <div className="glass-effect rounded-xl p-6">
                        <label className="block text-sm font-bold mb-4 text-white/80">
                            Audio File <span className="text-primary">*</span>
                        </label>
                        <input
                            type="file"
                            accept="audio/mp3,audio/mpeg,audio/wav,audio/m4a"
                            onChange={handleAudioChange}
                            className="block w-full text-sm text-white/60
                file:mr-4 file:py-3 file:px-6
                file:rounded-full file:border-0
                file:text-sm file:font-bold
                file:bg-primary file:text-black
                file:cursor-pointer file:transition-transform
                hover:file:scale-105
                cursor-pointer"
                            disabled={uploading}
                        />
                        {audioFile && (
                            <p className="mt-2 text-sm text-primary">
                                ✓ {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                        )}
                    </div>

                    {/* Cover Image Upload */}
                    <div className="glass-effect rounded-xl p-6">
                        <label className="block text-sm font-bold mb-4 text-white/80">
                            Cover Image (Optional)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverChange}
                            className="block w-full text-sm text-white/60
                file:mr-4 file:py-3 file:px-6
                file:rounded-full file:border-0
                file:text-sm file:font-bold
                file:bg-white/10 file:text-white
                file:cursor-pointer file:transition-all
                hover:file:bg-white/20
                cursor-pointer"
                            disabled={uploading}
                        />
                        {coverImage && (
                            <p className="mt-2 text-sm text-primary">
                                ✓ {coverImage.name}
                            </p>
                        )}
                    </div>

                    {/* Song Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-effect rounded-xl p-6">
                            <label className="block text-sm font-bold mb-2 text-white/80">
                                Title <span className="text-primary">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter song title"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors"
                                disabled={uploading}
                                required
                            />
                        </div>

                        <div className="glass-effect rounded-xl p-6">
                            <label className="block text-sm font-bold mb-2 text-white/80">
                                Artist <span className="text-primary">*</span>
                            </label>
                            <input
                                type="text"
                                name="artist"
                                value={formData.artist}
                                onChange={handleInputChange}
                                placeholder="Enter artist name"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors"
                                disabled={uploading}
                                required
                            />
                        </div>

                        <div className="glass-effect rounded-xl p-6">
                            <label className="block text-sm font-bold mb-2 text-white/80">
                                Album
                            </label>
                            <input
                                type="text"
                                name="album"
                                value={formData.album}
                                onChange={handleInputChange}
                                placeholder="Enter album name"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors"
                                disabled={uploading}
                            />
                        </div>

                        <div className="glass-effect rounded-xl p-6">
                            <label className="block text-sm font-bold mb-2 text-white/80">
                                Genre
                            </label>
                            <input
                                type="text"
                                name="genre"
                                value={formData.genre}
                                onChange={handleInputChange}
                                placeholder="e.g., Pop, Rock, Jazz"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors"
                                disabled={uploading}
                            />
                        </div>

                        <div className="glass-effect rounded-xl p-6">
                            <label className="block text-sm font-bold mb-2 text-white/80">
                                Year
                            </label>
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleInputChange}
                                placeholder="2024"
                                min="1900"
                                max={new Date().getFullYear() + 1}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors"
                                disabled={uploading}
                            />
                        </div>
                        <div className="md:col-span-2 glass-effect rounded-xl p-6">
                            <label className="block text-sm font-bold mb-2 text-white/80">
                                Lyrics (Optional)
                            </label>
                            <textarea
                                name="lyrics"
                                value={formData.lyrics}
                                onChange={handleInputChange}
                                placeholder="Paste or type song lyrics here..."
                                rows="6"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors resize-none"
                                disabled={uploading}
                            />
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {uploading && (
                        <div className="glass-effect rounded-xl p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-white/80">Uploading...</span>
                                <span className="text-sm font-bold text-primary">{progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={uploading}
                            className="flex-1 py-4 px-8 bg-primary text-black font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {uploading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">refresh</span>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">upload</span>
                                    Upload Song
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            disabled={uploading}
                            className="py-4 px-8 glass-effect text-white font-bold rounded-xl hover:bg-white/10 transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                {/* Instructions */}
                <div className="mt-8 glass-effect rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">info</span>
                        Upload Instructions
                    </h3>
                    <ul className="space-y-2 text-sm text-white/60">
                        <li className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                            <span>Only MP3, WAV, and M4A audio files are supported</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                            <span>Maximum file size: 10MB for audio, 5MB for cover image</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                            <span>For synced lyrics, use the format: [00:12.30] Your lyric line</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                            <span>All songs are saved in MongoDB with metadata</span>
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    );
};

export default Upload;
