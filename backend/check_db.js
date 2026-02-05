import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb+srv://ibm_intern:ganesh0483@ibmintern2.u9dsfyr.mongodb.net/?appName=ibmintern2';
        console.log('Connecting to MongoDB...');

        await mongoose.connect(uri);
        console.log('MongoDB Connected via script!');

        const adminEmail = 'admin@admin.com';
        const adminPassword = 'admin';

        // Manually hash the password
        console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Use findOneAndUpdate to BYPASS pre-save hooks and enforce the exact hash we want
        const filter = { email: adminEmail };
        const update = {
            username: 'Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            image: 'https://ui-avatars.com/api/?name=Admin+User&background=1DB954&color=fff',
            isPremium: true
        };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        console.log('Updating admin user...');
        const adminUser = await User.findOneAndUpdate(filter, update, options);

        console.log('-----------------------------------');
        console.log('✅ ADMIN RESET SUCCESSFUL');
        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔑 Password: ${adminPassword}`);
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('❌ Script Failed:', error.message);
        process.exit(1);
    }
};

seedDatabase();
