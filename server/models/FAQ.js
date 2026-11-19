const mongoose = require('mongoose');
const { createDualModel } = require('./modelHelper');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { 
    type: String, 
    default: 'General',
    enum: ['General', 'Dry Cleaning', 'Pricing', 'Pickup & Delivery', 'Garment Care']
  },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const MongooseFAQ = mongoose.model('FAQ', faqSchema);
const FAQ = createDualModel('faqs', MongooseFAQ);

module.exports = FAQ;
