import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Award, Calendar, Camera, ChevronDown, Compass, Globe2, Heart, Leaf, MapPin, Mountain, Quote, Search, Send, Shield, Sparkles, Star, Users, ShoppingBag, ExternalLink, ShieldCheck, CheckCircle2, MessageCircle } from "lucide-react";
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
import { useSiteSettings, buildWhatsAppUrl } from "@/lib/site-store";
import { GuestReviews, UpcomingDepartures } from "@/components/HomeLive";
import { useCurrency } from "@/lib/currency";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Golden Takin Holidays | Bhutan Tour Packages & Himalayan Experts" },
      {
        name: "description",
        content:
          "Department of Tourism licensed inbound tour operator in Thimphu, Bhutan. Crafting bespoke luxury Himalayan journeys, cultural festival tours, high-pass treks, and connecting travelers with authentic Bhutanese treasures via TakinMart.",
      },
      { property: "og:title", content: "Golden Takin Holidays — Journeys That Stay With You" },
      {
        property: "og:description",
        content:
          "Explore Bhutan, Nepal, Tibet, and India (NE) with Golden Takin Holidays. Official 24/7 WhatsApp: +91-8514889385. Special UK Promo Code: WSUKSU26.",
      },
    ],
  }),
});

const features = [
  { icon: Sparkles, title: "Bespoke Itineraries", desc: "Every route custom-crafted around your pace, purpose, and preferred season." },
  { icon: Award, title: "Expert Local Guides", desc: "Licensed Bhutanese cultural and natural history specialists, not generic escorts." },
  { icon: Leaf, title: "100% Visa & SDF Handled", desc: "Seamless Department of Tourism permit filing with daily SDF management included." },
  { icon: Heart, title: "Authentic Cultural Access", desc: "Monastic dzong blessings, artisan workshops, and authentic village homestays." },
  { icon: Mountain, title: "Private Chauffeur Luxury", desc: "Modern private Toyota Land Cruisers and Coasters for effortless mountain travel." },
  { icon: Shield, title: "24/7 Thimphu Concierge", desc: "Direct ground support from our Thimphu headquarters from arrival to farewell." },
];

const stats = [
  { n: `${tours.length}`, l: "Signature Journeys" },
  { n: "100%", l: "Visa & SDF Success" },
  { n: `${destinations.length}`, l: "Himalayan Valleys" },
  { n: "24/7", l: "Ground Concierge" },
];

const featuredTakinMart = [
  {
    name: "Pure Himalayan Bhutanese Shilajit Resin",
    tagline: "Wild-harvested above 4,500m · 70%+ Fulvic Acid",
    priceUSD: 21,
    image: "/products/jinlab-bhutanese-shilajit.png",
    category: "Wellness",
    slug: "jinlab-bhutanese-shilajit",
    badge: "Bestseller",
  },
  {
    name: "Rare Stingless-Bee Puthka Wild Honey",
    tagline: "Tangy medicinal forest nectar with high propolis",
    priceUSD: 30,
    image: "/products/jinlab-stingless-bee-puthka-honey.png",
    category: "Wild Honey",
    slug: "jinlab-stingless-bee-puthka-honey",
    badge: "Ultra Rare",
  },
  {
    name: "Himalayan Cordyceps Herbal Tea",
    tagline: "Wild Lunana Cordyceps infusion · Caffeine-free",
    priceUSD: 11,
    image: "/products/jinlab-cordyceps-tea-front.png",
    category: "Highland Tea",
    slug: "jinlab-himalayan-cordyceps-herbal-tea",
    badge: "New",
  },
  {
    name: "Authentic Bumthang Yathra Wool Blanket",
    tagline: "Handwoven pure sheep wool with botanical dye motifs",
    priceUSD: 115,
    image: "/products/p-buckwheat.jpg",
    category: "Master Craft",
    slug: "bumthang-yathra-pure-wool-blanket",
    badge: "Heirloom",
  },
];

