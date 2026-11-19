# MERCURY DRYCLEANERS – Premium MERN Stack Web Platform

> **Location:** Ghumar Mandi, Ludhiana, Punjab, India  
> **Tagline:** *Your Clothes. Our Care. Always Fresh.*  
> **Stack:** MongoDB • Express.js • React.js (Vite) • Node.js • Tailwind CSS • Socket.io

---

## 🌟 Overview

Mercury Drycleaners is an artisanal dry-cleaning and bespoke garment-care platform custom-built for our flagship location in **Ghumar Mandi, Ludhiana, Punjab**. 

The platform is strictly dedicated to **professional dry cleaning, vacuum steam ironing, and couture textile care**. It intentionally excludes all laundry / per-kg services to maintain the highest standard of fabric preservation.

---

## 🚀 Key Features

### 1. Interactive Customer Experience
- **Hero Parallax & Micro-Interactions:** Elegant headline reveal, location indicator for Ghumar Mandi, and an in-hero quick Order Status tracker.
- **Draggable Before/After Comparison Slider:** Touch-friendly, draggable comparison showing real fabric restoration (Italian Wool Tuxedos and Pure Banarasi Zari Silk Sarees).
- **Quick Price Estimator:** Interactive garment picker and steppers with animated totals calculation that carries directly into the booking wizard.
- **6-Step Online Booking Wizard:**
  1. Service selection
  2. Garment types and quantities (+/- steppers)
  3. Care instructions, stains, and delicate fabric notes
  4. Pickup vs store drop-off, interactive Ludhiana date & time-slot picker
  5. Contact details, live coupon validation (`FIRST100`, `MERCURY10`, `PREMIUM20`)
  6. Final review and instant booking submission
- **Booking Confirmation & Celebration:** Full-screen celebratory confetti (`canvas-confetti`), Order ID generation, WhatsApp sharing, and client-side PDF invoice generation (`jsPDF`).
- **Live Real-Time Order Tracking:** 10-stage animated visual timeline with pulse animation, powered by Socket.io updates dispatched directly from the staff portal.
- **Command Palette (Ctrl + K / Cmd + K):** Instant modal search to jump to services, pages, tracking, and booking anywhere on the site.
- **Floating WhatsApp Desk:** Attention-animated floating WhatsApp button generating prefilled booking enquiries.

### 2. Comprehensive Admin Console (`/admin`)
- **Dashboard Analytics:** Live animated KPI counters and interactive Recharts data visualizations (Monthly Revenue, Weekly Order Volume, Status Mix, and Popular Services).
- **Kanban Board & Table View:** Drag-and-drop / column-based order status pipeline with real-time Socket.io broadcasting to client tracking pages.
- **Garment Pricing Management:** Live inline price editing for dry cleaning, steam ironing, and couture care per garment.
- **Service Management:** CRUD operations for services, turnaround times, and process descriptions.
- **Customer Directory:** Track customer lifetime spend, previous orders, and contact details.
- **Coupons & Promotional Offers:** Manage percentage and fixed discount codes with minimum order thresholds.
- **Review Moderation:** Approve, feature, or reject reviews submitted by verified customers.
- **CSV Reports Export:** One-click download of all orders and financial metrics.

---

## 🔐 Default Access Credentials

### Superadmin Account
- **Portal URL:** `http://localhost:5173/admin/login`
- **Email:** `admin@mercurydrycleaners.com`
- **Password:** `Admin@12345`

### Sample Customer Account
- **Portal URL:** `http://localhost:5173/login`
- **Email:** `gurpreet@example.com`
- **Password:** `Customer@123`

### Sample Orders for Instant Live Tracking
- `MD-2611-1001` (Status: *Inspection in Progress*)
- `MD-2611-1002` (Status: *Ready for Pickup*)
- `MD-2611-1003` (Status: *Delivered*)

---

## 🛠️ Installation & Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (v9 or higher)
- [MongoDB](https://www.mongodb.com/) (Optional: The application includes a resilient auto-fallback engine that runs out of the box even before local MongoDB is started)

### 1. Clone & Install Dependencies

From the project root:
```bash
# Install root orchestrator dependencies
npm install

# Install server backend dependencies
cd server
npm install

# Install client frontend dependencies
cd ../client
npm install
cd ..
```

Or run the combined installer:
```bash
npm run install:all
```

---

### 2. Environment Variables

#### Backend (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mercury_drycleaners
JWT_SECRET=mercury_drycleaners_jwt_secret_key_ludhiana_secure_2026
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

### 3. Seed Database (Optional / Automatic)
The database automatically seeds on first server start if empty, or you can run it manually:
```bash
npm run seed
```

---

### 4. Running the Platform Locally

To run both the **Backend API** and **Frontend Web Application** concurrently with a single command:
```bash
npm run dev
```

Alternatively, run in separate terminals:

**Terminal 1 (Backend API):**
```bash
npm run dev:server
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm run dev:client
# Frontend runs on http://localhost:5173
```

---

## 📁 Project Architecture

```
project2/
├── client/                     # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── public/
│   │   ├── favicon.svg         # Garment Hanger Crest Favicon
│   │   └── logo.svg            # Mercury Drycleaners Vector Logo
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, FloatingWhatsApp, CommandPalette, Skeleton
│   │   │   ├── home/           # Hero, BeforeAfterSlider, QuickPriceEstimator, HowItWorks, Stats
│   │   │   ├── booking/        # 6-Step Booking Wizard, OrderSummarySidebar
│   │   ├── context/            # AuthContext, BookingContext, SocketContext
│   │   ├── pages/              # Home, About, Services, Pricing, Booking, TrackOrder, Dashboards
│   │   ├── services/           # Axios API, Socket.io, jsPDF Invoice Generator
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Backend (Node.js + Express + Mongoose + Socket.io)
│   ├── config/                 # db.js, socket.js
│   ├── controllers/            # auth, orders, services, pricing, analytics, reviews
│   ├── middleware/             # authMiddleware, uploadMiddleware
│   ├── models/                 # User, Admin, Order, Service, GarmentItem, Coupon, Review, FAQ
│   ├── routes/                 # REST API endpoints
│   ├── services/               # Resilient storage fallback & persistence
│   ├── utils/                  # Database seeder script
│   └── server.js
│
├── package.json                # Root orchestration & scripts
└── README.md
```

---

## 📍 Store Location & Contact Details
- **Store:** Mercury Drycleaners
- **Address:** Shop 14, Main Market, Ghumar Mandi, Ludhiana, Punjab – 141001, India
- **Phone:** +91 98765 43210
- **Email:** care@mercurydrycleaners.com
- **Hours:** Monday – Saturday (9:00 AM – 8:30 PM), Sunday (10:00 AM – 4:00 PM)
