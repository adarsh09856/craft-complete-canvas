import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { tours } from "@/lib/data";
import { brochures } from "@/lib/brochures";
import type { ItineraryDay, Tour } from "@/components/TourCard";
import { Clock, MapPin, Users, Check, ArrowLeft, Star, X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { PanoramaViewer } from "@/components/PanoramaViewer";
import { BookingWidget } from "@/components/BookingWidget";
import { useEffect, useState } from "react";
import { getPanoramas } from "@/lib/gallery-store";
import { formatPrice } from "@/lib/utils";

export const Route = createFileRoute("/tours/$slug")({
  loader: ({ params }) => {
    const tour = tours.find(t => t.slug === params.slug);
    if (!tour) throw notFound();
    return { tour };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.tour.title} — Golden Takin Holidays` : "Tour" },
      { name: "description", content: loaderData?.tour.desc ?? "" },
      { property: "og:title", content: loaderData?.tour.title ?? "" },
      { property: "og:description", content: loaderData?.tour.desc ?? "" },
      { property: "og:image", content: loaderData?.tour.image ?? "" },
    ],
  }),
  component: TourDetail,
  notFoundComponent: () => <div className="pt-40 text-center"><h1 className="font-display text-4xl">Tour not found</h1></div>,
  errorComponent: ({ reset }) => <div className="pt-40 text-center"><button onClick={reset}>Retry</button></div>,
});

const galleryTitles = ["Valley arrival", "Dzong courtyard", "High pass view"];

function TourDetail() {
  const { tour } = Route.useLoaderData() as { tour: Tour };
  const itinerary: ItineraryDay[] = tour.itinerary ?? [];
  const brochure = brochures[tour.slug];
  const includes = tour.includes ?? [];
  const excludes = tour.excludes ?? [];
  const [photo, setPhoto] = useState(0);
  const [adminPanos, setAdminPanos] = useState<{ title: string; image: string; note?: string }[]>([]);
  useEffect(() => { setAdminPanos(getPanoramas(tour.slug)); }, [tour.slug]);
  const gallery = [brochure, tour.image, ...tours.filter((item) => item.slug !== tour.slug).slice(0, 2).map((item) => item.image)].filter(Boolean) as string[];
  const defaultPanoramas = gallery.map((image, index) => ({ title: galleryTitles[index] ?? `Panorama ${index + 1}`, image, views: 1200 + index * 246, note: "Interactive destination preview with drag rotation, zoom, fullscreen, download and share controls." }));
  const panoramas = [...adminPanos.map((p, i) => ({ ...p, views: 1820 + i * 134 })), ...defaultPanoramas];

  return (
    <article>
      <div className="relative min-h-[620px] overflow-hidden bg-ink text-hero-foreground">
        <img src={tour.image} alt={tour.title} className="absolute inset-0 w-full h-full object-cover scale-105 animate-float-slow" style={{ animationDuration: "30s" }} />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 mandala-bg opacity-20" />
        <div className="relative mx-auto grid min-h-[620px] max-w-[1500px] items-end gap-10 px-4 pb-14 pt-32 sm:px-6 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0">
            <Link to="/tours" className="mb-6 flex w-fit items-center gap-2 rounded-md border border-hero-foreground/15 bg-hero-foreground/10 px-3 py-2 text-sm text-gold backdrop-blur transition hover:bg-hero-foreground/15"><ArrowLeft className="w-4 h-4" /> All tours</Link>
            <div className="mb-4 text-xs uppercase tracking-[0.35em] text-gold">{tour.category}</div>
            <h1 className="max-w-4xl font-display text-5xl leading-none sm:text-6xl md:text-7xl">{tour.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-hero-foreground/75">{tour.desc}</p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-2 rounded-md bg-hero-foreground/10 px-3 py-2"><Clock className="w-4 h-4 text-gold" />{tour.duration}</span>
              <span className="flex items-center gap-2 rounded-md bg-hero-foreground/10 px-3 py-2"><MapPin className="w-4 h-4 text-gold" />{tour.location}</span>
              <span className="flex items-center gap-2 rounded-md bg-hero-foreground/10 px-3 py-2"><Users className="w-4 h-4 text-gold" />{tour.groupSize ?? "Private group"}</span>
              <span className="flex items-center gap-2 rounded-md bg-hero-foreground/10 px-3 py-2"><Star className="w-4 h-4 fill-gold text-gold" />{tour.rating ?? 4.9}</span>
            </div>
          </div>
          {brochure && (
            <a href={brochure} target="_blank" rel="noreferrer" className="group hidden overflow-hidden rounded-2xl border border-hero-foreground/15 bg-hero-foreground/10 p-3 backdrop-blur transition hover:border-gold/60 lg:block">
              <img src={brochure} alt={`${tour.title} official brochure`} className="w-full rounded-xl object-contain shadow-card transition-transform duration-700 group-hover:scale-[1.02]" />
              <div className="px-1 pb-1 pt-3 text-center text-[10px] uppercase tracking-[0.28em] text-gold">Official brochure</div>
            </a>
          )}
        </div>
      </div>


      <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <div className="min-w-0">
          <Reveal>
            <div className="mb-12 grid gap-4 sm:grid-cols-4">
              {[{ label: "Duration", value: tour.nights ?? tour.duration }, { label: "Best time", value: tour.bestTime ?? "Mar–May" }, { label: "Ideal for", value: tour.groupSize ?? "Private group" }, { label: "From", value: formatPrice(tour.price) }].map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-cypress">{item.label}</div>
                  <div className="mt-2 text-base font-bold leading-snug">{item.value}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="mb-16 grid gap-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="text-[10px] uppercase tracking-[0.28em] text-cypress">Overview</div>
                <p className="mt-4 leading-relaxed text-muted-foreground">{tour.overview ?? tour.desc}</p>
                {tour.idealFor && (
                  <p className="mt-5 rounded-lg bg-muted p-4 text-sm"><span className="font-semibold">Ideal for: </span>{tour.idealFor}</p>
                )}
              </div>
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="text-[10px] uppercase tracking-[0.28em] text-cypress">Package highlights</div>
                <ul className="mt-4 grid gap-3 text-sm">
                  {(tour.highlights ?? []).map((item) => (
                    <li key={item} className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" /><span>{item}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="mb-16">
              <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-cypress">Main feature</div>
                  <h2 className="mt-2 text-3xl font-bold sm:text-5xl">360° destination gallery</h2>
                </div>
              </div>
              <PanoramaViewer panoramas={panoramas} />
            </div>
          </Reveal>

          <Reveal>
            <div className="mb-16 overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <div className="relative h-[380px] bg-ink sm:h-[520px]">
                <img src={gallery[photo]} alt={`${tour.title} gallery ${photo + 1}`} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
                <button onClick={() => setPhoto((current) => (current + gallery.length - 1) % gallery.length)} className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/90"><ChevronLeft className="h-5 w-5" /></button>
                <button onClick={() => setPhoto((current) => (current + 1) % gallery.length)} className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/90"><ChevronRight className="h-5 w-5" /></button>
                <a href={gallery[photo]} download className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-lg bg-background/90 text-foreground"><Download className="h-4 w-4" /></a>
                <div className="absolute bottom-4 left-4 rounded-lg bg-ink/70 px-4 py-3 text-hero-foreground backdrop-blur">Photo {photo + 1} / {gallery.length}</div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="text-[10px] uppercase tracking-[0.28em] text-cypress">Day-by-day</div>
            <h2 className="mb-3 mt-2 font-display text-5xl leading-none">The journey</h2>
            <p className="mb-10 max-w-3xl leading-relaxed text-muted-foreground">{tour.tagline ? tour.tagline + " — " : ""}a day-by-day plan operated by our licensed guides, with overnight stops, drive times and highlights confirmed before you travel.</p>
          </Reveal>

          <div className="mb-16 space-y-3">
            {itinerary.map((d, i) => (
              <Reveal key={d.day} delay={i * 0.05}>
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 rounded-lg border border-border bg-card p-5 shadow-card transition hover:border-gold/60 sm:gap-6 sm:p-6">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-gradient-gold font-display text-xl text-primary-foreground sm:h-14 sm:w-14">{d.day}</div>
                  <div className="min-w-0">
                    <h3 className="mb-1 font-display text-2xl leading-none">{d.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{d.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {brochure && (
            <Reveal>
              <div className="mb-16 overflow-hidden rounded-xl border border-border bg-card shadow-card">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border p-6">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.28em] text-cypress">Official brochure</div>
                    <h2 className="mt-2 font-display text-4xl leading-none">{tour.title}</h2>
                  </div>
                  <a href={brochure} download className="inline-flex items-center gap-2 rounded-lg bg-gradient-gold px-5 py-3 text-sm font-semibold text-primary-foreground">
                    <Download className="h-4 w-4" /> Download brochure
                  </a>
                </div>
                <div className="bg-muted p-4 sm:p-8">
                  <img src={brochure} alt={`${tour.title} brochure — Golden Takin Holidays`} loading="lazy" className="mx-auto w-full max-w-3xl rounded-lg shadow-card" />
                </div>
              </div>
            </Reveal>
          )}

          <Reveal>
            <div className="mb-16 grid gap-5 md:grid-cols-2">
              <InfoList title="Included" items={includes} type="in" />
              <InfoList title="Excluded" items={excludes} type="out" />
            </div>
          </Reveal>


          <Reveal>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="text-[10px] uppercase tracking-[0.28em] text-cypress">Route map</div>
                <div className="relative mt-4 h-72 overflow-hidden rounded-xl bg-muted">
                  <div className="absolute inset-6 rounded-full border-2 border-dashed border-gold" />
                  {itinerary.slice(0, 5).map((day, index) => <div key={day.day} className="absolute grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground" style={{ left: `${18 + index * 16}%`, top: `${22 + (index % 2) * 34}%` }}>{day.day}</div>)}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="text-[10px] uppercase tracking-[0.28em] text-cypress">Reviews</div>
                <div className="mt-4 flex gap-1 text-gold">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-5 w-5 fill-current" />)}</div>
                <blockquote className="mt-5 text-sm leading-relaxed text-muted-foreground">“Perfect pacing, exceptional guide, and the 360° previews helped our family understand every route before booking.”</blockquote>
                <div className="mt-4 text-sm font-semibold">— Amara Wells</div>
              </div>
            </div>
          </Reveal>
        </div>

        <aside className="h-fit lg:sticky lg:top-28">
          <BookingWidget tour={tour} />
        </aside>
      </div>
    </article>
  );
}

function InfoList({ title, items, type }: { title: string; items: string[]; type: "in" | "out" }) {
  const Icon = type === "in" ? Check : X;
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>
      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-lg bg-muted p-3 text-sm">
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${type === "in" ? "text-cypress" : "text-crimson"}`} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
