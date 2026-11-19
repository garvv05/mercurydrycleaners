import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Calendar, MapPin, Truck, Store, 
  Tag, ShieldCheck, AlertCircle, Loader2, Sparkles 
} from 'lucide-react';
import api from '../../services/api';
import { useBooking } from '../../context/BookingContext';

export default function Step6Review({ onBack, onComplete }) {
  const {
    bookingType,
    selectedServices,
    items,
    specialInstructions,
    stainsNotes,
    delicateFabricNotes,
    pickupAddress,
    preferredDate,
    preferredTimeSlot,
    customerName,
    customerPhone,
    customerEmail,
    paymentPreference,
    couponCode,
    appliedCoupon,
    subtotal,
    discount,
    pickupCharge,
    taxes,
    finalTotal
  } = useBooking();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmitBooking = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        customerName,
        customerPhone,
        customerEmail,
        bookingType,
        pickupAddress,
        preferredDate,
        preferredTimeSlot,
        services: selectedServices,
        items,
        specialInstructions,
        stainsNotes,
        delicateFabricNotes,
        couponCode: appliedCoupon?.code || couponCode,
        paymentPreference
      };

      const res = await api.post('/orders/booking', payload);
      if (res.data.success) {
        onComplete(res.data.order);
      } else {
        setError(res.data.message || 'Failed to submit booking');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setError(err.response?.data?.message || 'Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="space-y-1">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-mercury-navy">
          Step 6: Review & Finalize Booking
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm">
          Please review your items, schedule, and address details before submitting.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Review Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Customer & Location */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-xs pb-2 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Customer & Location</span>
          </div>
          <div className="space-y-1 text-slate-600">
            <p className="font-semibold text-slate-900">{customerName}</p>
            <p>Mobile: {customerPhone}</p>
            {customerEmail && <p>Email: {customerEmail}</p>}
            <p className="pt-1 text-slate-800 font-medium">
              Mode: {bookingType === 'pickup' ? 'Doorstep Collection' : 'Store Drop-off (Ghumar Mandi)'}
            </p>
            {bookingType === 'pickup' && (
              <p className="text-slate-500">
                Address: {pickupAddress.street}, {pickupAddress.city} - {pickupAddress.postalCode}
              </p>
            )}
          </div>
        </div>

        {/* Schedule & Timing */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-xs pb-2 border-b border-slate-100">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Pickup / Drop Schedule</span>
          </div>
          <div className="space-y-1 text-slate-600">
            <p className="text-slate-900 font-bold text-sm">
              Date: {preferredDate}
            </p>
            <p>Time Window: {preferredTimeSlot}</p>
            <p className="pt-2 text-slate-800 font-medium">
              Payment Mode: <span className="uppercase font-bold text-blue-600">{paymentPreference}</span> (Pay after service)
            </p>
          </div>
        </div>

      </div>

      {/* Garments List Review */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
        <h4 className="font-bold text-slate-800 text-xs pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>Garments & Services Selected ({items.length} items)</span>
          <span className="text-blue-600 font-bold">Total: ₹{finalTotal}</span>
        </h4>

        <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
          {items.map((item, idx) => (
            <div key={idx} className="py-2 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">{item.garmentName}</p>
                <p className="text-[11px] text-slate-500">{item.serviceType} × {item.quantity} pieces</p>
              </div>
              <span className="font-bold text-slate-900">₹{item.total}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Special Instructions Preview if Any */}
      {(specialInstructions || stainsNotes || delicateFabricNotes) && (
        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-1 text-slate-700">
          <p className="font-bold text-amber-900">Special Garment Notes Included:</p>
          {stainsNotes && <p>• Stain Notes: {stainsNotes}</p>}
          {delicateFabricNotes && <p>• Delicate Fabric: {delicateFabricNotes}</p>}
          {specialInstructions && <p>• Packaging: {specialInstructions}</p>}
        </div>
      )}

      {/* Guarantee Badge */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <div>
          <p className="font-bold text-xs">Mercury Drycleaners Care Commitment</p>
          <p className="text-[11px] text-emerald-700">
            Certified gentle solvent dry cleaning with zero color fading or fabric shrinkage. Handled by Ghumar Mandi specialists.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all"
        >
          ← Edit Details
        </button>

        <button
          onClick={handleSubmitBooking}
          disabled={loading}
          className="px-10 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-500/25 flex items-center gap-2 active:scale-95 transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Placing Booking...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Confirm & Place Pickup (₹{finalTotal})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
