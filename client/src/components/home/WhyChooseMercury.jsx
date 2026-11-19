import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Award, Shield, CheckCircle, 
  Clock, HeartHandshake, ArrowRight 
} from 'lucide-react';

export default function WhyChooseMercury() {
  const features = [
    {
      title: 'Professional Garment Care',
      description: 'Hand-inspected by master technicians with deep knowledge of delicate silks, woollens, and fine suit linings.',
      icon: Award,
      badge: 'Expertise'
    },
    {
      title: 'Quality Cleaning',
      description: 'Using high-purity hydrocarbon solvents and precision temperature cycles to dissolve stains with zero fabric abrasion.',
      icon: Sparkles,
      badge: 'Purity'
    },
    {
      title: 'Fabric-Friendly Treatment',
      description: 'Zero harsh detergents, zero water agitation. Keeps pure zari, velvet piles, and embroidery radiant.',
      icon: Shield,
      badge: 'Gentle'
    },
    {
      title: 'Attention to Detail',
      description: 'Foil-capped designer buttons, hand-rolled lapels, and tailored steam forms that maintain exact suit posture.',
      icon: CheckCircle,
      badge: 'Precision'
    },
    {
      title: 'Convenient Booking',
      description: 'Easy doorstep pickup scheduling across Ludhiana with real-time digital order tracking right to your doorstep.',
      icon: Clock,
      badge: 'Seamless'
    },
    {
      title: 'Customer Satisfaction',
      description: 'Our customer commitment: if any crease or finish is not immaculate, we gladly re-press it with zero questions.',
      icon: HeartHandshake,
      badge: 'Guaranteed'
    }
  ];

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Why Choose Mercury?
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-mercury-navy tracking-tight">
            Craftsmanship & Care in Every Thread
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            We reject mass shortcuts. Every garment entering our Ghumar Mandi workshop is treated as bespoke wearable art.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative p-8 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-mercury-navy mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Subtle bottom line */}
                <div className="mt-6 h-0.5 w-0 bg-blue-600 group-hover:w-12 transition-all duration-300 rounded-full" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
