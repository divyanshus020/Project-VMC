const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: String, // Thumbnail image for product card
    category: { type: String, required: true },

    images: [{ type: String }],      // For image slider on detail page
    sizes: [{ type: String }],       // E.g., ['S', 'M', 'L', 'XL']
    weights: [{ type: String }],     // E.g., ['250g', '500g', '1kg']
    quantities: [{ type: Number }],  // E.g., [1, 2, 5, 10]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
