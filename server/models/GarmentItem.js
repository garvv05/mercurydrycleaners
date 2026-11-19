const mongoose = require('mongoose');
const { createDualModel } = require('./modelHelper');

const garmentItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    trim: true
  },
  dryCleanPrice: { type: Number, required: true },
  steamIronPrice: { type: Number, required: true },
  premiumCarePrice: { type: Number, required: true },
  description: { type: String, default: '' },
  fabricAdvice: { type: String, default: 'Handled with fabric-safe gentle solvent treatment.' },
  icon: { type: String, default: 'shirt' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
});

const MongooseGarmentItem = mongoose.model('GarmentItem', garmentItemSchema);
const GarmentItem = createDualModel('garment_items', MongooseGarmentItem);

module.exports = GarmentItem;
