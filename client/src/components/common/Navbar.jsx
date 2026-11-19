import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Phone, Clock, Search, User, ShieldCheck, 
  Calendar, Sparkles, ChevronDown, LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onOpenSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const { user, admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll listener for sticky morph and scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const currentProgress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
      setScrollProgress(currentProgress);

      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdown(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Scroll Progress Bar at the Top */}
      <div 
        className="h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600 transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Top Bar for Location & Hours (Hidden on small screens) */}
      <div className={`hidden md:block text-xs transition-all duration-300 ${
        scrolled ? 'h-0 overflow-hidden opacity-0 py-0' : 'bg-mercury-navy text-slate-300 py-2 border-b border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-blue-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Ghumar Mandi, Ludhiana
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Mon - Sat: 9:00 AM – 8:30 PM (Sunday Closed)
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/track" className="hover:text-white transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Track Order
            </Link>
            <span className="text-slate-600">|</span>
            <a href="tel:+917814966031" className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              +91 78149 66031
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-100 text-slate-800'
          : 'bg-white/90 backdrop-blur-sm py-4 border-b border-slate-200/60 text-slate-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-mercury-navy flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              {/* Animated SVG Hanger Icon */}
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a2.5 2.5 0 0 0-2.5 2.5c0 1.2.7 2.1 1.7 2.4L3 14a1 1 0 0 0 .5 1.5h17a1 1 0 0 0 .5-1.5L12.8 7.9c1-.3 1.7-1.2 1.7-2.4A2.5 2.5 0 0 0 12 3z"/>
                <line x1="3" y1="15.5" x2="21" y2="15.5"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-lg md:text-xl tracking-tight text-mercury-navy">
                  MERCURY
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                  Care
                </span>
              </div>
              <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-blue-600 -mt-1">
                DRYCLEANERS
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-blue-600 font-semibold'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                  {active && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons & Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Command Palette Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-all bg-slate-50/50"
              title="Search services and pages (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Search</span>
              <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-400 shadow-2xs">
                Ctrl K
              </kbd>
            </button>

            {/* Auth Dropdown / Dashboard Button */}
            {admin ? (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Admin Panel
              </Link>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <AnimatePresence>
                  {userDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-xs"
                    >
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="font-semibold text-slate-800 truncate">{user.name}</p>
                        <p className="text-slate-400 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setUserDropdown(false)}
                      >
                        <User className="w-3.5 h-3.5" />
                        My Dashboard
                      </Link>
                      <Link
                        to="/track"
                        className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setUserDropdown(false)}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Track Orders
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdown(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 text-left border-t border-slate-100 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </Link>
            )}

            {/* Book a Pickup Button */}
            <Link
              to="/booking"
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs tracking-wide shadow-md shadow-blue-500/25 hover:bg-blue-700 active:scale-95 transition-all duration-200 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Book a Pickup
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden bg-white/98 backdrop-blur-xl border-b border-slate-200 shadow-2xl overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              <div className="bg-slate-50 p-2.5 rounded-xl flex items-center justify-between text-xs text-slate-600 mb-3">
                <span className="flex items-center gap-1 font-medium text-mercury-navy">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Ghumar Mandi, Ludhiana
                </span>
                <a href="tel:+917814966031" className="text-blue-600 font-semibold">
                  Call Shop
                </a>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive(link.path)
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <Link
                to="/track"
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <span>Track Order</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </Link>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="w-full py-2.5 px-4 text-center rounded-xl bg-slate-100 font-semibold text-xs text-slate-800"
                    >
                      My Dashboard ({user.name.split(' ')[0]})
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                      className="w-full py-2 px-4 text-center text-xs text-rose-600"
                    >
                      Sign Out
                    </button>
                  </>
                ) : admin ? (
                  <Link
                    to="/admin"
                    className="w-full py-2.5 px-4 text-center rounded-xl bg-slate-900 text-white font-semibold text-xs"
                  >
                    Go to Admin Dashboard
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      className="w-full py-2.5 px-4 text-center rounded-xl border border-slate-200 font-semibold text-xs text-slate-700 hover:bg-slate-50"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="w-full py-2.5 px-4 text-center rounded-xl bg-blue-50 text-blue-700 font-semibold text-xs"
                    >
                      Register
                    </Link>
                  </div>
                )}

                <Link
                  to="/booking"
                  className="w-full mt-2 py-3 px-4 text-center rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Book a Doorstep Pickup
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
