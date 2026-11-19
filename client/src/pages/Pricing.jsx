import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Tag, Sparkles, AlertCircle, Calendar, 
  HelpCircle, ArrowRight, X, Check, Send 
} from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { useBooking } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';

export default function Pricing() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Request a quote modal
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteName, setQuoteName] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteGarments, setQuoteGarments] = useState('');
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  const { addItem, setCurrentStep } = useBooking();
  const navigate = useNavigate();

  const categories = [
    'All',
    'Shirts',
    'Trousers',
    'Suits',
    'Blazers',
    'Sarees',
    'Dresses',
    'Jackets',
    'Blankets',
    'Other'
  ];

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await api.get('/pricing/garments');
        if (res.data.success) {
          setItems(res.data.items);
        }
      } catch (err) {
        console.error('Failed to load garment prices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleBookGarment = (item, serviceType, price) => {
    addItem(item.name, serviceType, price, 1);
    setCurrentStep(2);
    navigate('/booking');
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contact', {
        name: quoteName,
        phone: quotePhone,
        email: 'garvv22@gmail.com',
        subject: 'Custom Garment Quotation Request',
        message: `Customer requested a quotation for the following garments:\n${quoteGarments}`
      });
      setQuoteSuccess(true);
      setTimeout(() => {
        setQuoteSuccess(false);
        setQuoteModalOpen(false);
        setQuoteGarments('');
      }, 2500);
    } catch (err) {
      alert('Failed to send quote request. Please try again.');
    }
  };

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100/70 px-3.5 py-1.5 rounded-full border border-blue-200">
            Mercury Drycleaners • Official Store Rate Card
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-mercury-navy tracking-tight">
            Authentic Garment Care & Dry Cleaning Rates
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            Directly from our Ghumar Mandi, Ludhiana rate card. Transparent per-article pricing with zero per-kg laundry gimmicks. Every fabric receives artisanal care.
          </p>

          {/* Authentic Rate Card Rules Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 text-xs font-medium shadow-2xs">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Finishing & Pressing Rule:</strong> 50% to 60% of Dry Cleaning Charges
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium shadow-2xs">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Curtains:</strong> Lining curtain will be ₹50 extra
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-medium shadow-2xs">
              <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                All charges in <strong>₹ Onwards</strong> • Editable in Admin Dashboard
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="pt-2 max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search 50 articles (e.g. Suit Gents, Pashmina, Mink Blanket, Tweed Coat, Saree)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article Counter Strip */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Showing <strong className="text-slate-800">{filteredItems.length}</strong> dry cleaning articles</span>
          <span className="text-[11px] text-blue-600 font-medium">All rates in ₹ (INR) onwards as per authentic shop rate card</span>
        </div>

        {/* Pricing Table */}
        {loading ? (
          <SkeletonLoader type="table" count={8} />
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-6 font-semibold">Articles (Rate Card)</th>
                    <th className="py-4 px-4 font-semibold">Category</th>
                    <th className="py-4 px-4 font-semibold text-right">Pressing & Finishing (50-60%)</th>
                    <th className="py-4 px-4 font-semibold text-right text-blue-300">Dry Cleaning (Onwards)</th>
                    <th className="py-4 px-4 font-semibold text-right text-indigo-300">Couture / Silk Safe</th>
                    <th className="py-4 px-6 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item, idx) => (
                    <tr
                      key={item._id || idx}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.description || item.fabricAdvice}</p>
                      </td>
                      <td className="py-4 px-4 text-slate-500">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-slate-700">
                        ₹{item.steamIronPrice}/-
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-blue-600 text-sm">
                        ₹{item.dryCleanPrice}/- <span className="text-[10px] font-normal text-slate-400">Onw.</span>
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-indigo-700">
                        ₹{item.premiumCarePrice}/-
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleBookGarment(item, 'Dry Cleaning', item.dryCleanPrice)}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold text-xs transition-all shadow-2xs"
                        >
                          Book Care
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Custom Quotation Banner */}
        <div className="bg-gradient-to-r from-mercury-navy to-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Need Special Handling?
            </span>
            <h3 className="font-serif text-2xl font-bold">
              Bespoke Bridal Wear & Custom Fabric Quotations
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Have antique family heirloom shawls, heavy theatrical wardrobe, imported designer gowns, or large velvet curtains? Request a personalized inspection quote.
            </p>
          </div>

          <button
            onClick={() => setQuoteModalOpen(true)}
            className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 whitespace-nowrap transition-all"
          >
            Request a Quote
          </button>
        </div>

      </div>

      {/* Request a Quote Modal */}
      <AnimatePresence>
        {quoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuoteModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-xs"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-serif font-bold text-lg text-mercury-navy">
                  Request a Custom Quote
                </h3>
                <button
                  onClick={() => setQuoteModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {quoteSuccess ? (
                <div className="py-10 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-slate-900">
                    Quote Request Received!
                  </h4>
                  <p className="text-slate-500 text-xs">
                    Our Ghumar Mandi garment specialist will contact you with an estimate.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitQuote} className="space-y-4 pt-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jaspreet Kaur"
                      value={quoteName}
                      onChange={(e) => setQuoteName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98140 12345"
                      value={quotePhone}
                      onChange={(e) => setQuotePhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Garments & Details *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe the fabric, designer label, embroidery, or quantity (e.g. 1 heavy bridal lehenga with silver gota work)..."
                      value={quoteGarments}
                      onChange={(e) => setQuoteGarments(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 text-xs leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Quotation Request</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
