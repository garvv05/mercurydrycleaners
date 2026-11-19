import React, { useState, useEffect } from 'react';
import { Plus, Minus, Search, Tag, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useBooking } from '../../context/BookingContext';

export default function Step2Garments({ onNext, onBack }) {
  const { items, addItem, updateQuantity } = useBooking();
  const [garments, setGarments] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGarments = async () => {
      try {
        const res = await api.get('/pricing/garments');
        if (res.data.success) {
          setGarments(res.data.items);
        }
      } catch (err) {
        console.error('Failed to load garments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGarments();
  }, []);

  const categories = ['All', 'Shirts', 'Trousers', 'Suits', 'Blazers', 'Sarees', 'Dresses', 'Jackets', 'Blankets', 'Other'];

  const filtered = garments.filter((g) => {
    const matchesCat = category === 'All' || g.category === category;
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
                          g.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getItemQuantity = (garmentName) => {
    const found = items.find((i) => i.garmentName === garmentName);
    return found ? found.quantity : 0;
  };

  const totalGarmentsSelected = items.reduce((s, i) => s + (i.quantity || 1), 0);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-mercury-navy">
          Step 2: Garment Types & Quantities
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm">
          Select each piece you would like cleaned. Use the plus and minus buttons to set exact counts.
        </p>
      </div>

      {/* Category Filter Pills & Search */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search garment (e.g. Linen shirt, Tuxedo, Saree, Razai)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Garments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[440px] overflow-y-auto pr-1">
        {filtered.map((garment) => {
          const qty = getItemQuantity(garment.name);
          return (
            <div
              key={garment._id || garment.name}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                qty > 0
                  ? 'border-blue-400 bg-blue-50/30 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-800">
                    {garment.name}
                  </h4>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                    {garment.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {garment.description || garment.fabricAdvice}
                </p>
                <p className="text-xs font-bold text-blue-600 mt-1">
                  ₹{garment.dryCleanPrice} <span className="text-[10px] font-normal text-slate-400">/ piece</span>
                </p>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => updateQuantity(garment.name, 'Dry Cleaning', -1)}
                  disabled={qty === 0}
                  className="w-7 h-7 rounded-lg bg-white text-slate-700 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shadow-xs"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <span className="w-6 text-center text-xs font-bold text-slate-800">
                  {qty}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (qty === 0) {
                      addItem(garment.name, 'Dry Cleaning', garment.dryCleanPrice, 1);
                    } else {
                      updateQuantity(garment.name, 'Dry Cleaning', 1);
                    }
                  }}
                  className="w-7 h-7 rounded-lg bg-white text-slate-700 hover:text-blue-600 flex items-center justify-center shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {totalGarmentsSelected === 0 && (
        <div className="p-3 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Please select at least 1 garment to proceed with your booking.</span>
        </div>
      )}

      {/* Nav Buttons */}
      <div className="pt-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all"
        >
          ← Back to Services
        </button>

        <button
          onClick={onNext}
          disabled={totalGarmentsSelected === 0}
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all"
        >
          Next: Special Fabric Notes →
        </button>
      </div>
    </div>
  );
}
