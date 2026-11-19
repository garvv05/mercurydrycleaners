const Review = require('../models/Review');

exports.getPublicReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true }, { createdAt: -1 });
    return res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load reviews' });
  }
};

exports.submitReview = async (req, res) => {
  try {
    const { customerName, customerLocation, rating, reviewText, garmentCleaned } = req.body;
    if (!customerName || !rating || !reviewText) {
      return res.status(400).json({ success: false, message: 'Name, rating, and review text are required' });
    }

    const review = await Review.create({
      customerName,
      customerLocation: customerLocation || 'Ludhiana',
      rating: Number(rating),
      reviewText,
      garmentCleaned: garmentCleaned || 'Formal Suit & Garments',
      isApproved: false, // requires admin approval
      isFeatured: false
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted for verification.',
      review
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
};

exports.getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find({}, { createdAt: -1 });
    return res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve reviews' });
  }
};

exports.approveReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved, isFeatured } = req.body;
    const updates = {};
    if (isApproved !== undefined) updates.isApproved = Boolean(isApproved);
    if (isFeatured !== undefined) updates.isFeatured = Boolean(isFeatured);

    const updated = await Review.findByIdAndUpdate(id, updates, { new: true });
    return res.json({ success: true, message: 'Review status updated', review: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update review' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Review removed' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
};
