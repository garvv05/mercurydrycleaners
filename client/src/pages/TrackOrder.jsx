import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Sparkles, CheckCircle2, Clock, MapPin, 
  Phone, Download, Calendar, ShieldCheck, AlertCircle, RefreshCw 
} from 'lucide-react';
import api from '../services/api';
import { getSocket, joinOrderRoom, leaveOrderRoom } from '../services/socket';
import { generateInvoicePDF } from '../services/invoiceGenerator';

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [orderId, setOrderId] = useState(initialId);
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [liveToast, setLiveToast] = useState('');

  const allStatuses = [
    { title: 'Booking Received', desc: 'Booking confirmed online or at counter.' },
    { title: 'Confirmed', desc: 'Pickup driver scheduled / order tagged.' },
    { title: 'Garments Received', desc: 'Checked in at Ghumar Mandi facility.' },
    { title: 'Inspection in Progress', desc: 'Pre-spotting stains and fiber evaluation.' },
    { title: 'Processing', desc: 'Gentle hydrocarbon solvent dry cleaning cycle.' },
    { title: 'Quality Check', desc: '10-point inspection and steam form-pressing.' },
    { title: 'Ready for Pickup', desc: 'Garment bagged on hanger; ready at counter.' },
    { title: 'Out for Delivery', desc: 'Driver en route to your Ludhiana doorstep.' },
    { title: 'Delivered', desc: 'Delivered and signed off.' }
  ];

  const fetchTrackOrder = async (idToSearch, phoneToSearch) => {
    if (!idToSearch) return;
    setLoading(true);
    setError('');
    setLiveToast('');

    try {
      const res = await api.post('/orders/track', {
        orderId: idToSearch.trim().toUpperCase(),
        phone: phoneToSearch ? phoneToSearch.trim() : undefined
      });
      if (res.data.success) {
        setOrder(res.data.order);
        // Join Socket.io room for live status push
        joinOrderRoom(res.data.order.orderId);
      } else {
        setError(res.data.message || 'No booking found');
        setOrder(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to locate order. Please check the Order ID.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchTrackOrder(initialId, '');
    }
  }, [initialId]);

  // Live Socket.io listener for real-time order status updates
  useEffect(() => {
    const socket = getSocket();

    const handleStatusUpdate = (data) => {
      if (order && data.orderId === order.orderId) {
        setOrder((prev) => ({
          ...prev,
          orderStatus: data.orderStatus,
          statusHistory: data.statusHistory || prev.statusHistory
        }));
        setLiveToast(`Order status updated to: ${data.orderStatus}`);
        setTimeout(() => setLiveToast(''), 6000);
      }
    };

    socket.on('order:status_updated', handleStatusUpdate);
    socket.on('broadcast:order_status_update', handleStatusUpdate);

    return () => {
      socket.off('order:status_updated', handleStatusUpdate);
      socket.off('broadcast:order_status_update', handleStatusUpdate);
      if (order?.orderId) {
        leaveOrderRoom(order.orderId);
      }
    };
  }, [order?.orderId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTrackOrder(orderId, phone);
  };

  // Determine current stage index in allStatuses
  const getStatusIndex = (status) => {
    if (status === 'Cancelled') return -1;
    return allStatuses.findIndex((s) => s.title.toLowerCase() === (status || '').toLowerCase());
  };

  const currentStageIndex = order ? getStatusIndex(order.orderStatus) : -1;

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100/70 px-3 py-1 rounded-full border border-blue-200">
            Real-Time Garment Journey
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-mercury-navy tracking-tight">
            Track Your Order Live
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto">
            Enter your Order ID (e.g. MD-2611-1001) and optional registered phone to see live cleaning progress from our Ghumar Mandi workshop.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-6">
              <label className="block text-slate-700 font-semibold text-xs mb-1">
                Order ID *
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. MD-2611-1001"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 text-xs uppercase"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-slate-700 font-semibold text-xs mb-1">
                Registered Mobile (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="e.g. 9814012345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 text-xs"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading || !orderId.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Track</span>}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Live Notification Toast */}
        <AnimatePresence>
          {liveToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                <span className="font-semibold">{liveToast}</span>
              </div>
              <button
                onClick={() => setLiveToast('')}
                className="text-white/80 hover:text-white"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Details & Visual Tracking Timeline */}
        {order && (
          <div className="space-y-6">
            
            {/* Top Status Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Order Tracking
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span className="text-xs font-mono font-bold text-blue-600">
                      {order.orderId}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-mercury-navy mt-1">
                    {order.customerName}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Booked for: {order.preferredDate} ({order.preferredTimeSlot})
                  </p>
                </div>

                <div className="flex flex-col sm:items-end">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                    Current Status
                  </span>
                  <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold mt-1 shadow-2xs ${
                    order.orderStatus === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : order.orderStatus === 'Cancelled'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse'
                  }`}>
                    {order.orderStatus}
                  </span>
                  <button
                    onClick={() => generateInvoicePDF(order)}
                    className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Invoice (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Status Timeline Visualization */}
              {order.orderStatus === 'Cancelled' ? (
                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  <p className="font-bold">This booking has been cancelled.</p>
                  <p className="text-[11px] mt-1 text-rose-600">
                    If you have questions, contact our Ghumar Mandi store at +91 78149 66031.
                  </p>
                </div>
              ) : (
                <div className="py-4">
                  <div className="relative">
                    
                    {/* Vertical / Step-by-Step Timeline */}
                    <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 sm:before:left-4 before:w-0.5 before:bg-slate-200">
                      {allStatuses.map((step, idx) => {
                        const isCompleted = idx < currentStageIndex;
                        const isCurrent = idx === currentStageIndex;
                        const isUpcoming = idx > currentStageIndex;

                        return (
                          <div key={step.title} className="relative flex items-start gap-4">
                            {/* Circle Node */}
                            <div
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 transition-all ${
                                isCompleted
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : isCurrent
                                  ? 'bg-mercury-navy text-white ring-4 ring-blue-100 shadow-md animate-pulse'
                                  : 'bg-white border-2 border-slate-300 text-slate-300'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <span>{idx + 1}</span>
                              )}
                            </div>

                            {/* Status Text */}
                            <div className="flex-1 pt-0.5">
                              <div className="flex items-center justify-between">
                                <h4 className={`text-xs sm:text-sm font-bold ${
                                  isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                                }`}>
                                  {step.title}
                                </h4>
                                {isCurrent && (
                                  <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                    In Progress
                                  </span>
                                )}
                              </div>
                              <p className={`text-xs mt-0.5 ${
                                isUpcoming ? 'text-slate-400' : 'text-slate-600'
                              }`}>
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>
              )}

              {/* Garment Inspection & Completion Notes */}
              {(order.garmentInspectionNotes || order.estimatedCompletionDate) && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {order.estimatedCompletionDate && (
                    <div>
                      <span className="font-bold text-slate-700 block">Estimated Completion:</span>
                      <span className="text-slate-900 font-semibold">{order.estimatedCompletionDate}</span>
                    </div>
                  )}
                  {order.garmentInspectionNotes && (
                    <div>
                      <span className="font-bold text-slate-700 block">Garment Inspection Log:</span>
                      <span className="text-slate-600">{order.garmentInspectionNotes}</span>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Garments Table & Financial Breakdown */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-4 text-xs">
              <h3 className="font-serif font-bold text-lg text-mercury-navy pb-3 border-b border-slate-100">
                Garments Under Care
              </h3>

              <div className="divide-y divide-slate-100">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{item.garmentName}</p>
                      <p className="text-[11px] text-slate-400">{item.serviceType} • Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-slate-900">₹{item.total}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between font-bold text-slate-900 text-sm">
                <span>Final Amount ({order.paymentStatus || 'Pending'}):</span>
                <span className="text-blue-600 font-serif text-lg">₹{order.finalTotal}</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
