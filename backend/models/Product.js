const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'Shoes' },
  sizes: { type: [String], default: [] },
  price: { type: Number, default: 0 },
  desc: { type: String, default: '' },
  stock: { type: Number, default: 0 },
  image: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
