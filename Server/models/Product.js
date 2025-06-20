const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: String,
    category: { type: String, required: true }, // ✅ REQUIRED
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
