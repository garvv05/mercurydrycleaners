import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Clock, ArrowUp, 
  Sparkles, ShieldCheck, Heart, Send 
} from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-mercury-navy text-slate-300 pt-16 pb-8 border-t border-slate-800 relative">
      {/* Decorative top accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info (2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a2.5 2.5 0 0 0-2.5 2.5c0 1.2.7 2.1 1.7 2.4L3 14a1 1 0 0 0 .5 1.5h17a1 1 0 0 0 .5-1.5L12.8 7.9c1-.3 1.7-1.2 1.7-2.4A2.5 2.5 0 0 0 12 3z"/>
                  <line x1="3" y1="15.5" x2="21" y2="15.5"/>
                </svg>
              </div>
              <div>
                <span className="font-serif font-bold text-xl text-white tracking-wide">
                  MERCURY
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-[0.25em] text-blue-400">
                  DRYCLEANERS
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Your Clothes. Our Care. Always Fresh. Setting the highest standard in bespoke garment care and artisanal eco-solvent dry cleaning for the residents of Ludhiana.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-blue-900/50 border border-blue-700/50 text-blue-300">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Zero Fabric Shrinkage
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-slate-800 border border-slate-700 text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Ghumar Mandi Landmark
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-blue-400 transition-colors">Services Catalog</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-blue-400 transition-colors">Garment Pricing</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-blue-400 transition-colors">Garment Science</Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-blue-400 transition-colors text-blue-400 font-medium">Track Order Status</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact & Shop Map</Link>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">
              Garment Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services/dry-cleaning" className="hover:text-blue-400 transition-colors">Eco Dry Cleaning</Link>
              </li>
              <li>
                <Link to="/services/steam-ironing" className="hover:text-blue-400 transition-colors">Vacuum Steam Ironing</Link>
              </li>
              <li>
                <Link to="/services/suit-and-blazer-cleaning" className="hover:text-blue-400 transition-colors">Suits & Tuxedos</Link>
              </li>
              <li>
                <Link to="/services/saree-and-ethnic-wear-care" className="hover:text-blue-400 transition-colors">Banarasi & Silk Sarees</Link>
              </li>
              <li>
                <Link to="/services/winter-wear-cleaning" className="hover:text-blue-400 transition-colors">Winter Overcoats & Tweed</Link>
              </li>
              <li>
                <Link to="/services/blanket-cleaning" className="hover:text-blue-400 transition-colors">Mink Blankets & Razais</Link>
              </li>
              <li>
                <Link to="/services/premium-garment-care" className="hover:text-blue-400 transition-colors">Bespoke Bridal Couture</Link>
              </li>
            </ul>
          </div>

          {/* Store Details */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">
              Visit Our Shop
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Shop 14, Main Market, Ghumar Mandi, Ludhiana, Punjab – 141001, India
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="tel:+917814966031" className="hover:text-white transition-colors">
                  +91 78149 66031
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:garvv22@gmail.com" className="hover:text-white transition-colors">
                  garvv22@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1 text-slate-400">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p>Mon - Sat: 9:00 AM – 8:30 PM</p>
                  <p className="text-slate-400">Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/booking"
                className="inline-block w-full text-center py-2 px-3 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-500 transition-colors shadow-sm"
              >
                Schedule Doorstep Collection
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} MERCURY DRYCLEANERS. All rights reserved. Ghumar Mandi, Ludhiana.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/admin/login" className="hover:text-slate-300 transition-colors">
              Staff Portal
            </Link>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-white transition-colors text-blue-400"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
