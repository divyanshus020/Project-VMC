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

// ✅ Create Product (MySQL)
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
      images: uploadedImages.length > 0 ? uploadedImages : parseArrayField(req.body.images),
      capSize: capSize || "",
      weight: weight || "",
      tulsiRudrakshMM: tulsiRudrakshMM || "",
      estPCS: estPCS || "",
      diameter: diameter || "",
      ballGauge: ballGauge || "",
      wireGauge: wireGauge || "",
      otherWeight: otherWeight || "",
    };

    // Save to MySQL
    const product = await Product.create(productData);
    res.status(201).json(product);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get ALL Products (MySQL)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get SINGLE Product (MySQL)
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

// ✅ UPDATE Product (MySQL)
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

    let finalImageUrl = product.imageUrl;
    let uploadedImages = product.images || [];

    // Handle single main image (thumbnail)
    if (req.files && req.files.image && req.files.image[0]) {
      const result = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: 'ecommerce/products',
      });
      fs.unlinkSync(req.files.image[0].path);
      finalImageUrl = result.secure_url;
    } else if (imageUrl) {
      finalImageUrl = imageUrl;
    }

    // Handle multiple new slider images
    if (req.files && req.files.images) {
      uploadedImages = [];
      for (const file of req.files.images) {
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: 'ecommerce/products',
        });
        fs.unlinkSync(file.path);
        uploadedImages.push(upload.secure_url);
      }
    } else if (images !== undefined) {
      uploadedImages = parseArrayField(images);
    }

    // Build updated product data
    const updatedData = {
      name: name !== undefined ? name : product.name,
      category: category !== undefined ? category : product.category,
      imageUrl: finalImageUrl,
      images: uploadedImages,
      capSize: capSize !== undefined ? capSize : product.capSize,
      weight: weight !== undefined ? weight : product.weight,
      tulsiRudrakshMM: tulsiRudrakshMM !== undefined ? tulsiRudrakshMM : product.tulsiRudrakshMM,
      estPCS: estPCS !== undefined ? estPCS : product.estPCS,
      diameter: diameter !== undefined ? diameter : product.diameter,
      ballGauge: ballGauge !== undefined ? ballGauge : product.ballGauge,
      wireGauge: wireGauge !== undefined ? wireGauge : product.wireGauge,
      otherWeight: otherWeight !== undefined ? otherWeight : product.otherWeight,
    };

    await Product.updateById(req.params.id, updatedData);
    const updatedProduct = await Product.findById(req.params.id);
    res.json(updatedProduct);

  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE Product (MySQL)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    await Product.deleteById(req.params.id);
    res.json({ message: 'Product deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Product Options (enums for dropdowns)
exports.getProductOptions = async (req, res) => {
  try {
    const enums = Product.getEnums();
    res.json(enums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
