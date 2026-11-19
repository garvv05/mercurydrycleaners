const mongoose = require('mongoose');
const { createDualModel } = require('./modelHelper');

const reviewSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  customerLocation: { type: String, default: 'Ludhiana' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  garmentCleaned: { type: String, default: 'Formal Suit & Designer Wear' },
  isApproved: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const MongooseReview = mongoose.model('Review', reviewSchema);
const Review = createDualModel('reviews', MongooseReview);

module.exports = Review;
