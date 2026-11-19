import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingBag, Layers, Tag, Users, 
  Ticket, Star, HelpCircle, FileText, BarChart3, Settings, 
  LogOut, Bell, BellOff, Volume2, VolumeX, Search, Plus, 
  Download, Check, Trash2, Edit, RefreshCw, X, ArrowUpRight, 
  Phone, Calendar, AlertCircle, Eye, Printer, Filter 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid 
} from 'recharts';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLiveSocket } from '../context/SocketContext';
import { generateInvoicePDF } from '../services/invoiceGenerator';

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const { 
    newBookingAlert, clearAlert, unreadAlerts, 
    markAlertsRead, soundEnabled, setSoundEnabled 
  } = useLiveSocket();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data states
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [garments, setGarments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [websiteSettings, setWebsiteSettings] = useState(null);
  const [contactMessages, setContactMessages] = useState([]);

  // UI / Filter states
  const [orderViewMode, setOrderViewMode] = useState('kanban'); // 'kanban' or 'table'
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null); // for detail modal

  // Notification dropdown
  const [notifDropdown, setNotifDropdown] = useState(false);

  // Edit states for modals & pricing
  const [editingGarment, setEditingGarment] = useState(null);
  const [garmentSearch, setGarmentSearch] = useState('');
  const [garmentCategory, setGarmentCategory] = useState('All');
  const [addGarmentModalOpen, setAddGarmentModalOpen] = useState(false);
  const [newGarment, setNewGarment] = useState({
    name: '',
    category: 'Suits',
    dryCleanPrice: '',
    steamIronPrice: '',
    premiumCarePrice: '',
    description: ''
  });
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);

  // Loading
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');

  // Fetch initial admin data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [
        analyticsRes,
        ordersRes,
        servicesRes,
        garmentsRes,
        customersRes,
        couponsRes,
        reviewsRes,
        faqsRes,
        settingsRes,
        messagesRes
      ] = await Promise.all([
        api.get('/analytics/dashboard').catch(() => ({ data: { success: false } })),
        api.get('/orders/admin/all').catch(() => ({ data: { success: false, orders: [] } })),
        api.get('/services?activeOnly=false').catch(() => ({ data: { success: false, services: [] } })),
        api.get('/pricing/garments').catch(() => ({ data: { success: false, items: [] } })),
        api.get('/customers').catch(() => ({ data: { success: false, customers: [] } })),
        api.get('/coupons').catch(() => ({ data: { success: false, coupons: [] } })),
        api.get('/reviews/admin').catch(() => ({ data: { success: false, reviews: [] } })),
        api.get('/faqs/admin').catch(() => ({ data: { success: false, faqs: [] } })),
        api.get('/settings').catch(() => ({ data: { success: false } })),
        api.get('/contact/admin').catch(() => ({ data: { success: false, messages: [] } })),
      ]);

      if (analyticsRes.data.success) {
        setStats(analyticsRes.data.stats);
        setCharts(analyticsRes.data.charts);
      }
      if (ordersRes.data.success) setOrders(ordersRes.data.orders);
      if (servicesRes.data.success) setServices(servicesRes.data.services);
      if (garmentsRes.data.success) setGarments(garmentsRes.data.items);
      if (customersRes.data.success) setCustomers(customersRes.data.customers);
      if (couponsRes.data.success) setCoupons(couponsRes.data.coupons);
      if (reviewsRes.data.success) setReviews(reviewsRes.data.reviews);
      if (faqsRes.data.success) setFaqs(faqsRes.data.faqs);
      if (settingsRes.data.success) setWebsiteSettings(settingsRes.data.settings);
      if (messagesRes.data.success) setContactMessages(messagesRes.data.messages);
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const showToast = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  // Status Updater (emits real-time live update to customer tracking page)
  const handleUpdateOrderStatus = async (orderId, newStatus, note = '') => {
    try {
      const res = await api.patch(`/orders/admin/${orderId}/status`, {
        orderStatus: newStatus,
        note: note || `Status updated to ${newStatus}`
      });
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId || o._id === orderId ? res.data.order : o))
        );
        if (selectedOrder && selectedOrder.orderId === orderId) {
          setSelectedOrder(res.data.order);
        }
        showToast(`Order ${orderId} updated to ${newStatus}`);
      }
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateOrderPayment = async (orderId, paymentStatus) => {
    try {
      const res = await api.put(`/orders/admin/${orderId}/details`, { paymentStatus });
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId || o._id === orderId ? res.data.order : o))
        );
        showToast(`Payment status updated to ${paymentStatus}`);
      }
    } catch (err) {
      alert('Failed to update payment');
    }
  };

  // Garment Price Management
  const handleSaveGarmentPrice = async (garmentId, updates) => {
    try {
      const res = await api.put(`/pricing/garments/${garmentId}`, updates);
      if (res.data.success) {
        setGarments((prev) => prev.map((g) => (g._id === garmentId ? res.data.item : g)));
        setEditingGarment(null);
        showToast('Garment rate updated successfully');
      }
    } catch (err) {
      alert('Failed to update price');
    }
  };

  const handleAddGarment = async (e) => {
    e.preventDefault();
    if (!newGarment.name || !newGarment.dryCleanPrice) {
      alert('Please enter article name and dry cleaning rate');
      return;
    }
    try {
      const dryClean = Number(newGarment.dryCleanPrice);
      const payload = {
        ...newGarment,
        dryCleanPrice: dryClean,
        steamIronPrice: Number(newGarment.steamIronPrice || Math.round(dryClean * 0.5)),
        premiumCarePrice: Number(newGarment.premiumCarePrice || Math.round(dryClean * 1.3))
      };
      const res = await api.post('/pricing/garments', payload);
      if (res.data.success) {
        setGarments((prev) => [...prev, res.data.item]);
        setAddGarmentModalOpen(false);
        setNewGarment({
          name: '',
          category: 'Suits',
          dryCleanPrice: '',
          steamIronPrice: '',
          premiumCarePrice: '',
          description: ''
        });
        showToast('New article added to price list');
      }
    } catch (err) {
      alert('Failed to add article');
    }
  };

  const handleDeleteGarment = async (garmentId) => {
    if (!window.confirm('Are you sure you want to remove this article from the price list?')) return;
    try {
      const res = await api.delete(`/pricing/garments/${garmentId}`);
      if (res.data.success) {
        setGarments((prev) => prev.filter((g) => g._id !== garmentId));
        showToast('Article removed from price list');
      }
    } catch (err) {
      alert('Failed to delete garment item');
    }
  };

  // Review Approval
  const handleApproveReview = async (reviewId, isApproved) => {
    try {
      const res = await api.patch(`/reviews/admin/${reviewId}`, { isApproved });
      if (res.data.success) {
        setReviews((prev) => prev.map((r) => (r._id === reviewId ? res.data.review : r)));
        showToast(`Review ${isApproved ? 'approved' : 'hidden'}`);
      }
    } catch (err) {
      alert('Failed to update review status');
    }
  };

  // CSV Export Download
  const handleExportCsv = async () => {
    try {
      const res = await api.get('/analytics/export-orders-csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Mercury_Orders_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('CSV Export downloaded');
    } catch (err) {
      alert('Failed to export CSV');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter;
    const matchesSearch =
      (o.orderId && o.orderId.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (o.customerName && o.customerName.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (o.customerPhone && o.customerPhone.includes(orderSearch));
    return matchesStatus && matchesSearch;
  });

  const validStatuses = [
    'Booking Received',
    'Confirmed',
    'Garments Received',
    'Inspection in Progress',
    'Processing',
    'Quality Check',
    'Ready for Pickup',
    'Out for Delivery',
    'Delivered'
  ];

  const COLORS = ['#2563EB', '#102A43', '#0284C7', '#10B981', '#F59E0B', '#8B5CF6'];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col pt-16">
      
      {/* Toast Notification Bar */}
      <AnimatePresence>
        {actionSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-2xl flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{actionSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="h-16 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-hidden"
          >
            <Layers className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg text-white tracking-wider">
              MERCURY
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Admin Console
            </span>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-4 text-xs">
          
          {/* Audio Alert Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 ${
              soundEnabled
                ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                : 'border-slate-700 text-slate-500 hover:text-slate-300'
            }`}
            title={soundEnabled ? 'Live Order Sound Alerts: ON' : 'Live Order Sound Alerts: MUTED'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline text-[11px] font-medium">{soundEnabled ? 'Alerts ON' : 'Muted'}</span>
          </button>

          {/* Real-time Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifDropdown(!notifDropdown);
                if (unreadAlerts.length > 0) markAlertsRead();
              }}
              className="relative p-2 rounded-xl border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white bg-slate-900"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                  {unreadAlerts.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {notifDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-white">Live Booking Alerts</span>
                    <button
                      onClick={markAlertsRead}
                      className="text-[10px] text-blue-400 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>

                  {unreadAlerts.length === 0 ? (
                    <p className="text-slate-500 py-4 text-center text-xs">
                      No new booking alerts right now.
                    </p>
                  ) : (
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {unreadAlerts.map((alt, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-blue-400">{alt.orderId}</span>
                            <span className="text-emerald-400 font-bold">₹{alt.finalTotal}</span>
                          </div>
                          <p className="text-slate-300">{alt.customerName} ({alt.customerPhone})</p>
                          <p className="text-[10px] text-slate-500">{alt.bookingType} • {alt.preferredDate}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Admin Avatar & Logout */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <span className="hidden sm:inline font-semibold text-slate-300">
              {admin?.name || 'Administrator'}
            </span>
            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
              title="Logout from Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } bg-slate-950 border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between shrink-0`}>
          <div className="p-3 space-y-1.5 overflow-y-auto">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'orders', label: 'Orders & Kanban', icon: ShoppingBag, count: orders.length },
              { id: 'services', label: 'Service Catalog', icon: Layers },
              { id: 'pricing', label: 'Garment Pricing', icon: Tag },
              { id: 'customers', label: 'Customers Directory', icon: Users },
              { id: 'coupons', label: 'Coupons & Offers', icon: Ticket },
              { id: 'reviews', label: 'Customer Reviews', icon: Star },
              { id: 'faqs', label: 'FAQs Management', icon: HelpCircle },
              { id: 'content', label: 'Website Content', icon: FileText },
              { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
              { id: 'settings', label: 'Business Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </div>
                  {sidebarOpen && item.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      active ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          {sidebarOpen && (
            <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-500">
              <p className="font-semibold text-slate-400">Mercury Drycleaners</p>
              <p>Ghumar Mandi, Ludhiana</p>
            </div>
          )}
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 bg-slate-900 overflow-y-auto p-4 sm:p-8 space-y-6">
          
          {/* TAB 1: OVERVIEW & REAL-TIME ANALYTICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Counter Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { label: 'Total Orders', val: stats?.totalOrders || orders.length, color: 'text-blue-400' },
                  { label: "Today's Bookings", val: stats?.todayBookings || 0, color: 'text-emerald-400' },
                  { label: 'Pending Pickup', val: stats?.pendingOrders || 0, color: 'text-amber-400' },
                  { label: 'In Processing', val: stats?.processingOrders || 0, color: 'text-sky-400' },
                  { label: 'Completed', val: stats?.completedOrders || 0, color: 'text-teal-400' },
                  { label: 'Registered Clients', val: stats?.totalCustomers || customers.length, color: 'text-indigo-400' },
                  { label: 'Total Revenue', val: `₹${stats?.totalRevenue || 0}`, color: 'text-amber-300' },
                ].map((m, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block truncate">
                      {m.label}
                    </span>
                    <span className={`font-serif font-bold text-xl sm:text-2xl ${m.color}`}>
                      {m.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Monthly Revenue Chart (8 Cols) */}
                <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-base text-white">Monthly Revenue Trend</h3>
                      <p className="text-xs text-slate-400">Database figures in Indian Rupees (₹)</p>
                    </div>
                    <button
                      onClick={handleExportCsv}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-blue-400 hover:text-white flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  <div className="h-64">
                    {charts?.monthlyRevenue && charts.monthlyRevenue.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={charts.monthlyRevenue}>
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="month" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                          <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                            itemStyle={{ color: '#60a5fa' }}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#2563EB" fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                        No monthly revenue data recorded yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Distribution Pie Chart (4 Cols) */}
                <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                  <h3 className="font-serif font-bold text-base text-white">Order Status Mix</h3>
                  <div className="h-64 flex items-center justify-center">
                    {charts?.statusDistribution && charts.statusDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={charts.statusDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {charts.statusDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-slate-500 text-xs">No status data</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Weekly Orders Bar Chart & Popular Services */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Weekly Orders (6 Cols) */}
                <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                  <h3 className="font-serif font-bold text-base text-white">Weekly Order Volume (Last 7 Days)</h3>
                  <div className="h-60">
                    {charts?.weeklyOrders ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={charts.weeklyOrders}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                          <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                          <Bar dataKey="orders" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : null}
                  </div>
                </div>

                {/* Popular Services Breakdown (6 Cols) */}
                <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                  <h3 className="font-serif font-bold text-base text-white">Popular Garment Services</h3>
                  <div className="space-y-3 pt-2">
                    {charts?.popularServices && charts.popularServices.length > 0 ? (
                      charts.popularServices.slice(0, 5).map((srv, i) => (
                        <div key={i} className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
                          <span className="font-medium text-slate-300">{srv.name}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold">
                            {srv.count} garments
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-xs">No service volume data</p>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: ORDER MANAGEMENT (KANBAN & TABLE VIEW) */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search order ID, customer name, phone..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden"
                    />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden"
                  >
                    <option value="All">All Statuses</option>
                    {validStatuses.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {/* Kanban vs Table Toggle */}
                  <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
                    <button
                      onClick={() => setOrderViewMode('kanban')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        orderViewMode === 'kanban' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Kanban Board
                    </button>
                    <button
                      onClick={() => setOrderViewMode('table')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        orderViewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Table View
                    </button>
                  </div>

                  <button
                    onClick={loadDashboardData}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                    title="Refresh data"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* View 1: Kanban Board */}
              {orderViewMode === 'kanban' && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
                  {[
                    { col: 'Booking Received', color: 'border-blue-500' },
                    { col: 'Garments Received', color: 'border-sky-500' },
                    { col: 'Processing', color: 'border-indigo-500' },
                    { col: 'Quality Check', color: 'border-amber-500' },
                    { col: 'Delivered', color: 'border-emerald-500' },
                  ].map((column) => {
                    const colOrders = filteredOrders.filter((o) => {
                      if (column.col === 'Booking Received') return ['Booking Received', 'Confirmed'].includes(o.orderStatus);
                      if (column.col === 'Garments Received') return ['Garments Received', 'Inspection in Progress'].includes(o.orderStatus);
                      if (column.col === 'Processing') return o.orderStatus === 'Processing';
                      if (column.col === 'Quality Check') return ['Quality Check', 'Ready for Pickup', 'Out for Delivery'].includes(o.orderStatus);
                      return o.orderStatus === 'Delivered';
                    });

                    return (
                      <div key={column.col} className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800 flex flex-col space-y-3 min-w-[220px]">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <span className="font-semibold text-xs text-slate-300">{column.col}</span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-900 text-[10px] font-bold text-slate-400">
                            {colOrders.length}
                          </span>
                        </div>

                        <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                          {colOrders.map((ord) => (
                            <div
                              key={ord.orderId}
                              onClick={() => setSelectedOrder(ord)}
                              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/60 cursor-pointer transition-all space-y-2 text-xs shadow-md"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-blue-400">{ord.orderId}</span>
                                <span className="text-emerald-400 font-bold">₹{ord.finalTotal}</span>
                              </div>
                              <p className="font-semibold text-white truncate">{ord.customerName}</p>
                              <p className="text-[11px] text-slate-400 truncate">
                                {ord.items?.length || 1} items • {ord.preferredDate}
                              </p>

                              {/* Quick Move Status Selector */}
                              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                                <select
                                  value={ord.orderStatus}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => handleUpdateOrderStatus(ord.orderId, e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 rounded-lg text-[10px] text-slate-300 px-2 py-1 focus:outline-hidden"
                                >
                                  {validStatuses.map((st) => (
                                    <option key={st} value={st}>{st}</option>
                                  ))}
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* View 2: Detailed Table View */}
              {orderViewMode === 'table' && (
                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl text-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                          <th className="py-3 px-4">Order ID</th>
                          <th className="py-3 px-4">Customer</th>
                          <th className="py-3 px-4">Schedule</th>
                          <th className="py-3 px-4">Garments</th>
                          <th className="py-3 px-4 text-right">Amount</th>
                          <th className="py-3 px-4">Payment</th>
                          <th className="py-3 px-4">Status & Update</th>
                          <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredOrders.map((ord) => (
                          <tr key={ord.orderId} className="hover:bg-slate-900/50 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-blue-400">{ord.orderId}</td>
                            <td className="py-3 px-4">
                              <p className="font-semibold text-white">{ord.customerName}</p>
                              <p className="text-[11px] text-slate-400">{ord.customerPhone}</p>
                            </td>
                            <td className="py-3 px-4 text-slate-300">
                              <p>{ord.preferredDate}</p>
                              <p className="text-[10px] text-slate-500 capitalize">{ord.bookingType}</p>
                            </td>
                            <td className="py-3 px-4 text-slate-300">
                              {ord.items?.length || 1} pieces
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-emerald-400">
                              ₹{ord.finalTotal}
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={ord.paymentStatus || 'Pending'}
                                onChange={(e) => handleUpdateOrderPayment(ord.orderId, e.target.value)}
                                className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-hidden ${
                                  ord.paymentStatus === 'Paid'
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Failed">Failed</option>
                                <option value="Refunded">Refunded</option>
                              </select>
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={ord.orderStatus}
                                onChange={(e) => handleUpdateOrderStatus(ord.orderId, e.target.value)}
                                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg focus:outline-hidden"
                              >
                                {validStatuses.map((st) => (
                                  <option key={st} value={st}>{st}</option>
                                ))}
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 text-center space-x-2">
                              <button
                                onClick={() => setSelectedOrder(ord)}
                                className="p-1.5 text-blue-400 hover:text-white"
                                title="View details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => generateInvoicePDF(ord)}
                                className="p-1.5 text-slate-400 hover:text-white"
                                title="Print Invoice"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: SERVICES MANAGEMENT */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">Garment Care Services Catalog</h3>
                  <p className="text-xs text-slate-400">Manage public service offerings, starting rates, and turnarounds.</p>
                </div>
                <button
                  onClick={() => setServiceModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((srv) => (
                  <div key={srv._id || srv.slug} className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden space-y-3 p-4 text-xs">
                    <img src={srv.image} alt={srv.name} className="w-full h-36 object-cover rounded-xl" />
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{srv.name}</span>
                      <span className="text-blue-400 font-bold">₹{srv.startingPrice}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] line-clamp-2">{srv.shortDescription}</p>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Category: {srv.category}</span>
                      <span>Turnaround: {srv.estimatedTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GARMENT PRICING MANAGEMENT (INLINE EDIT & MASTER CONTROL) */}
          {activeTab === 'pricing' && (() => {
            const categoriesList = ['All', 'Suits', 'Blazers', 'Trousers', 'Shirts', 'Sarees', 'Dresses', 'Jackets', 'Blankets', 'Other'];
            const filteredGarments = garments.filter((g) => {
              const matchesCat = garmentCategory === 'All' || g.category === garmentCategory;
              const matchesSearch = g.name.toLowerCase().includes(garmentSearch.toLowerCase()) ||
                                    (g.description || '').toLowerCase().includes(garmentSearch.toLowerCase());
              return matchesCat && matchesSearch;
            });

            return (
              <div className="space-y-6">
                {/* Header & Add Button */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-lg text-white">Garment Pricing Matrix</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold text-[11px] border border-blue-500/30">
                        {garments.length} Total Articles
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Mercury Drycleaners Rate Card (Ghumar Mandi, Ludhiana). Pressing charges are 50% to 60% of Dry Cleaning. Edit or add articles anytime.
                    </p>
                  </div>

                  <button
                    onClick={() => setAddGarmentModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Article</span>
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
                  {/* Search */}
                  <div className="relative w-full md:w-80">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search articles (e.g. Suit Gents, Saree, Blanket, Jacket)..."
                      value={garmentSearch}
                      onChange={(e) => setGarmentSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
                    {categoriesList.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setGarmentCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                          garmentCategory === cat
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Articles Table */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl text-xs">
                  <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Showing <strong className="text-white">{filteredGarments.length}</strong> matching articles</span>
                    <span>Click <strong>"Edit Rate"</strong> to update prices in real-time</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                          <th className="py-3 px-4">Article (Rate Card)</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4 text-right">Pressing / Finishing (₹)</th>
                          <th className="py-3 px-4 text-right text-blue-400">Dry Clean (₹ Onwards)</th>
                          <th className="py-3 px-4 text-right text-indigo-400">Couture Care (₹)</th>
                          <th className="py-3 px-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredGarments.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="py-8 text-center text-slate-500">
                              No articles found matching "{garmentSearch}".
                            </td>
                          </tr>
                        ) : (
                          filteredGarments.map((g) => {
                            const isEditing = editingGarment?._id === g._id;
                            return (
                              <tr key={g._id} className="hover:bg-slate-900/40 transition-colors">
                                <td className="py-3 px-4 font-semibold text-white">
                                  {isEditing ? (
                                    <div className="space-y-1">
                                      <input
                                        type="text"
                                        value={editingGarment.name}
                                        onChange={(e) => setEditingGarment({ ...editingGarment, name: e.target.value })}
                                        className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white text-xs font-semibold"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Special note (e.g. ₹50 extra for lining)"
                                        value={editingGarment.description || ''}
                                        onChange={(e) => setEditingGarment({ ...editingGarment, description: e.target.value })}
                                        className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-400 text-[10px]"
                                      />
                                    </div>
                                  ) : (
                                    <div>
                                      <span>{g.name}</span>
                                      {g.description && (
                                        <p className="text-[10px] text-slate-500 font-normal mt-0.5 line-clamp-1">
                                          {g.description}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-slate-400">
                                  {isEditing ? (
                                    <select
                                      value={editingGarment.category}
                                      onChange={(e) => setEditingGarment({ ...editingGarment, category: e.target.value })}
                                      className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-300 text-xs"
                                    >
                                      {['Suits', 'Blazers', 'Trousers', 'Shirts', 'Sarees', 'Dresses', 'Jackets', 'Blankets', 'Other'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                      ))}
                                    </select>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-slate-900 text-[10px] font-medium text-slate-400 border border-slate-800">
                                      {g.category}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      value={editingGarment.steamIronPrice}
                                      onChange={(e) => setEditingGarment({ ...editingGarment, steamIronPrice: e.target.value })}
                                      className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-xs text-white"
                                    />
                                  ) : (
                                    <span className="text-slate-300">₹{g.steamIronPrice}/-</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-right font-bold text-blue-400">
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      value={editingGarment.dryCleanPrice}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setEditingGarment({
                                          ...editingGarment,
                                          dryCleanPrice: val,
                                          steamIronPrice: Math.round(Number(val) * 0.5)
                                        });
                                      }}
                                      className="w-20 px-2 py-1 bg-slate-900 border border-blue-500 rounded text-right text-xs text-white"
                                    />
                                  ) : (
                                    <span>₹{g.dryCleanPrice}/- <span className="text-[10px] text-slate-500 font-normal">Onw.</span></span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-right font-medium text-indigo-400">
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      value={editingGarment.premiumCarePrice}
                                      onChange={(e) => setEditingGarment({ ...editingGarment, premiumCarePrice: e.target.value })}
                                      className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-xs text-white"
                                    />
                                  ) : (
                                    <span>₹{g.premiumCarePrice}/-</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  {isEditing ? (
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        onClick={() => handleSaveGarmentPrice(g._id, {
                                          name: editingGarment.name,
                                          category: editingGarment.category,
                                          description: editingGarment.description,
                                          steamIronPrice: editingGarment.steamIronPrice,
                                          dryCleanPrice: editingGarment.dryCleanPrice,
                                          premiumCarePrice: editingGarment.premiumCarePrice
                                        })}
                                        className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                                        title="Save Price"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => setEditingGarment(null)}
                                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                                        title="Cancel"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center gap-2">
                                      <button
                                        onClick={() => setEditingGarment({ ...g })}
                                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-blue-400 hover:text-blue-300 font-medium text-xs border border-slate-800 transition-colors"
                                      >
                                        Edit Rate
                                      </button>
                                      <button
                                        onClick={() => handleDeleteGarment(g._id)}
                                        className="p-1 rounded-lg hover:bg-red-950/40 text-slate-500 hover:text-red-400 transition-colors"
                                        title="Delete Article"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add Garment Article Modal */}
                <AnimatePresence>
                  {addGarmentModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                      <div
                        onClick={() => setAddGarmentModalOpen(false)}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
                      />

                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-md bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl z-10 text-xs space-y-4"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                          <h4 className="font-serif font-bold text-base text-white">Add Article to Rate Card</h4>
                          <button
                            onClick={() => setAddGarmentModalOpen(false)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <form onSubmit={handleAddGarment} className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-slate-400 font-medium">Article Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Silk Kurta, Designer Waistcoat..."
                              value={newGarment.name}
                              onChange={(e) => setNewGarment({ ...newGarment, name: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-hidden focus:border-blue-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-slate-400 font-medium">Category *</label>
                            <select
                              value={newGarment.category}
                              onChange={(e) => setNewGarment({ ...newGarment, category: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-hidden focus:border-blue-500"
                            >
                              {['Suits', 'Blazers', 'Trousers', 'Shirts', 'Sarees', 'Dresses', 'Jackets', 'Blankets', 'Other'].map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-slate-400 font-medium">Dry Clean Rate (₹) *</label>
                              <input
                                type="number"
                                required
                                min="0"
                                placeholder="350"
                                value={newGarment.dryCleanPrice}
                                onChange={(e) => {
                                  const dc = e.target.value;
                                  setNewGarment({
                                    ...newGarment,
                                    dryCleanPrice: dc,
                                    steamIronPrice: Math.round(Number(dc) * 0.5),
                                    premiumCarePrice: Math.round(Number(dc) * 1.3)
                                  });
                                }}
                                className="w-full px-3 py-2 bg-slate-950 border border-blue-500/50 rounded-xl text-white text-xs focus:outline-hidden focus:border-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-slate-400 font-medium">Finishing / Pressing (₹)</label>
                              <input
                                type="number"
                                min="0"
                                placeholder="175 (50%)"
                                value={newGarment.steamIronPrice}
                                onChange={(e) => setNewGarment({ ...newGarment, steamIronPrice: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-hidden focus:border-blue-500"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-slate-400 font-medium">Luxury / Couture Care (₹)</label>
                            <input
                              type="number"
                              min="0"
                              placeholder="450"
                              value={newGarment.premiumCarePrice}
                              onChange={(e) => setNewGarment({ ...newGarment, premiumCarePrice: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-hidden focus:border-blue-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-slate-400 font-medium">Rate Card Special Note / Description</label>
                            <input
                              type="text"
                              placeholder="e.g. ₹350 - ₹500 Onwards, Lining ₹50 extra"
                              value={newGarment.description}
                              onChange={(e) => setNewGarment({ ...newGarment, description: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-hidden focus:border-blue-500"
                            />
                          </div>

                          <div className="pt-2 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setAddGarmentModalOpen(false)}
                              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/25"
                            >
                              Add Article
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            );
          })()}

          {/* TAB 5: CUSTOMERS DIRECTORY */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <h3 className="font-serif font-bold text-lg text-white">Registered Customer Profiles</h3>
                <p className="text-xs text-slate-400">View customer lifetime spend and past garment orders.</p>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden text-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Phone / WhatsApp</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4 text-center">Orders</th>
                        <th className="py-3 px-4 text-right">Lifetime Spend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {customers.map((c) => (
                        <tr key={c._id || c.email} className="hover:bg-slate-900/40">
                          <td className="py-3 px-4 font-bold text-white">{c.name}</td>
                          <td className="py-3 px-4 text-slate-300">{c.phone}</td>
                          <td className="py-3 px-4 text-slate-400">{c.email}</td>
                          <td className="py-3 px-4 text-center">{c.totalOrders || 0}</td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-400">
                            ₹{c.totalSpent || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: OFFERS & COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">Offers & Coupon Codes</h3>
                  <p className="text-xs text-slate-400">Configure welcome discounts and festive dry-cleaning promotions.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {coupons.map((cp) => (
                  <div key={cp._id || cp.code} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-lg text-amber-400">{cp.code}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        {cp.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-slate-300 font-semibold">{cp.title}</p>
                    <p className="text-slate-400 text-[11px]">{cp.description}</p>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Min Order: ₹{cp.minOrderAmount}</span>
                      <span>Times Used: {cp.usageCount || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <h3 className="font-serif font-bold text-lg text-white">Customer Reviews Moderation</h3>
                <p className="text-xs text-slate-400">Approve or reject reviews before they appear on the homepage.</p>
              </div>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{rev.customerName}</span>
                        <span className="text-amber-400">★ {rev.rating}/5</span>
                        <span className="text-slate-500">• {rev.customerLocation}</span>
                      </div>
                      <p className="text-slate-300 italic">"{rev.reviewText}"</p>
                      <p className="text-[11px] text-slate-500">Garment: {rev.garmentCleaned}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {rev.isApproved ? (
                        <button
                          onClick={() => handleApproveReview(rev._id, false)}
                          className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                        >
                          Revoke Approval
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApproveReview(rev._id, true)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                        >
                          Approve Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: WEBSITE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 text-xs">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-serif font-bold text-lg text-white">Shop & Business Settings</h3>
                <p className="text-slate-400">Manage phone, email, Ghumar Mandi address, and delivery thresholds.</p>
              </div>

              {websiteSettings && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Business Name</label>
                    <input
                      type="text"
                      readOnly
                      value={websiteSettings.businessName}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 mb-1">Support Phone</label>
                      <input
                        type="text"
                        readOnly
                        value={websiteSettings.phone}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">WhatsApp Number</label>
                      <input
                        type="text"
                        readOnly
                        value={websiteSettings.whatsappNumber}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Shop Address</label>
                    <input
                      type="text"
                      readOnly
                      value={`${websiteSettings.address?.shopNo}, ${websiteSettings.address?.area}, ${websiteSettings.address?.city}`}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-slate-400 mb-1">Free Pickup Threshold</label>
                      <input
                        type="text"
                        readOnly
                        value={`₹${websiteSettings.freePickupThreshold}`}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Pickup Fee Below Threshold</label>
                      <input
                        type="text"
                        readOnly
                        value={`₹${websiteSettings.pickupCharge}`}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Selected Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-xs space-y-6 max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="font-mono font-bold text-blue-400 text-base">{selectedOrder.orderId}</span>
                  <p className="text-slate-400 text-[11px]">Invoice: {selectedOrder.invoiceNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block">Customer</span>
                  <p className="font-bold text-white text-sm">{selectedOrder.customerName}</p>
                  <p className="text-slate-400">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block">Address / Mode</span>
                  <p className="text-slate-300">{selectedOrder.bookingType === 'pickup' ? selectedOrder.pickupAddress?.street : 'Shop Drop-off'}</p>
                  <p className="text-slate-500">{selectedOrder.preferredDate} ({selectedOrder.preferredTimeSlot})</p>
                </div>
              </div>

              {/* Status Updater */}
              <div className="space-y-2">
                <label className="block text-slate-300 font-semibold">Change Order Status (Emits Real-Time Alert to Customer)</label>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => handleUpdateOrderStatus(selectedOrder.orderId, e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-hidden"
                  >
                    {validStatuses.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-300">Garment Items</h4>
                <div className="divide-y divide-slate-800 max-h-36 overflow-y-auto">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="py-2 flex justify-between">
                      <span className="text-slate-200">{item.garmentName} ({item.quantity}x)</span>
                      <span className="text-blue-400 font-bold">₹{item.total}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm">
                  <span className="text-white">Total Amount ({selectedOrder.paymentStatus || 'Pending'}):</span>
                  <span className="text-emerald-400">₹{selectedOrder.finalTotal}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => generateInvoicePDF(selectedOrder)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Generate Invoice PDF</span>
                </button>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
