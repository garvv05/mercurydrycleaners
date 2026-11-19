import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Phone, Mail, Clock, MessageCircle, 
  Send, CheckCircle, Sparkles, AlertCircle 
} from 'lucide-react';
import api from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Garment Care Enquiry',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Live "Open Now / Closed" check based on IST shop hours:
  // Mon-Sat: 9:00 AM to 8:30 PM, Sunday: Closed
  const isOpenNow = useMemo(() => {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;

    if (day === 0) {
      // Sunday: Closed
      return false;
    } else {
      // Mon - Sat: 9:00 AM to 8:30 PM (20:30)
      return currentTime >= 9 * 60 && currentTime <= (20 * 60 + 30);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('/contact', formData);
      if (res.data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'General Garment Care Enquiry',
          message: ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deliver message. Please try again or call us.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100/70 px-3 py-1 rounded-full border border-blue-200">
            Get in Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-mercury-navy tracking-tight">
            Contact Mercury Drycleaners
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Visit our workshop in Ghumar Mandi, schedule a doorstep pickup, or speak directly with our garment care desk.
          </p>

          {/* Live Shop Status Indicator Pill */}
          <div className="pt-2 flex justify-center">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs ${
              isOpenNow
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{isOpenNow ? 'Ghumar Mandi Workshop Open Now' : 'Currently Closed • Opens Tomorrow at 9:00 AM'}</span>
            </div>
          </div>
        </div>

        {/* Contact Info Cards & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-5 text-xs">
            
            {/* Location Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <MapPin className="w-5 h-5 shrink-0" />
                <span>Shop Location</span>
              </div>
              <p className="text-slate-900 font-semibold text-sm">MERCURY DRYCLEANERS</p>
              <p className="text-slate-600 leading-relaxed">
                Shop 14, Main Market, Ghumar Mandi,<br />
                Ludhiana, Punjab – 141001, India
              </p>
              <p className="text-slate-400 text-[11px] pt-1">
                Landmark: Main Ghumar Mandi shopping lane.
              </p>
            </div>

            {/* Direct Lines */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <Phone className="w-5 h-5 shrink-0" />
                <span>Direct Contact</span>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">Phone Support:</span>
                  <a href="tel:+917814966031" className="text-slate-900 font-bold text-sm hover:text-blue-600 transition-colors">
                    +91 78149 66031
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Email Desk:</span>
                  <a href="mailto:garvv22@gmail.com" className="text-slate-900 font-semibold hover:text-blue-600 transition-colors">
                    garvv22@gmail.com
                  </a>
                </div>

                <div className="pt-2">
                  <a
                    href="https://wa.me/917814966031?text=Hello%20Mercury%20Drycleaners%2C%20I%20have%20an%20enquiry%20regarding%20garment%20care."
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on Official WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                <Clock className="w-5 h-5 shrink-0" />
                <span>Operating Timings</span>
              </div>
              <div className="space-y-1.5 text-slate-600 text-xs pt-1">
                <div className="flex justify-between">
                  <span>Monday – Saturday:</span>
                  <strong className="text-slate-900">9:00 AM – 8:30 PM</strong>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <strong className="text-rose-600 font-semibold">Closed</strong>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl space-y-6 text-xs">
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-mercury-navy">
                Send a Message
              </h3>
              <p className="text-slate-500 text-xs">
                Have a question about a specific garment, bridal restoration, or corporate account? Send us a note.
              </p>
            </div>

            {success ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-xl text-slate-900">
                  Message Delivered!
                </h4>
                <p className="text-slate-600 text-xs max-w-sm mx-auto leading-relaxed">
                  Thank you for contacting Mercury Drycleaners. Our team at Ghumar Mandi will get back to you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Jasleen Kaur"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98140 12345"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="jasleen@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 text-xs"
                    >
                      <option value="General Garment Care Enquiry">General Garment Care</option>
                      <option value="Doorstep Pickup In Ludhiana">Doorstep Pickup Schedule</option>
                      <option value="Bridal & Zari Saree Care">Bridal & Zari Saree Care</option>
                      <option value="Suits & Tuxedos Rejuvenation">Suits & Tuxedos</option>
                      <option value="Blankets & Quilts Sanitization">Blankets & Quilts</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Message *</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell us about the garments, special requirements, or pickup timing..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 text-xs leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Delivering Message...' : 'Send Message to Ghumar Mandi Team'}</span>
                </button>
              </form>
            )}

          </div>

        </div>

        {/* Google Maps Embed Section */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Map & Shop Directions – Ghumar Mandi, Ludhiana</span>
            </div>
            <a
              href="https://maps.google.com/?q=Ghumar+Mandi+Ludhiana+Punjab"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Open in Google Maps ↗
            </a>
          </div>

          <div className="rounded-2xl overflow-hidden h-72 sm:h-96 border border-slate-200">
            <iframe
              title="Mercury Drycleaners Ghumar Mandi Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13693.303977595304!2d75.83401569999999!3d30.9054778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a8397a66b56b3%3A0xe54e195726e6fa39!2sGhumar%20Mandi%2C%20Ludhiana%2C%20Punjab!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
