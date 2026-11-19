import React, { createContext, useContext, useState, useMemo } from 'react';
import api from '../services/api';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingType, setBookingType] = useState('pickup');
  const [selectedServices, setSelectedServices] = useState([
    { serviceId: 'dry-cleaning', serviceName: 'Dry Cleaning' }
  ]);
  const [items, setItems] = useState([
    { garmentName: '2-Piece Men’s Suit', serviceType: 'Dry Cleaning', quantity: 1, unitPrice: 360, total: 360 }
  ]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [stainsNotes, setStainsNotes] = useState('');
  const [delicateFabricNotes, setDelicateFabricNotes] = useState('');

  const [pickupAddress, setPickupAddress] = useState({
    street: '',
    landmark: '',
    city: 'Ludhiana',
    postalCode: '141001'
  });

  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  const [preferredTimeSlot, setPreferredTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentPreference, setPaymentPreference] = useState('cash');

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Calculations
  const subtotal = useMemo(() => {
    return items.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
  }, [items]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return appliedCoupon.discountAmount || 0;
  }, [appliedCoupon]);

  const pickupCharge = useMemo(() => {
    if (bookingType === 'dropoff') return 0;
    return subtotal >= 500 ? 0 : 50;
  }, [bookingType, subtotal]);

  const taxes = useMemo(() => {
    return Math.round((subtotal - discount) * 0.05); // 5% GST
  }, [subtotal, discount]);

  const finalTotal = useMemo(() => {
    return Math.max(0, Math.round(subtotal - discount + taxes + pickupCharge));
  }, [subtotal, discount, taxes, pickupCharge]);

  // Actions
  const addItem = (garmentName, serviceType, unitPrice, quantity = 1) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.garmentName === garmentName && i.serviceType === serviceType
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        const newQty = copy[existingIdx].quantity + quantity;
        copy[existingIdx].quantity = newQty;
        copy[existingIdx].total = newQty * unitPrice;
        return copy;
      }
      return [
        ...prev,
        {
          garmentName,
          serviceType,
          unitPrice,
          quantity,
          total: quantity * unitPrice
        }
      ];
    });
  };

  const updateQuantity = (garmentName, serviceType, delta) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.garmentName === garmentName && item.serviceType === serviceType) {
            const newQty = item.quantity + delta;
            return newQty > 0
              ? { ...item, quantity: newQty, total: newQty * item.unitPrice }
              : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeItem = (garmentName, serviceType) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.garmentName === garmentName && i.serviceType === serviceType)
      )
    );
  };

  const setGarmentsFromEstimator = (estimatorItems) => {
    if (Array.isArray(estimatorItems) && estimatorItems.length > 0) {
      setItems(estimatorItems);
    }
  };

  const applyCouponCode = async (codeToApply) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code');
      return false;
    }
    setCouponError('');
    setCouponSuccess('');
    try {
      const res = await api.post('/coupons/validate', {
        code,
        subtotal
      });
      if (res.data.success) {
        setAppliedCoupon(res.data.coupon);
        setCouponSuccess(res.data.message);
        return true;
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponSuccess('');
    setCouponError('');
  };

  const resetBooking = () => {
    setCurrentStep(1);
    setItems([
      { garmentName: '2-Piece Men’s Suit', serviceType: 'Dry Cleaning', quantity: 1, unitPrice: 360, total: 360 }
    ]);
    setSpecialInstructions('');
    setStainsNotes('');
    setDelicateFabricNotes('');
    setAppliedCoupon(null);
    setCouponCode('');
  };

  return (
    <BookingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        bookingType,
        setBookingType,
        selectedServices,
        setSelectedServices,
        items,
        setItems,
        addItem,
        updateQuantity,
        removeItem,
        setGarmentsFromEstimator,
        specialInstructions,
        setSpecialInstructions,
        stainsNotes,
        setStainsNotes,
        delicateFabricNotes,
        setDelicateFabricNotes,
        pickupAddress,
        setPickupAddress,
        preferredDate,
        setPreferredDate,
        preferredTimeSlot,
        setPreferredTimeSlot,
        customerName,
        setCustomerName,
        customerPhone,
        setCustomerPhone,
        customerEmail,
        setCustomerEmail,
        paymentPreference,
        setPaymentPreference,
        couponCode,
        setCouponCode,
        appliedCoupon,
        couponError,
        couponSuccess,
        applyCouponCode,
        removeCoupon,
        subtotal,
        discount,
        pickupCharge,
        taxes,
        finalTotal,
        resetBooking
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
