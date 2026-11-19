const mongoose = require('mongoose');
const { createDualModel } = require('./modelHelper');

const websiteSettingsSchema = new mongoose.Schema({
  businessName: { type: String, default: 'MERCURY DRYCLEANERS' },
  tagline: { type: String, default: 'Your Clothes. Our Care. Always Fresh.' },
  phone: { type: String, default: '+91 78149 66031' },
  email: { type: String, default: 'garvv22@gmail.com' },
  whatsappNumber: { type: String, default: '917814966031' },
  address: {
    shopNo: { type: String, default: 'Shop 14, Main Market' },
    area: { type: String, default: 'Ghumar Mandi' },
    city: { type: String, default: 'Ludhiana' },
    state: { type: String, default: 'Punjab' },
    pincode: { type: String, default: '141001' },
    country: { type: String, default: 'India' }
  },
  operatingHours: {
    days: { type: String, default: 'Monday – Saturday' },
    timings: { type: String, default: '9:00 AM – 8:30 PM' },
    sundayTimings: { type: String, default: 'Closed' },
    openTime: { type: String, default: '09:00' },
    closeTime: { type: String, default: '20:30' }
  },
  hero: {
    heading: { type: String, default: 'Premium Care for Every Fabric.' },
    subheading: { type: String, default: 'Experience professional dry cleaning and garment care with Mercury Drycleaners. We take care of your clothes so you can focus on what matters.' },
    locationBadge: { type: String, default: 'Proudly serving Ghumar Mandi, Ludhiana' }
  },
  promoBanner: {
    heading: { type: String, default: 'Give Your Clothes the Care They Deserve.' },
    subheading: { type: String, default: 'First time with Mercury Drycleaners? Enjoy ₹100 off on your first order with coupon FIRST100.' },
    buttonText: { type: String, default: 'Schedule a Pickup' },
    isActive: { type: Boolean, default: true }
  },
  beforeAfterComparisons: [{
    title: { type: String },
    garment: { type: String },
    beforeImage: { type: String },
    afterImage: { type: String },
    description: { type: String }
  }],
  pricingDisclaimer: { type: String, default: 'Estimated – demo prices. Final prices confirmed upon garment inspection at our Ghumar Mandi store.' },
  freePickupThreshold: { type: Number, default: 500 },
  pickupCharge: { type: Number, default: 50 },
  taxPercentage: { type: Number, default: 5 },
  updatedAt: { type: Date, default: Date.now }
});

const MongooseWebsiteSettings = mongoose.model('WebsiteSettings', websiteSettingsSchema);
const WebsiteSettings = createDualModel('website_settings', MongooseWebsiteSettings);

module.exports = WebsiteSettings;
