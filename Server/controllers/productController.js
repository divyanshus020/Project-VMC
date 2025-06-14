const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const file = req.file;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'ecommerce/products'
    });

    // Remove local file
    fs.unlinkSync(file.path);

    const product = new Product({
      name,
      description,
      price,
      imageUrl: result.secure_url
    });

    await product.save();

    res.status(201).json(product);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
