// server/routes/orderRoutes.js
const express = require('express');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const Order = require('../models/Order');
const Product = require('../models/Product');
const router = express.Router();

// Place an order
router.post('/place-order',authenticateToken, async (req, res) => {
  try {
    const { products } = req.body;

    let totalCost = 0;
    const orderItems = [];

    // Check product stock and calculate total cost
    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ error: 'Product not found' });

      // Check stock
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      // Deduct stock
      product.stockQuantity -= item.quantity;
      await product.save();

      // Calculate cost
      totalCost += product.price * item.quantity;
      orderItems.push({ product: product._id, quantity: item.quantity });
    }

    // Create the order
    const order = new Order({
      products: orderItems,
      totalCost,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//route to get previously populated order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// Update order status
router.put('/:id/status',authenticateToken,authorizeRole('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update status
    order.status = status;
    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
