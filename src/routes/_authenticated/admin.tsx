import { createFileRoute, Link } from "@tanstack/react-router";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, Building2, Camera, Edit3, Eye, ImagePlus, LayoutDashboard, LogOut, Mail, MapPin, Plus, Search, Settings, Sparkles, Tag, Trash2, Users, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { destinations as destinationData, experiences as experienceData, tours as tourData } from "@/lib/data";
import { addPanorama, getAllPanoramas, removePanorama, type GalleryPanorama } from "@/lib/gallery-store";
import { formatPrice, formatPriceFromBTN } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { saveSiteSettings, useSiteSettings } from "@/lib/site-store";
import { CouponsPanel } from "@/components/admin/CouponsPanel";
import { CrmContacts } from "@/components/admin/CrmContacts";
import { CrmPipeline } from "@/components/admin/CrmPipeline";
import { CrmTasks } from "@/components/admin/CrmTasks";
import { CrmReports } from "@/components/admin/CrmReports";
import { useSession, useStaff } from "@/lib/auth";

type AdminTour = {
  id: number;
  title: string;
  category: string;
  duration: string;
  price: number;
  status: "Published" | "Draft";
  image: string;
  views: number;
  bookings: number;
  panoramas: string[];
};

type Booking = {
  id: number;
  guest: string;
  email: string;
  phone: string;
  tour: string;
  date: string;
  travelers: number;
  amount: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  notes: string;
};

const nav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tours", label: "Tours", icon: MapPin },
  { id: "destinations", label: "Destinations", icon: Building2 },
  { id: "experiences", label: "Experiences", icon: Sparkles },
  { id: "gallery", label: "360° Gallery", icon: Camera },
  { id: "bookings", label: "Inquiries", icon: Mail },
  { id: "contacts", label: "CRM · Contacts", icon: Users },
  { id: "pipeline", label: "CRM · Pipeline", icon: BarChart3 },
  { id: "tasks", label: "CRM · Tasks", icon: CheckSquare },
  { id: "reports", label: "CRM · Reports", icon: BarChart3 },
  { id: "coupons", label: "Coupons", icon: Tag },
  { id: "settings", label: "Settings", icon: Settings },
];

const initialTours: AdminTour[] = tourData.map((tour, index) => ({ id: index + 1, title: tour.title, category: tour.category, duration: tour.duration, price: tour.price, status: index < 6 ? "Published" : "Draft", image: tour.image, views: 0, bookings: 0, panoramas: [tour.image] }));
const initialBookings: Booking[] = [];

export const Route = createFileRoute("/_authenticated/admin")({
  component: OperationsPage,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Golden Takin Holidays" },
      { name: "description", content: "Functional admin dashboard with tours, destinations, experiences, inquiries and settings panels." },
      { property: "og:title", content: "Golden Takin Holidays Admin Dashboard" },
      { property: "og:description", content: "Manage premium Bhutan tours end-to-end." },
    ],
  }),
});

