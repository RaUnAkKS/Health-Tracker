import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, X } from 'lucide-react';

const PhotoUpload = ({ onPhotoSelect, selectedPhoto, onClear }) => {
    const cameraInputRef = useRef(null);
    const galleryInputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size must be less than 5MB');
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                onPhotoSelect(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCamera = () => {
        if (cameraInputRef.current) {
            cameraInputRef.current.click();
        }
    };

    const handleGallery = () => {
        if (galleryInputRef.current) {
            galleryInputRef.current.click();
        }
    };

    const handleClear = () => {
        setPreview(null);
        onClear();
        if (cameraInputRef.current) cameraInputRef.current.value = '';
        if (galleryInputRef.current) galleryInputRef.current.value = '';
    };

    return (
        <div className="space-y-4">
            {/* Hidden camera input - separate for camera */}
            <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Hidden gallery input - separate for gallery */}
            <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Preview or Upload Buttons */}
            <AnimatePresence mode="wait">
                {preview ? (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative"
                    >
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-xl border-2 border-gray-300 dark:border-gray-600"
                        />

                        <button
                            onClick={handleClear}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="buttons"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-2 gap-3"
                    >
                        <button
                            onClick={handleCamera}
                            type="button"
                            className="flex flex-col items-center gap-2 p-4 glass-card hover:shadow-md transition-all border-2 border-dashed border-gray-300 dark:border-gray-600"
                        >
                            <Camera size={32} className="text-primary-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Take Photo
                            </span>
                        </button>

                        <button
                            onClick={handleGallery}
                            type="button"
                            className="flex flex-col items-center gap-2 p-4 glass-card hover:shadow-md transition-all border-2 border-dashed border-gray-300 dark:border-gray-600"
                        >
                            <ImageIcon size={32} className="text-secondary-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                From Gallery
                            </span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PhotoUpload;
