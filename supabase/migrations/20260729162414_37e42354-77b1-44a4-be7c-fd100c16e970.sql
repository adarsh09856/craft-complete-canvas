CREATE TABLE public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL DEFAULT '',
  discount_percent integer NOT NULL DEFAULT 0,
  discount_flat integer NOT NULL DEFAULT 0,
  min_travelers integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true,
  expires_on date,
  times_used integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.coupons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coupons TO authenticated;
GRANT ALL ON public.coupons TO service_role;

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coupons" ON public.coupons
  FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Authenticated users can insert coupons" ON public.coupons
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL AND length(trim(code)) > 0);
CREATE POLICY "Authenticated users can update coupons" ON public.coupons
  FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete coupons" ON public.coupons
  FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.travel_inquiries
  ADD COLUMN IF NOT EXISTS coupon_code text,
  ADD COLUMN IF NOT EXISTS quoted_total integer;

INSERT INTO public.coupons (code, label, discount_percent, discount_flat, min_travelers, active, expires_on) VALUES
  ('GTH10', 'Welcome offer — 10% off any package', 10, 0, 1, true, '2026-12-31'),
  ('FAMILY15', 'Family & group saver — 15% off for 4+ travellers', 15, 0, 4, true, '2026-12-31'),
  ('HONEY100', 'Honeymoon bonus — USD 100 off', 0, 100, 2, true, '2026-12-31');