function OperationsPage() {
  const { user, loading: sessionLoading } = useSession();
  const { isStaff, checking } = useStaff(user);
  const loggedIn = isStaff;
  const [active, setActive] = useState("dashboard");
  const [tours, setTours] = useState(initialTours);
  const [bookings, setBookings] = useState(initialBookings);
  const [query, setQuery] = useState("");
  const [editingTour, setEditingTour] = useState<AdminTour | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (!loggedIn) return;
    supabase.from("travel_inquiries").select("*").order("created_at", { ascending: false }).then(({ data, error }) => {
      if (error || !data) return;
      const live: Booking[] = data.map((row, i) => ({
        id: 900000 + i,
        guest: row.guest_name,
        email: "—",
        phone: "—",
        tour: row.tour_name,
        date: row.travel_date ?? "—",
        travelers: row.travelers,
        amount: (row.quoted_total ?? row.travelers * 4200) * 84,
        status: row.status === "Confirmed" ? "Confirmed" : row.status === "Designing" ? "Pending" : "Pending",
        notes: `Live inquiry · ${new Date(row.created_at).toLocaleString()}${row.coupon_code ? ` · coupon ${row.coupon_code}` : ""}`,
      }));
      setBookings((cur) => [...live, ...cur]);
    });
  }, [loggedIn]);

  const revenue = bookings.reduce((sum, booking) => sum + booking.amount, 0);
  const filteredTours = useMemo(() => tours.filter((tour) => `${tour.title} ${tour.category} ${tour.status}`.toLowerCase().includes(query.toLowerCase())), [query, tours]);
  const filteredBookings = useMemo(() => bookings.filter((booking) => `${booking.guest} ${booking.tour} ${booking.status}`.toLowerCase().includes(query.toLowerCase())), [bookings, query]);

  if (sessionLoading || checking) return <div className="grid min-h-screen place-items-center bg-ink text-hero-foreground">Checking your access…</div>;
  if (!isStaff) return <NoAccessPanel email={user?.email ?? ""} />;

  const saveTour = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const item: AdminTour = {
      id: editingTour?.id ?? Date.now(),
      title: String(form.get("title") || "Untitled Tour"),
      category: String(form.get("category") || "Culture Exchange"),
      duration: `${String(form.get("duration") || "7")} Days`,
      price: Number(form.get("price") || 2500),
      status: form.get("status") === "on" ? "Published" : "Draft",
      image: editingTour?.image ?? tourData[0].image,
      views: editingTour?.views ?? 0,
      bookings: editingTour?.bookings ?? 0,
      panoramas: editingTour?.panoramas ?? [tourData[0].image],
    };
    setTours((current) => editingTour ? current.map((tour) => tour.id === editingTour.id ? item : tour) : [item, ...current]);
    setEditingTour(null);
    toast.success("Tour saved", { description: `${item.title} is now in the tour list.` });
    event.currentTarget.reset();
  };

  return (
    <div className="min-h-screen bg-muted/35 pt-20">
      <div className="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-r border-border bg-card px-4 py-5 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)]">
          <div className="mb-5 rounded-xl bg-primary p-4 text-primary-foreground">
            <div className="text-xs uppercase tracking-[0.22em] text-primary-foreground/68">Admin</div>
            <div className="mt-1 text-xl font-bold">Golden Takin Panel</div>
          </div>
          <nav className="grid gap-1">
            {nav.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActive(id)} className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${active === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <Icon className="h-4 w-4" /> <span>{label}</span>
              </button>
            ))}
          </nav>
          <button onClick={async () => { await supabase.auth.signOut(); window.location.href = "/auth"; }} className="mt-5 grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl border border-border px-3 py-3 text-left text-sm font-semibold text-muted-foreground hover:bg-muted"><LogOut className="h-4 w-4" /> Logout</button>
        </aside>

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <header className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-[0.22em] text-cypress">Travel operations</div>
              <h1 className="mt-1 truncate text-3xl font-bold sm:text-4xl">{nav.find((item) => item.id === active)?.label}</h1>
            </div>
            <div className="hidden rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-card sm:block">Staff · {user?.email}</div>
          </header>

          {active === "dashboard" && <Dashboard tours={tours} bookings={bookings} revenue={revenue} onComplete={(id) => setBookings((current) => current.map((booking) => booking.id === id ? { ...booking, status: "Completed" } : booking))} />}
          {active === "tours" && <ToursPanel tours={filteredTours} query={query} setQuery={setQuery} saveTour={saveTour} editingTour={editingTour} setEditingTour={setEditingTour} deleteTour={(id) => { setTours((current) => current.filter((tour) => tour.id !== id)); toast.success("Tour deleted"); }} toggleTour={(id) => setTours((current) => current.map((tour) => tour.id === id ? { ...tour, status: tour.status === "Published" ? "Draft" : "Published" } : tour))} />}
          {active === "destinations" && <SimpleCrudPanel title="Destinations" rows={destinationData.map((item, index) => ({ id: index + 1, name: item.name, detail: item.desc, image: item.image }))} />}
          {active === "experiences" && <SimpleCrudPanel title="Experiences" rows={experienceData.map((item, index) => ({ id: index + 1, name: item.title, detail: item.desc, image: item.image }))} />}
          {active === "gallery" && <Gallery360Panel />}
          {active === "bookings" && <BookingsPanel bookings={filteredBookings} query={query} setQuery={setQuery} setBookings={setBookings} select={setSelectedBooking} />}
          {active === "contacts" && <CrmContacts />}
          {active === "pipeline" && <CrmPipeline />}
          {active === "tasks" && <CrmTasks />}
          {active === "reports" && <CrmReports />}
          {active === "coupons" && <CouponsPanel />}
          {active === "settings" && <SettingsPanel saved={settingsSaved} onSave={() => { setSettingsSaved(true); toast.success("Settings saved"); }} />}
        </main>
      </div>

      {selectedBooking && <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
    </div>
  );
}

