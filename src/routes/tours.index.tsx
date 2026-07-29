import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { categories, destinations, tours } from "@/lib/data";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { TourCard } from "@/components/TourCard";
import hero from "@/assets/tigers-nest.jpg";
import { Filter, RotateCcw, Search, SlidersHorizontal } from "lucide-react";

const durationGroups = ["Any duration", "3-7 days", "7-14 days", "14+ days"];

export const Route = createFileRoute("/tours/")({
  component: ToursPage,
  head: () => ({
    meta: [
      { title: "All Bhutan Tours — Royal Takin Tours" },
      { name: "description", content: "Search and filter premium Bhutan tours by category, destination, duration and price." },
      { property: "og:title", content: "All Bhutan Tours — Royal Takin Tours" },
      { property: "og:description", content: "Find culture, pilgrimage, trekking, family and luxury Bhutan itineraries." },
    ],
  }),
});

function days(duration: string) {
  return Number(duration.match(/\d+/)?.[0] ?? 0);
}

function ToursPage() {
  const [cat, setCat] = useState("All Tours");
  const [duration, setDuration] = useState("Any duration");
  const [destination, setDestination] = useState("All destinations");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => tours.filter((tour) => {
    const tourDays = days(tour.duration);
    const durationMatch = duration === "Any duration" || (duration === "3-7 days" && tourDays <= 7) || (duration === "7-14 days" && tourDays >= 7 && tourDays <= 14) || (duration === "14+ days" && tourDays >= 14);
    const destinationMatch = destination === "All destinations" || tour.location.toLowerCase().includes(destination.toLowerCase());
    const text = `${tour.title} ${tour.category} ${tour.location} ${tour.desc}`.toLowerCase();
    return (cat === "All Tours" || tour.category === cat) && durationMatch && destinationMatch && tour.price <= maxPrice && text.includes(q.toLowerCase());
  }), [cat, destination, duration, maxPrice, q]);

  const clear = () => {
    setCat("All Tours");
    setDuration("Any duration");
    setDestination("All destinations");
    setMaxPrice(5000);
    setQ("");
  };

  return (
    <>
      <PageHero eyebrow="Every journey" title="All Bhutan tours" subtitle="A structured catalogue with working search, category, duration, destination and price controls." image={hero}>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[{ n: filtered.length, l: "Matches" }, { n: tours.length, l: "Tours" }, { n: "4.9", l: "Rating" }].map((stat) => (
            <div key={stat.l} className="rounded-xl border border-hero-foreground/15 bg-hero-foreground/10 p-3 backdrop-blur-xl">
              <div className="text-2xl font-bold text-gold">{stat.n}</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-hero-foreground/68">{stat.l}</div>
            </div>
          ))}
        </div>
      </PageHero>

      <section className="section-shell py-12 sm:px-6 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="h-fit rounded-xl border border-border bg-card p-4 shadow-card lg:sticky lg:top-24">
            <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.24em] text-cypress">Filters</div>
                <h2 className="text-xl font-bold">Find a tour</h2>
              </div>
              <SlidersHorizontal className="h-5 w-5 shrink-0 text-gold" />
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Search</span>
                <span className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-lg border border-border bg-input px-3 py-2.5">
                  <Search className="h-4 w-4 text-cypress" />
                  <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Tiger's Nest, trek..." className="min-w-0 bg-transparent text-sm outline-none" />
                </span>
              </label>

              <FilterGroup title="Category" options={categories} value={cat} onChange={setCat} />
              <FilterGroup title="Duration" options={durationGroups} value={duration} onChange={setDuration} />
              <FilterGroup title="Destination" options={["All destinations", ...destinations.map((d) => d.name)]} value={destination} onChange={setDestination} />

              <label className="block rounded-lg bg-muted p-3">
                <span className="mb-3 flex justify-between text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"><span>Max price</span><span>${maxPrice}</span></span>
                <input type="range" min="1400" max="5000" step="100" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} className="w-full accent-primary" />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button type="button" className="rounded-lg bg-gradient-gold px-4 py-3 text-sm font-semibold text-primary-foreground shadow-gold">Apply</button>
                <button type="button" onClick={clear} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"><RotateCcw className="h-4 w-4" /> Clear</button>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.28em] text-cypress">Browse</div>
                <h2 className="mt-2 text-3xl font-bold sm:text-5xl">{cat}</h2>
              </div>
              <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">{filtered.length} results</div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((tour, index) => <Reveal key={tour.slug} delay={index * 0.04}><TourCard tour={tour} idx={index} /></Reveal>)}
            </div>
            {filtered.length === 0 && <div className="rounded-xl border border-border bg-card py-20 text-center text-muted-foreground shadow-card">No tours match your filters.</div>}
          </div>
        </div>
      </section>
    </>
  );
}

function FilterGroup({ title, options, value, onChange }: { title: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</div>
      <div className="grid gap-1.5">
        {options.map((option) => (
          <button key={option} type="button" onClick={() => onChange(option)} className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${value === option ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
            <span className={`h-2 w-2 rounded-full ${value === option ? "bg-gold" : "bg-border"}`} />
            <span className="min-w-0 truncate">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}