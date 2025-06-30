const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: String, // Thumbnail image for product card
    category: { type: String, required: true },

    images: [{ type: String }],      // For image slider on detail page
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
