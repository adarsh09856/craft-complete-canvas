DROP POLICY IF EXISTS "Anyone can create travel inquiries" ON public.travel_inquiries;
DROP POLICY IF EXISTS "Authenticated users can manage travel inquiries" ON public.travel_inquiries;

CREATE POLICY "Visitors can create valid travel inquiries"
ON public.travel_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(guest_name)) > 0
  AND length(trim(tour_name)) > 0
  AND travelers > 0
  AND status IN ('New', 'Designing', 'Confirmed')
);

CREATE POLICY "Authenticated users can view travel inquiries"
ON public.travel_inquiries
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update travel inquiries"
ON public.travel_inquiries
FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (
  auth.uid() IS NOT NULL
  AND length(trim(guest_name)) > 0
  AND length(trim(tour_name)) > 0
  AND travelers > 0
  AND status IN ('New', 'Designing', 'Confirmed')
);

CREATE POLICY "Authenticated users can delete travel inquiries"
ON public.travel_inquiries
FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);