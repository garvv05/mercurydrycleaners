import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Clock } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export default function Step1Services({ onNext }) {
  const { selectedServices, setSelectedServices } = useBooking();

  const servicesList = [
    {
      id: 'dry-cleaning',
      name: 'Dry Cleaning',
      desc: 'Eco-solvent cleaning for business wear, dresses, and everyday delicates.',
      startingPrice: 120,
      turnaround: '48 Hours'
    },
    {
      id: 'steam-ironing',
      name: 'Vacuum Steam Ironing',
      desc: 'High-pressure vacuum steam tables for sharp creases and zero shine.',
      startingPrice: 40,
      turnaround: '24 Hours'
    },
    {
      id: 'suit-and-blazer-cleaning',
      name: 'Suits & Blazers Care',
      desc: 'Form-pressed 3D finishing for structured tuxedos, coats, and blazers.',
      startingPrice: 350,
      turnaround: '48 Hours'
    },
    {
      id: 'saree-and-ethnic-wear-care',
      name: 'Saree & Ethnic Wear Care',
      desc: 'Zero-bleeding treatment for pure silk, Banarasi zari, and bridal wear.',
      startingPrice: 280,
      turnaround: '72 Hours'
    },
    {
      id: 'winter-wear-cleaning',
      name: 'Winter Wear & Overcoats',
      desc: 'Lanolin wool conditioning and baffle down-fluffing for jackets & coats.',
      startingPrice: 220,
      turnaround: '48 Hours'
    },
    {
      id: 'blanket-cleaning',
      name: 'Blankets & Quilts Sanitization',
      desc: 'Deep UV sanitization and plush drying for heavy mink blankets & razais.',
      startingPrice: 320,
      turnaround: '72 Hours'
    },
    {
      id: 'premium-garment-care',
      name: 'Couture White-Glove Care',
      desc: 'Liquid silicone GreenEarth process for imported labels & bridal sets.',
      startingPrice: 450,
      turnaround: '72-96 Hours'
    }
  ];

  const toggleService = (srv) => {
    const exists = selectedServices.some((s) => s.serviceId === srv.id);
    if (exists) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s.serviceId !== srv.id));
      }
    } else {
      setSelectedServices([...selectedServices, { serviceId: srv.id, serviceName: srv.name }]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-mercury-navy">
          Step 1: Choose Your Services
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm">
          Select one or multiple specialized garment care services for this booking.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {servicesList.map((srv) => {
          const isSelected = selectedServices.some((s) => s.serviceId === srv.id);
          return (
            <div
              key={srv.id}
              onClick={() => toggleService(srv)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-md shadow-blue-500/5'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-slate-900 text-sm sm:text-base">
                    {srv.name}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-blue-600 font-bold">Starts ₹{srv.startingPrice}</span>
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {srv.turnaround}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 flex justify-end">
        <button
          onClick={onNext}
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all"
        >
          Next: Select Garments & Quantities →
        </button>
      </div>
    </div>
  );
}
