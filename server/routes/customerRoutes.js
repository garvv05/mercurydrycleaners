const express = require('express');
const router = express.Router();
const { getAllCustomers, getCustomerDetails } = require('../controllers/customerController');
const { adminOnly } = require('../middleware/authMiddleware');

router.get('/', adminOnly, getAllCustomers);
router.get('/:id', adminOnly, getCustomerDetails);

module.exports = router;
