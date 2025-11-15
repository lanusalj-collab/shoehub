const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, required: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true }
    },
    items: [
      {
        id: mongoose.Schema.Types.Mixed,
        name: String,
        price: Number,
        qty: Number,
        category: String,
        image: String
      }
    ],
    total: { type: Number, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'completed', 'shipped', 'cancelled'] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
