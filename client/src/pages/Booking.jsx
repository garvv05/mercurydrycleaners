import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, ShieldCheck } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import OrderSummarySidebar from '../components/booking/OrderSummarySidebar';
import Step1Services from '../components/booking/Step1Services';
import Step2Garments from '../components/booking/Step2Garments';
import Step3Notes from '../components/booking/Step3Notes';
import Step4Schedule from '../components/booking/Step4Schedule';
import Step5Contact from '../components/booking/Step5Contact';
import Step6Review from '../components/booking/Step6Review';

export default function Booking() {
  const { currentStep, setCurrentStep, resetBooking } = useBooking();
  const navigate = useNavigate();

  const steps = [
    { num: 1, label: 'Services' },
    { num: 2, label: 'Garments' },
    { num: 3, label: 'Fabric Notes' },
    { num: 4, label: 'Schedule' },
    { num: 5, label: 'Contact' },
    { num: 6, label: 'Review' },
  ];

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }, [currentStep]);

  const handleBookingComplete = (createdOrder) => {
    navigate('/booking/confirmation', { state: { order: createdOrder } });
    resetBooking();
  };

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Wizard Header & Progress Bar */}
        <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-100/70 px-3 py-1 rounded-full border border-blue-200">
            Online Booking Wizard
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-mercury-navy tracking-tight">
            Schedule Your Garment Care
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Quick, transparent dry cleaning booking with live price calculations and free doorstep pickup in Ludhiana.
          </p>

          {/* Stepper Progress Bar */}
          <div className="pt-6">
            <div className="flex items-center justify-between relative max-w-xl mx-auto">
              {/* Background Connecting Line */}
              <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 -translate-y-1/2 z-0" />
              {/* Active Connecting Line */}
              <div
                className="absolute top-1/2 left-4 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-300 ease-out"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />

              {steps.map((st) => {
                const isPassed = currentStep > st.num;
                const isCurrent = currentStep === st.num;
                return (
                  <div key={st.num} className="relative z-10 flex flex-col items-center">
                    <button
                      onClick={() => {
                        if (isPassed) setCurrentStep(st.num);
                      }}
                      disabled={!isPassed && !isCurrent}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isPassed
                          ? 'bg-blue-600 text-white shadow-xs cursor-pointer'
                          : isCurrent
                          ? 'bg-mercury-navy text-white ring-4 ring-blue-100 shadow-md'
                          : 'bg-white border-2 border-slate-300 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4" /> : st.num}
                    </button>
                    <span className={`text-[10px] mt-1.5 font-medium hidden sm:block ${
                      isCurrent ? 'text-blue-600 font-bold' : 'text-slate-500'
                    }`}>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Wizard Main Content Grid: Form (8 Cols) + Live Summary (4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Step View */}
          <div className="lg:col-span-8 bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && (
                  <Step1Services onNext={() => setCurrentStep(2)} />
                )}
                {currentStep === 2 && (
                  <Step2Garments
                    onNext={() => setCurrentStep(3)}
                    onBack={() => setCurrentStep(1)}
                  />
                )}
                {currentStep === 3 && (
                  <Step3Notes
                    onNext={() => setCurrentStep(4)}
                    onBack={() => setCurrentStep(2)}
                  />
                )}
                {currentStep === 4 && (
                  <Step4Schedule
                    onNext={() => setCurrentStep(5)}
                    onBack={() => setCurrentStep(3)}
                  />
                )}
                {currentStep === 5 && (
                  <Step5Contact
                    onNext={() => setCurrentStep(6)}
                    onBack={() => setCurrentStep(4)}
                  />
                )}
                {currentStep === 6 && (
                  <Step6Review
                    onBack={() => setCurrentStep(5)}
                    onComplete={handleBookingComplete}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side: Sticky Live Order Summary */}
          <div className="lg:col-span-4">
            <OrderSummarySidebar />
          </div>

        </div>

      </div>
    </div>
  );
}
