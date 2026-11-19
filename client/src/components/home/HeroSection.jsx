import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Calendar, ArrowRight, ShieldCheck, 
  MapPin, CheckCircle, Search, Droplets 
} from 'lucide-react';

export default function HeroSection() {
  const [trackId, setTrackId] = useState('');
  const navigate = useNavigate();

  const handleHeroTrack = (e) => {
    e.preventDefault();
    if (trackId.trim()) {
      navigate(`/track?id=${encodeURIComponent(trackId.trim())}`);
    }
  };

  return (
    <section className="relative min-h-[90vh] pt-32 pb-20 overflow-hidden flex items-center bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Actions (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Location & Trust Pill */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-900 text-xs font-semibold shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
              <span>Proudly serving Ghumar Mandi, Ludhiana</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span className="text-blue-700">Doorstep Pickup Available</span>
            </motion.div>

            {/* Main Headline Reveal */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-mercury-navy leading-[1.12]"
            >
              Premium Care for <br className="hidden sm:inline" />
              <span className="relative inline-block text-blue-600">
                Every Fabric.
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-blue-200 -z-10" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="6" fill="none" />
                </svg>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl"
            >
              Experience professional dry cleaning and garment care with Mercury Drycleaners. We take care of your clothes so you can focus on what matters.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                to="/booking"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all group"
              >
                <Calendar className="w-4 h-4" />
                Book a Pickup
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold text-sm hover:border-blue-300 hover:bg-blue-50/50 shadow-sm transition-all"
              >
                Explore Our Services
              </Link>
            </motion.div>

            {/* Quick Hero Order Status Tracker Mini-Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-3 max-w-md"
            >
              <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-slate-200/90 shadow-md">
                <form onSubmit={handleHeroTrack} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 pl-3 flex-1">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Enter Order ID (e.g. MD-2611-1001)"
                      value={trackId}
                      onChange={(e) => setTrackId(e.target.value)}
                      className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-mercury-navy text-white text-xs font-semibold hover:bg-slate-800 transition-colors whitespace-nowrap flex items-center gap-1.5"
                  >
                    <span>Check Status</span>
                    <Sparkles className="w-3 h-3 text-amber-400" />
                  </button>
                </form>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 pl-2">
                Already dropped off clothes? Track real-time cleaning progress here.
              </p>
            </motion.div>

            {/* Animated Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-600 font-medium border-t border-slate-200/60"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Eco-Friendly Solvents</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Zero Fabric Shrinkage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Vacuum Steam Finishing</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Visual Garment Presentation (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Main Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80"
                  alt="Professionally dry cleaned formal suits and garments on wooden hangers"
                  className="w-full h-[460px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                {/* Floating Bottom Info Pill */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">
                      Artisanal Finishing
                    </span>
                    <h4 className="font-serif font-bold text-slate-900 text-sm">
                      Form-Pressed Suits & Silks
                    </h4>
                    <p className="text-[11px] text-slate-500">Delivered in breathable dust covers</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                    100%
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Top Right */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-800">Couture Care</p>
                  <p className="text-[10px] text-slate-500">Pure Zari & Silk Safe</p>
                </div>
              </motion.div>

              {/* Floating Badge 2: Bottom Left */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-6 -left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-800">Hydrocarbon Wash</p>
                  <p className="text-[10px] text-slate-500">Gentle on Fibers</p>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
