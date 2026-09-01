-- FIXED DEPARTURES
CREATE TABLE public.tour_departures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_slug text NOT NULL,
  tour_name text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  seats_total integer NOT NULL DEFAULT 12,
  seats_booked integer NOT NULL DEFAULT 0,
  price_usd integer NOT NULL DEFAULT 0,
  guide_name text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Open',
  published boolean NOT NULL DEFAULT true,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tour_departures TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tour_departures TO authenticated;
GRANT ALL ON public.tour_departures TO service_role;
ALTER TABLE public.tour_departures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published departures" ON public.tour_departures
  FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Staff manage departures" ON public.tour_departures
  FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER tour_departures_updated_at BEFORE UPDATE ON public.tour_departures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- GUIDE ROSTER
CREATE TABLE public.guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text,
  email text,
  languages text[] NOT NULL DEFAULT '{}',
  specialities text[] NOT NULL DEFAULT '{}',
  licence_no text,
  day_rate_usd integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guides TO authenticated;
GRANT ALL ON public.guides TO service_role;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage guides" ON public.guides
  FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER guides_updated_at BEFORE UPDATE ON public.guides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- GUEST REVIEWS
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  country text,
  tour_name text NOT NULL DEFAULT '',
  rating integer NOT NULL DEFAULT 5,
  quote text NOT NULL,
  photo_url text,
  approved boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view approved reviews" ON public.testimonials
  FOR SELECT TO anon, authenticated USING (approved = true);
CREATE POLICY "Visitors can submit reviews" ON public.testimonials
  FOR INSERT TO anon, authenticated
  WITH CHECK (length(trim(guest_name)) > 0 AND length(trim(quote)) > 0 AND rating BETWEEN 1 AND 5 AND approved = false AND featured = false);
CREATE POLICY "Staff manage reviews" ON public.testimonials
  FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER testimonials_updated_at BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();