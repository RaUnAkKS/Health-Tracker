const multer = require('multer');
const path = require('path');

// Configure multer for memory storage (we'll upload to Cloudinary directly)
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
    console.log('[Multer] Filtering file:', {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype
    });

    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        console.error('[Multer] Rejected file type:', file.mimetype);
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
};

// Multer upload configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: fileFilter,
});

module.exports = upload;
