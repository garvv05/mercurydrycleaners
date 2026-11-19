const express = require('express');
const router = express.Router();
const {
  getPublicReviews,
  submitReview,
  getAllReviewsAdmin,
  approveReview,
  deleteReview
} = require('../controllers/reviewController');
const { adminOnly } = require('../middleware/authMiddleware');

router.get('/public', getPublicReviews);
router.post('/', submitReview);

router.get('/admin', adminOnly, getAllReviewsAdmin);
router.patch('/admin/:id', adminOnly, approveReview);
router.delete('/admin/:id', adminOnly, deleteReview);

module.exports = router;
