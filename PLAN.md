# Golden Takin Holidays — Comprehensive Master Plan & Architecture Specification
**Domain:** `www.goldentakinholidays.bt` & `www.takinmart.bt`  
**Repository:** `craft-complete-canvas` (Stand-Alone Travel DMC Application)  
**Status:** In Active Execution — Full System Delivery  

---

## 1. Executive Summary & Brand Positioning

**Golden Takin Holidays** is an elite Inbound Tour Operator and Destination Management Company (DMC) licensed by the **Department of Tourism (DoT)**, Royal Government of Bhutan, headquartered on **Norzin Lam, Post Box 1024, Thimphu, Kingdom of Bhutan**.

- **Brand Slogans:** *"Journeys That Stay With You"* & *"Discover ◆ Experience ◆ Belong"*
- **Geographic Footprint:** Bhutan (Core Kingdom), Nepal, Tibet (Autonomous Region / Mt. Kailash), and India (North-East Overland Gateways).
- **Key Source Markets:** United Kingdom (UK), Australia (AUS), India (SAARC), and Global International Travelers.
- **Strict Decoupling Mandate:** Completely independent, self-contained architecture free of Lovable dependencies, with self-owned PostgreSQL database schema and seed data.

---

## 2. Interactive Opening Promo Popup Modal Specification

### 2.1 Visual & UX Requirements
- **Asset:** High-resolution Himalayan promotional banner (`src/assets/promo-banner.png`) containing Paro Taktsang, London Big Ben, Sydney Opera House, Mt. Kailash, and official contact directories.
- **Trigger Behavior:** Automatically triggers when opening the website (1.2s smooth slide-up / fade-in after initial DOM hydration).
- **Controls & Interaction:**
  - **Closing Cross (`X`):** Prominent high-contrast close button in the top right corner with accessible aria-label, hover scale animation, and keyboard `Esc` listener.
  - **Backdrop Dismiss:** Clicking outside the modal container smoothly closes it.
  - **Promo Code Action:** Displays **`WSUKSU26`** with a one-click **"Copy Code"** button providing instant toast feedback.
  - **Click-to-Call / Click-to-Chat Direct Actions:**
    - 🇧🇹 Bhutan Desk: `tel:+97517970050`
    - 💬 WhatsApp 24/7: `https://wa.me/918514889385`
    - 🇦🇺 Australia Support Desk: `tel:+61404343370`
    - 🇬🇧 United Kingdom Desk: `tel:+447586203728`
  - **Dismissal Persistence:** Optional "Don't show this again today" checkbox storing timestamp in `localStorage`.
  - **Re-Open Triggers:** Clickable promo code badge in `TopContactBar`, `Navbar`, `Footer`, and floating `PromoBadgeTrigger` allowing users to re-open the flyer anytime.

---

## 3. Verified Global Communication & Contact Directory

### 3.1 Helplines & Direct WhatsApp
| Channel / Office | Verified Contact | Hours / Functionality |
| :--- | :--- | :--- |
| 🇧🇹 **Bhutan Head Office** | **`+975-1797-0050`** | Central Operations, Tour Dispatch, Norzin Lam Thimphu |
| 💬 **Official 24/7 WhatsApp** | **`+91-8514889385`** | Immediate Quotes, Traveler Concierge, Itinerary Inquiries |
| 🇦🇺 **Australia Support Desk** | **`+61-404-343-370`** | Australian & New Zealand Guest Inquiries & Timezone Support |
| 🇬🇧 **United Kingdom Support Desk** | **`+44-7586203728`** | UK & European Guest Inquiries & Timezone Support |
| 🎁 **UK Exclusive Promo Code** | **`WSUKSU26`** | 10% Discount on UK/European Bookings |
| 🌐 **Official Domains** | `www.goldentakinholidays.bt`<br>`www.takinmart.bt` | Tour Portal & Artisan E-Commerce Marketplace |

