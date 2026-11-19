import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, SlidersHorizontal, ArrowLeftRight, Check } from 'lucide-react';

export default function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeTab, setActiveTab] = useState(0);
  const [containerWidth, setContainerWidth] = useState(800);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  // ResizeObserver to ensure inner clipped layer width matches outer container exactly
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateWidth);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // ONLY TWO SLIDES: 1. Italian Wool 3-Piece Suit, 2. Crisp Formal Dress Shirt
  // Saree slide removed as requested. Both slides use the EXACT same garment on both sides.
  // All stains strictly positioned on the fabric/clothes, never on hands or skin.
  const comparisons = [
    {
      title: 'Italian Wool 3-Piece Suit',
      garment: 'Bespoke Blue Plaid Woollen Suit & Vest',
      // EXACT SAME IMAGE ON BOTH SIDES
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80',
      beforeLabel: 'BEFORE: Stained, Wrinkled & Dull',
      afterLabel: 'AFTER: Mercury Eco-Drycleaned',
      problem: 'Coffee & sauce spills on wool lapel/vest, collapsed drape, and dull fabric fibers.',
      result: '100% stain lifted with eco-hydrocarbon solvents, vacuum steam-pressed lapels, restored wool luster.',
      beforeFilter: 'brightness(0.85) contrast(0.92) saturate(0.68) sepia(0.2)',
      // Stains strictly on the lapel & vest fabric (no hands)
      stains: (
        <>
          {/* Coffee spill splash strictly on chest lapel fabric */}
          <svg className="absolute top-[24%] left-[34%] w-28 h-28 pointer-events-none select-none" viewBox="0 0 100 100" style={{ mixBlendMode: 'multiply' }}>
            <defs>
              <radialGradient id="suitCoffee" cx="42%" cy="45%" r="50%">
                <stop offset="0%" stopColor="#2c140a" stopOpacity="0.95" />
                <stop offset="55%" stopColor="#451a03" stopOpacity="0.85" />
                <stop offset="85%" stopColor="#78350f" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
              </radialGradient>
            </defs>
            <path d="M 40,16 C 62,10 82,28 78,50 C 74,68 56,82 36,76 C 18,70 14,50 22,32 C 26,18 32,20 40,16 Z" fill="url(#suitCoffee)" filter="blur(1px)" />
            <circle cx="80" cy="28" r="2.8" fill="#3b1d11" opacity="0.85" />
            <circle cx="76" cy="72" r="2.4" fill="#451a03" opacity="0.8" />
            <circle cx="28" cy="78" r="2.6" fill="#451a03" opacity="0.8" />
          </svg>

          {/* Food sauce droplet on center vest fabric */}
          <svg className="absolute top-[44%] left-[46%] w-16 h-16 pointer-events-none select-none" viewBox="0 0 100 100" style={{ mixBlendMode: 'multiply' }}>
            <circle cx="50" cy="50" r="32" fill="#3a1c0b" opacity="0.8" filter="blur(1.5px)" />
            <circle cx="50" cy="50" r="22" fill="#240f05" opacity="0.9" />
          </svg>

          {/* Crease wrinkles on fabric */}
          <div className="absolute top-[38%] left-[26%] w-36 h-0.5 bg-black/35 blur-[1px] rotate-[-5deg] pointer-events-none" />
          <div className="absolute top-[48%] left-[28%] w-32 h-0.5 bg-black/30 blur-[1px] rotate-[6deg] pointer-events-none" />
        </>
      )
    },
    {
      title: 'Formal White Dress Shirt',
      garment: 'Crisp Cotton Formal Dress Shirt',
      // EXACT SAME IMAGE ON BOTH SIDES
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=80',
      beforeLabel: 'BEFORE: Coffee Placket & Collar Grime',
      afterLabel: 'AFTER: Pure White & Crisp Finished',
      problem: 'Dark coffee spill down chest placket, yellowed collar grime band, heavy wrinkles.',
      result: 'Enzyme pre-spotting completely lifted stain, vacuum collar roll finishing with zero fabric scorch.',
      beforeFilter: 'brightness(0.9) contrast(0.95) saturate(0.72) sepia(0.2)',
      // Stains strictly on chest fabric & collar (hand is far below on the left)
      stains: (
        <>
          {/* Coffee drip & splash strictly on chest placket fabric */}
          <svg className="absolute top-[30%] left-[46%] w-24 h-32 pointer-events-none select-none" viewBox="0 0 100 140" style={{ mixBlendMode: 'multiply' }}>
            <defs>
              <radialGradient id="shirtCoffee" cx="50%" cy="30%" r="50%">
                <stop offset="0%" stopColor="#2c140a" stopOpacity="0.96" />
                <stop offset="65%" stopColor="#542615" stopOpacity="0.85" />
                <stop offset="95%" stopColor="#78350f" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
              </radialGradient>
            </defs>
            <path d="M 45,10 C 65,8 75,25 70,45 C 65,60 55,75 52,95 C 50,110 40,115 36,105 C 32,95 38,70 34,50 C 30,30 35,12 45,10 Z" fill="url(#shirtCoffee)" filter="blur(1px)" />
            <circle cx="68" cy="50" r="2.8" fill="#3b1d11" opacity="0.85" />
            <circle cx="56" cy="115" r="3" fill="#3b1d11" opacity="0.8" />
            <circle cx="48" cy="128" r="2" fill="#3b1d11" opacity="0.75" />
          </svg>

          {/* Yellowed collar grime band on the neck collar fabric */}
          <div className="absolute top-[15%] left-[40%] w-28 h-5 bg-amber-600/40 blur-[3px] rounded-full mix-blend-multiply pointer-events-none" />

          {/* Wrinkle crease lines on shirt body */}
          <div className="absolute top-[42%] left-[40%] w-36 h-0.5 bg-black/25 blur-[1px] rotate-[-4deg] pointer-events-none" />
          <div className="absolute top-[52%] left-[42%] w-32 h-0.5 bg-black/20 blur-[1px] rotate-[5deg] pointer-events-none" />
        </>
      )
    }
  ];

  const current = comparisons[activeTab];

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 2) percentage = 2;
    if (percentage > 98) percentage = 98;
    setSliderPos(percentage);
  }, []);

  const handlePointerDown = (e) => {
    isDragging.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
    handleMove(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handlePointerUp = (e) => {
    isDragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Real Garment Restoration
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-mercury-navy tracking-tight">
            See the Mercury Difference on the Exact Same Garment
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Drag the handle across the garment below. Watch deep beverage spills, food stains, and fabric wrinkles completely disappear to reveal the pristine, steam-pressed fabric underneath.
          </p>

          {/* Preset Selector Tabs (Only 2 slides) */}
          <div className="pt-4 flex justify-center gap-3">
            {comparisons.map((c, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveTab(idx);
                  setSliderPos(50);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                  activeTab === idx
                    ? 'bg-mercury-navy text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Comparison Slider Container */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative h-[380px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl select-none cursor-ew-resize border-4 border-white bg-slate-900 touch-none"
          >
            {/* UNDERLYING LAYER: Pristine Clean Garment (AFTER) */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              <img
                src={current.image}
                alt={`${current.garment} - Restored Clean`}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
            </div>

            {/* AFTER Label Badge (Right Side) */}
            <div className="absolute top-6 right-6 z-10 px-3.5 py-1.5 rounded-full bg-emerald-600/95 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <Check className="w-3.5 h-3.5" />
              <span>{current.afterLabel}</span>
            </div>

            {/* OVERLYING LAYER: Stained / Soiled Garment (BEFORE) - Clipped by Slider */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none select-none z-10"
              style={{ width: `${sliderPos}%` }}
            >
              {/* Inner wrapper matches containerWidth exactly so images and garment features align 1:1 down to the pixel */}
              <div
                className="relative h-full"
                style={{ width: `${containerWidth}px` }}
              >
                {/* The EXACT SAME image with soiled / stained filter */}
                <img
                  src={current.image}
                  alt={`${current.garment} - Stained Before`}
                  className="w-full h-full object-cover object-center"
                  style={{ filter: current.beforeFilter }}
                />

                {/* Stains & Spills Specific to This Garment (strictly on fabric) */}
                {current.stains}

                {/* BEFORE Label Badge (Left Side) */}
                <div className="absolute top-6 left-6 z-20 px-3.5 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>{current.beforeLabel}</span>
                </div>
              </div>
            </div>

            {/* Draggable Divider Handle Line */}
            <div
              className="absolute top-0 bottom-0 z-20 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Vertical Divider Line */}
              <div className="w-0.5 h-full bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)] mx-auto" />
              
              {/* Circular Central Grip Knob */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white text-blue-600 shadow-2xl flex items-center justify-center border-2 border-blue-600">
                <ArrowLeftRight className="w-5 h-5 text-blue-600 animate-pulse" />
              </div>
            </div>

            {/* Drag Hint Footer Pill */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-medium pointer-events-none flex items-center gap-2 shadow-md">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
              <span>Drag handle left or right to wipe away stains</span>
            </div>
          </div>

          {/* Garment Details & Restoration Report */}
          <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="space-y-1 text-center sm:text-left">
              <p className="font-bold text-slate-800 text-sm">{current.garment}</p>
              <p className="text-slate-500">
                <span className="font-semibold text-rose-600">Problem Treated:</span> {current.problem}
              </p>
            </div>
            <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 font-medium text-center sm:text-right shrink-0">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{current.result}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
