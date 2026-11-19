const mongoose = require('mongoose');
const { createDualModel } = require('./modelHelper');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Dry Cleaning', 'Ironing', 'Premium Care', 'Home Textiles']
  },
  startingPrice: { type: Number, required: true },
  estimatedTime: { type: String, default: '48 Hours' },
  image: { type: String, required: true },
  gallery: [{ type: String }],
  features: [{ type: String }],
  careTips: [{ type: String }],
  included: [{ type: String }],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const MongooseService = mongoose.model('Service', serviceSchema);
const Service = createDualModel('services', MongooseService);

module.exports = Service;
