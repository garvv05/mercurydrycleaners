const Order = require('../models/Order');
const User = require('../models/User');
const Service = require('../models/Service');

exports.getDashboardStats = async (req, res) => {
  try {
    const orders = await Order.find({});
    const users = await User.find({ role: 'customer' });

    const totalOrders = orders.length;
    
    // Today's date in YYYY-MM-DD
    const todayStr = new Date().toISOString().split('T')[0];
    const todayBookings = orders.filter(o => 
      (o.createdAt && o.createdAt.startsWith(todayStr)) || o.preferredDate === todayStr
    ).length;

    const pendingOrders = orders.filter(o => ['Booking Received', 'Confirmed', 'Garments Received'].includes(o.orderStatus)).length;
    const processingOrders = orders.filter(o => ['Inspection in Progress', 'Processing', 'Quality Check'].includes(o.orderStatus)).length;
    const completedOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
    const readyOrders = orders.filter(o => ['Ready for Pickup', 'Out for Delivery'].includes(o.orderStatus)).length;

    // Total revenue from non-cancelled orders
    const totalRevenue = orders
      .filter(o => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + (Number(o.finalTotal) || 0), 0);

    // Monthly revenue (last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevenue = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mIdx = d.getMonth();
      const y = d.getFullYear();
      const prefix = `${y}-${String(mIdx + 1).padStart(2, '0')}`;
      
      const monthOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(prefix) && o.orderStatus !== 'Cancelled');
      const rev = monthOrders.reduce((sum, o) => sum + (Number(o.finalTotal) || 0), 0);
      
      monthlyRevenue.push({
        month: `${monthNames[mIdx]} ${y}`,
        revenue: rev,
        orders: monthOrders.length
      });
    }

    // Weekly orders (last 7 days)
    const weeklyOrders = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const count = orders.filter(o => (o.createdAt && o.createdAt.startsWith(dateStr)) || o.preferredDate === dateStr).length;
      weeklyOrders.push({
        day: dayName,
        date: dateStr,
        orders: count
      });
    }

    // Order status distribution
    const statusCounts = {};
    orders.forEach(o => {
      const st = o.orderStatus || 'Booking Received';
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    });

    const statusDistribution = Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status]
    }));

    // Popular services breakdown
    const serviceCounts = {};
    orders.forEach(o => {
      if (Array.isArray(o.items)) {
        o.items.forEach(it => {
          const sName = it.serviceType || 'Dry Cleaning';
          serviceCounts[sName] = (serviceCounts[sName] || 0) + (Number(it.quantity) || 1);
        });
      }
    });

    const popularServices = Object.keys(serviceCounts).map(name => ({
      name,
      count: serviceCounts[name]
    })).sort((a, b) => b.count - a.count);

    return res.json({
      success: true,
      stats: {
        totalOrders,
        todayBookings,
        pendingOrders,
        processingOrders,
        completedOrders,
        readyOrders,
        totalCustomers: users.length,
        totalRevenue
      },
      charts: {
        monthlyRevenue,
        weeklyOrders,
        statusDistribution,
        popularServices
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate analytics' });
  }
};

// CSV Export
exports.exportOrdersCsv = async (req, res) => {
  try {
    const orders = await Order.find({});
    
    // Header
    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Phone',
      'Booking Type',
      'Status',
      'Items Count',
      'Subtotal (INR)',
      'Discount (INR)',
      'Final Total (INR)',
      'Payment Status',
      'Payment Method'
    ];

    const rows = orders.map(o => [
      `"${o.orderId || ''}"`,
      `"${o.preferredDate || ''}"`,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      `"${o.customerPhone || ''}"`,
      `"${o.bookingType || 'pickup'}"`,
      `"${o.orderStatus || ''}"`,
      `"${Array.isArray(o.items) ? o.items.reduce((s, i) => s + (i.quantity || 1), 0) : 0}"`,
      `"${o.subtotal || 0}"`,
      `"${o.discount || 0}"`,
      `"${o.finalTotal || 0}"`,
      `"${o.paymentStatus || 'Pending'}"`,
      `"${o.paymentPreference || 'cash'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="mercury_drycleaners_orders.csv"');
    return res.status(200).send(csvContent);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to export CSV' });
  }
};
