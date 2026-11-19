const express = require('express');
const router = express.Router();
const {
  createBooking,
  trackOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  updateOrderDetails,
  cancelOrder
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.post('/booking', createBooking);
router.post('/track', trackOrder);
router.get('/:id', getOrderById);

// Customer protected
router.get('/user/my-orders', protect, getMyOrders);
router.post('/:id/cancel', protect, cancelOrder);

// Admin protected
router.get('/admin/all', adminOnly, getAllOrders);
router.patch('/admin/:id/status', adminOnly, updateOrderStatus);
router.put('/admin/:id/details', adminOnly, updateOrderDetails);
router.post('/admin/:id/cancel', adminOnly, cancelOrder);

module.exports = router;
