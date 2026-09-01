import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Check, Plus, Star, Trash2 } from "lucide-react";
import { createTestimonial, deleteTestimonial, listAllTestimonials, updateTestimonial, type Testimonial } from "@/lib/tourism";
import { Field } from "./crm-ui";

const empty = { guest_name: "", country: "", tour_name: "", rating: "5", quote: "" };

export function ReviewsPanel() {
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);

  const load = async () => {
    setLoading(true);
    try { setRows(await listAllTestimonials()); }
    catch (error) { toast.error("Could not load reviews", { description: (error as Error).message }); }
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.guest_name.trim() || !form.quote.trim()) { toast.error("Guest name and review text required"); return; }
    try {
      await createTestimonial({
        guest_name: form.guest_name.trim(),
        country: form.country || null,
        tour_name: form.tour_name,
        rating: Number(form.rating || 5),
        quote: form.quote.trim(),
        approved: true,
      });
      toast.success("Review published");
      setForm(empty);
      void load();
    } catch (error) {
      toast.error("Review not saved", { description: (error as Error).message });
    }
  };

  const pending = useMemo(() => rows.filter((row) => !row.approved), [rows]);
  const live = useMemo(() => rows.filter((row) => row.approved), [rows]);

  const card = (review: Testimonial) => (
    <article key={review.id} className="grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-card sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold">{review.guest_name}</p>
          <span className="text-[11px] text-muted-foreground">{review.country ?? "—"}</span>
          <span className="inline-flex items-center gap-0.5 text-gold">
            {Array.from({ length: review.rating }).map((_, index) => <Star key={index} className="h-3 w-3 fill-current" />)}
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">“{review.quote}”</p>
        <p className="mt-1 text-[11px] text-muted-foreground">{review.tour_name || "General"} · {new Date(review.created_at).toLocaleDateString()}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={async () => { await updateTestimonial(review.id, { approved: !review.approved }); toast.success(review.approved ? "Unpublished" : "Published to the website"); void load(); }} className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-bold transition ${review.approved ? "border-cypress/40 bg-cypress/12 text-cypress" : "border-border hover:bg-muted"}`}>
          <Check className="h-3.5 w-3.5" /> {review.approved ? "Live" : "Approve"}
        </button>
        <button type="button" onClick={async () => { await updateTestimonial(review.id, { featured: !review.featured }); void load(); }} className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${review.featured ? "border-gold bg-gold/15 text-clay" : "border-border hover:bg-muted"}`}>
          {review.featured ? "Featured" : "Feature"}
        </button>
        <button type="button" aria-label="Delete review" onClick={async () => { await deleteTestimonial(review.id); toast.success("Review deleted"); void load(); }} className="grid h-8 w-8 place-items-center rounded-lg border border-border text-crimson hover:bg-muted">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );

  return (
    <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
      <form onSubmit={submit} className="h-fit rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-4 font-display text-xl font-bold">Add a guest review</h2>
        <div className="grid gap-3">
          <Field label="Guest name" value={form.guest_name} onChange={(v) => setForm({ ...form, guest_name: v })} placeholder="Anita Sharma" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} placeholder="India" />
            <Field label="Rating (1-5)" type="number" value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
          </div>
          <Field label="Package" value={form.tour_name} onChange={(v) => setForm({ ...form, tour_name: v })} placeholder="Honeymoon Trip" />
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Review</span>
            <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={4} placeholder="Our guide made Punakha unforgettable…" className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-gold" />
          </label>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-gold px-4 py-3 text-sm font-bold text-primary-foreground shadow-gold"><Plus className="h-4 w-4" /> Publish review</button>
        </div>
      </form>

      <div className="grid gap-5">
        {loading ? <p className="p-10 text-center text-sm text-muted-foreground">Loading reviews…</p> : (
          <>
            <section>
              <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Awaiting approval · {pending.length}</h3>
              <div className="grid gap-2">
                {pending.map(card)}
                {pending.length === 0 && <p className="rounded-2xl border border-dashed border-border py-6 text-center text-xs text-muted-foreground">Nothing waiting — guest submissions land here.</p>}
              </div>
            </section>
            <section>
              <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Live on the website · {live.length}</h3>
              <div className="grid gap-2">
                {live.map(card)}
                {live.length === 0 && <p className="rounded-2xl border border-dashed border-border py-6 text-center text-xs text-muted-foreground">No published reviews yet.</p>}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
