const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB } = require('./config/db');
const { initSocket } = require('./config/socket');

// Route imports
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const pricingRoutes = require('./routes/pricingRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const faqRoutes = require('./routes/faqRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const contactRoutes = require('./routes/contactRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const customerRoutes = require('./routes/customerRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static upload files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    business: 'MERCURY DRYCLEANERS',
    location: 'Ghumar Mandi, Ludhiana, Punjab, India',
    tagline: 'Your Clothes. Our Care. Always Fresh.',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/upload', uploadRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  await connectDB();

  // Auto-seed if services collection is empty
  try {
    const Service = require('./models/Service');
    const serviceCount = await Service.countDocuments({});
    if (serviceCount === 0) {
      console.log('[Server] No services found. Auto-seeding initial Mercury Drycleaners dataset...');
      const seedData = require('./utils/seeder');
      await seedData();
    }
  } catch (err) {
    console.warn('[Server] Auto-seed check error:', err.message);
  }

  server.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`  MERCURY DRYCLEANERS BACKEND API IS ONLINE `);
    console.log(`  Location: Ghumar Mandi, Ludhiana, Punjab, India`);
    console.log(`  Port: http://localhost:${PORT}`);
    console.log(`  Socket.io: Enabled for live order updates & admin alerts`);
    console.log(`===================================================`);
  });
};

startServer();

module.exports = { app, server };
