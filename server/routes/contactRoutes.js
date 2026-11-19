const express = require('express');
const router = express.Router();
const { sendMessage, getAllMessagesAdmin, markAsRead, deleteMessage } = require('../controllers/contactController');
const { adminOnly } = require('../middleware/authMiddleware');

router.post('/', sendMessage);

router.get('/admin', adminOnly, getAllMessagesAdmin);
router.patch('/admin/:id/read', adminOnly, markAsRead);
router.delete('/admin/:id', adminOnly, deleteMessage);

module.exports = router;
