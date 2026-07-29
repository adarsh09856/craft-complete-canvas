import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Award, Calendar, Camera, ChevronDown, Compass, Globe2, Heart, Leaf, MapPin, Mountain, Quote, Search, Send, Shield, Sparkles, Star, Users } from "lucide-react";
import { useState } from "react";
import hero from "@/assets/hero-bhutan.jpg";
import tigersNest from "@/assets/tigers-nest.jpg";
import festival from "@/assets/festival.jpg";
import culture from "@/assets/culture.jpg";
import { categories, destinations, experiences, tours } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { TourCard } from "@/components/TourCard";
import { PanoramaViewer } from "@/components/PanoramaViewer";
import { useSiteSettings } from "@/lib/site-store";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Golden Takin Holidays | Bhutan Tour Packages & Travel Experts" },
      { name: "description", content: "Golden Takin Holidays is Bhutan's TCB-licensed inbound tour operator offering customised holiday packages, hotel booking, VISA processing, car rental and corporate tours." },
      { name: "keywords", content: "Bhutan tour package, Bhutan travel agency, Bhutan holiday package, best travel agency in Bhutan, Bhutan inbound tour operator, Golden Takin Holidays" },
      { property: "og:title", content: "Golden Takin Holidays | Bhutan Tour Packages & Travel Experts" },
      { property: "og:description", content: "Golden Takin Holidays is Bhutan's TCB-licensed inbound tour operator offering customised holiday packages, hotel booking, VISA processing, car rental and corporate tours." },
    ],
  }),
});

const features = [
  { icon: Sparkles, title: "Custom Itineraries", desc: "Every route shaped around pace, purpose and season." },
  { icon: Award, title: "Expert Local Guides", desc: "Licensed Bhutanese specialists, not generic escorts." },
  { icon: Leaf, title: "Sustainable Tourism", desc: "Measured travel that protects culture and valleys." },
  { icon: Heart, title: "Cultural Immersion", desc: "Homes, artisans, rituals and festival access." },
  { icon: Mountain, title: "Spiritual Journeys", desc: "Pilgrimage routes with quiet acclimatization." },
  { icon: Shield, title: "Happiness Guaranteed", desc: "24/7 support from inquiry through departure." },
];

const stats = [
  { n: `${tours.length}`, l: "Curated packages" },
  { n: `${categories.length - 1}`, l: "Travel styles" },
  { n: `${destinations.length}`, l: "Valleys & regions" },
  { n: "24/7", l: "Trip support" },
];

const process = [
  { step: "01", title: "Tell us the trip", desc: "Share dates, group size and the kind of Bhutan you want — culture, trekking, birding, wellness or a corporate off-site." },
  { step: "02", title: "Receive a costed plan", desc: "We return a day-by-day itinerary with hotels, guide, transport, permits and the SDF clearly itemised." },
  { step: "03", title: "Permits & visa handled", desc: "As a TCB-licensed operator we file your visa and route permits and confirm every booking on your behalf." },
  { step: "04", title: "Travel with our team", desc: "Licensed English-speaking guide, private vehicle and a 24/7 Thimphu desk for the whole journey." },
];

