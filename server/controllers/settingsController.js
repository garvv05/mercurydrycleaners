const WebsiteSettings = require('../models/WebsiteSettings');

exports.getSettings = async (req, res) => {
  try {
    let settings = await WebsiteSettings.findOne({});
    if (!settings) {
      // Create defaults
      settings = await WebsiteSettings.create({
        businessName: 'MERCURY DRYCLEANERS',
        tagline: 'Your Clothes. Our Care. Always Fresh.',
        phone: '+91 78149 66031',
        email: 'garvv22@gmail.com',
        whatsappNumber: '917814966031',
        address: {
          shopNo: 'Shop 14, Main Market',
          area: 'Ghumar Mandi',
          city: 'Ludhiana',
          state: 'Punjab',
          pincode: '141001',
          country: 'India'
        },
        operatingHours: {
          days: 'Monday – Saturday',
          timings: '9:00 AM – 8:30 PM',
          sundayTimings: 'Closed',
          openTime: '09:00',
          closeTime: '20:30'
        },
        hero: {
          heading: 'Premium Care for Every Fabric.',
          subheading: 'Experience professional dry cleaning and garment care with Mercury Drycleaners. We take care of your clothes so you can focus on what matters.',
          locationBadge: 'Proudly serving Ghumar Mandi, Ludhiana'
        },
        promoBanner: {
          heading: 'Give Your Clothes the Care They Deserve.',
          subheading: 'First time with Mercury Drycleaners? Enjoy ₹100 off on your first order with coupon FIRST100.',
          buttonText: 'Schedule a Pickup',
          isActive: true
        },
        beforeAfterComparisons: [
          {
            title: 'Designer Tuxedo Suit Restoration',
            garment: 'Italian Wool Tuxedo',
            beforeImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
            afterImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
            description: 'Intensive gentle dry cleaning removed deep beverage stains without damaging delicate lapel hand-stitching.'
          },
          {
            title: 'Pure Silk Banarasi Saree Care',
            garment: 'Zari Silk Saree',
            beforeImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
            afterImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
            description: 'Preserved delicate golden zari threads with hydrocarbon solvent wash and custom steam finishing.'
          }
        ],
        freePickupThreshold: 500,
        pickupCharge: 50,
        taxPercentage: 5
      });
    }
    return res.json({ success: true, settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load website settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await WebsiteSettings.findOne({});
    let updated;
    if (settings) {
      updated = await WebsiteSettings.findByIdAndUpdate(settings._id, req.body, { new: true });
    } else {
      updated = await WebsiteSettings.create(req.body);
    }
    return res.json({ success: true, message: 'Website settings updated successfully', settings: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update website settings' });
  }
};
