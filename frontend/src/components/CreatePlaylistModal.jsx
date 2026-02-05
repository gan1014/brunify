import React, { useState } from 'react';
import { useUIStore, usePlaylistStore } from '../store/store';
import toast from 'react-hot-toast';

const CreatePlaylistModal = () => {
    const { showCreatePlaylistModal, setShowCreatePlaylistModal } = useUIStore();
    const { createPlaylist } = usePlaylistStore();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!showCreatePlaylistModal) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);
        try {
            console.log('Creating playlist with:', { name, description });
            const result = await createPlaylist({ name, description });
            console.log('Playlist created successfully:', result);
            toast.success('Playlist created successfully');
            setShowCreatePlaylistModal(false);
            setName('');
            setDescription('');
        } catch (error) {
            console.error('Failed to create playlist:', error);
            toast.error(error.message || 'Failed to create playlist');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#282828] w-full max-w-md rounded-lg shadow-2xl p-6 animate-scale-up">
                <h2 className="text-2xl font-bold text-white mb-6">Create Playlist</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Playlist Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#3E3E3E] text-white p-3 rounded border border-transparent focus:border-white/30 focus:outline-none transition-colors"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-[#3E3E3E] text-white p-3 rounded border border-transparent focus:border-white/30 focus:outline-none transition-colors min-h-[100px] resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={() => setShowCreatePlaylistModal(false)}
                            className="px-4 py-3 font-bold text-white hover:scale-105 transition-transform"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim() || isLoading}
                            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePlaylistModal;
