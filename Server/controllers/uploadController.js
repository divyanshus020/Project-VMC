const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const uploadMultipleImages = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: 'your-folder-name', // Optional folder in Cloudinary
      })
    );

    const results = await Promise.all(uploadPromises);

    // Clean up local temp files
    files.forEach((file) => fs.unlinkSync(file.path));

    const imageData = results.map((result) => ({
      url: result.secure_url,
      public_id: result.public_id,
    }));

    res.status(200).json({ images: imageData });
  } catch (error) {
    console.error('❌ Cloudinary multi-upload error:', error);
    res.status(500).json({ message: 'Failed to upload images', error });
  }
};

module.exports = {
  uploadMultipleImages,
};
