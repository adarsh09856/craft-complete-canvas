# Golden Takin Holidays — Luxury Bhutan & Himalayan Travel Portal

Official web application and booking portal for **Golden Takin Holidays** (`goldentakinholidays.bt`), premier luxury DMC for Bhutan, Nepal, and Tibet.

## Features
- **Dynamic Tour Engine**: Comprehensive multi-day itineraries, dynamic price calculations, and multi-currency pricing (USD, INR, EUR, GBP, AUD).
- **Automated SDF Calculation**: Real-time calculation of Bhutan Sustainable Development Fee ($100/day for international, Nu. 1,200/day for regional).
- **KYC & Visa Documentation Desk**: Secure passport upload, flight manifest registration, and itinerary confirmation.
- **AI Himalayan Travel Concierge**: Live 24/7 intelligent itinerary planner with instant package matching.
- **B2B Agent & Wholesale Portal**: Dedicated agent registration, commission tiers, and bulk booking management.
- **Curated Bhutan Artisan Boutique**: Cross-linked store with TakinMart for authentic Himalayan textiles, honey, cordyceps, and sacred arts.

## Getting Started

### Prerequisites
- Node.js 20+ and npm

### Local Development
```sh
npm install
npm run dev
```

### Database & Environment Setup
Configure your `.env` file with your aaPanel PostgreSQL / Supabase settings:
```env
VITE_SUPABASE_URL=http://your-server-ip:8000
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_URL=http://your-server-ip:8000
SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Database schema migrations and seed scripts are located in `database/init.sql` and `database/seed.sql`.

