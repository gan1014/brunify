import multer from 'multer';

// Use memory storage for streaming to Cloudinary
const storage = multer.memoryStorage();

// File filter for audio files only
const audioFileFilter = (req, file, cb) => {
    // Accept audio files only
    if (file.mimetype.startsWith('audio/')) {
        cb(null, true);
    } else {
        cb(new Error('Only audio files are allowed! (.mp3, .wav, .m4a, etc.)'), false);
    }
};

// File filter for image files only
const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Audio upload configuration
export const uploadAudio = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: audioFileFilter
}).single('audio');

// Image upload configuration
export const uploadImage = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: imageFileFilter
}).single('image');

// Combined upload for song with cover image
export const uploadSongWithCover = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // Increased to 50MB for total upload size
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'audio') {
            audioFileFilter(req, file, cb);
        } else if (file.fieldname === 'coverImage') {
            imageFileFilter(req, file, cb);
        } else {
            cb(null, true);
        }
    }
}).fields([
    { name: 'audio', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]);

export default { uploadAudio, uploadImage, uploadSongWithCover };
