// controllers/productController.js
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// ✅ Parse input field into an array
function parseArrayField(field) {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  try {
    return JSON.parse(field);
  } catch {
    return [field];
  }
}

// ✅ Helper function to convert undefined to null
function sanitizeForDB(value) {
  return value === undefined ? null : value;
}

// ✅ Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, category, imageUrl, images, dieIds } = req.body;

    let finalImageUrl = '';
    let uploadedImages = [];

    // 🖼️ Upload thumbnail
    if (req.files?.image?.[0]) {
      const upload = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: 'ecommerce/products',
      });
      fs.unlinkSync(req.files.image[0].path);
      finalImageUrl = upload.secure_url;
    } else if (imageUrl) {
      finalImageUrl = imageUrl;
    } else {
      return res.status(400).json({ message: 'Image file or imageUrl is required' });
    }

    // 🖼️ Upload slider images
    if (req.files?.images) {
      for (const file of req.files.images) {
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: 'ecommerce/products',
        });
        fs.unlinkSync(file.path);
        uploadedImages.push(upload.secure_url);
      }
    }

    const productData = {
      name: sanitizeForDB(name),
      category: sanitizeForDB(category),
      imageUrl: finalImageUrl,
      images: uploadedImages.length ? uploadedImages : parseArrayField(images),
      dieIds: parseArrayField(dieIds), // <— string or number, no auto-increment
    };

    const newProduct = await Product.create(productData);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('❌ Create Product Error:', err);
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
};

// ✅ Get All Products (with optional dieNo filter)
exports.getProducts = async (req, res) => {
  try {
    const { dieNo } = req.query;
    let products;

    if (dieNo !== undefined) {
      // pass dieNo as-is (string or number)
      products = await Product.filterByDieNo(dieNo);
    } else {
      products = await Product.findAll();
    }

    res.json(products);
  } catch (err) {
    console.error('❌ Get Products Error:', err);
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
};

// ✅ Get Single Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('❌ Get Product By ID Error:', err);
    res.status(500).json({ message: 'Failed to fetch product', error: err.message });
  }
};

// ✅ Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { name, category, imageUrl, images, dieIds } = req.body;

    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Product not found' });

    let finalImageUrl = existing.imageUrl;
    let updatedImages = existing.images || [];

    // 🖼️ Update thumbnail
    if (req.files?.image?.[0]) {
      // ... (cloudinary upload logic)
    } else if (imageUrl !== undefined) {
      finalImageUrl = imageUrl;
    }

    // 🖼️ Update slider images
    if (req.files?.images) {
      // ... (cloudinary upload logic)
    } else if (images !== undefined) {
      updatedImages = parseArrayField(images);
    }

    const updatedData = {
      name: sanitizeForDB(name ?? existing.name),
      category: sanitizeForDB(category ?? existing.category),
      imageUrl: finalImageUrl,
      images: updatedImages,
      dieIds: dieIds !== undefined ? parseArrayField(dieIds) : existing.dieIds,
    };

    await Product.updateById(req.params.id, updatedData);
    const updatedProduct = await Product.findById(req.params.id);
    res.json(updatedProduct);
  } catch (err) {
    console.error('❌ Update Product Error:', err);
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
};

// ✅ Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Product not found' });

    await Product.deleteById(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('❌ Delete Product Error:', err);
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
};