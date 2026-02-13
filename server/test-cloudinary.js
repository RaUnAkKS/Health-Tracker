require('dotenv').config();
const cloudinary = require('./config/cloudinary');

console.log('Testing Cloudinary Connection...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '******' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'MISSING');

const testUpload = async () => {
    try {
        console.log('Attempting to upload a test image...');
        // Base64 1x1 pixel transparent gif
        const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

        const result = await cloudinary.uploader.upload(base64Image, {
            folder: 'test-folder',
            resource_type: 'image'
        });

        console.log('✅ Upload Successful!');
        console.log('URL:', result.secure_url);
        console.log('Public ID:', result.public_id);
    } catch (error) {
        console.error('❌ Upload Failed!');
        console.error('Error:', error);
    }
};

testUpload();
