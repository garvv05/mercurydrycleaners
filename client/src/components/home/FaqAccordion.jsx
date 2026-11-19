import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import api from '../../services/api';

export default function FaqAccordion() {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(0); // first item expanded by default

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.get('/faqs/public');
        if (res.data.success && res.data.faqs.length > 0) {
          setFaqs(res.data.faqs);
        }
      } catch (err) {
        console.error('Failed to load FAQs:', err);
      }
    };
    fetchFaqs();
  }, []);

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase()) ||
      (f.category && f.category.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleItem = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Common Inquiries
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-mercury-navy tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed max-w-xl mx-auto">
            Everything you need to know about our dry cleaning solvent processes, Ghumar Mandi pickup timings, and garment care.
          </p>

          {/* Live Search Filter Box */}
          <div className="pt-4 max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search questions (e.g. stains, pickup, silk, turnaround)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-blue-500 shadow-2xs transition-all"
              />
            </div>
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              No matching questions found for "{search}". Contact us directly for immediate assistance!
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq._id || index}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs hover:border-slate-300 transition-all"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 focus:outline-hidden"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className={`w-4 h-4 shrink-0 ${isOpen ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className={`text-sm font-semibold transition-colors ${isOpen ? 'text-blue-600' : 'text-slate-800'}`}>
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}
