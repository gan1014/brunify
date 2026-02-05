import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

console.log('Testing Cloudinary Connection Standalone Script');
console.log('---------------------------------------------');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '******' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'Not Set');

// 1. Check DNS Resolution
console.log('\nSTEP 1: Checking DNS Resolution for api.cloudinary.com...');
dns.lookup('api.cloudinary.com', (err, address, family) => {
    if (err) {
        console.error('❌ DNS Lookup Failed:', err.code, err.message);
        console.error('   This indicates a network connectivity or DNS issue on your machine.');
    } else {
        console.log('✅ DNS Lookup Successful:', address);

        // 2. Check Cloudinary Config
        console.log('\nSTEP 2: Configuring Cloudinary...');
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true
        });

        // 3. Ping Cloudinary API
        console.log('\nSTEP 3: Pinging Cloudinary API...');
        cloudinary.api.ping()
            .then(result => {
                console.log('✅ Cloudinary API Connection Successful!', result);
            })
            .catch(error => {
                console.error('❌ Cloudinary API Connection Failed:', error.message);
                if (error.error) console.error('   Details:', error.error);
            });
    }
});
