import { supabase } from "@/integrations/supabase/client";

export type Departure = {
  id: string;
  tour_slug: string;
  tour_name: string;
  start_date: string;
  end_date: string | null;
  seats_total: number;
  seats_booked: number;
  price_usd: number;
  guide_name: string;
  status: string;
  published: boolean;
  notes: string;
  created_at: string;
};

export type Guide = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  languages: string[];
  specialities: string[];
  licence_no: string | null;
  day_rate_usd: number;
  active: boolean;
  notes: string;
  created_at: string;
};

export type Testimonial = {
  id: string;
  guest_name: string;
  country: string | null;
  tour_name: string;
  rating: number;
  quote: string;
  photo_url: string | null;
  approved: boolean;
  featured: boolean;
  created_at: string;
};

export const DEPARTURE_STATUSES = ["Open", "Filling fast", "Guaranteed", "Full", "Cancelled"] as const;

const fail = (message?: string) => {
  throw new Error(message ?? "Something went wrong");
};

/* ---------------- departures ---------------- */

export const listDepartures = async () => {
  const { data, error } = await supabase.from("tour_departures").select("*").order("start_date", { ascending: true });
  if (error) fail(error.message);
  return (data ?? []) as Departure[];
};

/** Public: upcoming, published departures only. */
export const listUpcomingDepartures = async (limit = 6) => {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("tour_departures")
    .select("*")
    .eq("published", true)
    .gte("start_date", today)
    .neq("status", "Cancelled")
    .order("start_date", { ascending: true })
    .limit(limit);
  if (error) return [] as Departure[];
  return (data ?? []) as Departure[];
};

export const createDeparture = async (patch: Partial<Departure>) => {
  const { error } = await supabase.from("tour_departures").insert(patch as never);
  if (error) fail(error.message);
};

export const updateDeparture = async (id: string, patch: Partial<Departure>) => {
  const { error } = await supabase.from("tour_departures").update(patch as never).eq("id", id);
  if (error) fail(error.message);
};

export const deleteDeparture = async (id: string) => {
  const { error } = await supabase.from("tour_departures").delete().eq("id", id);
  if (error) fail(error.message);
};

/* ---------------- guides ---------------- */

export const listGuides = async () => {
  const { data, error } = await supabase.from("guides").select("*").order("full_name", { ascending: true });
  if (error) fail(error.message);
  return (data ?? []) as Guide[];
};

export const createGuide = async (patch: Partial<Guide>) => {
  const { error } = await supabase.from("guides").insert(patch as never);
  if (error) fail(error.message);
};

export const updateGuide = async (id: string, patch: Partial<Guide>) => {
  const { error } = await supabase.from("guides").update(patch as never).eq("id", id);
  if (error) fail(error.message);
};

export const deleteGuide = async (id: string) => {
  const { error } = await supabase.from("guides").delete().eq("id", id);
  if (error) fail(error.message);
};

/* ---------------- reviews ---------------- */

export const listAllTestimonials = async () => {
  const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
  if (error) fail(error.message);
  return (data ?? []) as Testimonial[];
};

/** Public: approved reviews for the website. */
export const listApprovedTestimonials = async (limit = 6) => {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("approved", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [] as Testimonial[];
  return (data ?? []) as Testimonial[];
};

export const submitTestimonial = async (patch: {
  guest_name: string;
  country?: string | null;
  tour_name?: string;
  rating: number;
  quote: string;
}) => {
  const { error } = await supabase.from("testimonials").insert({ ...patch, approved: false, featured: false } as never);
  if (error) fail(error.message);
};

export const createTestimonial = async (patch: Partial<Testimonial>) => {
  const { error } = await supabase.from("testimonials").insert(patch as never);
  if (error) fail(error.message);
};

export const updateTestimonial = async (id: string, patch: Partial<Testimonial>) => {
  const { error } = await supabase.from("testimonials").update(patch as never).eq("id", id);
  if (error) fail(error.message);
};

export const deleteTestimonial = async (id: string) => {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) fail(error.message);
};

export const seatsLeft = (departure: Departure) => Math.max(0, departure.seats_total - departure.seats_booked);
