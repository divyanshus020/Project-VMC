const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// Helper to parse array fields safely
function parseArrayField(field) {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  try {
    return JSON.parse(field);
  } catch {
    return [field];
  }
}

// ✅ Create Product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      imageUrl,
      capSize,
      weight,
      tulsiRudrakshMM,
      estPCS,
      diameter,
      ballGauge,
      wireGauge,
      otherWeight,
    } = req.body;

    let finalImageUrl;
    let uploadedImages = [];

    // Handle main image upload (thumbnail)
    if (req.files && req.files.image && req.files.image[0]) {
      const result = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: 'ecommerce/products',
      });
      fs.unlinkSync(req.files.image[0].path);
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

    // Build product object with all fields (always include all keys)
    const productData = {
      name,
      category,
      imageUrl: finalImageUrl,
      images: parseArrayField(req.body.images) || uploadedImages,
      capSize: capSize || "",
      weight: weight || "",
      tulsiRudrakshMM: tulsiRudrakshMM || "",
      estPCS: estPCS || "",
      diameter: diameter || "",
      ballGauge: ballGauge || "",
      wireGauge: wireGauge || "",
      otherWeight: otherWeight || "",
    };

    const product = new Product(productData);

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
    const {
      name,
      imageUrl,
      category,
      capSize,
      weight,
      tulsiRudrakshMM,
      estPCS,
      diameter,
      ballGauge,
      wireGauge,
      otherWeight,
      images
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    // Handle single main image (thumbnail)
    if (req.files && req.files.image && req.files.image[0]) {
      const result = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: 'ecommerce/products',
      });
      fs.unlinkSync(req.files.image[0].path);
      product.imageUrl = result.secure_url;
    } else if (imageUrl) {
      product.imageUrl = imageUrl;
    }

    // Handle multiple new slider images
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
    } else if (images !== undefined) {
      product.images = parseArrayField(images);
    }

    // Update all fields (always include all keys)
    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    product.capSize = capSize || "";
    product.weight = weight || "";
    product.tulsiRudrakshMM = tulsiRudrakshMM || "";
    product.estPCS = estPCS || "";
    product.diameter = diameter || "";
    product.ballGauge = ballGauge || "";
    product.wireGauge = wireGauge || "";
    product.otherWeight = otherWeight || "";

    await product.save();
    res.json(product);

  } catch (err) {
    console.error('Update product error:', err);
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
