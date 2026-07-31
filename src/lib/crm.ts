import { supabase } from "@/integrations/supabase/client";

export const STAGES = ["New", "Qualified", "Quoted", "Confirmed", "Travelled", "Lost"] as const;
export type Stage = (typeof STAGES)[number];

export const LIFECYCLES = ["Lead", "Engaged", "Customer", "Repeat", "Lost"] as const;
export const SOURCES = ["Website", "WhatsApp", "Referral", "Instagram", "Agent", "Walk-in", "Other"] as const;
export const ACTIVITY_KINDS = ["Note", "Call", "Email", "WhatsApp", "Meeting", "Stage"] as const;
export const PRIORITIES = ["Low", "Normal", "High"] as const;

export type Contact = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  source: string;
  tags: string[];
  lifecycle: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type Deal = {
  id: string;
  contact_id: string | null;
  inquiry_id: string | null;
  title: string;
  tour_name: string;
  stage: string;
  value_usd: number;
  travelers: number;
  travel_date: string | null;
  probability: number;
  coupon_code: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  contact_id: string | null;
  deal_id: string | null;
  title: string;
  due_on: string | null;
  priority: string;
  done: boolean;
  created_at: string;
};

export type Activity = {
  id: string;
  contact_id: string | null;
  deal_id: string | null;
  kind: string;
  body: string;
  created_at: string;
};

export type Inquiry = {
  id: string;
  guest_name: string;
  tour_name: string;
  travel_date: string | null;
  travelers: number;
  status: string;
  coupon_code: string | null;
  quoted_total: number | null;
  contact_id: string | null;
  deal_id: string | null;
  created_at: string;
};

const unwrap = <T,>(result: { data: T | null; error: { message: string } | null }): T => {
  if (result.error) throw new Error(result.error.message);
  return (result.data ?? []) as T;
};

/* ---------- contacts ---------- */
export const listContacts = async () =>
  unwrap<Contact[]>(await supabase.from("crm_contacts").select("*").order("created_at", { ascending: false }));

export const createContact = async (input: Partial<Contact> & { full_name: string }) =>
  unwrap<Contact[]>(await supabase.from("crm_contacts").insert(input).select())[0];

export const updateContact = async (id: string, patch: Partial<Contact>) => {
  const { error } = await supabase.from("crm_contacts").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
};

export const deleteContact = async (id: string) => {
  const { error } = await supabase.from("crm_contacts").delete().eq("id", id);
  if (error) throw new Error(error.message);
};

/* ---------- deals ---------- */
export const listDeals = async () =>
  unwrap<Deal[]>(await supabase.from("crm_deals").select("*").order("created_at", { ascending: false }));

export const createDeal = async (input: Partial<Deal> & { title: string }) =>
  unwrap<Deal[]>(await supabase.from("crm_deals").insert(input).select())[0];

export const updateDeal = async (id: string, patch: Partial<Deal>) => {
  const { error } = await supabase.from("crm_deals").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
};

export const deleteDeal = async (id: string) => {
  const { error } = await supabase.from("crm_deals").delete().eq("id", id);
  if (error) throw new Error(error.message);
};

/* ---------- tasks ---------- */
export const listTasks = async () =>
  unwrap<Task[]>(await supabase.from("crm_tasks").select("*").order("due_on", { ascending: true, nullsFirst: false }));

export const createTask = async (input: Partial<Task> & { title: string }) =>
  unwrap<Task[]>(await supabase.from("crm_tasks").insert(input).select())[0];

export const updateTask = async (id: string, patch: Partial<Task>) => {
  const { error } = await supabase.from("crm_tasks").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
};

export const deleteTask = async (id: string) => {
  const { error } = await supabase.from("crm_tasks").delete().eq("id", id);
  if (error) throw new Error(error.message);
};

/* ---------- activities ---------- */
export const listActivities = async (contactId?: string) => {
  let query = supabase.from("crm_activities").select("*").order("created_at", { ascending: false }).limit(200);
  if (contactId) query = query.eq("contact_id", contactId);
  return unwrap<Activity[]>(await query);
};

export const logActivity = async (input: Partial<Activity> & { body: string }) => {
  const { error } = await supabase.from("crm_activities").insert(input);
  if (error) throw new Error(error.message);
};

/* ---------- inquiries ---------- */
export const listInquiries = async () =>
  unwrap<Inquiry[]>(await supabase.from("travel_inquiries").select("*").order("created_at", { ascending: false }));

export const updateInquiry = async (id: string, patch: Partial<Inquiry>) => {
  const { error } = await supabase.from("travel_inquiries").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
};

/** Turn a website inquiry into a CRM contact + pipeline deal. */
export async function convertInquiry(inquiry: Inquiry) {
  const contact = await createContact({
    full_name: inquiry.guest_name,
    source: "Website",
    lifecycle: "Lead",
    tags: [inquiry.tour_name],
    notes: `Created from website inquiry on ${new Date(inquiry.created_at).toLocaleDateString()}`,
  });
  const deal = await createDeal({
    contact_id: contact.id,
    inquiry_id: inquiry.id,
    title: `${inquiry.guest_name} · ${inquiry.tour_name}`,
    tour_name: inquiry.tour_name,
    stage: inquiry.status === "Confirmed" ? "Confirmed" : inquiry.status === "Designing" ? "Quoted" : "New",
    value_usd: inquiry.quoted_total ?? 0,
    travelers: inquiry.travelers,
    travel_date: inquiry.travel_date,
    coupon_code: inquiry.coupon_code,
    probability: 30,
  });
  await updateInquiry(inquiry.id, { contact_id: contact.id, deal_id: deal.id });
  await logActivity({ contact_id: contact.id, deal_id: deal.id, kind: "Note", body: `Website inquiry converted into a deal for ${inquiry.tour_name}.` });
  return { contact, deal };
}

export const stageProbability = (stage: string) =>
  ({ New: 20, Qualified: 40, Quoted: 60, Confirmed: 100, Travelled: 100, Lost: 0 })[stage] ?? 20;
