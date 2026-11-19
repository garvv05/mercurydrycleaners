import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-36 pb-20 flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-md">
          <Sparkles className="w-8 h-8" />
        </div>
        <span className="font-serif font-bold text-5xl text-mercury-navy block">404</span>
        <h1 className="font-serif text-2xl font-bold text-slate-800">Page Not Found</h1>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
          The page or garment link you're looking for does not exist or has been moved.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <Link
            to="/"
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 flex items-center gap-1.5 transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/services"
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-all"
          >
            View Services
          </Link>
        </div>
      </div>
    </div>
  );
}
