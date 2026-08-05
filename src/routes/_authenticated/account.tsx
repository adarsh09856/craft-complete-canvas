import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { CalendarDays, LogOut, Plus, Save, Sparkles, Trash2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getProfile, saveProfile, useSession, useStaff, type Profile } from "@/lib/auth";
import { tours } from "@/lib/data";

type MyInquiry = {
  id: string;
  tour_name: string;
  travel_date: string | null;
  travelers: number;
  status: string;
  quoted_total: number | null;
  coupon_code: string | null;
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/account")({
  component: AccountPage,
  head: () => ({
    meta: [
      { title: "My trips — Golden Takin Holidays" },
      { name: "description", content: "Manage your Bhutan trip requests, travel dates, traveller counts and profile details." },
      { property: "og:title", content: "My trips — Golden Takin Holidays" },
      { property: "og:description", content: "Your private Golden Takin Holidays travel dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const STATUS = ["New", "Designing", "Confirmed"] as const;

function AccountPage() {
  const navigate = useNavigate();
  const { user } = useSession();
  const { isStaff } = useStaff(user);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [rows, setRows] = useState<MyInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ tour_name: tours[0]?.title ?? "", travel_date: "", travelers: "2" });
  const [editing, setEditing] = useState<MyInquiry | null>(null);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const [{ data, error }, prof] = await Promise.all([
      supabase.from("travel_inquiries").select("id,tour_name,travel_date,travelers,status,quoted_total,coupon_code,created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
      getProfile(user.id).catch(() => null),
    ]);
    if (error) toast.error("Could not load your trips", { description: error.message });
    setRows((data ?? []) as MyInquiry[]);
    setProfile(prof ?? { id: user.id, full_name: "", phone: null, country: null, created_at: "", updated_at: "" });
    setLoading(false);
  };

  useEffect(() => { void load(); }, [user?.id]);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    const payload = {
      guest_name: profile?.full_name?.trim() || user.email || "Guest",
      tour_name: form.tour_name,
      travel_date: form.travel_date || null,
      travelers: Math.max(1, Number(form.travelers) || 1),
      status: "New",
      user_id: user.id,
    };
    const { error } = await supabase.from("travel_inquiries").insert(payload);
    if (error) { toast.error("Request not saved", { description: error.message }); return; }
    toast.success("Trip request sent", { description: "A specialist replies within 2 hours." });
    setForm({ ...form, travel_date: "" });
    void load();
  };

  const saveEdit = async (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    const { error } = await supabase
      .from("travel_inquiries")
      .update({ tour_name: editing.tour_name, travel_date: editing.travel_date, travelers: Math.max(1, editing.travelers), status: editing.status })
      .eq("id", editing.id);
    if (error) { toast.error("Update failed", { description: error.message }); return; }
    toast.success("Trip request updated");
    setEditing(null);
    void load();
  };

  const remove = async (id: string) => {
    if (!confirm("Withdraw this trip request?")) return;
    const { error } = await supabase.from("travel_inquiries").delete().eq("id", id);
    if (error) { toast.error("Could not withdraw", { description: error.message }); return; }
    toast.success("Request withdrawn");
    void load();
  };

  const persistProfile = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || !profile) return;
    try {
      await saveProfile(user.id, { full_name: profile.full_name, phone: profile.phone, country: profile.country });
      toast.success("Profile saved");
    } catch (error) {
      toast.error("Profile not saved", { description: (error as Error).message });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    await navigate({ to: "/auth", replace: true });
  };

  const stats = useMemo(() => ({
    total: rows.length,
    confirmed: rows.filter((row) => row.status === "Confirmed").length,
    designing: rows.filter((row) => row.status === "Designing").length,
  }), [rows]);

  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-24">
      <div className="mx-auto grid max-w-[1300px] gap-6 px-4 sm:px-6">
        <header className="overflow-hidden rounded-[26px] border border-border bg-ink p-6 text-hero-foreground shadow-deep sm:p-8">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.3em] text-gold">Guest dashboard</div>
              <h1 className="mt-2 truncate font-display text-3xl font-extrabold sm:text-4xl">
                {profile?.full_name?.trim() || user?.email}
              </h1>
              <p className="mt-2 text-sm text-hero-foreground/68">Manage every Bhutan trip request in one place.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {isStaff && (
                <Link to="/admin" className="inline-flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/12 px-4 py-2.5 text-sm font-bold text-gold">
                  <Sparkles className="h-4 w-4" /> Staff CRM
                </Link>
              )}
              <button onClick={signOut} className="inline-flex items-center gap-2 rounded-xl border border-hero-foreground/16 px-4 py-2.5 text-sm font-semibold text-hero-foreground/80 hover:bg-hero-foreground/10">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[{ label: "Trip requests", value: stats.total }, { label: "Being designed", value: stats.designing }, { label: "Confirmed", value: stats.confirmed }].map((card) => (
              <div key={card.label} className="rounded-xl border border-hero-foreground/12 bg-hero-foreground/[0.06] p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-hero-foreground/55">{card.label}</div>
                <div className="mt-1.5 text-2xl font-bold text-gold">{card.value}</div>
              </div>
            ))}
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 rounded-[22px] border border-border bg-card p-5 shadow-card">
            <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <h2 className="font-display text-xl font-bold">My trip requests</h2>
              <span className="text-xs font-semibold text-muted-foreground">{rows.length} total</span>
            </div>

            <form onSubmit={create} className="mb-5 grid gap-3 rounded-xl border border-dashed border-border bg-muted/40 p-4 sm:grid-cols-[minmax(0,1.4fr)_auto_auto_auto]">
              <select value={form.tour_name} onChange={(e) => setForm({ ...form, tour_name: e.target.value })} className="min-w-0 rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-gold">
                {tours.map((tour) => <option key={tour.slug} value={tour.title}>{tour.title}</option>)}
              </select>
              <input type="date" value={form.travel_date} onChange={(e) => setForm({ ...form, travel_date: e.target.value })} className="rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-gold" />
              <input type="number" min="1" value={form.travelers} onChange={(e) => setForm({ ...form, travelers: e.target.value })} className="w-24 rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-gold" />
              <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-gold px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-gold">
                <Plus className="h-4 w-4" /> Request
              </button>
            </form>

            {loading ? (
              <p className="py-10 text-center text-sm text-muted-foreground">Loading your trips…</p>
            ) : rows.length === 0 ? (
              <div className="grid gap-3 rounded-xl border border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">No trip requests yet.</p>
                <Link to="/tours" className="mx-auto rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">Browse the 15 packages</Link>
              </div>
            ) : (
              <div className="grid gap-3">
                {rows.map((row) => (
                  <article key={row.id} className="grid gap-3 rounded-xl border border-border p-4 transition hover:shadow-card sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <div className="min-w-0">
                      <p className="truncate font-bold">{row.tour_name}</p>
                      <p className="mt-1 grid grid-flow-col items-center justify-start gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{row.travel_date ?? "Flexible"}</span>
                        <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{row.travelers} pax</span>
                      </p>
                      {row.quoted_total ? <p className="mt-1 text-xs font-semibold text-cypress">Quote: USD {row.quoted_total.toLocaleString()}{row.coupon_code ? ` · ${row.coupon_code}` : ""}</p> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${row.status === "Confirmed" ? "bg-cypress/15 text-cypress" : row.status === "Designing" ? "bg-saffron/15 text-saffron" : "bg-muted text-muted-foreground"}`}>{row.status}</span>
                      <button onClick={() => setEditing(row)} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted">Edit</button>
                      <button onClick={() => remove(row.id)} aria-label="Withdraw request" className="grid h-9 w-9 place-items-center rounded-lg border border-border text-crimson hover:bg-muted"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <form onSubmit={persistProfile} className="h-fit rounded-[22px] border border-border bg-card p-5 shadow-card">
            <h2 className="mb-4 font-display text-xl font-bold">My profile</h2>
            <div className="grid gap-3">
              <LabeledInput label="Full name" value={profile?.full_name ?? ""} onChange={(v) => setProfile((p) => p && { ...p, full_name: v })} />
              <LabeledInput label="Phone / WhatsApp" value={profile?.phone ?? ""} onChange={(v) => setProfile((p) => p && { ...p, phone: v })} />
              <LabeledInput label="Country" value={profile?.country ?? ""} onChange={(v) => setProfile((p) => p && { ...p, country: v })} />
              <div className="rounded-lg bg-muted p-3 text-[11px] text-muted-foreground">Signed in as {user?.email}</div>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">
                <Save className="h-4 w-4" /> Save profile
              </button>
            </div>
          </form>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-ink/70 p-4 backdrop-blur">
          <form onSubmit={saveEdit} className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-deep">
            <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center">
              <h2 className="font-display text-xl font-bold">Edit trip request</h2>
              <button type="button" onClick={() => setEditing(null)} className="grid h-9 w-9 place-items-center rounded-lg border border-border">×</button>
            </div>
            <div className="grid gap-3">
              <select value={editing.tour_name} onChange={(e) => setEditing({ ...editing, tour_name: e.target.value })} className="rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none">
                {[editing.tour_name, ...tours.map((t) => t.title)].filter((v, i, a) => a.indexOf(v) === i).map((title) => <option key={title} value={title}>{title}</option>)}
              </select>
              <input type="date" value={editing.travel_date ?? ""} onChange={(e) => setEditing({ ...editing, travel_date: e.target.value || null })} className="rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none" />
              <input type="number" min="1" value={editing.travelers} onChange={(e) => setEditing({ ...editing, travelers: Number(e.target.value) })} className="rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none" />
              <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none">
                {STATUS.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <button className="rounded-xl bg-gradient-gold px-4 py-3 text-sm font-bold text-primary-foreground shadow-gold">Save changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function LabeledInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} className="rounded-lg border border-border bg-input px-4 py-3 text-sm font-medium normal-case tracking-normal text-foreground outline-none focus:border-gold" />
    </label>
  );
}
