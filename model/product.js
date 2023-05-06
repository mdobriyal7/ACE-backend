const mongoose = require("mongoose");

const product = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  priceGross: {
    type: Number,
    required: true,
  },
  vat: {
    type: Number,
    required: true,
    enum: [10, 15, 25],
  },
  priceNet: { type: Number, required: true },

  totalStock: { type: Number, required: true },

  imageUrl: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
