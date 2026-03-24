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
    enum: ['appetizers', 'entrees', 'sides', 'desserts', 'beverages'],
  },
  pricePerPerson: {
    type: Number,
    required: true,
    min: 0,
  },
  minimumOrder: {
    type: Number,
    default: 10,
  },
  dietaryTags: {
    type: [String],
    enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free'],
    default: [],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
