const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// ✅ Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl } = req.body;
    let finalImageUrl;

    if (req.file) {
      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'ecommerce/products',
      });
      fs.unlinkSync(req.file.path);
      finalImageUrl = result.secure_url;
    } else if (imageUrl) {
      // If testing with URL
      finalImageUrl = imageUrl;
    } else {
      return res.status(400).json({ message: 'Either an image file or imageUrl is required' });
    }

    const product = new Product({
      name,
      description,
      price,
      imageUrl: finalImageUrl,
    });

    await product.save();
    res.status(201).json(product);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get ALL Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get SINGLE Product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE Product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl } = req.body;
    const file = req.file;

    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    // If a new file is uploaded, upload it
    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'ecommerce/products',
      });
      fs.unlinkSync(file.path);
      product.imageUrl = result.secure_url;
    } else if (imageUrl) {
      // If no file, but new imageUrl provided, use it
      product.imageUrl = imageUrl;
    }

    // Update other fields if provided
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;

    await product.save();
    res.json(product);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