function NoAccessPanel({ email }: { email: string }) {
  return (
    <section className="grid min-h-screen place-items-center bg-ink px-4 py-28 text-hero-foreground">
      <div className="w-full max-w-md rounded-[26px] border border-hero-foreground/12 bg-hero-foreground/[0.07] p-8 text-center shadow-deep backdrop-blur-2xl">
        <h1 className="font-display text-2xl font-bold">Staff access only</h1>
        <p className="mt-2 text-sm text-hero-foreground/65">
          {email ? `${email} is signed in but has no staff role yet.` : "Sign in with a staff account to open the CRM."} Ask an administrator to grant you access.
        </p>
        <div className="mt-6 grid gap-2">
          <Link to="/account" className="rounded-xl bg-gradient-gold px-5 py-3 text-sm font-bold text-primary-foreground shadow-gold">Go to my dashboard</Link>
          <button onClick={async () => { await supabase.auth.signOut(); window.location.href = "/auth"; }} className="rounded-xl border border-hero-foreground/16 px-5 py-3 text-sm font-semibold">Sign out</button>
        </div>
      </div>
    </section>
  );
}

function Dashboard({ tours, bookings, revenue, onComplete }: { tours: AdminTour[]; bookings: Booking[]; revenue: number; onComplete: (id: number) => void }) {
  const cards = [{ label: "Total tours", value: tours.length }, { label: "Bookings", value: bookings.length }, { label: "Website views", value: tours.reduce((sum, tour) => sum + tour.views, 0).toLocaleString() }, { label: "Revenue", value: formatPriceFromBTN(revenue) }];
  return <div className="grid gap-6"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map((card) => <MetricCard key={card.label} {...card} />)}</div><div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]"><DataTable title="Recent bookings" rows={bookings.slice(0, 4)} onComplete={onComplete} /><ChartPanel tours={tours.slice(0, 5)} /></div></div>;
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl border border-border bg-card p-5 shadow-card"><div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</div><div className="mt-3 text-3xl font-bold text-primary">{value}</div></div>;
}

function DataTable({ title, rows, onComplete }: { title: string; rows: Booking[]; onComplete: (id: number) => void }) {
  return <section className="rounded-xl border border-border bg-card p-4 shadow-card"><h2 className="mb-4 text-xl font-bold">{title}</h2><div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm"><thead className="bg-muted text-left text-xs uppercase tracking-[0.14em] text-muted-foreground"><tr><th className="p-3">Guest</th><th className="p-3">Tour</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3">Amount</th><th className="p-3">Action</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id} className="border-t border-border hover:bg-muted/50"><td className="p-3 font-semibold">{row.guest}</td><td className="p-3">{row.tour}</td><td className="p-3">{row.date}</td><td className="p-3">{row.status}</td><td className="p-3">{formatPriceFromBTN(row.amount)}</td><td className="p-3"><button onClick={() => onComplete(row.id)} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Complete</button></td></tr>)}</tbody></table></div></section>;
}

function ChartPanel({ tours }: { tours: AdminTour[] }) {
  const max = Math.max(...tours.map((tour) => tour.bookings));
  return <section className="rounded-xl border border-border bg-card p-5 shadow-card"><h2 className="mb-4 flex items-center gap-2 text-xl font-bold"><BarChart3 className="h-5 w-5 text-gold" /> Popular tours</h2><div className="grid gap-4">{tours.map((tour) => <div key={tour.id}><div className="mb-1 flex justify-between text-xs"><span className="truncate">{tour.title}</span><span>{tour.bookings}</span></div><div className="h-3 rounded-full bg-muted"><div className="h-full rounded-full bg-gradient-gold" style={{ width: `${(tour.bookings / max) * 100}%` }} /></div></div>)}</div></section>;
}

