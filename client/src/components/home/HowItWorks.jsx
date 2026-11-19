import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Truck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Book Your Service',
      desc: 'Pick your garments online, choose special fabric notes, and select your preferred pickup time slot in Ludhiana.',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600'
    },
    {
      step: '02',
      title: 'Drop Off or Collection',
      desc: 'Our courteous driver collects your garments from your doorstep, or drop them off directly at our Ghumar Mandi store counter.',
      icon: Truck,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      step: '03',
      title: 'Professional Cleaning',
      desc: 'Master dry-cleaning technicians pre-spot stains, apply gentle hydrocarbon solvent washes, and steam-form each garment.',
      icon: Sparkles,
      color: 'from-sky-500 to-blue-600'
    },
    {
      step: '04',
      title: 'Ready for Collection or Delivery',
      desc: 'Inspected under high-CRI lighting, wrapped in protective breathable garment bags on sturdy hangers, and delivered crisp.',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-emerald-600'
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Effortless Experience
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-mercury-navy tracking-tight">
            How Mercury Drycleaners Works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From your closet to our state-of-the-art Ghumar Mandi facility and back: a seamless 4-step garment care journey.
          </p>
        </div>

        {/* 4-Step Process Grid */}
        <div className="relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-gradient-to-r from-blue-300 via-indigo-300 to-emerald-300 -translate-y-8 -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Icon and Step Number */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="font-serif font-bold text-2xl text-slate-300">
                        {item.step}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-mercury-navy mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                    <span>Stage {index + 1} of 4</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Bar */}
        <div className="mt-14 text-center">
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-mercury-navy text-white font-semibold text-sm hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all group"
          >
            <span>Experience It Today – Book a Pickup</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
