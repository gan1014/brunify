import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Playlist name is required'],
        trim: true,
        maxlength: [100, 'Playlist name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    coverImage: {
        type: String,
        default: 'https://via.placeholder.com/300x300.png?text=Playlist'
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    followers: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for better query performance
playlistSchema.index({ owner: 1 });
playlistSchema.index({ name: 'text', description: 'text' });

// Virtual for total duration
playlistSchema.virtual('totalDuration').get(function () {
    return this.songs.reduce((total, song) => total + (song.duration || 0), 0);
});

const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist;
