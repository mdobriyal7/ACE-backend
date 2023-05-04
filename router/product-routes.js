const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const { cloudinaryConfig } = require("../utils/cloudinary");

// Set up multer and cloudinary for image uploading
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "ecommerce/products",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }],
});

const parser = multer({ storage: storage });

// GET all product
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific product by ID
router.get("/:id", getProduct, (req, res) => {
  res.json(res.product);
});

// POST a new product
router.post("/", parser.single("image"), async (req, res) => {
  const product = new Product({
    name: req.body.name,
    priceGross: req.body.priceGross,
    vat: req.body.vat,
    priceNet: req.body.priceNet,
    totalStock: req.body.totalStock,
    imageUrl: req.file.path,
  });
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE an existing product
router.patch("/:id", getProduct, parser.single("image"), async (req, res) => {
  const allowedFields = [
    "name",
    "priceGross",
    "vat",
    "priceNet",
    "totalStock",
    "imageUrl",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] != null) {
      res.product[field] = req.body[field];
    }
  });

  if (req.file != null) {
    res.product.imageUrl = req.file.path;
  }

  try {
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a product
router.delete("/:id", getProduct, async (req, res) => {
  try {
    await res.product.remove();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a specific product by ID
async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: "Cannot find product" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.product = product;
  next();
}

module.exports = router;