### 3.2 Enterprise Departmental Email Matrix (6 Inboxes)
1. **`info@goldentakinholidays.bt`** — General traveler inquiries, public bookings, custom planning intake.
2. **`office@goldentakinholidays.bt`** — Central ground operations, hotel room allocations, vehicle fleet dispatch.
3. **`gm@goldentakinholidays.bt`** — General Manager executive escalations, quality assurance, VIP delegations.
4. **`ceo@goldentakinholidays.bt`** — Chief Executive Officer strategic leadership, ministry relations.
5. **`bdm@goldentakinholidays.bt`** — Business Development Manager: B2B Travel Partner & DMA onboarding, wholesale rate cards, trade marketing.
6. **`support@goldentakinholidays.bt`** — 24/7 guest support, emergency medical evacuation triage, flight delays.

---

## 4. Multi-Currency Engine & Transparent SDF Breakdown

### 4.1 Supported Currencies
- 🇺🇸 **USD ($)** — Global International base standard.
- 🇮🇳 **INR (₹ / Nu.)** — Pegged 1:1 with Bhutanese Ngultrum for Indian and SAARC travelers.
- 🇦🇺 **AUD (A$)** — Direct Australian Dollar display for the active Australian market.
- 🇪🇺 **EUR (€)** — European Union travelers.
- 🇬🇧 **GBP (£)** — United Kingdom travelers.

### 4.2 Dynamic Real-Time Calculations
- Multi-currency switcher available in header, mobile drawer, and booking components.
- Automatic conversion across package cards, detail pages, subtotal rows, and artisan craft store.
- **Sustainable Development Fee (SDF) Itemization:**
  - Indian Travelers: Fixed **INR 1,200/night/adult** (Children 6–12: 50% concession = INR 600; Children under 5: Free).
  - International Travelers: Fixed **USD 100/night/adult** (converted to selected currency).

---

## 5. Ingestion of All 26 Master Documents

### 5.1 College & University Field Excursions (Docs 2, 3, 4)
- **4N/5D, 5N/6D, 6N/7D** Academic itineraries across Hasimara, Phuentsholing, Thimphu, Punakha, Paro.
- 2-Star DoT-certified student accommodations, AP meal plan (all meals), dedicated study visits to Zorig Chusum Institute, National Herbarium, and Royal Takin Preserve.
- Faculty FOC Policy: 1 complimentary faculty escort per 15 paying students.

### 5.2 Corporate MICE & Executive Incentives (Docs 5, 6, 7)
- **4N/5D, 5N/6D, 6N/7D** Luxury corporate packages.
- 3-Star Premium hotels & mountain resorts, conference hall with projector/AV, traditional *Tashi Khaddar* scarf welcome, gala banquet dinner with live mask dance troupe, archery contest, and Punakha white-water rafting.

### 5.3 High School Overland Excursions (Docs 8, 9, 10)
- **4N/5D, 5N/6D, 6N/7D** Overland student circuits for Classes XI & XII.
- Comprehensive safety protocols, 24/7 GTH tour escort, gender-segregated hotel wings, daily roll calls, portable emergency oxygen.

### 5.4 Royal Romantic Honeymoon Escapes (Docs 11, 12)
- **5N/6D & 6N/7D** Luxury private couple journeys.
- Dedicated executive SUV (Innova Crysta), boutique valley-view suites, complimentary bottle of Bhutanese peach wine (*Zumzin*), private candlelight dinner, traditional herbal river-stone bath (*Dotsho*), traditional attire (*Gho* & *Kira*) photoshoot, and monastery butter-lamp blessings.

### 5.5 Multi-Country Himalayan Cross-Border Circuits
- **Nepal & Bhutan Cultural Odyssey (9N/10D):** Kathmandu Valley (Pashupatinath, Boudhanath, Patan) + Pokhara + Paro, Thimphu, Punakha.
- **Tibet & Bhutan Trans-Himalayan Pilgrimage (11N/12D):** Lhasa (Potala Palace, Jokhang, Sera Monastery) + Mt. Kailash / Manasarovar + Bhutan sacred valleys.
- **India (North-East) Overland Gateways:** Hasimara, Alipurduar, Siliguri, and Bagdogra integration.

### 5.6 B2B Travel Partner Portal (Docs 19 & 21) — `/b2b-portal`
- Destination Management Agency (DMA) onboarding registration wizard:
  - Agency profile, IATA/TAAI registration, GST/PAN validation, annual pax slabs.
  - Wholesale net rates, credit terms, commission matrix, Thimphu ADRC arbitration.
  - Stores registration in `b2b_partners` table; dispatches notification to `bdm@goldentakinholidays.bt`.

