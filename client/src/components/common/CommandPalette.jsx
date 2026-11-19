import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Calendar, Sparkles, Phone, Tag, 
  HelpCircle, Info, ChevronRight, X 
} from 'lucide-react';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Handle Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose(); // toggle
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const items = [
    { title: 'Book a Pickup', category: 'Actions', path: '/booking', icon: Calendar, desc: 'Schedule doorstep pickup in Ludhiana' },
    { title: 'Track Order', category: 'Actions', path: '/track', icon: Sparkles, desc: 'Check live status of your dry cleaning' },
    { title: 'Dry Cleaning Service', category: 'Services', path: '/services/dry-cleaning', icon: Sparkles, desc: 'Eco-solvent delicate garment care' },
    { title: 'Suit and Blazer Cleaning', category: 'Services', path: '/services/suit-and-blazer-cleaning', icon: Sparkles, desc: 'Form-finished suits & tuxedos' },
    { title: 'Saree & Ethnic Wear Care', category: 'Services', path: '/services/saree-and-ethnic-wear-care', icon: Sparkles, desc: 'Zari and bridal preservation' },
    { title: 'Winter Wear & Overcoats', category: 'Services', path: '/services/winter-wear-cleaning', icon: Sparkles, desc: 'Cashmeres, coats & down jackets' },
    { title: 'Blanket Cleaning', category: 'Services', path: '/services/blanket-cleaning', icon: Sparkles, desc: 'Mink blankets & razais' },
    { title: 'Steam Ironing', category: 'Services', path: '/services/steam-ironing', icon: Sparkles, desc: 'Vacuum finish wrinkle removal' },
    { title: 'Garment Pricing Table', category: 'Pages', path: '/pricing', icon: Tag, desc: 'Per garment prices in INR' },
    { title: 'How It Works', category: 'Pages', path: '/how-it-works', icon: HelpCircle, desc: '4-step dry cleaning process' },
    { title: 'About Mercury Drycleaners', category: 'Pages', path: '/about', icon: Info, desc: 'Our story and Ghumar Mandi store' },
    { title: 'Contact & Shop Location', category: 'Pages', path: '/contact', icon: Phone, desc: 'Phone, timings, and map' },
  ];

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search services, garment pricing, tracking, pages..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-400">
                  No matching services or pages found.
                </div>
              ) : (
                filtered.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSelect(item.path)}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50/70 group flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                          {item.category}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Navigate with click or arrow keys</span>
              <span>ESC to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
