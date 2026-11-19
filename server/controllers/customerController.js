const User = require('../models/User');
const Order = require('../models/Order');

exports.getAllCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    let users = await User.find({ role: 'customer' }, { createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      users = users.filter(u => 
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.phone && u.phone.includes(q))
      );
    }

    const customersWithStats = await Promise.all(users.map(async (u) => {
      const orders = await Order.find({ user: u._id });
      const phoneOrders = await Order.find({ customerPhone: u.phone });
      
      const allOrders = [...orders];
      phoneOrders.forEach(po => {
        if (!allOrders.some(o => o.orderId === po.orderId)) {
          allOrders.push(po);
        }
      });

      const totalSpent = allOrders.reduce((sum, o) => sum + (Number(o.finalTotal) || 0), 0);

      const { password, ...safeUser } = u;
      return {
        ...safeUser,
        totalOrders: allOrders.length,
        totalSpent,
        lastOrderDate: allOrders.length > 0 ? allOrders[0].createdAt : null
      };
    }));

    return res.json({ success: true, count: customersWithStats.length, customers: customersWithStats });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve customers' });
  }
};

exports.getCustomerDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const orders = await Order.find({ user: user._id }, { createdAt: -1 });
    const { password, ...safeUser } = user;

    return res.json({
      success: true,
      customer: safeUser,
      orders
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load customer profile' });
  }
};
