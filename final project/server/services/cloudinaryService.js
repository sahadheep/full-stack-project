const cloudinary = require('cloudinary').v2;
const { CLOUDINARY_URL } = require('../config/envConfig');
const logger = require('../config/logger');
const { Buffer } = require('buffer');

if (CLOUDINARY_URL) {
  cloudinary.config({ secure: true, cloud_name: '', api_key: '', api_secret: '' });
  // cloudinary will parse CLOUDINARY_URL automatically if present in env
}

async function uploadImage(buffer, filename = 'avatar') {
  if (!CLOUDINARY_URL) {
    // fallback: store file handled by multer and return null to indicate local path used
    return null;
  }
  try {
    const base64 = buffer.toString('base64');
    const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64}`, {
      folder: 'scaler_matrimony',
      public_id: `${filename}-${Date.now()}`,
      resource_type: 'image'
    });
    return { url: result.secure_url, public_id: result.public_id };
  } catch (err) {
    logger.error('Cloudinary upload failed', err);
    return null;
  }
}

module.exports = { uploadImage };
