const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// ✅ Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, category, imageUrl, sizes, weights, quantities } = req.body;
    let finalImageUrl;
    let uploadedImages = [];

    // Handle main image upload (thumbnail)
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'ecommerce/products',
      });
      fs.unlinkSync(req.file.path);
      finalImageUrl = result.secure_url;
    } else if (imageUrl) {
      finalImageUrl = imageUrl;
    } else {
      return res.status(400).json({ message: 'Either an image file or imageUrl is required' });
    }

    // Handle multiple slider images (images[])
    if (req.files && req.files.images) {
      for (const file of req.files.images) {
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: 'ecommerce/products',
        });
        fs.unlinkSync(file.path);
        uploadedImages.push(upload.secure_url);
      }
    }

    const product = new Product({
      name,
      category,
      imageUrl: finalImageUrl,
      images: uploadedImages,
      sizes: sizes ? JSON.parse(sizes) : [],
      weights: weights ? JSON.parse(weights) : [],
      quantities: quantities ? JSON.parse(quantities) : [],
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
    const { name, imageUrl, category, sizes, weights, quantities } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    // Handle single main image (thumbnail)
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'ecommerce/products',
      });
      fs.unlinkSync(req.file.path);
      product.imageUrl = result.secure_url;
    } else if (imageUrl) {
      product.imageUrl = imageUrl;
    }

    // Handle multiple new slider images (optional)
    if (req.files && req.files.images) {
      const uploadedImages = [];
      for (const file of req.files.images) {
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: 'ecommerce/products',
        });
        fs.unlinkSync(file.path);
        uploadedImages.push(upload.secure_url);
      }
      product.images = uploadedImages;
    }

    // Update other fields
    if (name) product.name = name;
    if (category) product.category = category;
    if (sizes) product.sizes = JSON.parse(sizes);
    if (weights) product.weights = JSON.parse(weights);
    if (quantities) product.quantities = JSON.parse(quantities);

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
