-- ====================================================================
-- GOLDEN TAKIN HOLIDAYS (TRAVEL PLATFORM) DATABASE SCHEMA
-- Standalone PostgreSQL 15+ compatible DDL
-- Domain: www.goldentakinholidays.bt
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE app_role AS ENUM ('super_admin', 'gm', 'ceo', 'bdm', 'operations_staff', 'support_agent');

CREATE TABLE IF NOT EXISTS staff_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'operations_staff',
  phone TEXT,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Official 6 Department Email Dispatch Logs
CREATE TABLE IF NOT EXISTS email_dispatch_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_email TEXT NOT NULL CHECK (sender_email IN (
    'info@goldentakinholidays.bt', 'office@goldentakinholidays.bt',
    'gm@goldentakinholidays.bt', 'ceo@goldentakinholidays.bt',
    'bdm@goldentakinholidays.bt', 'support@goldentakinholidays.bt'
  )),
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_type TEXT NOT NULL,
  body_text TEXT,
  body_html TEXT,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Destinations (Bhutan, Nepal, Tibet, India NE)
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  country TEXT NOT NULL CHECK (country IN ('Bhutan', 'Nepal', 'Tibet', 'India')),
  region TEXT NOT NULL,
  elevation_m INTEGER,
  tagline TEXT,
  description TEXT NOT NULL,
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  best_seasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  travel_tips JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT,
  gallery_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tour Packages (Ingested from 26 PDF Documents + Multi-Country)
CREATE TABLE IF NOT EXISTS tour_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'college_academic', 'corporate_mice', 'school_overland', 
    'romantic_honeymoon', 'cultural_heritage', 'trekking_adventure', 
    'himalayan_combo'
  )),
  countries TEXT[] NOT NULL DEFAULT ARRAY['Bhutan'],
  duration_nights INTEGER NOT NULL,
  duration_days INTEGER NOT NULL,
  route TEXT NOT NULL,
  accommodation_tier TEXT NOT NULL DEFAULT '3-Star Premium',
  meal_plan TEXT NOT NULL DEFAULT 'AP (All Meals Included)',
  transport_type TEXT NOT NULL DEFAULT 'Dedicated Tourist Vehicle / Coaster Bus',
  
  -- Multi-Currency Base Pricing
  price_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_inr NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_aud NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_eur NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_gbp NUMERIC(10,2) NOT NULL DEFAULT 0,
  
  -- SDF & Government compliance
  sdf_included BOOLEAN NOT NULL DEFAULT false,
  daily_sdf_inr NUMERIC(10,2) NOT NULL DEFAULT 1200.00,
  daily_sdf_usd NUMERIC(10,2) NOT NULL DEFAULT 100.00,
  
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  itinerary JSONB NOT NULL DEFAULT '[]'::jsonb,
  inclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
  exclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
  cancellation_policy_summary TEXT,
  
  featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Traveler Inquiries & Custom Quotes
CREATE TABLE IF NOT EXISTS travel_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_number TEXT UNIQUE,
  guest_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  nationality TEXT NOT NULL DEFAULT 'Indian',
  country_of_residence TEXT NOT NULL DEFAULT 'India',
  
  package_id UUID REFERENCES tour_packages(id) ON DELETE SET NULL,
  tour_name TEXT NOT NULL,
  destinations_interested TEXT[] NOT NULL DEFAULT ARRAY['Bhutan'],
  
  travel_date DATE,
  travelers_count INTEGER NOT NULL DEFAULT 2,
  children_count INTEGER NOT NULL DEFAULT 0,
  hotel_preference TEXT DEFAULT '3-Star',
  currency_preference TEXT NOT NULL DEFAULT 'INR' CHECK (currency_preference IN ('INR', 'USD', 'AUD', 'EUR', 'GBP')),
  promo_code_used TEXT,
  estimated_budget NUMERIC(12,2),
  
  special_requests TEXT,
  lead_source TEXT NOT NULL DEFAULT 'Website',
  assigned_to UUID REFERENCES staff_users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Quoted', 'Confirmed', 'Cancelled')),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- B2B Destination Management Agents (DMA) Registry (Doc 19 & 21)
CREATE TABLE IF NOT EXISTS b2b_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_ref TEXT UNIQUE NOT NULL,
  agency_name TEXT NOT NULL,
  registered_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state_or_province TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  contact_person TEXT NOT NULL,
  designation TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  mobile TEXT,
  website TEXT,
  
  gstin_or_tax_id TEXT,
  pan_number TEXT,
  iata_taai_membership TEXT,
  bank_name TEXT,
  bank_account_number TEXT,
  bank_ifsc_swift TEXT,
  
  annual_turnover_range TEXT,
  projected_annual_pax INTEGER NOT NULL DEFAULT 50,
  target_segments TEXT[] DEFAULT ARRAY['FIT', 'Corporate MICE', 'College Excursions'],
  
  status TEXT NOT NULL DEFAULT 'Pending_Verification' CHECK (status IN ('Pending_Verification', 'Approved_DMA', 'Active', 'Suspended')),
  mou_signed_at TIMESTAMPTZ,
  assigned_bdm UUID REFERENCES staff_users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Traveler KYC & Immigration Intake Record (Doc 20)
CREATE TABLE IF NOT EXISTS traveler_kyc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID REFERENCES travel_inquiries(id) ON DELETE CASCADE,
  doc_ref TEXT NOT NULL,
  full_name TEXT NOT NULL,
  nationality TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL,
  
  id_document_type TEXT NOT NULL CHECK (id_document_type IN ('Passport', 'Election_Voter_ID')),
  id_document_number TEXT NOT NULL,
  id_issue_date DATE,
  id_expiry_date DATE,
  place_of_issue TEXT,
  id_document_url TEXT,
  
  blood_group TEXT,
  emergency_contact_name TEXT NOT NULL,
  emergency_contact_phone TEXT NOT NULL,
  emergency_contact_relationship TEXT NOT NULL,
  
  dietary_preference TEXT DEFAULT 'Standard' CHECK (dietary_preference IN ('Standard', 'Pure Vegetarian', 'Jain', 'Halal', 'Vegan')),
  medical_conditions TEXT,
  altitude_history TEXT,
  insurance_policy_number TEXT,
  insurance_provider TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed Staff Accounts (Matching Official 6 Inboxes)
INSERT INTO staff_users (email, full_name, role, phone, password_hash)
VALUES
('ceo@goldentakinholidays.bt', 'Executive Director / CEO', 'ceo', '+975 17970050', crypt('BhutanCeo2026!#', gen_salt('bf'))),
('gm@goldentakinholidays.bt', 'General Manager Operations', 'gm', '+975 17970050', crypt('BhutanGm2026!#', gen_salt('bf'))),
('bdm@goldentakinholidays.bt', 'Business Development Manager', 'bdm', '+91 8514889385', crypt('BhutanBdm2026!#', gen_salt('bf'))),
('office@goldentakinholidays.bt', 'Head Office & Fleet Dispatch', 'operations_staff', '+975 17970050', crypt('BhutanOffice2026!#', gen_salt('bf'))),
('support@goldentakinholidays.bt', '24/7 Traveler Support Desk', 'support_agent', '+91 8514889385', crypt('BhutanSupport2026!#', gen_salt('bf'))),
('info@goldentakinholidays.bt', 'Information & Public Inquiries Desk', 'support_agent', '+975 17970050', crypt('BhutanInfo2026!#', gen_salt('bf')))
ON CONFLICT (email) DO NOTHING;