function ToursPanel(props: { tours: AdminTour[]; query: string; setQuery: (v: string) => void; saveTour: (event: FormEvent<HTMLFormElement>) => void; editingTour: AdminTour | null; setEditingTour: (tour: AdminTour | null) => void; deleteTour: (id: number) => void; toggleTour: (id: number) => void }) {
  return <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]"><form onSubmit={props.saveTour} className="h-fit rounded-xl border border-border bg-card p-5 shadow-card xl:sticky xl:top-24"><div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><h2 className="text-xl font-bold">{props.editingTour ? "Edit tour" : "Create tour"}</h2><ImagePlus className="h-5 w-5 text-gold" /></div><div className="grid gap-3"><input name="title" defaultValue={props.editingTour?.title} required placeholder="Tour title" className="rounded-lg border border-border bg-input px-4 py-3 text-sm outline-none" /><input name="category" defaultValue={props.editingTour?.category} placeholder="Category" className="rounded-lg border border-border bg-input px-4 py-3 text-sm outline-none" /><div className="grid grid-cols-2 gap-3"><input name="duration" defaultValue={props.editingTour?.duration.replace(/\D/g, "")} type="number" min="1" placeholder="Days" className="min-w-0 rounded-lg border border-border bg-input px-4 py-3 text-sm outline-none" /><input name="price" defaultValue={props.editingTour?.price} type="number" min="1" placeholder="Price" className="min-w-0 rounded-lg border border-border bg-input px-4 py-3 text-sm outline-none" /></div><textarea placeholder="Itinerary day-by-day details" className="min-h-28 resize-none rounded-lg border border-border bg-input px-4 py-3 text-sm outline-none" /><div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">Upload images and 360° panoramas preview</div><label className="flex items-center gap-2 text-sm"><input name="status" type="checkbox" defaultChecked={props.editingTour?.status !== "Draft"} /> Published</label><div className="grid grid-cols-2 gap-2"><button className="rounded-lg bg-gradient-gold px-4 py-3 text-sm font-semibold text-primary-foreground">Save tour</button><button type="button" onClick={() => props.setEditingTour(null)} className="rounded-lg border border-border px-4 py-3 text-sm font-semibold">Cancel</button></div></div></form><section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-card"><Toolbar query={props.query} setQuery={props.setQuery} placeholder="Search tours" /><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-sm"><thead className="bg-muted text-left text-xs uppercase tracking-[0.14em] text-muted-foreground"><tr><th className="p-3">Tour</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Status</th><th className="p-3">Views</th><th className="p-3">Bookings</th><th className="p-3">Actions</th></tr></thead><tbody>{props.tours.map((tour) => <tr key={tour.id} className="border-t border-border hover:bg-muted/50"><td className="p-3"><div className="flex items-center gap-3"><img src={tour.image} alt="" className="h-12 w-16 rounded-lg object-cover" /><span className="font-semibold">{tour.title}</span></div></td><td className="p-3">{tour.category}</td><td className="p-3">{formatPrice(tour.price)}</td><td className="p-3"><button onClick={() => props.toggleTour(tour.id)} className="rounded-full bg-muted px-3 py-1 text-xs">{tour.status}</button></td><td className="p-3">{tour.views}</td><td className="p-3">{tour.bookings}</td><td className="p-3"><div className="flex gap-2"><Link to="/tours/$slug" params={{ slug: tourData.find((item) => item.title === tour.title)?.slug ?? "tigers-nest-pilgrimage" }} className="grid h-9 w-9 place-items-center rounded-lg border border-border"><Eye className="h-4 w-4" /></Link><button onClick={() => props.setEditingTour(tour)} className="grid h-9 w-9 place-items-center rounded-lg border border-border text-cypress"><Edit3 className="h-4 w-4" /></button><button onClick={() => props.deleteTour(tour.id)} className="grid h-9 w-9 place-items-center rounded-lg border border-border text-crimson"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div></section></div>;
}

function Toolbar({ query, setQuery, placeholder }: { query: string; setQuery: (v: string) => void; placeholder: string }) {
  return <label className="mb-4 grid max-w-md grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-xl border border-border bg-input px-3 py-2.5"><Search className="h-4 w-4 text-cypress" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} className="min-w-0 bg-transparent text-sm outline-none" /></label>;
}

