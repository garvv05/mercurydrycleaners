import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Plus, Minus, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export default function QuickPriceEstimator() {
  const navigate = useNavigate();
  const { setGarmentsFromEstimator, setCurrentStep } = useBooking();

  const [quantities, setQuantities] = useState({
    'Suit Gents (2 Pcs.)': 1,
    'Shirt (Ord)': 2,
    'Pant': 1,
    'Saree (Plain)': 0,
    'Lady Suit (Ord.)': 0,
    'Coat': 0,
    'Blanket (Double Bed Double Ply)': 0,
    'Leather Jacket': 0
  });

  const priceCatalog = {
    'Suit Gents (2 Pcs.)': { name: 'Suit Gents (2 Pcs.)', price: 500, icon: '🤵' },
    'Shirt (Ord)': { name: 'Shirt (Ord)', price: 150, icon: '👔' },
    'Pant': { name: 'Pant', price: 180, icon: '👖' },
    'Coat': { name: 'Coat', price: 350, icon: '🧥' },
    'Saree (Plain)': { name: 'Saree (Plain)', price: 300, icon: '🥻' },
    'Lady Suit (Ord.)': { name: 'Lady Suit (Ord.)', price: 300, icon: '👗' },
    'Blanket (Double Bed Double Ply)': { name: 'Double Bed Blanket', price: 600, icon: '🛏️' },
    'Leather Jacket': { name: 'Leather Jacket', price: 1000, icon: '🧥' }
  };

  const handleQtyChange = (key, delta) => {
    setQuantities(prev => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta)
    }));
  };

  const totalGarments = useMemo(() => {
    return Object.values(quantities).reduce((a, b) => a + b, 0);
  }, [quantities]);

  const estimatedTotal = useMemo(() => {
    return Object.keys(quantities).reduce((sum, key) => {
      const qty = quantities[key] || 0;
      const unit = priceCatalog[key]?.price || 0;
      return sum + (qty * unit);
    }, 0);
  }, [quantities]);

  const handleContinueToBooking = () => {
    const selectedItems = [];
    Object.keys(quantities).forEach(key => {
      const q = quantities[key];
      if (q > 0) {
        selectedItems.push({
          garmentName: key,
          serviceType: 'Dry Cleaning',
          quantity: q,
          unitPrice: priceCatalog[key].price,
          total: q * priceCatalog[key].price
        });
      }
    });

    if (selectedItems.length > 0) {
      setGarmentsFromEstimator(selectedItems);
    }
    setCurrentStep(3); // jump directly to special instructions / schedule
    navigate('/booking');
  };

  return (
    <section className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100/70 px-3 py-1 rounded-full border border-blue-200">
            Transparent Pricing
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-mercury-navy tracking-tight">
            Quick Garment Price Estimator
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Select your garments and quantities to calculate an instant dry-cleaning estimate before scheduling your pickup.
          </p>

          <div className="inline-flex items-center gap-1.5 text-xs text-blue-800 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-lg">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Official Mercury Drycleaners Rate Card (₹ Onwards). Pressing/Charakh is 50%-60% of Dry Cleaning.</span>
          </div>
        </div>

        {/* Main Estimator Box */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.keys(priceCatalog).map((key) => {
              const item = priceCatalog[key];
              const qty = quantities[key] || 0;
              return (
                <div
                  key={key}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    qty > 0
                      ? 'border-blue-400 bg-blue-50/30 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-2xl mb-1 block">{item.icon}</span>
                      <h4 className="font-semibold text-xs sm:text-sm text-slate-800">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-blue-600 font-bold">₹{item.price} / item</p>
                    </div>
                  </div>

                  {/* Quantity Counter Stepper */}
                  <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-3">
                    <span className="text-xs text-slate-500 font-medium">Qty</span>
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                      <button
                        onClick={() => handleQtyChange(key, -1)}
                        disabled={qty === 0}
                        className="w-6 h-6 rounded-md bg-white text-slate-700 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shadow-xs transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-800">
                        {qty}
                      </span>
                      <button
                        onClick={() => handleQtyChange(key, 1)}
                        className="w-6 h-6 rounded-md bg-white text-slate-700 hover:text-blue-600 flex items-center justify-center shadow-xs transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Running Total & Carry to Booking Button */}
          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/70 p-6 rounded-2xl">
            <div className="text-center sm:text-left">
              <p className="text-xs text-slate-500 font-medium">
                Total Garments Selected: <span className="font-bold text-slate-800">{totalGarments} items</span>
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Estimated Total:</span>
                <motion.span
                  key={estimatedTotal}
                  initial={{ scale: 1.1, color: '#2563EB' }}
                  animate={{ scale: 1, color: '#102A43' }}
                  className="text-3xl font-bold font-serif text-mercury-navy"
                >
                  ₹{estimatedTotal}
                </motion.span>
                <span className="text-[11px] text-slate-400">+ 5% GST</span>
              </div>
            </div>

            <button
              onClick={handleContinueToBooking}
              disabled={totalGarments === 0}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:bg-blue-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              <span>Continue to Booking with Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
