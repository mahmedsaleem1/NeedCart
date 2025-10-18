// cloudinaryUtils.js
import cloudinary from '../config/cloudinary.js';

/**
 * Upload an image
 * @param {string} filePath - URL or local path
 * @param {string} publicId - Optional public_id
 * @returns {Promise<string>} - Returns uploaded image URL
 */
export const uploadImage = async (filePath, publicId = null) => {
  try {
    const options = {};
    if (publicId) options.public_id = publicId;

    const result = await cloudinary.uploader.upload(filePath, options);
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};

/**
 * Generate optimized image URL
 * @param {string} publicId
 * @param {object} options - transformations like width, height, crop, quality, etc.
 * @returns {string}
 */
export const getTransformedUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, options);
};
