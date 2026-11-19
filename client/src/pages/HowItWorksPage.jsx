import React from 'react';
import { 
  Sparkles, ShieldCheck, CheckCircle2, ArrowRight, 
  Droplets, Flame, HelpCircle, Calendar 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorksPage() {
  const processSteps = [
    {
      num: '01',
      title: 'Digital Booking or Counter Check-In',
      desc: 'Book a convenient pickup online or walk into our Ghumar Mandi store. Your garments are tagged with unique barcoded garment IDs to prevent mix-ups.',
      detail: 'Every piece is weighed and cataloged with specific customer instructions.'
    },
    {
      num: '02',
      title: 'Detailed Master Inspection',
      desc: 'Our senior fabric technicians examine seams, hems, button attachments, and stain origins under high-CRI 5000K daylight inspection lamps.',
      detail: 'Stains are classified (protein, tannin, lipid, or chemical dye) for targeted pre-spotting.'
    },
    {
      num: '03',
      title: 'Targeted Hand Pre-Spotting',
      desc: 'Before entering the main cycle, stains on collars, cuffs, and delicate lapels are treated manually using pH-neutral spotting agents that lift blemishes without damaging the fabric matrix.',
      detail: 'Zero water agitation is used on silks, cashmeres, and structured woollen coats.'
    },
    {
      num: '04',
      title: 'Eco-Solvent Purification Cycle',
      desc: 'Garments are immersed in pure hydrocarbon or liquid silicone solvents inside state-of-the-art Italian dry cleaning machines.',
      detail: 'Continuous solvent filtration ensures only crystal-clear fluid contacts your garments.'
    },
    {
      num: '05',
      title: 'Vacuum Steam Form-Finishing',
      desc: 'Instead of flat hot iron plates that crush fabric pile and leave shiny pressure burns, we use vacuum steam mannequins and air-cushioned tables.',
      detail: 'Restores the original designer drape and rolls suit lapels naturally.'
    },
    {
      num: '06',
      title: 'Quality Check & Archival Packing',
      desc: 'Passed through our final 10-point inspection check, hung on sturdy contoured hangers, and covered in clear breathable garment bags.',
      detail: 'Delivered to your Ludhiana doorstep or placed ready at our counter.'
    }
  ];

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100/70 px-3 py-1 rounded-full border border-blue-200">
            The Science of Fabric Care
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-mercury-navy tracking-tight">
            How Dry Cleaning Protects Your Wardrobe
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Understand the difference between mechanical water washing and artisanal eco-solvent dry cleaning engineered for fine textiles.
          </p>
        </div>

        {/* Science Comparison: Water vs Dry Cleaning */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Water Washing Card */}
          <div className="p-8 rounded-3xl bg-white border border-rose-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-slate-900">
              Ordinary Water Washing
            </h3>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>Water swells natural fibers (wool, silk, linen), causing irreversible fiber contraction and shrinkage.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>Mechanical drum churning abrades delicate embroidery, loosens beads, and causes pilling.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>Water dissolves fabric sizing and degrades the internal horsehair canvas of structured suits.</span>
              </li>
            </ul>
          </div>

          {/* Mercury Eco-Solvent Dry Cleaning */}
          <div className="p-8 rounded-3xl bg-white border-2 border-blue-600 shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
              Mercury Standard
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-mercury-navy">
              Mercury Eco-Solvent Cleaning
            </h3>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero water immersion. Natural fiber diameters remain completely unchanged with zero shrinkage.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Solvents dissolve oily sebum, makeup, and food grease effortlessly without abrasive mechanical rubbing.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Colors remain vibrant; gold zari and sequins are shielded from oxidation or thread breakdown.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 6-Step Detailed Process Cards */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-mercury-navy">
              The 6-Step Ghumar Mandi Care Journey
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              From arrival to packaging: how each garment is treated with artisanal precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg transition-all space-y-3 flex flex-col justify-between"
              >
                <div>
                  <span className="font-serif font-bold text-2xl text-blue-600 block mb-2">
                    {step.num}
                  </span>
                  <h4 className="font-serif font-bold text-base text-slate-900 mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-[11px] text-blue-800 font-medium">
                  • {step.detail}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-10 rounded-3xl bg-mercury-navy text-white text-center space-y-4 shadow-xl">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold">
            Ready to Protect Your Finest Clothes?
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto">
            Book online in under 2 minutes. We collect from your doorstep anywhere in Ludhiana.
          </p>
          <div className="pt-2">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-xs shadow-md shadow-blue-500/30 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule a Pickup in Ludhiana</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
