import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Clock, CheckCircle, Sparkles, ShieldCheck, 
  ArrowLeft, ArrowRight, Calendar, Heart, Share2 
} from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { useBooking } from '../context/BookingContext';

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  const { addItem, setCurrentStep } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServiceData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/services/${slug}`);
        if (res.data.success) {
          setService(res.data.service);
          setActiveImage(res.data.service.image);
        }

        // Fetch related services in the same or nearby category
        const allRes = await api.get('/services?activeOnly=true');
        if (allRes.data.success) {
          setRelated(allRes.data.services.filter((s) => s.slug !== slug).slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load service detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceData();
  }, [slug]);

  const handleBookThis = () => {
    if (service) {
      addItem(
        service.name,
        service.category === 'Ironing' ? 'Steam Ironing' : 'Dry Cleaning',
        service.startingPrice,
        1
      );
      setCurrentStep(2);
      navigate('/booking');
    }
  };

  if (loading) {
    return (
      <div className="pt-36 pb-20 max-w-7xl mx-auto px-4">
        <SkeletonLoader type="card" count={1} />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="pt-36 pb-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="font-serif text-2xl font-bold text-slate-800 mb-2">Service Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The requested garment service does not exist or has been retired.</p>
        <Link to="/services" className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold">
          Return to Services Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb Back */}
        <div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Garment Services</span>
          </Link>
        </div>

        {/* Hero Section of Service: Gallery + Inline Booking Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-900 h-[380px] sm:h-[460px]">
              <img
                src={activeImage || service.image}
                alt={service.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/95 text-mercury-navy shadow-sm">
                  {service.category}
                </span>
              </div>
            </div>

            {/* Thumbnail selector if gallery has multiple photos */}
            {service.gallery && service.gallery.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveImage(service.image)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === service.image ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 opacity-70'
                  }`}
                >
                  <img src={service.image} alt="Main thumbnail" className="w-full h-full object-cover" />
                </button>
                {service.gallery.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === imgUrl ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Details & Booking Panel (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                Ludhiana Garment Care
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-mercury-navy">
                {service.name}
              </h1>
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Turnaround: <strong className="text-slate-800">{service.estimatedTime || '48 Hours'}</strong>
                </span>
                <span>•</span>
                <span>Ghumar Mandi Workshop</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-widest block font-medium">Starting Rate</span>
                <span className="font-serif font-bold text-3xl text-mercury-navy">₹{service.startingPrice}</span>
                <span className="text-xs text-slate-500"> / garment</span>
              </div>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200">
                Zero Shrinkage
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {service.description}
            </p>

            {/* Book Now Button */}
            <div className="pt-2">
              <button
                onClick={handleBookThis}
                className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Book This Service (Doorstep Pickup)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Complimentary pickup across Ludhiana for bookings over ₹500.</span>
            </div>
          </div>

        </div>

        {/* Detailed Breakdown: Features, What's Included, Care Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Key Features */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              <Sparkles className="w-5 h-5" />
              <span>Process Highlights</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              {service.features?.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What's Included */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>What Is Included</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              {service.included?.map((inc, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expert Fabric Care Tips */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <Heart className="w-5 h-5" />
              <span>Home Garment Care Tips</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              {service.careTips?.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Related Services */}
        {related.length > 0 && (
          <div className="space-y-6 pt-8 border-t border-slate-200">
            <h3 className="font-serif text-2xl font-bold text-mercury-navy">
              Related Garment Services
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/services/${rel.slug}`}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group flex items-center gap-4"
                >
                  <img
                    src={rel.image}
                    alt={rel.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                      {rel.name}
                    </h4>
                    <span className="text-xs font-bold text-blue-600">Starts ₹{rel.startingPrice}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
