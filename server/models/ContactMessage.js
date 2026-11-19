const mongoose = require('mongoose');
const { createDualModel } = require('./modelHelper');

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  subject: { type: String, default: 'General Enquiry' },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  repliedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const MongooseContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
const ContactMessage = createDualModel('contact_messages', MongooseContactMessage);

module.exports = ContactMessage;
