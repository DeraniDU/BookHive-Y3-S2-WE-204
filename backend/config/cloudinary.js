const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'book-bidding',
    });
    // Delete file from server after upload
    fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    // Delete file from server if upload fails
    fs.unlinkSync(filePath);
    throw error;
  }
};

module.exports = { uploadToCloudinary };