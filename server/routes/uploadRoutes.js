const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { adminOnly } = require('../middleware/authMiddleware');

router.post('/', adminOnly, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({ success: true, message: 'Upload successful', url: fileUrl });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
});

module.exports = router;
