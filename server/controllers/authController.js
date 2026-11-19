const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'mercury_drycleaners_jwt_secret_key_ludhiana_secure_2026';

const generateToken = (id, role = 'customer') => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '30d' });
};

// Customer Register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, street, landmark, city, postalCode } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const initialAddresses = [];
    if (street) {
      initialAddresses.push({
        label: 'Home',
        street,
        landmark: landmark || '',
        city: city || 'Ludhiana',
        postalCode: postalCode || '141001',
        isDefault: true
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      addresses: initialAddresses
    });

    const token = generateToken(user._id, 'customer');

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// Customer Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role || 'customer');

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses || []
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// Get current profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { password, ...userData } = user;
    return res.json({ success: true, user: userData });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving profile' });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true }
    );
    const { password, ...userData } = updated;
    return res.json({ success: true, message: 'Profile updated successfully', user: userData });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

// Saved Addresses
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const newAddress = {
      _id: 'addr_' + Date.now(),
      label: req.body.label || 'Home',
      street: req.body.street,
      landmark: req.body.landmark || '',
      city: req.body.city || 'Ludhiana',
      postalCode: req.body.postalCode || '141001',
      isDefault: req.body.isDefault || user.addresses.length === 0
    };

    let addresses = user.addresses || [];
    if (newAddress.isDefault) {
      addresses = addresses.map(a => ({ ...a, isDefault: false }));
    }
    addresses.push(newAddress);

    await User.findByIdAndUpdate(req.user._id, { addresses });
    return res.json({ success: true, message: 'Address saved', addresses });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add address' });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const addresses = (user.addresses || []).filter(a => a._id !== req.params.id && a.id !== req.params.id);
    await User.findByIdAndUpdate(req.user._id, { addresses });
    return res.json({ success: true, message: 'Address removed', addresses });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete address' });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin && (normalizedEmail === 'admin@mercurydrycleaners.com' || normalizedEmail === 'garvv22gmail.com' || normalizedEmail === 'garvv22@gmail.com')) {
      admin = await Admin.findOne({});
    }
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    await Admin.findByIdAndUpdate(admin._id, { lastLogin: new Date() });

    const token = generateToken(admin._id, admin.role || 'admin');

    return res.json({
      success: true,
      message: 'Admin authorization granted',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during admin login' });
  }
};
