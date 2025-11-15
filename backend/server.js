require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shoehub';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Models
const Product = require('./models/Product');
const Order = require('./models/Order');

// Basic health check
app.get('/api/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));

// CRUD: Products
// Admin API key middleware: if ADMIN_API_KEY is set, require header 'x-admin-key' to match
function adminKeyMiddleware(req, res, next) {
  const required = process.env.ADMIN_API_KEY;
  if (!required) return next();
  const provided = req.headers['x-admin-key'] || req.headers['x-admin-token'] || req.query.admin_key;
  if (provided && provided === required) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).lean();
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/products', adminKeyMiddleware, async (req, res) => {
  try {
    const body = req.body || {};
    const product = new Product(body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create product', details: err.message });
  }
});

app.put('/api/products/:id', adminKeyMiddleware, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update product', details: err.message });
  }
});

app.delete('/api/products/:id', adminKeyMiddleware, async (req, res) => {
  try {
    const removed = await Product.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Checkout: Create and save order to MongoDB
app.post('/api/checkout', async (req, res) => {
  try {
    const { customer, items, total } = req.body;
    
    // Validate required fields
    if (!customer || !customer.name || !customer.email || !customer.address) {
      return res.status(400).json({ error: 'Missing required customer information' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    if (!total || total <= 0) {
      return res.status(400).json({ error: 'Invalid order total' });
    }

    // Generate unique order ID
    const orderId = `ORD-${Date.now().toString().slice(-8)}`;

    // Create and save order
    const order = new Order({
      orderId,
      customer,
      items,
      total,
      status: 'pending'
    });

    await order.save();

    console.log(`Order created: ${orderId}`);
    res.status(201).json({ 
      success: true, 
      orderId, 
      message: 'Order placed successfully' 
    });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to process order', details: err.message });
  }
});

// Get all orders (admin only, optional: protect with adminKeyMiddleware)
app.get('/api/orders', adminKeyMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id }).lean();
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Seed endpoint: create default products if collection empty
app.post('/api/products/seed', adminKeyMiddleware, async (req, res) => {
  try {
    const count = await Product.estimatedDocumentCount();
    if (count > 0) return res.status(409).json({ error: 'Products already exist' });

    const defaults = [
      { name: "Classic White Sneakers", category: 'Sneakers', sizes: ['6','7','8','9','10'], price: 2499.00, desc: "Timeless white leather sneakers perfect for everyday wear.", stock: 45, image: "https://via.placeholder.com/400x280?text=White+Sneakers" },
      { name: "Premium Running Shoes", category: 'Running', sizes: ['7','8','9','10','11'], price: 3999.00, desc: "Advanced cushioning technology for optimal running performance.", stock: 38, image: "https://via.placeholder.com/400x280?text=Running+Shoes" },
      { name: "Casual Canvas Shoes", category: 'Casual', sizes: ['6','7','8','9','10'], price: 1899.00, desc: "Comfortable canvas design for relaxed, casual style.", stock: 52, image: "https://via.placeholder.com/400x280?text=Canvas+Shoes" },
      { name: "Formal Leather Oxfords", category: 'Formal', sizes: ['7','8','9','10'], price: 4499.00, desc: "Elegant leather oxfords for professional and formal occasions.", stock: 28, image: "https://via.placeholder.com/400x280?text=Formal+Oxfords" }
    ];

    const created = await Product.insertMany(defaults);
    res.status(201).json({ inserted: created.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to seed products' });
  }
});

// Serve frontend static files (so root URL serves the site)
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// For any non-API route, serve index.html (supports client-side routing)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Fallback for other API routes (if not handled above)
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));