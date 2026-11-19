import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Package, Calendar, Clock, MapPin, 
  Plus, Trash2, RotateCcw, Download, Sparkles, 
  Search, ShieldCheck, LogOut, CheckCircle2 
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { generateInvoicePDF } from '../services/invoiceGenerator';

export default function CustomerDashboard() {
  const { user, logout, updateUserProfile } = useAuth();
  const { setGarmentsFromEstimator, setCurrentStep } = useBooking();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'orders', 'addresses', 'profile'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('All');

  // Address modal / inputs
  const [newStreet, setNewStreet] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newLabel, setNewLabel] = useState('Home');
  const [addressSuccess, setAddressSuccess] = useState('');

  // Profile inputs
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileSuccess, setProfileSuccess] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/user/my-orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newStreet.trim()) return;
    try {
      const res = await api.post('/auth/addresses', {
        label: newLabel,
        street: newStreet,
        landmark: newLandmark,
        city: 'Ludhiana',
        postalCode: '141001',
        isDefault: false
      });
      if (res.data.success) {
        updateUserProfile({ ...user, addresses: res.data.addresses });
        setAddressSuccess('Address saved successfully');
        setNewStreet('');
        setNewLandmark('');
        setTimeout(() => setAddressSuccess(''), 2500);
      }
    } catch (err) {
      alert('Failed to save address');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await api.delete(`/auth/addresses/${id}`);
      if (res.data.success) {
        updateUserProfile({ ...user, addresses: res.data.addresses });
      }
    } catch (err) {
      alert('Failed to delete address');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/profile', {
        name: profileName,
        phone: profilePhone
      });
      if (res.data.success) {
        updateUserProfile(res.data.user);
        setProfileSuccess('Profile updated successfully');
        setTimeout(() => setProfileSuccess(''), 2500);
      }
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const handleReorder = (order) => {
    if (order.items && order.items.length > 0) {
      setGarmentsFromEstimator(order.items);
      setCurrentStep(3);
      navigate('/booking');
    }
  };

  const activeOrders = orders.filter((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled');
  const pastOrders = orders.filter((o) => o.orderStatus === 'Delivered' || o.orderStatus === 'Cancelled');

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === 'All' || o.orderStatus === orderFilter;
    const matchesSearch = (o.orderId && o.orderId.toLowerCase().includes(orderSearch.toLowerCase())) ||
                          (o.items && o.items.some(i => i.garmentName.toLowerCase().includes(orderSearch.toLowerCase())));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-mercury-navy text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md shadow-blue-500/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                Customer Account
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-mercury-navy mt-1">
                Welcome, {user?.name || 'Customer'}
              </h1>
              <p className="text-xs text-slate-500">
                {user?.email} • {user?.phone} • Ludhiana
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/booking"
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Book New Pickup</span>
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Sparkles },
            { id: 'orders', label: `My Orders (${orders.length})`, icon: Package },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
            { id: 'profile', label: 'Profile Settings', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 font-semibold border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold uppercase text-slate-400">Total Bookings</span>
                <p className="font-serif text-3xl font-bold text-mercury-navy">{orders.length}</p>
                <p className="text-xs text-slate-500">Orders placed with Mercury</p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold uppercase text-blue-600">Active In-Progress</span>
                <p className="font-serif text-3xl font-bold text-blue-600">{activeOrders.length}</p>
                <p className="text-xs text-slate-500">Currently in master care</p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold uppercase text-emerald-600">Delivered Orders</span>
                <p className="font-serif text-3xl font-bold text-emerald-600">
                  {pastOrders.filter(o => o.orderStatus === 'Delivered').length}
                </p>
                <p className="text-xs text-slate-500">Completed & returned fresh</p>
              </div>
            </div>

            {/* Active Orders List Preview */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-serif font-bold text-lg text-mercury-navy">
                  Active Care Orders ({activeOrders.length})
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              {activeOrders.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  You have no active orders in progress right now.
                </div>
              ) : (
                <div className="space-y-4">
                  {activeOrders.map((ord) => (
                    <div
                      key={ord.orderId}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-blue-600 text-sm">{ord.orderId}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px]">
                            {ord.orderStatus}
                          </span>
                        </div>
                        <p className="text-slate-600">
                          Scheduled: {ord.preferredDate} ({ord.preferredTimeSlot}) • {ord.items?.length || 1} items
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          to={`/track?id=${ord.orderId}`}
                          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-xs hover:bg-blue-700 transition-colors"
                        >
                          Track Live Timeline
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Orders List with Search, Filter & Reorder */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 text-xs">
            
            {/* Search & Filter Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search order ID or garment..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {['All', 'Booking Received', 'Processing', 'Quality Check', 'Ready for Pickup', 'Delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap ${
                      orderFilter === st
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No matching orders found.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => (
                  <div key={ord.orderId} className="py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900">{ord.orderId}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : ord.orderStatus === 'Cancelled'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {ord.orderStatus}
                        </span>
                      </div>

                      <p className="text-slate-500">
                        Date: {ord.preferredDate} • Mode: <strong className="text-slate-700 capitalize">{ord.bookingType}</strong> • Total: <strong className="text-blue-600 font-bold">₹{ord.finalTotal}</strong> ({ord.paymentStatus || 'Pending'})
                      </p>

                      <div className="text-slate-600 text-[11px]">
                        Garments: {ord.items?.map(i => `${i.garmentName} (${i.quantity})`).join(', ') || 'Dry cleaning items'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <Link
                        to={`/track?id=${ord.orderId}`}
                        className="flex-1 md:flex-none text-center px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs"
                      >
                        Track
                      </Link>

                      <button
                        onClick={() => generateInvoicePDF(ord)}
                        className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                        title="Download Invoice PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleReorder(ord)}
                        className="flex-1 md:flex-none text-center px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* Tab 3: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
            {/* Existing Addresses (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-mercury-navy pb-2 border-b border-slate-100">
                Your Saved Pickup Locations
              </h3>

              {(!user?.addresses || user.addresses.length === 0) ? (
                <p className="text-slate-400 py-6 text-center">
                  No saved addresses yet. Add your primary home or office address in Ludhiana.
                </p>
              ) : (
                <div className="space-y-3">
                  {user.addresses.map((addr) => (
                    <div
                      key={addr._id || addr.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{addr.label || 'Home'}</span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px]">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600">{addr.street}</p>
                        {addr.landmark && <p className="text-slate-400">Landmark: {addr.landmark}</p>}
                        <p className="text-slate-500 font-medium">{addr.city || 'Ludhiana'} - {addr.postalCode || '141001'}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteAddress(addr._id || addr.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Address Form (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-mercury-navy pb-2 border-b border-slate-100">
                Add New Address
              </h3>

              {addressSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {addressSuccess}
                </div>
              )}

              <form onSubmit={handleAddAddress} className="space-y-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Label</label>
                  <select
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. House No. 89, Sarabha Nagar"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Landmark</label>
                  <input
                    type="text"
                    placeholder="e.g. Near Gurudwara Sahib"
                    value={newLandmark}
                    onChange={(e) => setNewLandmark(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
                >
                  Save Address
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 4: Profile */}
        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4 text-xs">
            <h3 className="font-serif font-bold text-lg text-mercury-navy pb-2 border-b border-slate-100">
              Personal Information
            </h3>

            {profileSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                {profileSuccess}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  readOnly
                  value={user?.email || ''}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-xs cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all"
              >
                Update Profile
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
