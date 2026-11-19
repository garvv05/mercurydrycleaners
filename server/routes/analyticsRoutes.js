const express = require('express');
const router = express.Router();
const { getDashboardStats, exportOrdersCsv } = require('../controllers/analyticsController');
const { adminOnly } = require('../middleware/authMiddleware');

router.get('/dashboard', adminOnly, getDashboardStats);
router.get('/export-orders-csv', adminOnly, exportOrdersCsv);

module.exports = router;
