CREATE TABLE public.travel_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  tour_name text NOT NULL,
  travel_date text,
  travelers integer NOT NULL DEFAULT 1 CHECK (travelers > 0),
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Designing', 'Confirmed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.travel_inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.travel_inquiries TO authenticated;
GRANT ALL ON public.travel_inquiries TO service_role;

ALTER TABLE public.travel_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create travel inquiries"
ON public.travel_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage travel inquiries"
ON public.travel_inquiries
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_travel_inquiries_updated_at
BEFORE UPDATE ON public.travel_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();