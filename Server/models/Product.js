const mongoose = require('mongoose');

const CAP_SIZE_ENUM = [
  "43 No CAP MALA",
  "42 No CAP MALA",
  "22 No CAP MALA",
  "21 No CAP MALA",
  "19 No CAP MALA",
  "17 No CAP MALA",
  "15 No CAP MALA",
  "12 No CAP MALA",
  "11 No CAP MALA",
  "10 No CAP MALA",
  "8 No CAP MALA",
  "5 No CAP MALA"
];

const WEIGHT_ENUM = [
  "8 - 9 gm",
  "9 - 10 gm",
  "10 - 11 gm",
  "12 - 13 gm",
  "14 - 15 gm",
  "16 - 17 gm",
  "18 - 19 gm",
  "20 gm",
  "21 - 22 gm",
  "24 - 25 gm",
  "28 - 29 gm",
  "31 - 32 gm"
];

// Add fixed values for TULSI / RUDRAKSH MM and EST PCS
const TULSI_RUDRAKSH_MM_ENUM = [
  "3 mm",
  "3 mm",
  "3.5 mm",
  "3.5 mm",
  "4 mm",
  "4.5 mm",
  "5 mm",
  "5 mm",
  "5.5 mm",
  "6 mm",
  "7 mm",
  "7.5 mm"
];

const TULSI_RUDRAKSH_ESTPCS_ENUM = [
  "80 - 85 Pcs",
  "75 - 80 Pcs",
  "75 - 80 Pcs",
  "75 - 80 Pcs",
  "65 - 70 Pcs",
  "65 - 70 Pcs",
  "57 - 62 Pcs",
  "54 - 60 Pcs",
  "54 - 58 Pcs",
  "50 - 52 Pcs",
  "45 - 48 Pcs",
  "40 - 45 Pcs"
];

const DIAMETER_ENUM = [
  "11 MM",
  "9 MM",
  "8.25 MM",
  "7.5 MM",
  "7 MM",
  "6.4 MM",
  "6 MM",
  "5.6 MM",
  "5.2 MM",
  "4.7 MM",
  "4.4 MM",
  "4 MM",
  "3.6 MM",
  "3.25 MM",
  "3 MM",
  "2.8 MM",
  "2.5 MM"
];

const BALL_GAUGE_ENUM = [
  "-", "-", "-", "-",
  "38", "34", "33", "31", "30", "25", "22", "20", "17", "15", "13", "12", "10"
];

const WIRE_GAUGE_ENUM = [
  "-", "-", "0", "-", "1.5", "3", "3.5", "4", "5", "6", "7", "8", "9", "10", "-", "11", "12"
];

const OTHER_WEIGHT_ENUM = [
  "1.2",
  "1",
  "0.85",
  "0.65",
  "0.5",
  "0.4",
  "0.35",
  "0.3",
  "0.25",
  "0.2",
  "0.175",
  "0.15",
  "0.125",
  "0.1",
  "0.09",
  "0.075",
  "0.055"
];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    category: { type: String, required: true },
    images: { type: [String], default: [] },

    // Mala-specific fields
    capSize: {
      type: String,
      enum: CAP_SIZE_ENUM,
      default: "",
      required: function () {
        return this.category && this.category.toLowerCase() === 'mala';
      },
    },
    weight: {
      type: String,
      enum: WEIGHT_ENUM,
      default: "",
      required: function () {
        return this.category && this.category.toLowerCase() === 'mala';
      },
    },
    tulsiRudrakshMM: {
      type: String,
      enum: TULSI_RUDRAKSH_MM_ENUM,
      default: "",
      required: function () {
        return this.category && this.category.toLowerCase() === 'mala';
      },
    },
    estPCS: {
      type: String,
      enum: TULSI_RUDRAKSH_ESTPCS_ENUM,
      default: "",
      required: function () {
        return this.category && this.category.toLowerCase() === 'mala';
      },
    },

    // Non-mala fields
    diameter: {
      type: String,
      enum: DIAMETER_ENUM,
      default: "",
      required: function () {
        return this.category && this.category.toLowerCase() !== 'mala';
      },
    },
    ballGauge: {
      type: String,
      enum: BALL_GAUGE_ENUM,
      default: "",
      required: function () {
        return this.category && this.category.toLowerCase() !== 'mala';
      },
    },
    wireGauge: {
      type: String,
      enum: WIRE_GAUGE_ENUM,
      default: "",
      required: function () {
        return this.category && this.category.toLowerCase() !== 'mala';
      },
    },
    otherWeight: {
      type: String,
      enum: OTHER_WEIGHT_ENUM,
      default: "",
      required: function () {
        return this.category && this.category.toLowerCase() !== 'mala';
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
