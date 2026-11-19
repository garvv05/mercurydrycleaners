const mongoose = require('mongoose');
const { createDualModel } = require('./modelHelper');

const orderItemSchema = new mongoose.Schema({
  garmentName: { type: String, required: true },
  serviceType: { type: String, default: 'Dry Cleaning' },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true }
});

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  note: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  invoiceNumber: { type: String, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  customerName: { type: String, required: true, trim: true },
  customerPhone: { type: String, required: true, trim: true },
  customerEmail: { type: String, default: '', trim: true },
  bookingType: { type: String, enum: ['pickup', 'dropoff'], default: 'pickup' },
  pickupAddress: {
    street: { type: String, default: '' },
    landmark: { type: String, default: '' },
    city: { type: String, default: 'Ludhiana' },
    postalCode: { type: String, default: '141001' }
  },
  preferredDate: { type: String, required: true },
  preferredTimeSlot: { type: String, required: true },
  services: [{
    serviceId: { type: String },
    serviceName: { type: String }
  }],
  items: [orderItemSchema],
  specialInstructions: { type: String, default: '' },
  stainsNotes: { type: String, default: '' },
  delicateFabricNotes: { type: String, default: '' },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  couponApplied: {
    code: { type: String, default: '' },
    discountAmount: { type: Number, default: 0 }
  },
  taxes: { type: Number, default: 0 },
  pickupCharge: { type: Number, default: 0 },
  finalTotal: { type: Number, required: true },
  paymentPreference: { 
    type: String, 
    enum: ['cash', 'upi', 'online'], 
    default: 'cash' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'], 
    default: 'Pending' 
  },
  orderStatus: {
    type: String,
    enum: [
      'Booking Received',
      'Confirmed',
      'Garments Received',
      'Inspection in Progress',
      'Processing',
      'Quality Check',
      'Ready for Pickup',
      'Out for Delivery',
      'Delivered',
      'Cancelled'
    ],
    default: 'Booking Received'
  },
  statusHistory: [statusHistorySchema],
  estimatedCompletionDate: { type: String, default: '' },
  garmentInspectionNotes: { type: String, default: '' },
  internalNotes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const MongooseOrder = mongoose.model('Order', orderSchema);
const Order = createDualModel('orders', MongooseOrder);

module.exports = Order;
