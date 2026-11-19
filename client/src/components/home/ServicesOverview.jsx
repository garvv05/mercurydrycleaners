import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Tag, Calendar, Sparkles } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../common/SkeletonLoader';
import { useBooking } from '../../context/BookingContext';

export default function ServicesOverview() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem, setCurrentStep } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        if (res.data.success && res.data.services && res.data.services.length > 0) {
          setServices(res.data.services);
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleQuickBook = (service) => {
    addItem(service.name, service.category === 'Ironing' ? 'Steam Ironing' : 'Dry Cleaning', service.startingPrice, 1);
    setCurrentStep(2);
    navigate('/booking');
  };

  return (
    <section className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100/60 px-3 py-1 rounded-full border border-blue-200">
              Our Core Services
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-mercury-navy tracking-tight">
              Bespoke Garment & Fabric Care
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Explore our specialized garment care, curtain cleaning, sofa upholstery, and carpet rejuvenation services in Ghumar Mandi, Ludhiana.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 group shrink-0"
          >
            <span>View All Services & Care Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        {/* Dynamic Service Grid or Skeleton */}
        {loading ? (
          <SkeletonLoader type="card" count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service._id || service.slug || index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                {/* Image Box with Zoom */}
                <div className="relative h-56 overflow-hidden bg-slate-900">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                  {/* Category Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md text-mercury-navy shadow-xs">
                      {service.category}
                    </span>
                  </div>

                  {/* Turnaround Time Pill */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/60 backdrop-blur-md text-white">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span>{service.estimatedTime || '48 Hours'}</span>
                  </div>

                  {/* Starting Price Overlay */}
                  <div className="absolute bottom-3 left-4 text-white">
                    <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Starts From</span>
                    <span className="text-xl font-bold font-serif">₹{service.startingPrice}</span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-xl text-mercury-navy group-hover:text-blue-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {service.shortDescription}
                    </p>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <Link
                      to={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors group/link"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>

                    <button
                      onClick={() => handleQuickBook(service)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-semibold text-xs hover:bg-blue-600 hover:text-white transition-all shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Quick Book
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
