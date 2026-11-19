const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const { emitNewBooking, emitOrderStatusUpdate } = require('../config/socket');

const generateOrderId = () => {
  const dateStr = new Date().toISOString().slice(2, 7).replace('-', '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `MD-${dateStr}-${randomPart}`;
};

// Create Booking / Order
exports.createBooking = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      bookingType,
      pickupAddress,
      preferredDate,
      preferredTimeSlot,
      services,
      items,
      specialInstructions,
      stainsNotes,
      delicateFabricNotes,
      couponCode,
      paymentPreference
    } = req.body;

    if (!customerName || !customerPhone || !preferredDate || !preferredTimeSlot) {
      return res.status(400).json({ success: false, message: 'Please provide all required contact and schedule details' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one garment for care' });
    }

    // Calculate subtotal
    let subtotal = 0;
    const validatedItems = items.map(item => {
      const q = Number(item.quantity) || 1;
      const p = Number(item.unitPrice) || 0;
      const t = q * p;
      subtotal += t;
      return {
        garmentName: item.garmentName || 'Garment',
        serviceType: item.serviceType || 'Dry Cleaning',
        quantity: q,
        unitPrice: p,
        total: t
      };
    });

    // Check Coupon
    let discount = 0;
    let appliedCoupon = { code: '', discountAmount: 0 };

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim(), isActive: true });
      if (coupon) {
        const isNotExpired = new Date(coupon.expiryDate) > new Date();
        const meetsMin = subtotal >= (coupon.minOrderAmount || 0);

        if (isNotExpired && meetsMin) {
          if (coupon.discountType === 'percentage') {
            discount = Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscount || 1000);
          } else {
            discount = Math.min(coupon.discountValue, subtotal);
          }
          appliedCoupon = {
            code: coupon.code,
            discountAmount: Math.round(discount)
          };
          // Increment usage
          await Coupon.findByIdAndUpdate(coupon._id, { usageCount: (coupon.usageCount || 0) + 1 });
        }
      }
    }

    const pickupCharge = (bookingType === 'pickup' && subtotal < 500) ? 50 : 0;
    const taxes = Math.round((subtotal - discount) * 0.05); // 5% GST
    const finalTotal = Math.max(0, Math.round(subtotal - discount + taxes + pickupCharge));

    const orderId = generateOrderId();
    const invoiceNumber = `INV-${orderId.replace('MD-', '')}`;

    const newOrder = await Order.create({
      orderId,
      invoiceNumber,
      user: req.user ? req.user._id : null,
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      bookingType: bookingType || 'pickup',
      pickupAddress: pickupAddress || { street: '', landmark: '', city: 'Ludhiana', postalCode: '141001' },
      preferredDate,
      preferredTimeSlot,
      services: services || [],
      items: validatedItems,
      specialInstructions: specialInstructions || '',
      stainsNotes: stainsNotes || '',
      delicateFabricNotes: delicateFabricNotes || '',
      subtotal,
      discount: Math.round(discount),
      couponApplied: appliedCoupon,
      taxes,
      pickupCharge,
      finalTotal,
      paymentPreference: paymentPreference || 'cash',
      paymentStatus: 'Pending',
      orderStatus: 'Booking Received',
      statusHistory: [
        {
          status: 'Booking Received',
          note: 'Booking successfully placed online. Our Ghumar Mandi team has been notified.',
          updatedAt: new Date()
        }
      ],
      estimatedCompletionDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    // If logged in, update user order statistics
    if (req.user && req.user._id) {
      const user = await User.findById(req.user._id);
      if (user) {
        await User.findByIdAndUpdate(req.user._id, {
          totalOrders: (user.totalOrders || 0) + 1,
          totalSpent: (user.totalSpent || 0) + finalTotal
        });
      }
    }

    // Emit real-time notification to admin dashboard
    emitNewBooking({
      orderId: newOrder.orderId,
      customerName: newOrder.customerName,
      customerPhone: newOrder.customerPhone,
      finalTotal: newOrder.finalTotal,
      bookingType: newOrder.bookingType,
      preferredDate: newOrder.preferredDate,
      preferredTimeSlot: newOrder.preferredTimeSlot,
      createdAt: newOrder.createdAt
    });

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process booking' });
  }
};

