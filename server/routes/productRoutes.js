const express = require('express');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const Product = require('../models/Product');
const router = express.Router();

// Create a new product
router.post('/new-product',authenticateToken,authorizeRole('admin'), async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get products that are low in stock
router.get('/low-stock',authenticateToken,authorizeRole('admin'), async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5; // Default threshold set to 5
    const lowStockProducts = await Product.find({ stockQuantity: { $lt: threshold }, isDeleted: false });

    res.json(lowStockProducts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Read individual product
router.get('/:id',authenticateToken, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isDeleted: false });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read paginated list of products
router.get('/all-products',authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const products = await Product.find({ isDeleted: false })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update product details
router.put('/update/:id',authenticateToken,authorizeRole('admin'), async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Soft-delete a product
router.delete('/soft-delete/:id',authenticateToken,authorizeRole('admin'), async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product soft-deleted successfully', product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Permanently delete a product
router.delete('/delete/:id',authenticateToken,authorizeRole('admin'), async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product permanently deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Adjust stock level for a product
router.put('/:id/adjust-stock',authenticateToken,authorizeRole('admin'), async (req, res) => {
  try {
    const { adjustment } = req.body; // Expecting adjustment to be a positive or negative integer
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $inc: { stockQuantity: adjustment } }, // Use $inc to increase or decrease
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Stock adjusted successfully', product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// Get an overview of all products and their stock levels
router.get('/inventory-overview',authenticateToken,authorizeRole('admin'), async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false }, 'name SKU stockQuantity');

    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



module.exports = router;