import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, Star, Users } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/Reveal";
import { listApprovedTestimonials, listUpcomingDepartures, seatsLeft, submitTestimonial, type Departure, type Testimonial } from "@/lib/tourism";

export function UpcomingDepartures() {
  const [rows, setRows] = useState<Departure[]>([]);
  useEffect(() => { void listUpcomingDepartures(6).then(setRows); }, []);
  if (rows.length === 0) return null;
  return (
    <section className="mx-auto max-w-[1500px] px-4 py-20 sm:px-6">
      <div className="eyebrow text-saffron">Fixed departures</div>
      <h2 className="mt-3 mb-8 font-display text-4xl font-extrabold sm:text-5xl">Join an upcoming <em className="not-italic text-gradient-gold">group trip</em></h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((d, i) => {
          const left = seatsLeft(d);
          const fill = d.seats_total ? Math.round((d.seats_booked / d.seats_total) * 100) : 0;
          return (
            <Reveal key={d.id} delay={i * 0.05}>
              <article className="hover-lift grid h-full gap-3 rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{new Date(d.start_date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span className="rounded-full bg-gold/15 px-2 py-0.5 font-semibold text-clay">{d.status}</span>
                </div>
                <h3 className="font-display text-xl font-bold leading-tight">{d.tour_name}</h3>
                <div className="h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-gradient-gold" style={{ width: `${fill}%` }} /></div>
                <div className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-1 text-muted-foreground"><Users className="h-4 w-4" />{left} seats left</span>
                  {d.price_usd > 0 && <span className="font-bold">USD {d.price_usd.toLocaleString()} pp</span>}
                </div>
                <Link to="/tours/$slug" params={{ slug: d.tour_slug }} className="mt-1 rounded-xl border border-primary px-4 py-2 text-center text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">View package</Link>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export function GuestReviews() {
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [form, setForm] = useState({ guest_name: "", country: "", rating: 5, quote: "" });
  const [open, setOpen] = useState(false);
  useEffect(() => { void listApprovedTestimonials(6).then(setRows); }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.guest_name.trim() || !form.quote.trim()) { toast.error("Please add your name and review"); return; }
    try {
      await submitTestimonial({ ...form, guest_name: form.guest_name.trim(), quote: form.quote.trim(), country: form.country || null });
      toast.success("Thank you! Your review will appear after approval.");
      setForm({ guest_name: "", country: "", rating: 5, quote: "" });
      setOpen(false);
    } catch (err) { toast.error("Could not send review", { description: (err as Error).message }); }
  };

  return (
    <section className="mx-auto max-w-[1500px] px-4 py-20 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow text-saffron">Guest stories</div>
          <h2 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">What our <em className="not-italic text-gradient-gold">travellers</em> say</h2>
        </div>
        <button onClick={() => setOpen((v) => !v)} className="rounded-xl bg-gradient-gold px-5 py-3 text-sm font-bold text-primary-foreground shadow-gold">{open ? "Close" : "Share your experience"}</button>
      </div>
      {open && (
        <form onSubmit={submit} className="mb-8 grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-card sm:grid-cols-2">
          <input value={form.guest_name} onChange={(e) => setForm({ ...form, guest_name: e.target.value })} placeholder="Your name" maxLength={80} className="rounded-lg border border-border bg-input px-3 py-2.5 text-sm" />
          <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" maxLength={60} className="rounded-lg border border-border bg-input px-3 py-2.5 text-sm" />
          <div className="flex items-center gap-1 sm:col-span-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} aria-label={`${n} stars`} onClick={() => setForm({ ...form, rating: n })}><Star className={`h-6 w-6 text-gold ${n <= form.rating ? "fill-current" : ""}`} /></button>
            ))}
          </div>
          <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={3} maxLength={800} placeholder="Tell us about your trip…" className="rounded-lg border border-border bg-input px-3 py-2.5 text-sm sm:col-span-2" />
          <button className="rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground sm:col-span-2">Submit review</button>
        </form>
      )}
      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">Be the first to share your Bhutan story.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.05}>
              <article className="hover-lift grid h-full gap-3 rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex gap-0.5 text-gold">{Array.from({ length: r.rating }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}</div>
                <p className="text-sm leading-relaxed">“{r.quote}”</p>
                <p className="mt-auto text-xs text-muted-foreground"><span className="font-bold text-foreground">{r.guest_name}</span>{r.country ? ` · ${r.country}` : ""}{r.tour_name ? ` · ${r.tour_name}` : ""}</p>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
