const ContactMessage = require('../models/ContactMessage');

exports.sendMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const newMessage = await ContactMessage.create({
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      subject: subject || 'General Enquiry',
      message,
      isRead: false
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Our team at Ghumar Mandi will get back to you shortly.',
      data: newMessage
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

exports.getAllMessagesAdmin = async (req, res) => {
  try {
    const messages = await ContactMessage.find({}, { createdAt: -1 });
    return res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve messages' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ContactMessage.findByIdAndUpdate(id, { isRead: true }, { new: true });
    return res.json({ success: true, message: 'Message marked as read', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update message' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await ContactMessage.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Message removed' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete message' });
  }
};