function Home() {
  const settings = useSiteSettings();
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState(0);
  const [q, setQ] = useState("");
  const [dates, setDates] = useState("");
  const [guests, setGuests] = useState("");
  const [ask, setAsk] = useState("");

  const askAssistant = (text: string) => {
    window.dispatchEvent(new CustomEvent("gth:ask-assistant", { detail: text }));
  };

  const runSearch = () => {
    navigate({
      to: "/tours",
      search: { q: q.trim(), category: categories[activeCat] ?? "All Tours", dates: dates.trim(), guests: guests.trim() },
    });
  };
  const previewPanos = [
    { title: "Tiger's Nest at dawn", image: tigersNest, views: 0, note: "The cliff-clinging Taktsang monastery. Drag to circle the rock face." },
    { title: "Festival courtyard", image: festival, views: 0, note: "Masked dance and saffron color in a dzong courtyard." },
    { title: "Weaver's atelier", image: culture, views: 0, note: "A working textile studio in a heritage farmhouse." },
  ];

  return (
    <>
      {/* ============ MAGAZINE HERO ============ */}
      <section className="relative min-h-[94svh] overflow-hidden bg-ink text-hero-foreground">
        <div className="absolute inset-0">
          <img src={hero} alt="Dawn over Bhutanese valleys" className="h-full w-full object-cover animate-float-slow" style={{ animationDuration: "26s" }} />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          <div className="absolute inset-0 mandala-bg opacity-25" />
          <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-saffron/25 blur-3xl" />
          <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-primary/40 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-[1500px] gap-10 px-4 pb-10 pt-28 sm:px-6 sm:pt-36 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:pb-16 xl:gap-16">
          <div className="min-w-0 animate-rise-in">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-12 bg-gradient-gold" />
              <span className="eyebrow text-saffron">{settings.companyName} · TCB-licensed, Thimphu</span>
            </div>
            {settings.announcement && (
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-saffron/10 px-4 py-2 text-xs font-semibold text-saffron backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> {settings.announcement}
              </div>
            )}
            <h1 className="max-w-4xl font-display text-[3.4rem] font-extrabold leading-[0.9] sm:text-[5.4rem] lg:text-[6.6rem] xl:text-[7.4rem]">
              {settings.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-hero-foreground/82 sm:text-xl">
              {settings.heroSubtitle}
            </p>

            <div className="mt-8 max-w-5xl rounded-2xl border border-hero-foreground/12 bg-background/95 p-2 text-foreground shadow-deep backdrop-blur-xl">
              <div className="flex gap-1 overflow-x-auto px-1 pb-2 scrollbar-hide">
                {categories.map((c, i) => (
                  <button key={c} onClick={() => setActiveCat(i)} className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition sm:px-4 ${activeCat === i ? "bg-gradient-gold text-primary-foreground shadow-gold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                    {c}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(event) => { event.preventDefault(); runSearch(); }}
                className="grid gap-2 rounded-xl border border-border bg-card p-2 md:grid-cols-[1.4fr_1fr_1fr_auto]"
              >
                <label className="flex min-w-0 items-center gap-3 rounded-lg bg-input px-3 py-3 transition focus-within:ring-2 focus-within:ring-ring">
                  <Search className="h-4 w-4 shrink-0 text-saffron" />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Destination or experience" aria-label="Destination or experience" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
                </label>
                <label className="flex min-w-0 items-center gap-3 rounded-lg bg-input px-3 py-3 transition focus-within:ring-2 focus-within:ring-ring">
                  <Calendar className="h-4 w-4 shrink-0 text-saffron" />
                  <input type="date" value={dates} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDates(e.target.value)} aria-label="Travel date" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
                </label>
                <label className="flex min-w-0 items-center gap-3 rounded-lg bg-input px-3 py-3 transition focus-within:ring-2 focus-within:ring-ring">
                  <Users className="h-4 w-4 shrink-0 text-saffron" />
                  <select value={guests} onChange={(e) => setGuests(e.target.value)} aria-label="Guests" className="min-w-0 flex-1 bg-transparent text-sm outline-none">
                    <option value="">Guests</option>
                    {["1", "2", "3", "4", "5", "6", "8", "10", "15+"].map((g) => (
                      <option key={g} value={g}>{g} {g === "1" ? "traveller" : "travellers"}</option>
                    ))}
                  </select>
                </label>
                <button type="submit" className="sheen-on-hover inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-gold px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:shadow-gold">
                  Search <Sparkles className="h-4 w-4" />
                </button>
              </form>
              <div className="flex flex-wrap items-center gap-2 px-2 pb-1 pt-2 text-xs text-muted-foreground">
                <span className="font-semibold uppercase tracking-wide">Popular</span>
                {["Tiger's Nest", "Honeymoon", "Trekking", "Birdwatching", "Family", "Punakha"].map((s) => (
                  <button key={s} type="button" onClick={() => { setQ(s); navigate({ to: "/tours", search: { q: s, category: "All Tours", dates: dates.trim(), guests: guests.trim() } }); }} className="rounded-full border border-border px-3 py-1 font-medium transition hover:border-saffron hover:text-saffron">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/tours" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:shadow-gold">All Tours <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/plan" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-saffron bg-hero-foreground/8 px-5 py-3 text-sm font-semibold text-saffron backdrop-blur transition hover:bg-saffron hover:text-primary-foreground"><Sparkles className="h-4 w-4" /> Plan with AI</Link>
            </div>

            <div className="mt-7 grid gap-3 text-xs text-hero-foreground/74 sm:grid-cols-3 lg:max-w-3xl">
              <div className="flex min-w-0 items-center gap-2"><Shield className="h-4 w-4 shrink-0 text-saffron" /><span>TCB-licensed inbound operator</span></div>
              <div className="flex min-w-0 items-center gap-2"><Star className="h-4 w-4 shrink-0 fill-saffron text-saffron" /><span>{tours.length} ready-to-book packages</span></div>
              <div className="flex min-w-0 items-center gap-2"><Globe2 className="h-4 w-4 shrink-0 text-saffron" /><span>Visa, SDF & permits handled</span></div>
            </div>
          </div>

          <aside className="dark-panel self-end rounded-2xl p-5 text-hero-foreground sm:p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
              <div className="min-w-0">
                <div className="eyebrow text-saffron">Live planning desk</div>
                <h2 className="mt-2 font-display text-3xl font-bold leading-none">AI + Bhutan specialist</h2>
              </div>
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-saffron text-saffron animate-pulse-gold">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-hero-foreground/72">Start with instant routing; finish with a human-reviewed itinerary, permits, hotels and guide assignment.</p>
            <div className="mt-5 grid gap-2">
              {["Suggest culture tours", "Best time to visit", "Plan a 7-day Buddhist tour", "Build a college group trip"].map((s) => (
                <button key={s} type="button" onClick={() => askAssistant(s)} className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-hero-foreground/12 bg-hero-foreground/8 px-3 py-2.5 text-left text-xs transition hover:border-saffron/60 hover:bg-hero-foreground/14">
                  <span className="min-w-0 truncate">{s}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-saffron transition group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); if (!ask.trim()) return; askAssistant(ask.trim()); setAsk(""); }}
              className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-2 rounded-xl border border-hero-foreground/12 bg-hero-foreground/8 p-2"
            >
              <input value={ask} onChange={(e) => setAsk(e.target.value)} aria-label="Ask the travel assistant" placeholder="Ask anything..." className="min-w-0 bg-transparent px-2 text-xs outline-none placeholder:text-hero-foreground/45" />
              <button type="submit" aria-label="Ask" className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-gold text-primary-foreground"><Send className="h-4 w-4" /></button>
            </form>
          </aside>
        </div>

        {/* feature strip */}
        <div className="relative mx-auto max-w-[1500px] px-4 pb-10 sm:px-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="grid h-full grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-xl border border-hero-foreground/12 bg-hero-foreground/9 p-4 backdrop-blur-xl transition hover:border-saffron/40 hover:bg-hero-foreground/14">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-saffron/18 text-saffron"><f.icon className="h-5 w-5" /></div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-hero-foreground">{f.title}</div>
                    <div className="mt-1 text-xs leading-relaxed text-hero-foreground/65">{f.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 eyebrow text-hero-foreground/55">
            Scroll to explore <ChevronDown className="h-4 w-4 animate-bounce text-saffron" />
          </div>
        </div>
      </section>

      {/* ============ MAGAZINE — FEATURED STORY ============ */}
      <section className="mx-auto max-w-[1500px] px-4 py-20 sm:px-6 sm:py-28">
        <div className="mb-12 grid items-end gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <div className="eyebrow text-saffron">Featured packages</div>
            <h2 className="mt-3 font-display text-5xl font-extrabold leading-[0.92] sm:text-7xl">
              Premium tours, <em className="not-italic text-gradient-gold">picked by hand</em>.
            </h2>
          </div>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Every card opens the full package — day-by-day itinerary, official brochure, inclusions, exclusions and a direct booking request. All itineraries are built and operated by our own Thimphu team.
          </p>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="font-display text-4xl font-extrabold text-gradient-gold sm:text-5xl">{s.n}</div>
              <div className="mt-2 eyebrow text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.slice(0, 6).map((t, i) => <Reveal key={t.slug} delay={i * 0.04}><TourCard tour={t} idx={i} /></Reveal>)}
        </div>
        <div className="mt-12 text-center">
          <Link to="/tours" className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition hover:shadow-gold">
            View all tours <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ============ 360° PREVIEW SECTION ============ */}
      <section className="relative overflow-hidden bg-ink py-20 text-hero-foreground sm:py-28">
        <div className="absolute inset-0 mandala-bg opacity-20" />
        <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-saffron/20 blur-3xl" />
        <div className="relative mx-auto max-w-[1500px] px-4 sm:px-6">
          <div className="mb-12 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <div className="eyebrow text-saffron">360° immersive preview</div>
              <h2 className="mt-3 font-display text-5xl font-extrabold leading-[0.92] sm:text-7xl">
                See it, <em className="not-italic text-gradient-gold">then go</em>.
              </h2>
            </div>
            <p className="text-base leading-relaxed text-hero-foreground/74 sm:text-lg">
              Drag to rotate, scroll to zoom. Preview the valleys, dzongs and monasteries on your route before you commit — our team keeps the gallery updated season by season.
            </p>
          </div>
          <Reveal>
            <PanoramaViewer panoramas={previewPanos} />
          </Reveal>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-hero-foreground/68">
            <span className="chip border-saffron bg-hero-foreground/8 text-saffron"><Camera className="h-3.5 w-3.5" /> Drag · Zoom · Fullscreen</span>
            <span className="chip border-saffron bg-hero-foreground/8 text-saffron"><Compass className="h-3.5 w-3.5" /> Auto-rotate on</span>
            <Link to="/operations" className="chip border-saffron bg-hero-foreground/8 text-saffron hover:bg-saffron hover:text-primary-foreground">Manage gallery →</Link>
          </div>
        </div>
      </section>

      {/* ============ SACRED DESTINATIONS ============ */}
      <section className="mx-auto max-w-[1500px] px-4 py-20 sm:px-6 sm:py-28">
        <div className="mb-12 mx-auto max-w-3xl text-center">
          <div className="eyebrow text-saffron">Where to wander</div>
          <h2 className="mt-3 font-display text-5xl font-extrabold leading-[0.92] sm:text-7xl">Sacred destinations</h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">A clean visual map of valleys, cities and cultural regions your itinerary can combine.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d, i) => (
            <Reveal key={d.slug} delay={i * 0.05}>
              <Link to="/destinations" className="group relative block aspect-[4/5] overflow-hidden rounded-2xl">
                <img src={d.image} alt={d.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-hero-foreground">
                  <div className="mb-2 flex items-center gap-2 eyebrow text-saffron"><MapPin className="h-3 w-3" /> Bhutan</div>
                  <h3 className="font-display text-3xl font-bold">{d.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-hero-foreground/70">{d.desc}</p>
                  <span className="mt-4 inline-flex rounded-xl bg-background/92 px-3 py-2 text-xs font-semibold text-primary">Explore</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ EXPERIENCES ============ */}
      <section className="mx-auto max-w-[1500px] px-4 py-20 sm:px-6 sm:py-28">
        <SectionTitle eyebrow="Signature experiences" title="Bookable Bhutan experiences" subtitle="Spiritual, cultural, active and restorative panels that connect directly to related tour planning." />
        <div className="grid gap-6 md:grid-cols-2">
          {experiences.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.05}>
              <div className="group grid overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:shadow-deep md:grid-cols-[0.9fr_1fr]">
                <div className="relative min-h-64 overflow-hidden">
                  <img src={e.image} alt={e.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
                </div>
                <div className="flex min-w-0 flex-col justify-between p-6 sm:p-7">
                  <div>
                    <div className="eyebrow text-cypress">Experience {String(i + 1).padStart(2, "0")}</div>
                    <h3 className="mt-3 font-display text-4xl font-bold leading-none">{e.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{e.desc}</p>
                  </div>
                  <Link to="/experiences" className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:shadow-gold">
                    Discover <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6">
          <div className="mb-10 grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <div className="eyebrow text-saffron">How we work</div>
              <h2 className="mt-3 font-display text-5xl font-extrabold leading-[0.92] sm:text-6xl">From enquiry to <em className="not-italic text-gradient-gold">arrival</em>.</h2>
            </div>
            <Link to="/contact" className="hidden items-center gap-2 rounded-xl border border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground lg:inline-flex">Talk to our team <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <Reveal key={p.step} delay={i * 0.06}>
                <article className="hover-lift grid h-full gap-4 rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div className="font-display text-4xl font-extrabold text-gradient-gold">{p.step}</div>
                  <h3 className="font-display text-2xl font-bold leading-tight">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ============ CTA ============ */}
      <section className="mx-auto max-w-[1500px] px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-ink p-8 text-center text-hero-foreground shadow-deep sm:p-14 md:p-20">
            <div className="absolute inset-0 mandala-bg opacity-25" />
            <div className="absolute inset-x-0 top-0 h-px shimmer" />
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-saffron/25 blur-3xl" />
            <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
            <div className="relative mx-auto max-w-3xl">
              <div className="eyebrow text-saffron">Begin your journey</div>
              <h2 className="mt-3 font-display text-5xl font-extrabold leading-[0.92] sm:text-7xl">Build the trip, <em className="not-italic text-gradient-gold">live it slowly</em>.</h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-hero-foreground/72 sm:text-lg">Use the planning assistant, browse premium routes, or open the travel desk to create and update inquiries.</p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link to="/plan" className="inline-flex items-center gap-2 rounded-xl bg-gradient-gold px-7 py-4 text-sm font-semibold text-primary-foreground transition hover:shadow-gold"><Sparkles className="h-4 w-4" /> Plan with AI</Link>
                <Link to="/tours" className="inline-flex items-center gap-2 rounded-xl border border-saffron px-7 py-4 text-sm font-semibold text-saffron transition hover:bg-saffron hover:text-primary-foreground">Browse tours</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
