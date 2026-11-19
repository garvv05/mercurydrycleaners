const Coupon = require('../models/Coupon');

exports.validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code required' });
    }

    const orderAmount = Number(subtotal) || 0;
    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: 'This coupon has expired' });
    }

    if (orderAmount < (coupon.minOrderAmount || 0)) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${coupon.minOrderAmount} required for this coupon`
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.min((orderAmount * coupon.discountValue) / 100, coupon.maxDiscount || 1000);
    } else {
      discount = Math.min(coupon.discountValue, orderAmount);
    }

    return res.json({
      success: true,
      message: `Coupon applied: Saved ₹${Math.round(discount)}!`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discount)
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error checking coupon' });
  }
};

exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}, { createdAt: -1 });
    return res.json({ success: true, count: coupons.length, coupons });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const { code, title, description, discountType, discountValue, minOrderAmount, maxDiscount, expiryDate } = req.body;
    
    const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const newCoupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      title: title || `${discountValue}% OFF`,
      description: description || '',
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount || 0),
      maxDiscount: Number(maxDiscount || 1000),
      expiryDate: new Date(expiryDate || Date.now() + 90 * 24 * 60 * 60 * 1000),
      isActive: true
    });

    return res.status(201).json({ success: true, message: 'Coupon created', coupon: newCoupon });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create coupon' });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.code) updates.code = updates.code.toUpperCase().trim();
    if (updates.discountValue) updates.discountValue = Number(updates.discountValue);
    if (updates.minOrderAmount !== undefined) updates.minOrderAmount = Number(updates.minOrderAmount);

    const updated = await Coupon.findByIdAndUpdate(id, updates, { new: true });
    return res.json({ success: true, message: 'Coupon updated', coupon: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update coupon' });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await Coupon.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete coupon' });
  }
};
