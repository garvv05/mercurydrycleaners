import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Copy, Check, ArrowRight } from 'lucide-react';

export default function PromotionalBanner() {
  const [copied, setCopied] = useState(false);
  const coupon = 'FIRST100';

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-mercury-navy via-blue-900 to-indigo-950 p-8 sm:p-14 text-white shadow-2xl">
          {/* Subtle decorative background elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Text & Offer (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                Special Inaugural Online Offer
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Give Your Clothes the Care They Deserve.
              </h2>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Enjoy flat <span className="text-white font-bold">₹100 OFF</span> on your dry cleaning order above ₹500. Complimentary doorstep pickup & delivery across Ludhiana.
              </p>

              {/* Coupon Box */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs">
                  <span className="text-slate-300">Use Code:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm tracking-widest">{coupon}</span>
                  <button
                    onClick={handleCopy}
                    className="p-1 text-slate-300 hover:text-white transition-colors"
                    title="Copy coupon code"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {copied && (
                  <span className="text-xs text-emerald-400 font-medium animate-pulse">
                    Coupon copied to clipboard!
                  </span>
                )}
              </div>
            </div>

            {/* CTA Button (4 Cols) */}
            <div className="lg:col-span-4 flex lg:justify-end">
              <Link
                to="/booking"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-500 hover:bg-blue-400 active:scale-95 text-white font-bold text-sm shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 transition-all group"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Pickup Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
