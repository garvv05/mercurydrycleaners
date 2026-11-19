const mongoose = require('mongoose');
const { createDualModel } = require('./modelHelper');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'admin', 'manager'], default: 'admin' },
  permissions: [{ type: String }],
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const MongooseAdmin = mongoose.model('Admin', adminSchema);
const Admin = createDualModel('admins', MongooseAdmin);

module.exports = Admin;
