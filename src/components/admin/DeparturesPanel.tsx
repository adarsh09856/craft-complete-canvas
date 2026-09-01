import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { CalendarDays, Eye, EyeOff, Plus, Trash2, Users } from "lucide-react";
import { tours } from "@/lib/data";
import {
  DEPARTURE_STATUSES,
  createDeparture,
  deleteDeparture,
  listDepartures,
  listGuides,
  seatsLeft,
  updateDeparture,
  type Departure,
  type Guide,
} from "@/lib/tourism";
import { Field, Select } from "./crm-ui";

const empty = { tour_slug: tours[0]?.slug ?? "", start_date: "", end_date: "", seats_total: "12", price_usd: "", guide_name: "", status: "Open", notes: "" };

export function DeparturesPanel() {
  const [rows, setRows] = useState<Departure[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);

  const load = async () => {
    setLoading(true);
    try {
      const [departures, guideRows] = await Promise.all([listDepartures(), listGuides().catch(() => [])]);
      setRows(departures);
      setGuides(guideRows as Guide[]);
    } catch (error) {
      toast.error("Could not load departures", { description: (error as Error).message });
    }
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const tour = tours.find((item) => item.slug === form.tour_slug);
    if (!tour || !form.start_date) { toast.error("Pick a package and a start date"); return; }
    try {
      await createDeparture({
        tour_slug: tour.slug,
        tour_name: tour.title,
        start_date: form.start_date,
        end_date: form.end_date || null,
        seats_total: Number(form.seats_total || 12),
        price_usd: Number(form.price_usd || tour.price || 0),
        guide_name: form.guide_name,
        status: form.status,
        notes: form.notes,
      });
      toast.success("Departure scheduled");
      setForm({ ...empty, tour_slug: form.tour_slug });
      void load();
    } catch (error) {
      toast.error("Departure not saved", { description: (error as Error).message });
    }
  };

  const stats = useMemo(() => {
    const open = rows.filter((row) => row.status !== "Cancelled" && seatsLeft(row) > 0);
    return {
      total: rows.length,
      seats: open.reduce((sum, row) => sum + seatsLeft(row), 0),
      booked: rows.reduce((sum, row) => sum + row.seats_booked, 0),
    };
  }, [rows]);

  return (
    <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
      <form onSubmit={submit} className="h-fit rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-4 font-display text-xl font-bold">Schedule a departure</h2>
        <div className="grid gap-3">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Package</span>
            <select value={form.tour_slug} onChange={(e) => setForm({ ...form, tour_slug: e.target.value })} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-gold">
              {tours.map((tour) => <option key={tour.slug} value={tour.slug}>{tour.title}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start" type="date" value={form.start_date} onChange={(v) => setForm({ ...form, start_date: v })} />
            <Field label="End" type="date" value={form.end_date} onChange={(v) => setForm({ ...form, end_date: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Seats" type="number" value={form.seats_total} onChange={(v) => setForm({ ...form, seats_total: v })} />
            <Field label="Price (USD pp)" type="number" value={form.price_usd} onChange={(v) => setForm({ ...form, price_usd: v })} placeholder="2450" />
          </div>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Guide</span>
            <select value={form.guide_name} onChange={(e) => setForm({ ...form, guide_name: e.target.value })} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-gold">
              <option value="">Unassigned</option>
              {guides.filter((guide) => guide.active).map((guide) => <option key={guide.id} value={guide.full_name}>{guide.full_name}</option>)}
            </select>
          </label>
          <Select label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v })} options={[...DEPARTURE_STATUSES]} />
          <Field label="Note" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} placeholder="Paro festival window" />
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-gold px-4 py-3 text-sm font-bold text-primary-foreground shadow-gold"><Plus className="h-4 w-4" /> Add departure</button>
        </div>
      </form>

      <div className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Scheduled departures", value: stats.total, icon: CalendarDays },
            { label: "Seats still open", value: stats.seats, icon: Users },
            { label: "Seats booked", value: stats.booked, icon: Users },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl border border-border bg-card p-4 shadow-card">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{card.label}</div>
              <div className="mt-2 font-display text-3xl font-extrabold text-gradient-gold">{card.value}</div>
            </div>
          ))}
        </div>

        {loading ? <p className="p-10 text-center text-sm text-muted-foreground">Loading departures…</p> : (
          <div className="grid gap-2">
            {rows.map((row) => {
              const left = seatsLeft(row);
              const fill = row.seats_total ? Math.min(100, Math.round((row.seats_booked / row.seats_total) * 100)) : 0;
              return (
                <article key={row.id} className="hover-lift grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-card lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] lg:items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{row.tour_name}</p>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                      {new Date(row.start_date).toLocaleDateString()}{row.end_date ? ` → ${new Date(row.end_date).toLocaleDateString()}` : ""} · ${row.price_usd.toLocaleString()} pp · {row.guide_name || "guide TBA"}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="font-semibold text-foreground">{row.seats_booked}/{row.seats_total} seats</span>
                      <span>{left} left</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-gradient-gold transition-all duration-700" style={{ width: `${fill}%` }} /></div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={row.status}
                      onChange={async (e) => { await updateDeparture(row.id, { status: e.target.value }); void load(); }}
                      className="rounded-lg border border-border bg-input px-2 py-1.5 text-xs font-semibold outline-none focus:border-gold"
                    >
                      {DEPARTURE_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <button type="button" aria-label="Add booking" onClick={async () => { await updateDeparture(row.id, { seats_booked: Math.min(row.seats_total, row.seats_booked + 1) }); void load(); }} className="rounded-lg border border-border px-2 py-1.5 text-xs font-bold hover:bg-muted">+1 seat</button>
                    <button type="button" aria-label="Toggle visibility" onClick={async () => { await updateDeparture(row.id, { published: !row.published }); void load(); }} className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:bg-muted">
                      {row.published ? <Eye className="h-3.5 w-3.5 text-cypress" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
                    </button>
                    <button type="button" aria-label="Delete departure" onClick={async () => { await deleteDeparture(row.id); toast.success("Departure removed"); void load(); }} className="grid h-8 w-8 place-items-center rounded-lg border border-border text-crimson hover:bg-muted">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
            {rows.length === 0 && <p className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">No departures scheduled yet — add the first fixed date on the left.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