function Home() {
  const settings = useSiteSettings();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [q, setQ] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Tours");

  const runSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/tours",
      search: { q: q.trim(), category: activeCategory },
    });
  };

  const previewPanos = [
    { title: "Tiger's Nest at dawn", image: tigersNest, views: 0, note: "The cliff-clinging Taktsang monastery. Drag to explore the rock face." },
    { title: "Festival courtyard", image: festival, views: 0, note: "Sacred Cham masked dances in a historic dzong courtyard." },
    { title: "Weaver's atelier", image: culture, views: 0, note: "A working heritage textile studio in Bumthang valley." },
  ];

  return (
    <>
      {/* ====================================================================
          1. BREATHTAKING EDITORIAL LUXURY HERO
      ==================================================================== */}
      <section className="relative min-h-[92svh] overflow-hidden bg-ink text-hero-foreground flex items-center">
        {/* Background Image with Ambient Glow */}
        <div className="absolute inset-0">
          <img
            src={hero}
            alt="Dawn over the sacred valleys of Bhutan"
            className="h-full w-full object-cover animate-float-slow scale-105"
            style={{ animationDuration: "30s" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/40" />
          <div className="absolute inset-0 mandala-bg opacity-15" />
          <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-4 py-20 sm:px-6 lg:py-28 w-full">
          <div className="max-w-3xl">
            {/* Accreditation Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-4 py-1.5 text-xs font-semibold text-gold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span>Bhutan DoT Licensed Inbound Operator · Thimphu</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-hero-foreground">
              Kingdom of Wonder. <br />
              <span className="text-gradient-gold">Crafted by Masters.</span>
            </h1>

            {/* Subheading */}
            <p className="mt-5 text-base sm:text-lg text-hero-foreground/85 leading-relaxed max-w-2xl">
              Journey beyond the tourist trails into the last Himalayan sanctuary. Tailor-made cultural immersions, sacred festivals, high-pass treks, and private luxury departures operated by our Thimphu headquarters.
            </p>

            {/* Streamlined Trip Finder Pill */}
            <div className="mt-8 rounded-2xl sm:rounded-full border border-hero-foreground/20 bg-card/90 p-2 text-foreground shadow-deep backdrop-blur-2xl max-w-2xl">
              <form onSubmit={runSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex items-center gap-2.5 px-3 py-2 flex-1">
                  <Search className="h-4 w-4 text-gold shrink-0" />
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Where in Bhutan? (e.g. Paro, Festival, Trek)"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-xl sm:rounded-full bg-gradient-gold px-6 py-3 text-xs sm:text-sm font-bold text-primary-foreground shadow-gold hover:shadow-hover hover:scale-[1.02] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Explore Journeys</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Credibility Strip */}
            <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-hero-foreground/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold" />
                <span>100% Visa &amp; SDF Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-gold" />
                <span>Private Chauffeur &amp; Guide</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-gold text-gold" />
                <span>5.0 Rated Overseas Feedback</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. FEATURE VALUE STRIP (ROYAL STANDARDS)
      ==================================================================== */}
      <section className="border-y border-border bg-card/60 backdrop-blur-md py-6">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {features.map((f, i) => (
              <div key={f.title} className="flex items-start gap-3 p-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold mt-0.5">
                  <f.icon className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs font-bold text-foreground">{f.title}</div>
                  <div className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. FEATURED SIGNATURE JOURNEYS
      ==================================================================== */}
      <section className="mx-auto max-w-[1500px] px-4 py-20 sm:px-6 sm:py-24">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="eyebrow text-gold font-bold uppercase tracking-wider text-xs">Curated Himalayan Routes</div>
            <h2 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold text-foreground">
              Signature Bhutan Tours &amp; <em className="not-italic text-gradient-gold">Expeditions</em>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl">
              From classic fortress valleys to glaciated high-altitude passes. All journeys include your licensed Bhutanese guide, private transport, luxury accommodations, and daily SDF.
            </p>
          </div>

          <Link
            to="/tours"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-gold transition"
          >
            <span>View All Packages</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Tour Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.slice(0, 6).map((t, i) => (
            <Reveal key={t.slug} delay={i * 0.05}>
              <TourCard tour={t} idx={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ====================================================================
          4. TAKINMART ARTISANAL SHOWCASE (ATTACHED TO TRAVEL STORE)
      ==================================================================== */}
      <section className="bg-secondary/40 border-y border-border py-20 sm:py-24">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-bold uppercase tracking-wider mb-2">
                <ShoppingBag className="w-3.5 h-3.5" /> Official TakinMart Sourcing Alliance
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-foreground">
                Authentic Treasures of the <em className="not-italic text-gradient-gold">Kingdom</em>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                Connect with the pure botanical and artisanal heritage of Bhutan. Wild-harvested Cordyceps, pure Himalayan Shilajit, raw Puthka honey, and museum-grade Yathra handweaves sourced directly from master cottage artisans.
              </p>
            </div>

            <Link
              to="/store"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-gold px-6 py-3 text-xs sm:text-sm font-bold text-primary-foreground shadow-gold hover:shadow-hover transition"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Explore TakinMart Store</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Product Cards Row */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredTakinMart.map((prod) => (
              <div
                key={prod.slug}
                className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-4 shadow-card hover:border-gold/60 hover:shadow-hover transition-all"
              >
                <div>
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary/60 mb-4">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-gradient-gold px-2.5 py-0.5 text-[9px] font-bold uppercase text-primary-foreground shadow-soft">
                      {prod.badge}
                    </span>
                    <span className="absolute right-2.5 top-2.5 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground border">
                      {prod.category}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-foreground line-clamp-1 group-hover:text-gold transition">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {prod.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase text-muted-foreground">Direct Price</div>
                    <div className="font-display text-lg font-extrabold text-foreground">
                      {formatPrice(prod.priceUSD)}
                    </div>
                  </div>

                  <Link
                    to="/store"
                    className="flex items-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold hover:text-slate-950 transition"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. 360° IMMERSIVE PANORAMA EXPERIENCE
      ==================================================================== */}
      <section className="relative overflow-hidden bg-ink py-20 text-hero-foreground sm:py-24">
        <div className="absolute inset-0 mandala-bg opacity-15" />
        <div className="relative mx-auto max-w-[1500px] px-4 sm:px-6">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="eyebrow text-gold font-bold uppercase tracking-wider text-xs">Interactive Virtual Acclimatization</div>
              <h2 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold">
                Experience Bhutan in <em className="not-italic text-gradient-gold">360° Panorama</em>
              </h2>
              <p className="mt-2 text-sm sm:text-base text-hero-foreground/75 max-w-xl">
                Drag to rotate and zoom into sacred monastic courtyards and cliffside shrines before you arrive.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-hero-foreground/60">
              <Camera className="w-4 h-4 text-gold" />
              <span>Interactive High-Resolution Panoramas</span>
            </div>
          </div>

          <Reveal>
            <PanoramaViewer panoramas={previewPanos} />
          </Reveal>
        </div>
      </section>

      {/* ====================================================================
          6. SACRED VALLEYS & DESTINATIONS
      ==================================================================== */}
      <section className="mx-auto max-w-[1500px] px-4 py-20 sm:px-6 sm:py-24">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="eyebrow text-gold font-bold uppercase tracking-wider text-xs">Where To Wander</div>
          <h2 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold text-foreground">
            Sacred Valleys of the <em className="not-italic text-gradient-gold">Kingdom</em>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Each valley maintains its distinct microclimate, architecture, and dialects. Let our specialists weave them seamlessly together.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.slice(0, 4).map((d, i) => (
            <Reveal key={d.slug} delay={i * 0.05}>
              <Link to="/destinations" className="group relative block aspect-[4/5] overflow-hidden rounded-3xl shadow-card">
                <img
                  src={d.image}
                  alt={d.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-hero-foreground">
                  <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gold">
                    <MapPin className="h-3 w-3" /> Bhutan
                  </div>
                  <h3 className="font-display text-2xl font-bold">{d.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-hero-foreground/75 leading-relaxed">{d.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-gold group-hover:underline">
                    Explore Valley →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Departures & Verified Reviews */}
      <UpcomingDepartures />
      <GuestReviews />

      {/* ====================================================================
          7. TAILOR-MADE JOURNEY FINAL BANNER
      ==================================================================== */}
      <section className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-ink p-8 sm:p-14 md:p-20 text-center text-hero-foreground shadow-deep">
          <div className="absolute inset-0 mandala-bg opacity-20" />
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/15 text-gold text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Start Your Himalayan Chapter
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold leading-tight">
              Walk Beneath the <em className="not-italic text-gradient-gold">Prayer Flags</em>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-hero-foreground/80 leading-relaxed">
              Tell our Thimphu team about your ideal pace, travel dates, and group size. We'll return an itemized, custom itinerary with visas and private logistics within 24 hours.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/plan"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-gold px-7 py-3.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-gold hover:shadow-hover transition"
              >
                <Sparkles className="h-4 w-4" />
                <span>Plan Tailor-Made Tour</span>
              </Link>
              <a
                href={buildWhatsAppUrl(settings.whatsappNumber || "+918514889385", "Hi Golden Takin Holidays, I would like to plan a bespoke trip to Bhutan.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-7 py-3.5 text-xs sm:text-sm font-bold text-emerald-400 hover:bg-emerald-500 hover:text-white transition"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Specialist</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
