const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const { connectDB } = require('../config/db');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Service = require('../models/Service');
const GarmentItem = require('../models/GarmentItem');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');
const FAQ = require('../models/FAQ');
const WebsiteSettings = require('../models/WebsiteSettings');
const Order = require('../models/Order');

const seedData = async () => {
  console.log('[Seeder] Starting data population for Mercury Drycleaners...');
  await connectDB();

  // Clear existing
  await User.deleteMany({});
  await Admin.deleteMany({});
  await Service.deleteMany({});
  await GarmentItem.deleteMany({});
  await Coupon.deleteMany({});
  await Review.deleteMany({});
  await FAQ.deleteMany({});
  await WebsiteSettings.deleteMany({});
  await Order.deleteMany({});

  // 1. Admin
  const adminSalt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('Admin@12345', adminSalt);
  await Admin.create({
    name: 'Mercury Admin',
    email: 'garvv22@gmail.com',
    phone: '+91 78149 66031',
    password: adminPassword,
    role: 'superadmin',
    permissions: ['all'],
    isActive: true
  });
  console.log('[Seeder] Admin created: garvv22@gmail.com / Admin@12345');

  // 2. Demo Customer
  const customerPassword = await bcrypt.hash('Customer@123', adminSalt);
  const demoCustomer = await User.create({
    name: 'Gurpreet Singh',
    email: 'gurpreet@example.com',
    phone: '+91 98140 12345',
    password: customerPassword,
    role: 'customer',
    addresses: [
      {
        label: 'Home',
        street: 'House No. 42, Green Avenue, Near Club Road',
        landmark: 'Opposite Rakh Bagh',
        city: 'Ludhiana',
        postalCode: '141001',
        isDefault: true
      },
      {
        label: 'Office',
        street: 'Cabin 3, Feroze Gandhi Market',
        landmark: 'Near Stock Exchange Building',
        city: 'Ludhiana',
        postalCode: '141001',
        isDefault: false
      }
    ]
  });

  // 3. Services (7 Distinct Dry Cleaning & Garment Care services)
  const services = [
    {
      name: 'Dry Cleaning',
      slug: 'dry-cleaning',
      category: 'Dry Cleaning',
      shortDescription: 'Eco-solvent dry cleaning engineered to protect delicate fabric fibers and colors.',
      description: 'Our state-of-the-art Italian dry cleaning process uses specialized eco-friendly hydrocarbon solvents that dissolve dirt, body oils, and stubborn stains without subjecting delicate weaves to abrasive mechanical washing. Every piece undergoes thorough pre-spotting, precision temperature cleaning, and gentle deodorizing.',
      startingPrice: 120,
      estimatedTime: '48 Hours',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80'
      ],
      features: [
        'Zero shrinkage or fiber stress',
        'Advanced pre-spotting inspection',
        'Eco-friendly odorless hydrocarbon solvent',
        'Delivered on custom wooden or contoured hangers'
      ],
      careTips: [
        'Check care label for "Dry Clean Only" symbols.',
        'Never apply water or rub aggressively on stain spots at home.',
        'Store in breathable garment covers away from direct dampness.'
      ],
      included: [
        'Detailed garment collar and cuff pre-treatment',
        'Solvent purification cycle',
        'Form-finishing steam pressing',
        'Protective clear garment dust covering'
      ],
      order: 1
    },
    {
      name: 'Steam Ironing',
      slug: 'steam-ironing',
      category: 'Ironing',
      shortDescription: 'Industrial vacuum steam pressing for crisp pleats and immaculate wrinkle removal.',
      description: 'Standard domestic irons scorch natural fibers and leave shiny pressure marks. Our commercial steam-finishing tables utilize high-pressure dry steam that relaxes woven threads while vacuum suction locks in sharp, crisp lines without burning delicate threads.',
      startingPrice: 40,
      estimatedTime: '24 Hours',
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80'
      ],
      features: [
        'High-velocity dry steam injection',
        'Vacuum extraction to avoid dampness',
        'No shiny iron streaks or fabric burn',
        'Perfect collar and lapel alignment'
      ],
      careTips: [
        'Button up the top shirt button when hanging.',
        'Allow garments to cool completely before wearing.'
      ],
      included: [
        'Manual cuff and collar roll finishing',
        'Vacuum crease fixation',
        'Free hanger packaging'
      ],
      order: 2
    },
    {
      name: 'Suit and Blazer Cleaning',
      slug: 'suit-and-blazer-cleaning',
      category: 'Dry Cleaning',
      shortDescription: 'Bespoke care for formal suits, tuxedos, blazers, and woollen coats.',
      description: 'Suits feature internal horsehair canvas, shoulder padding, and structured linings that can be irreparably damaged by standard methods. We hand-inspect button stitchings, apply pH-neutral stain extractors, and finish on specialized 3D torso formers to retain exact posture and drape.',
      startingPrice: 350,
      estimatedTime: '48 Hours',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
      ],
      features: [
        '3D pneumatic mannequin steam form-pressing',
        'Horn and pearl button protective foil capping',
        'Lapel roll preservation without flat creasing',
        'Lint and hair removal finishing roll'
      ],
      careTips: [
        'Brush suits with a natural bristle garment brush after each wear.',
        'Air out your suit overnight before storing in your closet.'
      ],
      included: [
        'Button tightening check',
        'Lining and armpit hygienic deodorizing',
        'Heavy-gauge suit hanger and dust bag'
      ],
      order: 3
    },
    {
      name: 'Saree and Ethnic Wear Care',
      slug: 'saree-and-ethnic-wear-care',
      category: 'Premium Care',
      shortDescription: 'Delicate handling for Pure Silk, Banarasi, Zari, Chanderi, and Lehengas.',
      description: 'Ludhiana’s wedding and festive traditions demand the highest standard of bridal and ethnic garment preservation. We clean zari threads, gota-patti, sequins, and delicate mirror work using specialized gentle solvents that prevent tarnishing, color bleeding, or thread detachment.',
      startingPrice: 280,
      estimatedTime: '72 Hours',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
      ],
      features: [
        'Zero-bleeding certified dye care',
        'Zari luster restoration and anti-tarnish shield',
        'Rolling & crease-free saree folding',
        'Hand-detailed embellishment inspection'
      ],
      careTips: [
        'Refold zari sarees every 6 months along different crease lines.',
        'Wrap in breathable pure cotton malmal cloth rather than airtight plastic.'
      ],
      included: [
        'Pallu and border pre-treatment',
        'Gentle solvent immersion',
        'Custom saree roll packaging'
      ],
      order: 4
    },
    {
      name: 'Winter Wear Cleaning',
      slug: 'winter-wear-cleaning',
      category: 'Dry Cleaning',
      shortDescription: 'Specialized deep cleaning for woollen coats, cashmeres, down jackets, and sweaters.',
      description: 'Punjab winters require heavy woollens and premium tweeds. Our winter wear process removes trapped dust, seasonal odors, and lint, conditioning the natural wool lanolin oils to keep garments extraordinarily soft, warm, and moth-resistant.',
      startingPrice: 220,
      estimatedTime: '48 Hours',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80'
      ],
      features: [
        'Lanolin-replenishing wool conditioners',
        'Feather & down baffle fluffing for padded jackets',
        'De-pilling and fuzz removal',
        'Moth-guard protective treatment'
      ],
      careTips: [
        'Always clean winter coats before storing for the summer season.',
        'Never hang heavy knit sweaters on wire hangers.'
      ],
      included: [
        'Motorized de-fuzzing roller pass',
        'Water-repellent finish touch-up for trench coats',
        'Long garment protective garment bag'
      ],
      order: 5
    },
    {
      name: 'Blanket Cleaning',
      slug: 'blanket-cleaning',
      category: 'Home Textiles',
      shortDescription: 'Hygienic deep sanitization and plush drying for heavy mink blankets and quilts.',
      description: 'Heavy winter mink blankets, quilts (razais), and duvets harbor millions of microscopic dust mites and skin particulates. Our industrial large-drum solvent cleaning and UV sanitization penetrates deep layers, leaving blankets fluffy, fresh, and hypoallergenic.',
      startingPrice: 320,
      estimatedTime: '72 Hours',
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80'
      ],
      features: [
        'UV-C hygiene sanitization',
        'Anti-dust mite thermal treatment',
        'Plush pile restoration',
        'Zippered heavy-gauge storage bag packaging'
      ],
      careTips: [
        'Store in the provided zippered breathable bag in a dry closet.',
        'Clean before seasonal storage to avoid stubborn discoloration.'
      ],
      included: [
        'High-capacity tumbling and fluffing',
        'Edge binding re-tacking if loose',
        'Heavy-duty travel-ready zipper bag'
      ],
      order: 6
    },
    {
      name: 'Premium Garment Care',
      slug: 'premium-garment-care',
      category: 'Premium Care',
      shortDescription: 'Couture white-glove treatment for imported fabrics, bridal couture, and bespoke attire.',
      description: 'For bespoke fashion pieces, designer sherwanis, and luxury runway labels. Every garment is individually processed by our Master Garment Technician using non-toxic GreenEarth silicone solvents, individual hand inspection, and museum-grade archivist packing.',
      startingPrice: 450,
      estimatedTime: '72-96 Hours',
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80'
      ],
      features: [
        'GreenEarth pure liquid silicone process',
        'Hand-detailed artisanal stain treatment',
        'Individual machine cycle - never co-mingled',
        'Archival breathable luxury cover'
      ],
      careTips: [
        'Keep fragrance and hairspray sprays away from silk and satin finishes.',
        'Request our bespoke boxed preservation for heirloom bridal wear.'
      ],
      included: [
        'Comprehensive fiber condition analysis report',
        'Hand-ironing with non-stick Teflon shoe plates',
        'Velvet-padded hanger and breathable cloth bag'
      ],
      order: 7
    },
    {
      name: 'Curtain & Drapery Cleaning',
      slug: 'curtain-cleaning',
      category: 'Home Textiles',
      shortDescription: 'Zero-shrinkage vertical steam dry cleaning for heavy drapes, sheer, and velvet.',
      description: 'Specialized deep solvent extraction and steam finishing for window curtains, sheer drapes, blackout curtains, and luxury velvet panels without shrinkage.',
      startingPrice: 180,
      estimatedTime: '48-72 Hours',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
      ],
      features: [
        'Zero-shrinkage hem guarantee',
        'Sun-dust & odor extraction',
        'Pleat and header steam restoration'
      ],
      careTips: [
        'Vacuum curtains lightly with brush attachment every month.'
      ],
      included: [
        'Pre-spotting of window condensation marks',
        'Vertical steam hanging finish'
      ],
      order: 8
    },
    {
      name: 'Sofa Sets & Upholstery Care',
      slug: 'sofa-sets-and-upholstery-care',
      category: 'Home Textiles',
      shortDescription: 'Deep fabric foam dry shampooing and dust-mite extraction for living room sofa sets.',
      description: 'Professional fabric sanitization, dust mite extraction, and deep foam dry cleaning for fabric couches, velvet sofas, dining chairs, and luxury recliners.',
      startingPrice: 450,
      estimatedTime: 'On-site / In-Store',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
      ],
      features: [
        'Deep foam vacuum extraction',
        'Fabric-safe stain lifters',
        'Anti-bacterial deodorizing'
      ],
      careTips: [
        'Blot liquid spills immediately without scrubbing.'
      ],
      included: [
        'Cushion deep sanitization',
        'Quick-dry thermal drying'
      ],
      order: 9
    },
    {
      name: 'Carpet & Rug Restoration',
      slug: 'carpet-and-rug-restoration',
      category: 'Home Textiles',
      shortDescription: 'Flat-bed solvent extraction, grit removal, and fringe grooming for fine rugs.',
      description: 'Specialized flat-bed solvent washing, fringe grooming, and moth-proofing for Persian carpets, Kashmiri silk rugs, wool dhurries, and modern area rugs.',
      startingPrice: 350,
      estimatedTime: '72 Hours',
      image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80'
      ],
      features: [
        'Dust and grit centrifugal extraction',
        'Color-fastness lock process',
        'Hand-groomed fringe revival'
      ],
      careTips: [
        'Rotate carpets every 6 months to balance sun exposure.'
      ],
      included: [
        'Edge binding inspection',
        'Rolled protective packaging'
      ],
      order: 10
    }
  ];
  await Service.insertMany(services);
  console.log('[Seeder] 10 Garment Care & Dry Cleaning services seeded.');

  // 4. Garment Pricing Catalog (Authentic Mercury Drycleaners Rate Card)
  const garmentItems = [
    // Column 1
    { name: 'Suit Gents (2 Pcs.)', category: 'Suits', dryCleanPrice: 500, steamIronPrice: 250, premiumCarePrice: 650, description: "Two-piece gentleman's lounge or business suit (₹500/- Onwards).", fabricAdvice: 'Steam vacuum shaped on contoured form.', icon: 'briefcase' },
    { name: 'Suit Gents Branded', category: 'Suits', dryCleanPrice: 600, steamIronPrice: 300, premiumCarePrice: 750, description: 'Branded or designer luxury gents suit (₹600/- Onwards).', fabricAdvice: 'Gentle low-heat solvent cycle for designer labels.', icon: 'award' },
    { name: 'Suit Gents (3 Pcs.)', category: 'Suits', dryCleanPrice: 650, steamIronPrice: 325, premiumCarePrice: 850, description: 'Three-piece suit including jacket, trousers, and waistcoat (₹650/- Onwards).', fabricAdvice: 'Hand-finished lapels and matching vest treatment.', icon: 'briefcase' },
    { name: 'Safari Suit', category: 'Suits', dryCleanPrice: 350, steamIronPrice: 175, premiumCarePrice: 450, description: 'Classic safari jacket and matching trouser set (₹350/- Onwards).', fabricAdvice: 'Pleat preservation and structure pressing.', icon: 'briefcase' },
    { name: 'Coat', category: 'Blazers', dryCleanPrice: 350, steamIronPrice: 175, premiumCarePrice: 450, description: 'Single coat / formal dinner jacket (₹350/- Onwards).', fabricAdvice: 'Shoulder pad alignment and lapel roll.', icon: 'shield' },
    { name: 'Coat (Tweed)', category: 'Blazers', dryCleanPrice: 400, steamIronPrice: 200, premiumCarePrice: 520, description: 'Heavy textured woollen tweed coat (₹400/- Onwards).', fabricAdvice: 'Deep fiber revitalizing solvent treatment.', icon: 'shield' },
    { name: 'Pant', category: 'Trousers', dryCleanPrice: 180, steamIronPrice: 90, premiumCarePrice: 240, description: 'Formal trousers and slacks (₹180/- Onwards).', fabricAdvice: 'Sharp knife crease pressing.', icon: 'scissors' },
    { name: 'Pant (Jean & Corduroy)', category: 'Trousers', dryCleanPrice: 200, steamIronPrice: 100, premiumCarePrice: 260, description: 'Denim jeans, heavy cotton, or corduroy pants (₹200/- Onwards).', fabricAdvice: 'Color-lock treatment preventing fade.', icon: 'scissors' },
    { name: 'Waist Coat Branded', category: 'Blazers', dryCleanPrice: 250, steamIronPrice: 125, premiumCarePrice: 320, description: 'Branded or designer formal waistcoat (₹250/- Onwards).', fabricAdvice: 'Delicate lining and button protection.', icon: 'award' },
    { name: 'Nehru Wasket', category: 'Blazers', dryCleanPrice: 300, steamIronPrice: 150, premiumCarePrice: 390, description: 'Mandarin collar Nehru jacket / wasket (₹300/- Onwards).', fabricAdvice: 'Structured collar press and button care.', icon: 'award' },
    { name: 'Over Coat', category: 'Jackets', dryCleanPrice: 500, steamIronPrice: 250, premiumCarePrice: 650, description: 'Full-length heavy winter overcoat (₹500/- Onwards).', fabricAdvice: 'Controlled moisture steam extraction.', icon: 'shield' },
    { name: 'Over Coat Semi', category: 'Jackets', dryCleanPrice: 450, steamIronPrice: 225, premiumCarePrice: 580, description: 'Mid-length semi overcoat (₹450/- Onwards).', fabricAdvice: 'Thermal fiber fluffing and de-linting.', icon: 'shield' },
    { name: 'Pullover (Simple)', category: 'Jackets', dryCleanPrice: 200, steamIronPrice: 100, premiumCarePrice: 260, description: 'Standard woollen pullover / sweater (₹200/- Onwards).', fabricAdvice: 'Anti-shrinkage flat dry and lint shaving.', icon: 'sparkles' },
    { name: 'Pullover (Branded)', category: 'Jackets', dryCleanPrice: 250, steamIronPrice: 125, premiumCarePrice: 320, description: 'Branded woollen or cashmere pullover (₹250/- Onwards).', fabricAdvice: 'Ultra-gentle solvent bath for fine knitwear.', icon: 'award' },
    { name: 'Cardigan Long', category: 'Jackets', dryCleanPrice: 250, steamIronPrice: 125, premiumCarePrice: 320, description: 'Long woollen cardigan with buttoned front (₹250/- Onwards).', fabricAdvice: 'Dimensional shape retention blocking.', icon: 'sparkles' },
    { name: 'Sweater (S.L)', category: 'Jackets', dryCleanPrice: 180, steamIronPrice: 90, premiumCarePrice: 230, description: 'Sleeveless (S.L) woollen sweater (₹180/- Onwards).', fabricAdvice: 'Armhole and rib knit integrity care.', icon: 'sparkles' },
    { name: 'Sweater Branded (S.L)', category: 'Jackets', dryCleanPrice: 200, steamIronPrice: 100, premiumCarePrice: 260, description: 'Branded sleeveless (S.L) sweater (₹200/- Onwards).', fabricAdvice: 'Gentle fiber conditioning.', icon: 'award' },
    { name: 'T-Shirt (Ord)', category: 'Shirts', dryCleanPrice: 120, steamIronPrice: 60, premiumCarePrice: 160, description: 'Standard casual cotton t-shirt (₹120/- Onwards).', fabricAdvice: 'Soft finish and collar alignment.', icon: 'shirt' },
    { name: 'T-Shirt (Branded)', category: 'Shirts', dryCleanPrice: 180, steamIronPrice: 90, premiumCarePrice: 230, description: 'Designer or branded premium t-shirt / polo (₹180/- Onwards).', fabricAdvice: 'Print protection and color preservation.', icon: 'award' },
    { name: 'Shirt (Ord)', category: 'Shirts', dryCleanPrice: 150, steamIronPrice: 75, premiumCarePrice: 200, description: 'Regular cotton or blended dress shirt (₹150/- Onwards).', fabricAdvice: 'Crisp cuff and collar press.', icon: 'shirt' },
    { name: 'Shirt (Woollen Khakhi & O.G)', category: 'Shirts', dryCleanPrice: 200, steamIronPrice: 100, premiumCarePrice: 260, description: 'Heavy woollen, khakhi, or olive green (O.G) shirt (₹200/- Onwards).', fabricAdvice: 'Moth-proofing and heavy fabric care.', icon: 'shirt' },
    { name: 'Achkan / Sherwani', category: 'Suits', dryCleanPrice: 600, steamIronPrice: 300, premiumCarePrice: 850, description: 'Traditional wedding sherwani or royal achkan (₹600/- Onwards).', fabricAdvice: 'Hand protection for zardozi, gems, and embroidery.', icon: 'award' },
    { name: 'Tie', category: 'Other', dryCleanPrice: 100, steamIronPrice: 50, premiumCarePrice: 140, description: 'Silk, polyester, or wool necktie (₹100/- Onwards).', fabricAdvice: 'Roll-press preserving internal lining roll.', icon: 'scissors' },
    { name: 'Baby Coat', category: 'Blazers', dryCleanPrice: 250, steamIronPrice: 125, premiumCarePrice: 320, description: "Children's formal blazer or winter coat (₹250/- Onwards).", fabricAdvice: 'Skin-friendly hypoallergenic solvent cleaning.', icon: 'shield' },
    { name: 'Baby Pant', category: 'Trousers', dryCleanPrice: 150, steamIronPrice: 75, premiumCarePrice: 190, description: "Children's formal trousers or party pants (₹150/- Onwards).", fabricAdvice: 'Gentle sanitized finish.', icon: 'scissors' },
    { name: 'Kurta Pajama', category: 'Dresses', dryCleanPrice: 300, steamIronPrice: 150, premiumCarePrice: 390, description: "Men's or unisex ethnic kurta with pajama set (₹300/- Onwards).", fabricAdvice: 'Fabric softener and crease-resistant pressing.', icon: 'shirt' },

    // Column 2
    { name: 'Shawl (Plain Ord.)', category: 'Other', dryCleanPrice: 250, steamIronPrice: 125, premiumCarePrice: 320, description: 'Standard woollen or blended plain shawl (₹250/- Onwards).', fabricAdvice: 'Fringe untangling and soft wool fluffing.', icon: 'sparkles' },
    { name: 'Shawl (pashmina)', category: 'Other', dryCleanPrice: 600, steamIronPrice: 300, premiumCarePrice: 999, description: 'Pure Cashmere / Pashmina luxury shawl (₹600 - ₹999 Onwards).', fabricAdvice: 'Zero-stress pure hydrocarbon hand care.', icon: 'award' },
    { name: 'Loi', category: 'Other', dryCleanPrice: 300, steamIronPrice: 150, premiumCarePrice: 390, description: 'Traditional gents woollen loi / wrap (₹300/- Onwards).', fabricAdvice: 'Gentle moisture steaming and moth-proof storage.', icon: 'shield' },
    { name: 'Lady Suit (Ord.)', category: 'Dresses', dryCleanPrice: 300, steamIronPrice: 150, premiumCarePrice: 390, description: 'Ladies salwar kameez / suit (₹300/- Onwards).', fabricAdvice: 'Dupatta and salwar matched finish.', icon: 'heart' },
    { name: 'Lady Shirt / Jumper', category: 'Dresses', dryCleanPrice: 200, steamIronPrice: 100, premiumCarePrice: 260, description: 'Ladies standard top, kurti, or jumper (₹200/- Onwards).', fabricAdvice: 'Fabric-safe steam finishing.', icon: 'shirt' },
    { name: 'Lady Shirt / Jumper Long', category: 'Dresses', dryCleanPrice: 300, steamIronPrice: 150, premiumCarePrice: 390, description: 'Ladies long tunic, long kurti, or winter jumper (₹300/- Onwards).', fabricAdvice: 'Drape preservation pressing.', icon: 'heart' },
    { name: 'Lady Suit (Emb. & Tila)', category: 'Dresses', dryCleanPrice: 350, steamIronPrice: 175, premiumCarePrice: 500, description: 'Embroidered and tila-work designer ladies suit (₹350 - ₹500 Onwards).', fabricAdvice: 'Tila metallic thread luster revitalization.', icon: 'sparkles' },
    { name: 'Lady Suit (Woollen)', category: 'Dresses', dryCleanPrice: 350, steamIronPrice: 175, premiumCarePrice: 450, description: 'Warm woollen / pashmina ladies suit (₹350 - ₹450 Onwards).', fabricAdvice: 'Anti-pilling thermal steam process.', icon: 'shield' },
    { name: 'Dupatta', category: 'Sarees', dryCleanPrice: 150, steamIronPrice: 75, premiumCarePrice: 200, description: 'Plain chiffon, georgette, or cotton dupatta (₹150/- Onwards).', fabricAdvice: 'Even charakh roll and steam finish.', icon: 'heart' },
    { name: 'Dupatta (Emb.)', category: 'Sarees', dryCleanPrice: 200, steamIronPrice: 100, premiumCarePrice: 260, description: 'Embroidered, lace, or beaded designer dupatta (₹200/- Onwards).', fabricAdvice: 'Delicate border protection and soft steam.', icon: 'sparkles' },
    { name: 'Saree (Plain)', category: 'Sarees', dryCleanPrice: 300, steamIronPrice: 160, premiumCarePrice: 400, description: 'Plain georgette, chiffon, or silk saree (₹300 - ₹400 Onwards).', fabricAdvice: 'Traditional charakh and smooth roller press.', icon: 'heart' },
    { name: 'Saree (Emb.)', category: 'Sarees', dryCleanPrice: 400, steamIronPrice: 200, premiumCarePrice: 500, description: 'Embroidered, stone-work, or thread-work saree (₹400 - ₹500 Onwards).', fabricAdvice: 'Sequins and bead stabilization in protective mesh.', icon: 'sparkles' },
    { name: 'Saree (Tila & Zari)', category: 'Sarees', dryCleanPrice: 400, steamIronPrice: 200, premiumCarePrice: 550, description: 'Banarasi, Kanjeevaram, tila, or real zari metallic saree (₹400/- Onwards).', fabricAdvice: 'Zari luster rejuvenation without tarnishing.', icon: 'award' },
    { name: 'Blouse', category: 'Sarees', dryCleanPrice: 150, steamIronPrice: 75, premiumCarePrice: 200, description: 'Saree blouse / choli (₹150/- Onwards).', fabricAdvice: 'Contoured cup pressing and pad care.', icon: 'heart' },
    { name: 'Jacket', category: 'Jackets', dryCleanPrice: 350, steamIronPrice: 175, premiumCarePrice: 450, description: 'Standard bomber, windcheater, or casual jacket (₹350/- Onwards).', fabricAdvice: 'Zipper lubrication and fabric conditioning.', icon: 'shield' },
    { name: 'Jacket Heavy', category: 'Jackets', dryCleanPrice: 400, steamIronPrice: 200, premiumCarePrice: 520, description: 'Heavy padded, down, or quilted winter jacket (₹400/- Onwards).', fabricAdvice: 'Loft restoration and down fluffing cycle.', icon: 'shield' },
    { name: 'Leather Jacket', category: 'Jackets', dryCleanPrice: 1000, steamIronPrice: 500, premiumCarePrice: 1400, description: 'Genuine leather, suede, or sheepskin jacket (₹1000/- Onwards).', fabricAdvice: 'Specialist leather oil replenishment & buffing.', icon: 'award' },
    { name: 'Skirt', category: 'Dresses', dryCleanPrice: 180, steamIronPrice: 90, premiumCarePrice: 240, description: 'Pleated, A-line, or casual long skirt (₹180/- Onwards).', fabricAdvice: 'Pleat alignment and anti-static treatment.', icon: 'heart' },
    { name: 'Blanket (Single Bed Single Ply)', category: 'Blankets', dryCleanPrice: 350, steamIronPrice: 175, premiumCarePrice: 450, description: 'Single bed 1-ply blanket (₹350/- Onwards).', fabricAdvice: 'Deep dust extraction and sanitizing steam bath.', icon: 'sun' },
    { name: 'Blanket (Single Bed Double Ply)', category: 'Blankets', dryCleanPrice: 400, steamIronPrice: 200, premiumCarePrice: 520, description: 'Single bed thick 2-ply mink blanket (₹400/- Onwards).', fabricAdvice: 'Thermal sanitization and pile brushing.', icon: 'sun' },
    { name: 'Blanket (Double Bed Single Ply)', category: 'Blankets', dryCleanPrice: 500, steamIronPrice: 250, premiumCarePrice: 650, description: 'Double bed 1-ply large blanket (₹500/- Onwards).', fabricAdvice: 'Even dry-clean solvent extraction.', icon: 'sun' },
    { name: 'Blanket (Double Bed Double Ply)', category: 'Blankets', dryCleanPrice: 600, steamIronPrice: 300, premiumCarePrice: 750, description: 'Heavy double bed 2-ply mink blanket (₹600/- Onwards).', fabricAdvice: 'High-capacity tumble fluffing and softness revitalizer.', icon: 'sun' },
    { name: 'Quilt', category: 'Blankets', dryCleanPrice: 600, steamIronPrice: 300, premiumCarePrice: 750, description: 'Traditional heavy cotton or microfiber quilt / razai (₹600/- Onwards).', fabricAdvice: 'Moisture-free sanitizing dry cleaning.', icon: 'sun' },
    { name: 'Curtain', category: 'Other', dryCleanPrice: 200, steamIronPrice: 100, premiumCarePrice: 260, description: 'Window or door drape panel (Lining Curtain will be ₹50 extra) (₹200/- Onwards).', fabricAdvice: 'Vertical tension steam pressing.', icon: 'home' }
  ];
  await GarmentItem.insertMany(garmentItems);
  console.log('[Seeder] Garment pricing table seeded (per garment, no per-kg laundry).');

  // 5. Coupons
  const coupons = [
    {
      code: 'MERCURY10',
      title: '10% Welcome Discount',
      description: 'Get 10% off on dry cleaning orders above ₹400.',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 400,
      maxDiscount: 300,
      expiryDate: new Date('2027-12-31'),
      isActive: true
    },
    {
      code: 'FIRST100',
      title: 'Flat ₹100 Off',
      description: 'Enjoy ₹100 flat discount on your dry cleaning order above ₹500.',
      discountType: 'fixed',
      discountValue: 100,
      minOrderAmount: 500,
      maxDiscount: 100,
      expiryDate: new Date('2027-12-31'),
      isActive: true
    },
    {
      code: 'PREMIUM20',
      title: '20% Off Festive Garment Care',
      description: '20% off on orders above ₹1,000 for suits, blazers, and bridal sarees.',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 1000,
      maxDiscount: 800,
      expiryDate: new Date('2027-12-31'),
      isActive: true
    }
  ];
  await Coupon.insertMany(coupons);

  // 6. Verified Reviews
  const reviews = [
    {
      customerName: 'Harpreet Singh Dhillon',
      customerLocation: 'Model Town, Ludhiana',
      rating: 5,
      reviewText: 'Got my three Raymond three-piece suits dry cleaned here before my brother’s wedding. The lapel shaping and steam finishing were impeccable. They look brand new. Truly the premier dry cleaner in Ghumar Mandi.',
      garmentCleaned: '3-Piece Woollen Suits',
      isApproved: true,
      isFeatured: true
    },
    {
      customerName: 'Simran Kaur Gill',
      customerLocation: 'Civil Lines, Ludhiana',
      rating: 5,
      reviewText: 'I was hesitant to trust anyone with my heavy bridal Banarasi lehenga, but Mercury Drycleaners handled the golden zari work flawlessly with zero tarnishing. Delivered on time in an exquisite garment bag.',
      garmentCleaned: 'Bridal Banarasi Lehenga',
      isApproved: true,
      isFeatured: true
    },
    {
      customerName: 'Dr. Rajesh Bhalla',
      customerLocation: 'Sarabha Nagar, Ludhiana',
      rating: 5,
      reviewText: 'Prompt pickup and delivery service at my home. The online booking wizard is super intuitive and tracking my overcoat status in real-time was a breath of fresh air. Highly recommended.',
      garmentCleaned: 'Cashmere Winter Overcoat',
      isApproved: true,
      isFeatured: true
    },
    {
      customerName: 'Amanpreet Chawla',
      customerLocation: 'Ghumar Mandi, Ludhiana',
      rating: 5,
      reviewText: 'Been walking into their Ghumar Mandi shop for years. The upgrade to this modern online system makes scheduling pickups effortless. Professional fabric care at its finest.',
      garmentCleaned: 'Pure Silk Sarees & Blazers',
      isApproved: true,
      isFeatured: true
    }
  ];
  await Review.insertMany(reviews);

  // 7. FAQs
  const faqs = [
    {
      question: 'What is the difference between dry cleaning and regular washing?',
      answer: 'Dry cleaning does not use water. Instead, it utilizes specialized hydrocarbon or liquid silicone fluids that dissolve grease, wine, sweat, and makeup without swelling garment fibers, causing shrinkage, or degrading delicate linings.',
      category: 'Dry Cleaning',
      order: 1,
      isActive: true
    },
    {
      question: 'Do you offer home pickup and delivery in Ludhiana?',
      answer: 'Yes! We provide doorstep pickup and scheduled delivery across Ghumar Mandi, Model Town, Civil Lines, Sarabha Nagar, BRS Nagar, and surrounding Ludhiana localities. Orders above ₹500 enjoy complimentary pickup.',
      category: 'Pickup & Delivery',
      order: 2,
      isActive: true
    },
    {
      question: 'What is the standard turnaround time for dry cleaning?',
      answer: 'Our standard processing time is 48 hours to ensure careful pre-inspection, stain treatment, gentle drying, vacuum steam pressing, and final quality control. Express 24-hour service is available on request.',
      category: 'Dry Cleaning',
      order: 3,
      isActive: true
    },
    {
      question: 'Can you remove tough wine, ink, or turmeric stains from silk?',
      answer: 'Our master technicians are trained in chemical pre-spotting and enzyme treatment. While success depends on whether the stain was previously ironed or treated with water, we achieve complete stain lifting in over 95% of cases without color loss.',
      category: 'Garment Care',
      order: 4,
      isActive: true
    },
    {
      question: 'How do I track my order once it is picked up?',
      answer: 'Simply enter your unique Order ID (e.g., MD-XXXXX) and mobile number on our "Track Order" page. You can follow live updates through 10 detailed stages from "Garments Received" to "Quality Check" and "Out for Delivery".',
      category: 'General',
      order: 5,
      isActive: true
    },
    {
      question: 'Do you provide per-kilogram laundry services?',
      answer: 'No. Mercury Drycleaners is strictly an artisanal dry-cleaning and garment-care establishment. We price each garment individually according to fabric type, construction, and required finishing to ensure couture-grade care.',
      category: 'Pricing',
      order: 6,
      isActive: true
    }
  ];
  await FAQ.insertMany(faqs);

  // 8. Website Settings
  await WebsiteSettings.create({
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
        title: 'Italian Wool 3-Piece Suit',
        garment: 'Bespoke Blue Plaid Woollen Suit & Vest',
        beforeImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
        afterImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
        description: 'Eco-hydrocarbon dry cleaning lifted beverage & sauce spills, vacuum steam-pressed lapels, restored wool luster.'
      },
      {
        title: 'Formal White Dress Shirt',
        garment: 'Crisp Cotton Formal Dress Shirt',
        beforeImage: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
        afterImage: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
        description: 'Enzyme pre-spotting completely lifted placket coffee spill and collar grime, finished with crisp vacuum pressing.'
      }
    ],
    pricingDisclaimer: 'Estimated – demo prices. Final prices confirmed upon garment inspection at our Ghumar Mandi store.',
    freePickupThreshold: 500,
    pickupCharge: 50,
    taxPercentage: 5
  });

  // 9. Initial Sample Orders (for tracking & dashboard demonstration)
  const initialOrders = [
    {
      orderId: 'MD-2611-1001',
      invoiceNumber: 'INV-2611-1001',
      user: demoCustomer._id,
      customerName: 'Gurpreet Singh',
      customerPhone: '+91 98140 12345',
      customerEmail: 'gurpreet@example.com',
      bookingType: 'pickup',
      pickupAddress: {
        street: 'House No. 42, Green Avenue',
        landmark: 'Opposite Rakh Bagh',
        city: 'Ludhiana',
        postalCode: '141001'
      },
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTimeSlot: '10:00 AM - 12:00 PM',
      services: [{ serviceId: 'dry-cleaning', serviceName: 'Dry Cleaning' }],
      items: [
        { garmentName: '2-Piece Men’s Suit', serviceType: 'Dry Cleaning', quantity: 1, unitPrice: 360, total: 360 },
        { garmentName: 'Formal Shirt', serviceType: 'Dry Cleaning', quantity: 2, unitPrice: 110, total: 220 }
      ],
      specialInstructions: 'Please handle the suit lapels carefully, delicate Italian wool.',
      stainsNotes: 'Small coffee spot on the right cuff of one shirt.',
      subtotal: 580,
      discount: 100,
      couponApplied: { code: 'FIRST100', discountAmount: 100 },
      taxes: 24,
      pickupCharge: 0,
      finalTotal: 504,
      paymentPreference: 'upi',
      paymentStatus: 'Pending',
      orderStatus: 'Inspection in Progress',
      statusHistory: [
        { status: 'Booking Received', note: 'Booking placed online.', updatedAt: new Date(Date.now() - 5 * 3600 * 1000) },
        { status: 'Confirmed', note: 'Pickup scheduled with driver.', updatedAt: new Date(Date.now() - 4 * 3600 * 1000) },
        { status: 'Garments Received', note: 'Arrived at Ghumar Mandi facility.', updatedAt: new Date(Date.now() - 2 * 3600 * 1000) },
        { status: 'Inspection in Progress', note: 'Garment technician examining fabric weave and pre-treating cuff spot.', updatedAt: new Date() }
      ],
      estimatedCompletionDate: new Date(Date.now() + 36 * 3600 * 1000).toISOString().split('T')[0],
      garmentInspectionNotes: 'Fabric in good condition. Pre-spotting coffee spot with gentle alkaline spotter.'
    },
    {
      orderId: 'MD-2611-1002',
      invoiceNumber: 'INV-2611-1002',
      customerName: 'Simran Kaur',
      customerPhone: '+91 98720 54321',
      customerEmail: 'simran.k@example.com',
      bookingType: 'dropoff',
      pickupAddress: { street: 'Ghumar Mandi Store Walk-in', city: 'Ludhiana', postalCode: '141001' },
      preferredDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString().split('T')[0],
      preferredTimeSlot: '02:00 PM - 04:00 PM',
      services: [{ serviceId: 'saree-and-ethnic-wear-care', serviceName: 'Saree and Ethnic Wear Care' }],
      items: [
        { garmentName: 'Pure Silk / Kanjivaram Saree', serviceType: 'Premium Care', quantity: 1, unitPrice: 320, total: 320 },
        { garmentName: 'Banarasi Brocade Saree', serviceType: 'Premium Care', quantity: 1, unitPrice: 380, total: 380 }
      ],
      specialInstructions: 'Delicate gold zari embroidery on both pallus.',
      subtotal: 700,
      discount: 70,
      couponApplied: { code: 'MERCURY10', discountAmount: 70 },
      taxes: 32,
      pickupCharge: 0,
      finalTotal: 662,
      paymentPreference: 'cash',
      paymentStatus: 'Paid',
      orderStatus: 'Ready for Pickup',
      statusHistory: [
        { status: 'Booking Received', note: 'Order dropped off at shop counter.', updatedAt: new Date(Date.now() - 24 * 3600 * 1000) },
        { status: 'Confirmed', note: 'Garment tags assigned.', updatedAt: new Date(Date.now() - 23 * 3600 * 1000) },
        { status: 'Garments Received', note: 'Checked into master dry cleaning batch.', updatedAt: new Date(Date.now() - 20 * 3600 * 1000) },
        { status: 'Processing', note: 'Hydrocarbon gentle cleaning complete.', updatedAt: new Date(Date.now() - 10 * 3600 * 1000) },
        { status: 'Quality Check', note: 'Passed 10-point fabric inspection.', updatedAt: new Date(Date.now() - 4 * 3600 * 1000) },
        { status: 'Ready for Pickup', note: 'Packed in protective roll covers and ready at Ghumar Mandi counter.', updatedAt: new Date() }
      ],
      estimatedCompletionDate: new Date().toISOString().split('T')[0]
    },
    {
      orderId: 'MD-2611-1003',
      invoiceNumber: 'INV-2611-1003',
      customerName: 'Ravinder Verma',
      customerPhone: '+91 98888 77665',
      customerEmail: 'ravinder@example.com',
      bookingType: 'pickup',
      pickupAddress: { street: 'B-12, Sarabha Nagar', city: 'Ludhiana', postalCode: '141001' },
      preferredDate: new Date(Date.now() - 48 * 3600 * 1000).toISOString().split('T')[0],
      preferredTimeSlot: '04:00 PM - 06:00 PM',
      services: [{ serviceId: 'winter-wear-cleaning', serviceName: 'Winter Wear Cleaning' }],
      items: [
        { garmentName: 'Overcoat / Trench Coat', serviceType: 'Dry Cleaning', quantity: 1, unitPrice: 380, total: 380 },
        { garmentName: 'Double Mink Blanket (Heavy)', serviceType: 'Home Textiles', quantity: 1, unitPrice: 380, total: 380 }
      ],
      subtotal: 760,
      discount: 0,
      taxes: 38,
      pickupCharge: 0,
      finalTotal: 798,
      paymentPreference: 'upi',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      statusHistory: [
        { status: 'Booking Received', note: 'Booking confirmed.', updatedAt: new Date(Date.now() - 48 * 3600 * 1000) },
        { status: 'Confirmed', note: 'Driver assigned.', updatedAt: new Date(Date.now() - 46 * 3600 * 1000) },
        { status: 'Garments Received', note: 'Checked in.', updatedAt: new Date(Date.now() - 44 * 3600 * 1000) },
        { status: 'Processing', note: 'Sanitized and cleaned.', updatedAt: new Date(Date.now() - 24 * 3600 * 1000) },
        { status: 'Quality Check', note: 'Passed inspection.', updatedAt: new Date(Date.now() - 12 * 3600 * 1000) },
        { status: 'Out for Delivery', note: 'Out with delivery associate.', updatedAt: new Date(Date.now() - 4 * 3600 * 1000) },
        { status: 'Delivered', note: 'Delivered to customer doorstep in Sarabha Nagar.', updatedAt: new Date() }
      ],
      estimatedCompletionDate: new Date(Date.now() - 4 * 3600 * 1000).toISOString().split('T')[0]
    }
  ];
  await Order.insertMany(initialOrders);
  console.log('[Seeder] Initial sample orders created.');

  console.log('[Seeder] All database records successfully seeded for Mercury Drycleaners!');
};

if (require.main === module) {
  seedData()
    .then(() => {
      console.log('[Seeder] Done!');
      process.exit(0);
    })
    .catch(err => {
      console.error('[Seeder] Error:', err);
      process.exit(1);
    });
}

module.exports = seedData;