function SimpleCrudPanel({ title, rows }: { title: string; rows: { id: number; name: string; detail: string; image: string }[] }) {
  const [items, setItems] = useState(rows);
  const [name, setName] = useState("");
  return <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]"><form onSubmit={(event) => { event.preventDefault(); if (!name.trim()) return; setItems((current) => [{ id: Date.now(), name, detail: "New managed item", image: rows[0].image }, ...current]); setName(""); toast.success(`${title} item saved`); }} className="h-fit rounded-xl border border-border bg-card p-5 shadow-card"><h2 className="mb-4 text-xl font-bold">Create / Edit {title}</h2><div className="grid gap-3"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" className="rounded-lg border border-border bg-input px-4 py-3 text-sm outline-none" /><textarea placeholder="Description" className="min-h-28 rounded-lg border border-border bg-input px-4 py-3 text-sm outline-none" /><div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">Image + 360° gallery upload</div><button className="rounded-lg bg-gradient-gold px-4 py-3 text-sm font-semibold text-primary-foreground">Save</button></div></form><section className="rounded-xl border border-border bg-card p-4 shadow-card"><div className="grid gap-3">{items.map((item) => <article key={item.id} className="grid gap-4 rounded-xl border border-border p-3 sm:grid-cols-[120px_minmax(0,1fr)_auto]"><img src={item.image} alt={item.name} className="h-24 w-full rounded-lg object-cover sm:w-[120px]" /><div className="min-w-0"><h3 className="font-bold">{item.name}</h3><p className="mt-1 text-sm text-muted-foreground">{item.detail}</p></div><div className="grid grid-cols-3 gap-2 sm:grid-cols-1"><button className="grid h-10 place-items-center rounded-lg border border-border"><Eye className="h-4 w-4" /></button><button className="grid h-10 place-items-center rounded-lg border border-border text-cypress"><Edit3 className="h-4 w-4" /></button><button onClick={() => setItems((current) => current.filter((existing) => existing.id !== item.id))} className="grid h-10 place-items-center rounded-lg border border-border text-crimson"><Trash2 className="h-4 w-4" /></button></div></article>)}</div></section></div>;
}

function BookingsPanel({ bookings, query, setQuery, setBookings, select }: { bookings: Booking[]; query: string; setQuery: (v: string) => void; setBookings: Dispatch<SetStateAction<Booking[]>>; select: (booking: Booking) => void }) {
  const setStatus = (id: number, status: Booking["status"]) => setBookings((current) => current.map((booking) => booking.id === id ? { ...booking, status } : booking));
  return <section className="rounded-xl border border-border bg-card p-4 shadow-card"><Toolbar query={query} setQuery={setQuery} placeholder="Search bookings" /><div className="overflow-x-auto"><table className="w-full min-w-[860px] text-sm"><thead className="bg-muted text-left text-xs uppercase tracking-[0.14em] text-muted-foreground"><tr><th className="p-3">Guest</th><th className="p-3">Tour</th><th className="p-3">Date</th><th className="p-3">Group</th><th className="p-3">Status</th><th className="p-3">Amount</th><th className="p-3">Actions</th></tr></thead><tbody>{bookings.map((booking) => <tr key={booking.id} className="border-t border-border hover:bg-muted/50"><td className="p-3 font-semibold">{booking.guest}</td><td className="p-3">{booking.tour}</td><td className="p-3">{booking.date}</td><td className="p-3">{booking.travelers}</td><td className="p-3">{booking.status}</td><td className="p-3">{formatPriceFromBTN(booking.amount)}</td><td className="p-3"><div className="flex gap-2"><button onClick={() => select(booking)} className="rounded-lg border border-border px-3 py-2 text-xs">View</button><button onClick={() => setStatus(booking.id, "Confirmed")} className="rounded-lg bg-primary px-3 py-2 text-xs text-primary-foreground">Confirm</button><button onClick={() => setStatus(booking.id, "Cancelled")} className="rounded-lg border border-border px-3 py-2 text-xs text-crimson">Cancel</button></div></td></tr>)}</tbody></table></div></section>;
}

function BookingModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  return <div className="fixed inset-0 z-[80] grid place-items-center bg-ink/70 p-4 backdrop-blur"><div className="w-full max-w-2xl rounded-2xl bg-card p-6 shadow-deep"><div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center"><h2 className="text-2xl font-bold">Booking details</h2><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-lg border border-border">×</button></div><div className="grid gap-4 sm:grid-cols-2">{Object.entries(booking).map(([key, value]) => <div key={key} className="rounded-lg bg-muted p-3"><div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{key}</div><div className="mt-1 font-semibold">{String(value)}</div></div>)}</div><textarea placeholder="Internal notes" className="mt-4 min-h-28 w-full rounded-lg border border-border bg-input p-3 outline-none" /><button onClick={() => toast.success("Reply email prepared")} className="mt-4 rounded-lg bg-gradient-gold px-5 py-3 font-semibold text-primary-foreground">Send email reply</button></div></div>;
}

function SettingsPanel({ saved, onSave }: { saved: boolean; onSave: () => void }) {
  const settings = useSiteSettings();
  const [form, setForm] = useState(settings);
  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    saveSiteSettings(form);
    onSave();
  };

  return (
    <form onSubmit={submit} className="grid gap-6 xl:grid-cols-2">
      <section className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-1 text-xl font-bold">Booking channel</h2>
        <p className="mb-4 text-xs text-muted-foreground">Choose how the "Confirm booking" button behaves site-wide. WhatsApp opens a pre-filled chat to your number. Payment gateway can be added later.</p>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-2">
            {(["whatsapp", "form"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => update("bookingMode", mode)}
                className={`rounded-xl border-2 p-3 text-left text-sm font-semibold transition ${form.bookingMode === mode ? "border-saffron bg-saffron/10" : "border-border hover:bg-muted"}`}
              >
                <div className="capitalize">{mode === "form" ? "Form only" : "WhatsApp"}</div>
                <div className="mt-1 text-[11px] font-normal text-muted-foreground">
                  {mode === "whatsapp" ? "Opens WhatsApp with booking summary" : "Saves inquiry, specialist emails back"}
                </div>
              </button>
            ))}
          </div>
          <label className="grid gap-1 text-xs font-semibold text-muted-foreground">
            WhatsApp number (with country code, digits only)
            <input value={form.whatsappNumber} onChange={(e) => update("whatsappNumber", e.target.value.replace(/\D/g, ""))} placeholder="97517123456" className="rounded-lg border border-border bg-input px-4 py-3 text-sm font-medium text-foreground outline-none" />
          </label>
          <div className="rounded-lg bg-muted p-3 text-[11px] text-muted-foreground">
            Payment gateway integration (Stripe / Razorpay / bKash) can be enabled later. Ask your operator to switch this to <b>Form only</b> when the gateway is live.
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-4 text-xl font-bold">Company & support</h2>
        <div className="grid gap-3">
          <LabeledInput label="Company name" value={form.companyName} onChange={(v) => update("companyName", v)} />
          <LabeledInput label="Support email" value={form.supportEmail} onChange={(v) => update("supportEmail", v)} />
          <LabeledInput label="Support phone" value={form.supportPhone} onChange={(v) => update("supportPhone", v)} />
          <LabeledInput label="Site announcement" value={form.announcement} onChange={(v) => update("announcement", v)} />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-card xl:col-span-2">
        <h2 className="mb-1 text-xl font-bold">Homepage hero</h2>
        <p className="mb-4 text-xs text-muted-foreground">Controls the giant title and lead paragraph on the home page.</p>
        <div className="grid gap-3">
          <LabeledInput label="Hero title" value={form.heroTitle} onChange={(v) => update("heroTitle", v)} />
          <label className="grid gap-1 text-xs font-semibold text-muted-foreground">
            Hero subtitle
            <textarea value={form.heroSubtitle} onChange={(e) => update("heroSubtitle", e.target.value)} rows={3} className="rounded-lg border border-border bg-input px-4 py-3 text-sm font-medium text-foreground outline-none" />
          </label>
        </div>
      </section>

      <button className="rounded-xl bg-gradient-gold px-5 py-3 font-semibold text-primary-foreground xl:col-span-2">{saved ? "Saved ✓  ·  Save again" : "Save all settings"}</button>
    </form>
  );
}

function LabeledInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-semibold text-muted-foreground">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} className="rounded-lg border border-border bg-input px-4 py-3 text-sm font-medium text-foreground outline-none" />
    </label>
  );
}
function Gallery360Panel() {
  const [slug, setSlug] = useState(tourData[0]?.slug ?? "");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [note, setNote] = useState("");
  const [version, setVersion] = useState(0);
  const all = useMemo(() => getAllPanoramas(), [version]);
  const list: GalleryPanorama[] = all[slug] ?? [];
  const activeTour = tourData.find((t) => t.slug === slug);

  useEffect(() => {
    const seed = tourData[0]?.slug;
    if (seed && Object.keys(getAllPanoramas()).length === 0) {
      addPanorama(seed, { title: "Sample 360 View", image: tourData[0].image, note: "Auto-generated sample panorama. Replace with your own equirectangular image URL." });
      setVersion((v) => v + 1);
    }
  }, []);

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!image.trim() || !title.trim()) { toast.error("Title and image URL required"); return; }
    addPanorama(slug, { title: title.trim(), image: image.trim(), note: note.trim() || undefined });
    setTitle(""); setImage(""); setNote("");
    setVersion((v) => v + 1);
    toast.success("360° panorama added", { description: "Live on the tour detail page now." });
  };

  const remove = (index: number) => {
    removePanorama(slug, index);
    setVersion((v) => v + 1);
    toast.success("Panorama removed");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[460px_minmax(0,1fr)]">
      <form onSubmit={save} className="h-fit rounded-2xl border border-border bg-card p-5 shadow-card xl:sticky xl:top-24">
        <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div>
            <div className="eyebrow text-saffron">Manage 360° gallery</div>
            <h2 className="mt-1 text-xl font-bold">Add a panorama</h2>
          </div>
          <Camera className="h-6 w-6 text-saffron" />
        </div>
        <div className="grid gap-3">
          <label className="grid gap-1 text-xs font-semibold text-muted-foreground">
            Target tour
            <select value={slug} onChange={(e) => setSlug(e.target.value)} className="rounded-lg border border-border bg-input px-3 py-3 text-sm font-medium text-foreground outline-none">
              {tourData.map((t) => <option key={t.slug} value={t.slug}>{t.title}</option>)}
            </select>
          </label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="View title (e.g. Dzong courtyard)" className="rounded-lg border border-border bg-input px-4 py-3 text-sm outline-none focus:border-saffron" />
          <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL (equirectangular preferred)" className="rounded-lg border border-border bg-input px-4 py-3 text-sm outline-none focus:border-saffron" />
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional caption / note" className="min-h-24 resize-none rounded-lg border border-border bg-input px-4 py-3 text-sm outline-none focus:border-saffron" />
          {image && <img src={image} alt="Preview" className="h-32 w-full rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-gold px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:shadow-gold"><Plus className="h-4 w-4" /> Add panorama</button>
          {activeTour && <Link to="/tours/$slug" params={{ slug }} className="text-center text-xs font-semibold text-saffron underline">Open tour page →</Link>}
        </div>
      </form>

      <section className="min-w-0 rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div>
            <h2 className="text-xl font-bold">{activeTour?.title ?? "Tour"} · {list.length} panorama{list.length === 1 ? "" : "s"}</h2>
            <p className="text-xs text-muted-foreground">Drag-rotate, zoom, fullscreen and share are enabled by default for all viewers.</p>
          </div>
          <span className="chip border-saffron text-saffron">Live</span>
        </div>
        {list.length === 0 ? (
          <div className="grid place-items-center rounded-xl border border-dashed border-border bg-muted/40 p-10 text-center">
            <Camera className="h-8 w-8 text-saffron" />
            <p className="mt-3 text-sm font-semibold">No panoramas yet</p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">Add equirectangular 360° photos by URL. They will appear in the 360° viewer on the tour detail page in priority order.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {list.map((p, i) => (
              <article key={`${p.image}-${i}`} className="overflow-hidden rounded-xl border border-border bg-background shadow-card">
                <div className="relative aspect-[16/9]">
                  <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                  <span className="chip absolute left-3 top-3 bg-card/90">#{i + 1}</span>
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">{p.title}</div>
                    {p.note && <div className="line-clamp-1 text-xs text-muted-foreground">{p.note}</div>}
                  </div>
                  <button onClick={() => remove(i)} className="grid h-9 w-9 place-items-center rounded-lg border border-border text-crimson hover:bg-muted" aria-label="Remove panorama"><Trash2 className="h-4 w-4" /></button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
