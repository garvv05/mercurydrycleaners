import React from 'react';
import { Truck, Store, Calendar, Clock, MapPin } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export default function Step4Schedule({ onNext, onBack }) {
  const {
    bookingType,
    setBookingType,
    pickupAddress,
    setPickupAddress,
    preferredDate,
    setPreferredDate,
    preferredTimeSlot,
    setPreferredTimeSlot
  } = useBooking();

  // Generate next 7 selectable operating days (skipping Sundays as shop is closed)
  const upcomingDays = [];
  let dayOffset = 1;
  while (upcomingDays.length < 7) {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    dayOffset++;
    // Skip Sunday (0)
    if (d.getDay() === 0) continue;
    upcomingDays.push({
      dateString: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' })
    });
  }

  const timeSlots = [
    { label: 'Morning Slot', time: '09:00 AM - 11:30 AM' },
    { label: 'Midday Slot', time: '11:30 AM - 02:00 PM' },
    { label: 'Afternoon Slot', time: '02:00 PM - 04:30 PM' },
    { label: 'Evening Slot', time: '04:30 PM - 07:00 PM' },
    { label: 'Late Evening', time: '07:00 PM - 08:30 PM' },
  ];

  const handleAddressChange = (field, val) => {
    setPickupAddress({ ...pickupAddress, [field]: val });
  };

  const isPickupValid = bookingType === 'dropoff' || (pickupAddress.street && pickupAddress.street.trim().length > 3);

  return (
    <div className="space-y-6 text-xs">
      <div className="space-y-1">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-mercury-navy">
          Step 4: Pickup or Drop-off Schedule
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm">
          Choose whether you would like free doorstep collection across Ludhiana or prefer dropping garments off at our Ghumar Mandi store.
        </p>
      </div>

      {/* Booking Type Selector */}
      <div className="grid grid-cols-2 gap-4">
        <div
          onClick={() => setBookingType('pickup')}
          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3.5 ${
            bookingType === 'pickup'
              ? 'border-blue-600 bg-blue-50/40 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            bookingType === 'pickup' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Doorstep Pickup</h4>
            <p className="text-[11px] text-slate-500">Collected from your Ludhiana home</p>
          </div>
        </div>

        <div
          onClick={() => setBookingType('dropoff')}
          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3.5 ${
            bookingType === 'dropoff'
              ? 'border-blue-600 bg-blue-50/40 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            bookingType === 'dropoff' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Store Drop-off</h4>
            <p className="text-[11px] text-slate-500">Ghumar Mandi Shop 14</p>
          </div>
        </div>
      </div>

      {/* Address Form (if Doorstep Pickup) */}
      {bookingType === 'pickup' && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs pb-1 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Doorstep Pickup Address in Ludhiana</span>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              House / Apartment / Street Address *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. House No. 42, Green Avenue, Near Rakh Bagh"
              value={pickupAddress.street || ''}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Landmark (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Opposite Club Road"
                value={pickupAddress.landmark || ''}
                onChange={(e) => handleAddressChange('landmark', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">City</label>
              <input
                type="text"
                readOnly
                value="Ludhiana"
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-medium text-xs cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Pincode</label>
              <input
                type="text"
                placeholder="141001"
                value={pickupAddress.postalCode || '141001'}
                onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* Interactive Date Picker Pills */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 font-bold text-slate-800 text-xs">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>Select Date</span>
        </label>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {upcomingDays.map((d) => {
            const isSelected = preferredDate === d.dateString;
            return (
              <button
                type="button"
                key={d.dateString}
                onClick={() => setPreferredDate(d.dateString)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className="block text-[10px] uppercase font-bold tracking-wider opacity-80">
                  {d.dayName}
                </span>
                <span className="block text-lg font-bold font-serif my-0.5">
                  {d.dayNumber}
                </span>
                <span className="block text-[10px] opacity-80">
                  {d.monthName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Time Slot Picker */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 font-bold text-slate-800 text-xs">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Preferred Time Slot</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {timeSlots.map((slot) => {
            const isSelected = preferredTimeSlot === slot.time;
            return (
              <button
                type="button"
                key={slot.time}
                onClick={() => setPreferredTimeSlot(slot.time)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-semibold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div>
                  <span className="block text-[10px] text-slate-400 font-medium">{slot.label}</span>
                  <span className="text-xs">{slot.time}</span>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                }`}>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav Buttons */}
      <div className="pt-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all"
        >
          ← Back to Notes
        </button>

        <button
          onClick={onNext}
          disabled={!isPickupValid}
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all"
        >
          Next: Contact Details & Payment →
        </button>
      </div>
    </div>
  );
}
