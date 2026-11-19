import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [service, setService] = useState('Dry Cleaning');
  const [garmentsCount, setGarmentsCount] = useState('3-5 Garments');
  const [preferredDate, setPreferredDate] = useState('Tomorrow');
  const [preference, setPreference] = useState('Doorstep Pickup in Ludhiana');

  const whatsappNumber = '917814966031'; // Ghumar Mandi WhatsApp desk

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    const customer = name.trim() || 'Valued Customer';
    const message = `Hello Mercury Drycleaners! I would like to enquire about garment care.

*Customer Name:* ${customer}
*Service Requested:* ${service}
*Estimated Garments:* ${garmentsCount}
*Preferred Timing:* ${preferredDate}
*Preference:* ${preference}
*Location:* Ghumar Mandi, Ludhiana

Kindly let me know the pickup schedule and rates. Thank you!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* WhatsApp Modal Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-xs"
          >
            {/* Header */}
            <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Mercury Drycleaners WhatsApp</h4>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    Online • Ghumar Mandi Desk
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSendWhatsApp} className="p-4 space-y-3 bg-slate-50">
              <p className="text-slate-600 text-xs">
                Have a quick question or need immediate pickup assistance? Connect directly with our Ghumar Mandi garment specialists.
              </p>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jaspreet Singh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Service</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden text-xs"
                  >
                    <option value="Dry Cleaning">Dry Cleaning</option>
                    <option value="Suits & Blazers">Suits & Blazers</option>
                    <option value="Silk Sarees & Zari">Silk Sarees & Zari</option>
                    <option value="Winter Coats & Tweed">Winter Coats</option>
                    <option value="Mink Blankets & Quilts">Blanket Care</option>
                    <option value="Steam Ironing">Steam Ironing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Quantity</label>
                  <select
                    value={garmentsCount}
                    onChange={(e) => setGarmentsCount(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden text-xs"
                  >
                    <option value="1-2 Garments">1-2 Items</option>
                    <option value="3-5 Garments">3-5 Items</option>
                    <option value="6-10 Garments">6-10 Items</option>
                    <option value="10+ Garments">10+ Bulk Items</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Pickup or Drop-off</label>
                <select
                  value={preference}
                  onChange={(e) => setPreference(e.target.value)}
                  className="w-full px-2.5 py-2 bg-white rounded-lg border border-slate-200 focus:outline-hidden text-xs"
                >
                  <option value="Doorstep Pickup in Ludhiana">Doorstep Pickup (Ludhiana)</option>
                  <option value="Dropping off at Ghumar Mandi Shop">Store Drop-off (Ghumar Mandi)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all text-xs"
              >
                <Send className="w-3.5 h-3.5" />
                Start Chat with Prefilled Enquiry
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative group w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-600/40 focus:outline-hidden"
        aria-label="Chat on WhatsApp"
      >
        {/* Subtle Attention Ping Ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500 opacity-75 animate-ping -z-10" />

        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-7 h-7" />
        )}

        {/* Hover Tooltip */}
        <span className="absolute right-16 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
          Need Help? Chat on WhatsApp
        </span>
      </motion.button>
    </div>
  );
}
