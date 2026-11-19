const express = require('express');
const router = express.Router();
const {
  getAllGarments,
  updateGarmentPrice,
  createGarmentItem,
  deleteGarmentItem
} = require('../controllers/pricingController');
const { adminOnly } = require('../middleware/authMiddleware');

router.get('/garments', getAllGarments);
router.post('/garments', adminOnly, createGarmentItem);
router.put('/garments/:id', adminOnly, updateGarmentPrice);
router.delete('/garments/:id', adminOnly, deleteGarmentItem);

module.exports = router;
