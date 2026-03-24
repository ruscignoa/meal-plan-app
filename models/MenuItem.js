const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['sandwiches', 'specialty-sandwiches', 'pasta', 'chicken', 'meat-seafood', 'vegetables', 'catering-packages', 'group-lunch'],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  pricingType: {
    type: String,
    enum: ['per-item', 'per-person', 'per-package'],
    default: 'per-item',
  },
  servesCount: {
    type: Number,
    default: null,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