// Track Order by ID and phone
exports.trackOrder = async (req, res) => {
  try {
    const { orderId, phone } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    const cleanId = orderId.trim().toUpperCase();
    const order = await Order.findOne({ orderId: cleanId });

    if (!order) {
      return res.status(404).json({ success: false, message: 'No booking found with this Order ID' });
    }

    // If phone is provided, verify match
    if (phone && phone.trim().length > 0) {
      const cleanPhone = phone.trim().replace(/\D/g, '');
      const orderPhone = (order.customerPhone || '').replace(/\D/g, '');
      if (orderPhone && !orderPhone.endsWith(cleanPhone) && !cleanPhone.endsWith(orderPhone)) {
        return res.status(403).json({ success: false, message: 'Mobile number does not match records for this Order ID' });
      }
    }

    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving order tracking' });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let order = await Order.findOne({ orderId: id });
    if (!order) {
      order = await Order.findById(id);
    }
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

// Get current user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const userPhone = req.user.phone;

    let orders = await Order.find({ user: userId }, { createdAt: -1 });
    if (orders.length === 0 && userPhone) {
      orders = await Order.find({ customerPhone: userPhone }, { createdAt: -1 });
    }

    return res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve your orders' });
  }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status, search, date } = req.query;
    let orders = await Order.find({}, { createdAt: -1 });

    if (status && status !== 'All') {
      orders = orders.filter(o => o.orderStatus === status);
    }

    if (date) {
      orders = orders.filter(o => o.preferredDate === date || (o.createdAt && o.createdAt.startsWith(date)));
    }

    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter(o => 
        (o.orderId && o.orderId.toLowerCase().includes(q)) ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.customerPhone && o.customerPhone.includes(q)) ||
        (o.customerEmail && o.customerEmail.toLowerCase().includes(q))
      );
    }

    return res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, note } = req.body;

    const validStatuses = [
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
    ];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid status provided' });
    }

    const order = await Order.findById(id) || await Order.findOne({ orderId: id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const historyEntry = {
      status: orderStatus,
      note: note || `Status updated to ${orderStatus}`,
      updatedAt: new Date()
    };

    const statusHistory = Array.isArray(order.statusHistory) ? [...order.statusHistory, historyEntry] : [historyEntry];

    const updated = await Order.findByIdAndUpdate(order._id, {
      orderStatus,
      statusHistory
    }, { new: true });

    // Emit live status update to Socket.io room and global listeners
    emitOrderStatusUpdate(order.orderId, {
      orderId: order.orderId,
      orderStatus,
      statusHistory,
      note: historyEntry.note,
      updatedAt: historyEntry.updatedAt
    });

    return res.json({
      success: true,
      message: `Order ${order.orderId} status changed to ${orderStatus}`,
      order: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};

// Admin: Update general order details
exports.updateOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { estimatedCompletionDate, garmentInspectionNotes, internalNotes, paymentStatus } = req.body;

    const updates = {};
    if (estimatedCompletionDate !== undefined) updates.estimatedCompletionDate = estimatedCompletionDate;
    if (garmentInspectionNotes !== undefined) updates.garmentInspectionNotes = garmentInspectionNotes;
    if (internalNotes !== undefined) updates.internalNotes = internalNotes;
    if (paymentStatus !== undefined) updates.paymentStatus = paymentStatus;

    const updated = await Order.findByIdAndUpdate(id, updates, { new: true }) ||
                    await Order.findOneAndUpdate({ orderId: id }, updates, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, message: 'Order details updated', order: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update order details' });
  }
};

// Cancel Order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id) || await Order.findOne({ orderId: id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({ success: false, message: 'Cannot cancel an order that has already been delivered' });
    }

    const historyEntry = {
      status: 'Cancelled',
      note: reason || 'Order cancelled by customer or admin request',
      updatedAt: new Date()
    };

    const statusHistory = Array.isArray(order.statusHistory) ? [...order.statusHistory, historyEntry] : [historyEntry];

    const updated = await Order.findByIdAndUpdate(order._id, {
      orderStatus: 'Cancelled',
      statusHistory
    }, { new: true });

    emitOrderStatusUpdate(order.orderId, {
      orderId: order.orderId,
      orderStatus: 'Cancelled',
      statusHistory,
      note: historyEntry.note
    });

    return res.json({ success: true, message: 'Order has been cancelled', order: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
};
