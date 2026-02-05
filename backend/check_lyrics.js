import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/spotify_clone';

async function checkSongs() {
    try {
        console.log('Connecting to:', mongoUri);
        await mongoose.connect(mongoUri);

        const songSchema = new mongoose.Schema({}, { strict: false });
        const Song = mongoose.model('Song', songSchema);

        const songs = await Song.find({}, 'title artist lyrics');
        console.log('Songs found:', JSON.stringify(songs, null, 2));

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkSongs();
