import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { useBooking } from '../context/BookingContext';

// Built-in fallback ensuring the page ALWAYS presents all services immediately
const DEFAULT_SERVICES = [
  {
    _id: 'srv-1',
    name: 'Dry Cleaning',
    slug: 'dry-cleaning',
    category: 'Dry Cleaning',
    shortDescription: 'Gentle hydrocarbon solvent dry cleaning for fine formals and daily wear.',
    startingPrice: 120,
    estimatedTime: '48 Hours',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80'
  },
  {
    _id: 'srv-2',
    name: 'Steam Ironing',
    slug: 'steam-ironing',
    category: 'Ironing',
    shortDescription: 'Vacuum suction steam table finishing for crisp pleats without fabric scorch.',
    startingPrice: 40,
    estimatedTime: '24 Hours',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=1000&q=80'
  },
  {
    _id: 'srv-3',
    name: 'Suit & Blazer Cleaning',
    slug: 'suit-and-blazer-cleaning',
    category: 'Dry Cleaning',
    shortDescription: 'Pneumatic torso form-pressing preserving shoulder pads, canvas, and lapel drape.',
    startingPrice: 350,
    estimatedTime: '48 Hours',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80'
  },
  {
    _id: 'srv-4',
    name: 'Saree & Ethnic Wear Care',
    slug: 'saree-and-ethnic-wear-care',
    category: 'Premium Care',
    shortDescription: 'Anti-tarnish liquid silicone care for Pure Silk, Banarasi, Zari, and Lehengas.',
    startingPrice: 280,
    estimatedTime: '72 Hours',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'
  },
  {
    _id: 'srv-5',
    name: 'Winter Wear Cleaning',
    slug: 'winter-wear-cleaning',
    category: 'Dry Cleaning',
    shortDescription: 'Lanolin-replenishing deep wash and motorized de-fuzzing for coats and cashmeres.',
    startingPrice: 220,
    estimatedTime: '48 Hours',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80'
  },
  {
    _id: 'srv-6',
    name: 'Blanket & Quilt Cleaning',
    slug: 'blanket-cleaning',
    category: 'Home Textiles',
    shortDescription: 'Hygienic UV-C sanitization and thermal fluffing for heavy mink blankets and quilts.',
    startingPrice: 320,
    estimatedTime: '72 Hours',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80'
  },
  {
    _id: 'srv-7',
    name: 'Curtain & Drapery Cleaning',
    slug: 'curtain-cleaning',
    category: 'Home Textiles',
    shortDescription: 'Zero-shrinkage vertical steam dry cleaning for heavy drapes, sheer, and velvet.',
    startingPrice: 180,
    estimatedTime: '48-72 Hours',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80'
  },
  {
    _id: 'srv-8',
    name: 'Sofa Sets & Upholstery Care',
    slug: 'sofa-sets-and-upholstery-care',
    category: 'Home Textiles',
    shortDescription: 'Deep foam dry shampooing and dust-mite extraction for living room sofa sets.',
    startingPrice: 450,
    estimatedTime: 'On-site / In-Store',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80'
  },
  {
    _id: 'srv-9',
    name: 'Carpet & Rug Restoration',
    slug: 'carpet-and-rug-restoration',
    category: 'Home Textiles',
    shortDescription: 'Flat-bed solvent extraction, grit removal, and fringe grooming for fine rugs.',
    startingPrice: 350,
    estimatedTime: '72 Hours',
    image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80'
  },
  {
    _id: 'srv-10',
    name: 'Premium Garment Care',
    slug: 'premium-garment-care',
    category: 'Premium Care',
    shortDescription: 'White-glove GreenEarth silicone treatment for designer gowns and couture labels.',
    startingPrice: 450,
    estimatedTime: '72-96 Hours',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1000&q=80'
  }
];

export default function Services() {
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [activeCategory, setActiveCategory] = useState('All Services');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const { addItem, setCurrentStep } = useBooking();
  const navigate = useNavigate();

  const categories = [
    'All Services',
    'Dry Cleaning',
    'Home Textiles',
    'Premium Care',
    'Ironing'
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        if (res.data.success && res.data.services && res.data.services.length > 0) {
          setServices(res.data.services);
        }
      } catch (err) {
        console.warn('Using verified default catalog:', err.message);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter((s) => {
    const matchesCat = activeCategory === 'All Services' || s.category === activeCategory;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          (s.shortDescription && s.shortDescription.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleBookNow = (service) => {
    addItem(service.name, service.category === 'Ironing' ? 'Steam Ironing' : 'Dry Cleaning', service.startingPrice, 1);
    setCurrentStep(2);
    navigate('/booking');
  };

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100/70 px-3.5 py-1.5 rounded-full border border-blue-200">
            Professional Garment & Textile Care
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-mercury-navy tracking-tight">
            Our Specialized Care Services
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            From bespoke suits and pure zari sarees to curtains, sofas, and luxury carpets—discover our full range of certified dry-cleaning services in Ghumar Mandi, Ludhiana.
          </p>

          {/* Search Input */}
          <div className="pt-3 max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services (e.g. Curtains, Sofa, Carpet, Saree, Suit)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-mercury-navy text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'Home Textiles' ? 'Home & Living (Curtains, Sofas, Carpets)' : cat}
            </button>
          ))}
        </div>

        {/* Services Grid: Visual-First Representation with Single Photo & Heading */}
        {loading ? (
          <SkeletonLoader type="card" count={6} />
        ) : filteredServices.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-500 max-w-md mx-auto space-y-3 border border-slate-200">
            <p className="font-semibold text-base text-slate-800">No services found</p>
            <p className="text-xs text-slate-400">
              No matching service found for "{search}". Try selecting "All Services".
            </p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All Services'); }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Show All Services
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            <AnimatePresence>
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service._id || service.slug}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group"
                >
                  {/* Single Clean High-Resolution Photo */}
                  <div className="relative h-64 overflow-hidden bg-slate-900">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                    {/* Category Tag on Top-Left */}
                    <div className="absolute top-3.5 left-3.5">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/95 backdrop-blur-md text-mercury-navy shadow-sm">
                        {service.category}
                      </span>
                    </div>

                    {/* Starting Price on Top-Right */}
                    <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-[11px] font-bold bg-mercury-navy/90 backdrop-blur-md text-white shadow-sm flex items-center gap-1">
                      <span className="text-blue-300 text-[10px] font-normal">Starts</span>
                      <span>₹{service.startingPrice}</span>
                    </div>

                    {/* Service Name & Single Subtitle Over Image Bottom */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-serif font-bold text-xl leading-snug drop-shadow-sm group-hover:text-blue-200 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-[12px] text-slate-200 mt-1 line-clamp-1 opacity-90">
                        {service.shortDescription}
                      </p>
                    </div>
                  </div>

                  {/* Clean Bottom Action Row */}
                  <div className="p-4 bg-white flex items-center justify-between gap-3 border-t border-slate-100">
                    <Link
                      to={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors group/link"
                    >
                      <span>Care Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>

                    <button
                      onClick={() => handleBookNow(service)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Service</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </div>
  );
}
