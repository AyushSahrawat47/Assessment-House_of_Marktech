// server/routes/reportRoutes.js
const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// Inventory Report - Admin only
router.get('/inventory', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const products = await Product.find();
    const report = products.map(product => ({
      productId: product._id,
      name: product.name,
      price: product.price,
      stock: product.stock,
    }));
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Error generating inventory report' });
  }
});

//sales route - admin only
router.get('/sales', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const orders = await Order.find().populate('products.product'); // Populate product references
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalCost, 0); // Use totalCost instead of totalAmount
    const totalOrders = orders.length;

    // Sales by Product
    const salesByProduct = orders.reduce((acc, order) => {
      order.products.forEach(item => {
        const productId = item.product._id.toString(); // Ensure correct product reference
        acc[productId] = (acc[productId] || 0) + item.quantity;
      });
      return acc;
    }, {});

    res.json({
      totalRevenue,
      totalOrders,
      salesByProduct,
    });
  } catch (error) {
    console.error('Error generating sales report:', error); // Log error for debugging
    res.status(500).send(error); // Send detailed error response
  }
});


// Orders per Day Report - Admin only
router.get('/orders-per-day', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const orders = await Order.find();
    const ordersPerDay = {};

    orders.forEach(order => {
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      ordersPerDay[date] = (ordersPerDay[date] || 0) + 1;
    });

    res.json(ordersPerDay);
  } catch (error) {
    res.status(500).json({ error: 'Error generating orders per day report' });
  }
});

// Top Selling Products - Admin only
router.get('/top-selling-products', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const orders = await Order.find().populate('products.product'); // Populate the product reference
    const productSales = {};

    // Iterate over orders and accumulate sales data
    orders.forEach(order => {
      order.products.forEach(item => {
        const productId = item.product._id.toString();  // Access the product's ObjectId
        const productName = item.product.name;  // Assuming `name` is part of the `Product` model

        if (!productSales[productId]) {
          productSales[productId] = { quantity: 0, name: productName };
        }
        productSales[productId].quantity += item.quantity;
      });
    });

    // Sort products by quantity and take the top 5
    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    res.json(topSellingProducts);
  } catch (error) {
    console.error('Error generating top-selling products report:', error);  // More detailed logging
    res.status(500).json({ error: 'Error generating top-selling products report' });
  }
});


module.exports = router;
