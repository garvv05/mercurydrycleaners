import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, Download, Share2, Sparkles, 
  Calendar, MapPin, Phone, ArrowRight, ShieldCheck, Home 
} from 'lucide-react';
import { generateInvoicePDF } from '../services/invoiceGenerator';

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  // Trigger celebration confetti
  useEffect(() => {
    try {
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#2563EB', '#102A43', '#F59E0B', '#10B981']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#2563EB', '#102A43', '#F59E0B', '#10B981']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } catch (e) {
      // Confetti fallback
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-slate-800 mb-2">No Booking Record Found</h2>
        <p className="text-slate-500 text-sm mb-6">Looks like you navigated here directly or the session has ended.</p>
        <Link to="/booking" className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs">
          Schedule New Booking
        </Link>
      </div>
    );
  }

  const handleShareWhatsApp = () => {
    const text = `Hi Mercury Drycleaners! I have placed an online booking.
*Order ID:* ${order.orderId}
*Customer:* ${order.customerName}
*Date:* ${order.preferredDate} (${order.preferredTimeSlot})
*Total:* ₹${order.finalTotal}
Looking forward to garment pickup in Ludhiana.`;
    window.open(`https://wa.me/917814966031?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleDownloadPDF = () => {
    generateInvoicePDF(order);
  };

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Main Success Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xl space-y-8">
          
          {/* Header Banner */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
              <CheckCircle className="w-9 h-9" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Booking Successfully Placed
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-mercury-navy tracking-tight">
              Thank You, {order.customerName.split(' ')[0]}!
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Your garments are booked with Mercury Drycleaners. Our Ghumar Mandi workshop has received your booking.
            </p>

            {/* Highlighted Order ID */}
            <div className="pt-2">
              <div className="inline-block p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">Your Unique Order ID</p>
                <p className="font-mono text-2xl font-bold text-blue-600 tracking-wider mt-0.5">
                  {order.orderId}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Keep this Order ID to track cleaning status in real-time.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Schedule Recap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center gap-2 text-slate-700 font-bold mb-1">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Scheduled Collection</span>
              </div>
              <p className="font-semibold text-slate-900">{order.preferredDate}</p>
              <p className="text-slate-500">Time Window: {order.preferredTimeSlot}</p>
              <p className="text-slate-500">Mode: {order.bookingType === 'pickup' ? 'Doorstep Pickup' : 'Store Drop-off'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center gap-2 text-slate-700 font-bold mb-1">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Location & Payment</span>
              </div>
              <p className="font-semibold text-slate-900">
                {order.bookingType === 'pickup' 
                  ? `${order.pickupAddress?.street || 'Ludhiana'}, ${order.pickupAddress?.city || 'Ludhiana'}` 
                  : 'Ghumar Mandi Shop 14'}
              </p>
              <p className="text-slate-500">Pay Mode: <strong className="text-slate-800 uppercase">{order.paymentPreference}</strong> (After inspection)</p>
              <p className="text-slate-500">Estimated Total: <strong className="text-blue-600 font-bold">₹{order.finalTotal}</strong></p>
            </div>
          </div>

          {/* Garment Details List */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Garments Booked ({order.items?.length || 0} items)</span>
              <span>Total: ₹{order.finalTotal}</span>
            </h4>

            <div className="divide-y divide-slate-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{item.garmentName}</p>
                    <p className="text-[11px] text-slate-400">{item.serviceType} × {item.quantity} pieces</p>
                  </div>
                  <span className="font-bold text-slate-800">₹{item.total}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons: WhatsApp Share & Download Invoice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleDownloadPDF}
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Invoice</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>
          </div>

          {/* Track Order Direct CTA */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to={`/track?id=${order.orderId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Track This Order Live</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-blue-600 font-medium flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return to Homepage</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
