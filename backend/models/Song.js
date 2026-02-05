import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Song title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    artist: {
        type: String,
        required: [true, 'Artist name is required'],
        trim: true,
        maxlength: [200, 'Artist name cannot exceed 200 characters']
    },
    album: {
        type: String,
        trim: true,
        default: 'Unknown Album'
    },
    duration: {
        type: Number, // Duration in seconds
        default: 0
    },
    audioUrl: {
        type: String,
        required: [true, 'Audio URL is required']
    },
    audioPublicId: {
        type: String,
        required: [true, 'Cloudinary public ID is required']
    },
    coverImageUrl: {
        type: String,
        default: 'https://via.placeholder.com/300x300.png?text=No+Cover'
    },
    coverImagePublicId: {
        type: String
    },
    genre: {
        type: String,
        default: 'Unknown'
    },
    year: {
        type: Number,
        min: [1900, 'Year must be after 1900'],
        max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
    },
    playCount: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lyrics: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Indexes for better query performance
songSchema.index({ title: 'text', artist: 'text', album: 'text' });
songSchema.index({ artist: 1 });
songSchema.index({ genre: 1 });
songSchema.index({ createdAt: -1 });

// Virtual for formatted duration
songSchema.virtual('formattedDuration').get(function () {
    const minutes = Math.floor(this.duration / 60);
    const seconds = this.duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Instance method to increment play count
songSchema.methods.incrementPlayCount = async function () {
    this.playCount += 1;
    return await this.save();
};

const Song = mongoose.model('Song', songSchema);

export default Song;
