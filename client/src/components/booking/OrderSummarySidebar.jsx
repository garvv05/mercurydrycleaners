import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Trash2, ShieldCheck, Check, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export default function OrderSummarySidebar() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
    pickupCharge,
    taxes,
    finalTotal,
    bookingType,
    couponCode,
    setCouponCode,
    appliedCoupon,
    couponError,
    couponSuccess,
    applyCouponCode,
    removeCoupon
  } = useBooking();

  const [inputCoupon, setInputCoupon] = useState('');
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCouponCode(inputCoupon.trim());
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xl lg:sticky lg:top-28 text-xs">
      
      {/* Mobile Accordion Header */}
      <div 
        onClick={() => setMobileExpanded(!mobileExpanded)}
        className="flex lg:hidden items-center justify-between pb-3 cursor-pointer border-b border-slate-100"
      >
        <div>
          <span className="font-serif font-bold text-base text-mercury-navy">
            Live Order Summary
          </span>
          <span className="text-slate-500 block">
            {items.length} items • Final: <strong className="text-blue-600">₹{finalTotal}</strong>
          </span>
        </div>
        <button className="p-1 rounded-lg bg-slate-100">
          {mobileExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <div className={`space-y-5 ${mobileExpanded ? 'block mt-4' : 'hidden lg:block'}`}>
        
        {/* Title on Desktop */}
        <div className="hidden lg:flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-serif font-bold text-lg text-mercury-navy">
            Live Order Summary
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
            {items.reduce((s, i) => s + (i.quantity || 1), 0)} Pieces
          </span>
        </div>

        {/* Garment Items List */}
        <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 pr-1">
          {items.length === 0 ? (
            <p className="text-slate-400 py-6 text-center italic">
              No garments selected yet. Select from the list to see live totals.
            </p>
          ) : (
            items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 truncate">
                    {item.garmentName}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {item.serviceType} • ₹{item.unitPrice} × {item.quantity}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">₹{item.total}</span>
                  <button
                    onClick={() => removeItem(item.garmentName, item.serviceType)}
                    className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Coupon Code Section */}
        <div className="pt-3 border-t border-slate-100">
          {appliedCoupon ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="font-bold font-mono tracking-wide">{appliedCoupon.code}</p>
                  <p className="text-[10px] text-emerald-600">Saved ₹{appliedCoupon.discountAmount}</p>
                </div>
              </div>
              <button
                onClick={removeCoupon}
                className="text-xs text-rose-600 hover:underline font-semibold"
              >
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. FIRST100)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl uppercase text-xs focus:bg-white focus:outline-hidden focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-mercury-navy text-white font-semibold rounded-xl hover:bg-slate-800 text-xs shadow-xs"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-rose-500 text-[10px] pl-1">{couponError}</p>}
              {couponSuccess && <p className="text-emerald-600 text-[10px] pl-1">{couponSuccess}</p>}
            </form>
          )}
        </div>

        {/* Pricing Calculation Breakdown */}
        <div className="pt-3 border-t border-slate-100 space-y-2 text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-800">₹{subtotal}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Promo Discount</span>
              <span>- ₹{discount}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Pickup & Delivery ({bookingType === 'pickup' ? 'Doorstep' : 'Self Drop-off'})</span>
            <span className={pickupCharge === 0 ? 'text-emerald-600 font-medium' : 'text-slate-800'}>
              {pickupCharge === 0 ? 'FREE' : `₹${pickupCharge}`}
            </span>
          </div>

          <div className="flex justify-between">
            <span>GST (5%)</span>
            <span className="text-slate-800">₹{taxes}</span>
          </div>

          {/* Final Running Total */}
          <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between text-slate-900">
            <span className="font-bold text-sm">Estimated Total</span>
            <div className="text-right">
              <span className="font-serif font-bold text-2xl text-mercury-navy">
                ₹{finalTotal}
              </span>
              <span className="block text-[10px] text-slate-400">All taxes included</span>
            </div>
          </div>
        </div>

        {/* Trust Note */}
        <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100/70 flex items-center gap-2 text-blue-800 text-[11px]">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Pay after inspection on delivery or shop pickup. No upfront payment required.</span>
        </div>

      </div>
    </div>
  );
}
