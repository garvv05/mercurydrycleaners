import React from 'react';
import { Sparkles, AlertTriangle, ShieldCheck, Heart } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export default function Step3Notes({ onNext, onBack }) {
  const {
    specialInstructions,
    setSpecialInstructions,
    stainsNotes,
    setStainsNotes,
    delicateFabricNotes,
    setDelicateFabricNotes
  } = useBooking();

  return (
    <div className="space-y-6 text-xs">
      <div className="space-y-1">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-mercury-navy">
          Step 3: Care Instructions & Fabric Notes
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm">
          Tell our master technicians about any existing stains, fragile embellishments, or specific pressing preferences.
        </p>
      </div>

      <div className="space-y-4">
        {/* Stains & Spots Description */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <label className="flex items-center gap-2 font-bold text-slate-800 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Existing Stains or Discoloration (Optional)</span>
          </label>
          <p className="text-[11px] text-slate-500">
            Mention the type of stain (e.g., wine, tea, turmeric, grease, ink) and location (cuff, lapel, collar).
          </p>
          <textarea
            rows={2}
            placeholder="e.g. Coffee mark on the right sleeve of the white shirt; faint food oil splash on the front of the blazer..."
            value={stainsNotes}
            onChange={(e) => setStainsNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 text-xs leading-relaxed"
          />
        </div>

        {/* Delicate Embellishments / Fabric Notes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <label className="flex items-center gap-2 font-bold text-slate-800 text-xs">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Delicate Fabrics, Zari, or Embellishments (Optional)</span>
          </label>
          <p className="text-[11px] text-slate-500">
            Identify delicate elements like real gold zari, mother-of-pearl buttons, fine silk embroidery, or vintage beads.
          </p>
          <textarea
            rows={2}
            placeholder="e.g. Saree has heavy pure silver zari border; please cap horn buttons on the tuxedo jacket..."
            value={delicateFabricNotes}
            onChange={(e) => setDelicateFabricNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 text-xs leading-relaxed"
          />
        </div>

        {/* General Pressing & Packaging Preferences */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <label className="flex items-center gap-2 font-bold text-slate-800 text-xs">
            <Heart className="w-4 h-4 text-blue-500" />
            <span>Packaging & Pressing Instructions (Optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Crisp trouser crease; hang on wooden hangers; fold sarees in breathable roll covers..."
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 text-xs leading-relaxed"
          />
        </div>
      </div>

      {/* Nav Buttons */}
      <div className="pt-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all"
        >
          ← Back to Garments
        </button>

        <button
          onClick={onNext}
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all"
        >
          Next: Pickup Schedule & Location →
        </button>
      </div>
    </div>
  );
}
