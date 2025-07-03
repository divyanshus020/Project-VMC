const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },

  // Mala fields
  capSize: { type: String },
  weight: { type: String },
  tulsiRudrakshMM: { type: String },
  estPCS: { type: String },

  // Non-mala fields
  diameter: { type: String },
  ballGauge: { type: String },
  wireGauge: { type: String },
  otherWeight: { type: String },
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);