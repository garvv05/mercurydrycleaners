import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Sparkles, Award, CheckCircle2, 
  MapPin, HeartHandshake, Droplets, Calendar 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100/70 px-3 py-1 rounded-full border border-blue-200">
            About Mercury Drycleaners
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-mercury-navy tracking-tight leading-tight">
            Artisanal Garment Care in Ghumar Mandi, Ludhiana
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Your Clothes. Our Care. Always Fresh. Setting the standard for pure eco-solvent dry cleaning, delicate fabric protection, and bespoke steam finishing in Punjab.
          </p>
        </div>

        {/* Narrative & Visual Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Our Philosophy
            </span>
            <h2 className="font-serif text-3xl font-bold text-mercury-navy">
              Why We Treat Garments Differently
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              At Mercury Drycleaners, we recognize that your wardrobe represents meaningful moments: weddings, corporate milestones, festive family traditions, and daily confidence. Standard domestic washing machines and harsh water chemistry degrade fine threads, strip protective lanolin from woollens, and dissolve delicate zari work.
            </p>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              We exclusively utilize high-purity hydrocarbon and liquid silicone dry cleaning technology. Because no water touches the garments during this process, fabric fibers neither swell nor stretch. Colors remain radiant, bespoke linings retain tailored posture, and intricate embroideries stay firmly anchored.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4 text-xs font-semibold text-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Shrinkage Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Non-Abrasive Solvents</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Hand Pre-Spotting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Tailored Form-Pressing</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1000&q=80"
                alt="Mercury Drycleaners garment workshop"
                className="w-full h-[420px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md text-mercury-navy flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm">Ghumar Mandi Flagship</h4>
                  <p className="text-[11px] text-slate-500">Shop 14, Main Market, Ludhiana</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                  Open 6 Days
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-mercury-navy">
              The Mercury Care Pillars
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              Our foundational commitments to garment preservation and customer delight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-base text-slate-900">Fiber Protection</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hydrocarbon solvent technology gently lifts lipids and airborne dirt while preserving delicate weaves.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-base text-slate-900">Bespoke Finishing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Italian vacuum steam forms relax wrinkles while locking in razor-sharp lapels without shine marks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-base text-slate-900">Master Inspection</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every piece undergoes a 10-point inspection before cleaning and after pressing under high-CRI lighting.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-base text-slate-900">Ludhiana Convenience</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scheduled doorstep collection and delivery across Ghumar Mandi, Model Town, Civil Lines, and Sarabha Nagar.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="p-10 rounded-3xl bg-mercury-navy text-white text-center space-y-4 shadow-xl">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold">
            Ready to Experience Couture Fabric Care?
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto">
            Schedule a convenient doorstep pickup in Ludhiana or visit our Ghumar Mandi counter today.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              to="/booking"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-xs shadow-md shadow-blue-500/30 transition-all"
            >
              Book a Doorstep Pickup
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold text-xs transition-all"
            >
              Shop Location & Contact
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
