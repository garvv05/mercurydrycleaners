const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
  reorderServices
} = require('../controllers/serviceController');
const { adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllServices);
router.get('/:slug', getServiceBySlug);

router.post('/', adminOnly, createService);
router.put('/reorder', adminOnly, reorderServices);
router.put('/:id', adminOnly, updateService);
router.delete('/:id', adminOnly, deleteService);

module.exports = router;
