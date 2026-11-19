const express = require('express');
const router = express.Router();
const {
  getPublicFaqs,
  getAllFaqsAdmin,
  createFaq,
  updateFaq,
  deleteFaq
} = require('../controllers/faqController');
const { adminOnly } = require('../middleware/authMiddleware');

router.get('/public', getPublicFaqs);

router.get('/admin', adminOnly, getAllFaqsAdmin);
router.post('/admin', adminOnly, createFaq);
router.put('/admin/:id', adminOnly, updateFaq);
router.delete('/admin/:id', adminOnly, deleteFaq);

module.exports = router;
