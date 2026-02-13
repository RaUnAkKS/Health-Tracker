const cloudinary = require('../config/cloudinary');

/**
 * Upload photo to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {String} folder - Cloudinary folder name
 * @returns {Promise<String>} - Cloudinary URL
 */
const uploadToCloudinary = (fileBuffer, folder = 'sugar-logs') => {
    console.log('[Cloudinary] Upload started', {
        bufferSize: fileBuffer?.length,
        folder,
        hasConfig: !!process.env.CLOUDINARY_CLOUD_NAME,
    });

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'image',
                transformation: [
                    { width: 800, height: 800, crop: 'limit' }, // Resize to max 800x800
                    { quality: 'auto' }, // Auto quality
                    { fetch_format: 'auto' }, // Auto format (webp for modern browsers)
                ],
            },
            (error, result) => {
                if (error) {
                    console.error('[Cloudinary] Upload failed:', error);
                    reject(error);
                } else {
                    console.log('[Cloudinary] Upload success:', result.secure_url);
                    resolve(result.secure_url);
                }
            }
        );

        // Convert buffer to stream and pipe to cloudinary
        const stream = require('stream');
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileBuffer);
        bufferStream.pipe(uploadStream);
    });
};

/**
 * Delete photo from Cloudinary
 * @param {String} photoUrl - Cloudinary URL
 */
const deleteFromCloudinary = async (photoUrl) => {
    try {
        // Extract public_id from URL
        const urlParts = photoUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = `sugar-logs/${filename.split('.')[0]}`;

        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
    }
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
};