### 5.7 Mandatory Traveler KYC & Immigration Hub (Docs 14–18, 20) — `/kyc`
- Guest profile, emergency contact, dietary preferences, and medical background.
- **Strict Indian Passport / Voter ID Compliance:**
  - Clear banner warning that **only valid Passport (min 6 months validity) or Election Voter ID (EPIC)** are accepted for Bhutan Entry Permits.
  - Prominent notification: Aadhaar Card, PAN Card, and Driving Licenses are strictly rejected by Royal Bhutan Immigration.
  - Stores submission in `traveler_kyc` table.

### 5.8 Handicraft Association of Bhutan Store Showcase — `/store`
- Authentic cottage industry showcase: Bumthang Yathra Woolens, Lhuentse Kishuthara Raw Silk, Hand-painted Mineral Thangkas, Turned Dappa Bowls, Lunana Cordyceps, Bumthang Wild Honey.
- Real-time multi-currency pricing and direct links to `www.takinmart.bt`.

---

## 6. Self-Owned PostgreSQL Database Architecture

Located in [`craft-complete-canvas/database/`](file:///e:/ai/bhutanprojects/ecom%20and%20the%20travel/craft-complete-canvas/database/):
1. **`init.sql`:**
   - `staff_users`: RBAC for 6 official departmental inboxes (`ceo@`, `gm@`, `bdm@`, `office@`, `support@`, `info@`).
   - `email_dispatch_logs`: Audited email log for all outbound notifications.
   - `destinations`: Bhutan, Nepal, Tibet, India NE.
   - `tour_packages`: Ingested packages with multi-currency rates, duration, itineraries, inclusions, exclusions.
   - `travel_inquiries`: Guest booking requests, travel dates, pax, quoted amounts, assigned staff.
   - `b2b_partners`: DMA partner agency registrations, IATA memberships, approval workflow.
   - `traveler_kyc`: Passport / Voter ID data, medical histories, emergency contacts.
2. **`seed.sql`:** Pre-populated with complete packages, destinations, and credentials.
3. **`docker-compose.yml`:** Dedicated PostgreSQL 16 container (`goldentakin_postgres`) on port 5432.

---

## 7. Decoupled Toolchain & Architecture

- **Vite Configuration:** Cleaned from `@lovable.dev/vite-tanstack-config` to standard open plugins.
- **Client Storage:** Decoupled `previewAuthStorage.ts` from Lovable iframe messaging to standard browser `localStorage`.
- **Chatbot / AI Assistant (`src/routes/api/chat.ts`):** Decoupled from Lovable AI gateway to direct Google Gemini API (`@google/genai` or standard endpoint).
- **Environment:** Configurable via `.env` for either local PostgreSQL or self-hosted Supabase instance.

---

## 8. Implementation & Verification Roadmap

- [x] Extract all 26 PDF documents and compile master dossier.
- [x] Ingest promotional flyer asset (`promo-banner.png`) from screenshot.
- [x] Create dedicated PostgreSQL schema (`init.sql`), seed (`seed.sql`), and `docker-compose.yml`.
- [x] Build `PromoPopupModal.tsx` with closing cross, copyable promo code `WSUKSU26`, and verified dials.
- [x] Implement Multi-Currency provider (`USD`, `INR`, `AUD`, `EUR`, `GBP`) and `CurrencySelector.tsx`.
- [x] Build `/store` showcasing Handicraft Association of Bhutan products with multi-currency pricing.
- [x] Update verified contacts (+975-1797-0050, +91-8514889385, +61-404-343-370, +44-7586203728) and 6 departmental emails in `Footer.tsx`, `TopContactBar.tsx`, `Navbar.tsx`, `contact.tsx`.
- [ ] Connect `useCurrency()` into `tours.$slug.tsx` and `BookingWidget.tsx` for real-time currency switching and SDF itemization.
- [ ] Build B2B DMA Partner Portal page (`src/routes/b2b-portal.tsx`).
- [ ] Build Traveler KYC & Immigration Permit Hub page (`src/routes/kyc.tsx`).
- [ ] Decouple `src/integrations/supabase/client.ts` and `src/routes/api/chat.ts` from Lovable services.
- [ ] Verify build, routing, and functionality.
