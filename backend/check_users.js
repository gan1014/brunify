import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/spotify_clone';

async function checkUsers() {
    try {
        console.log('Connecting to:', mongoUri);
        await mongoose.connect(mongoUri);

        const userSchema = new mongoose.Schema({}, { strict: false });
        const User = mongoose.model('User', userSchema);

        const users = await User.find({}, 'username email role isAdmin');
        console.log('Users found:', JSON.stringify(users, null, 2));

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkUsers();
