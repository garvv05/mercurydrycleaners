import React, { useEffect } from 'react';
import { User, Phone, Mail, CreditCard, Banknote, QrCode } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';

export default function Step5Contact({ onNext, onBack }) {
  const {
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerEmail,
    setCustomerEmail,
    paymentPreference,
    setPaymentPreference
  } = useBooking();

  const { user } = useAuth();

  // Prefill if customer is logged in
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name || '');
      if (!customerPhone) setCustomerPhone(user.phone || '');
      if (!customerEmail) setCustomerEmail(user.email || '');
    }
  }, [user]);

  const isValid = customerName.trim().length >= 2 && customerPhone.trim().length >= 10;

  return (
    <div className="space-y-6 text-xs">
      <div className="space-y-1">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-mercury-navy">
          Step 5: Contact Details & Payment Preference
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm">
          Provide your contact info for order updates and select your preferred payment mode.
        </p>
      </div>

      {/* Contact Inputs */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
        <div>
          <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. Jaspreet Singh"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Mobile Number (WhatsApp Enabled) *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                placeholder="+91 98140 12345"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 text-xs"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">We send live order status tracking to this number.</p>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Email Address (Optional)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="jaspreet@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Preference */}
      <div className="space-y-3">
        <label className="block font-bold text-slate-800 text-xs">
          Payment Preference (Pay after Inspection)
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={() => setPaymentPreference('cash')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
              paymentPreference === 'cash'
                ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              paymentPreference === 'cash' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs">Cash on Delivery</h4>
              <p className="text-[10px] text-slate-400">Pay cash upon delivery</p>
            </div>
          </div>

          <div
            onClick={() => setPaymentPreference('upi')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
              paymentPreference === 'upi'
                ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              paymentPreference === 'upi' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs">UPI QR Code</h4>
              <p className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</p>
            </div>
          </div>

          <div
            onClick={() => setPaymentPreference('online')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
              paymentPreference === 'online'
                ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              paymentPreference === 'online' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs">Card / Netbanking</h4>
              <p className="text-[10px] text-slate-400">Credit or debit card</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Buttons */}
      <div className="pt-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all"
        >
          ← Back to Schedule
        </button>

        <button
          onClick={onNext}
          disabled={!isValid}
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all"
        >
          Next: Review & Confirm Booking →
        </button>
      </div>
    </div>
  );
}
