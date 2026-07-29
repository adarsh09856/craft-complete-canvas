import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { destinations, tours } from "@/lib/data";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { PanoramaViewer } from "@/components/PanoramaViewer";
import { ArrowRight, Compass, MapPin, X } from "lucide-react";
import punakha from "@/assets/punakha.jpg";

export const Route = createFileRoute("/destinations")({
  component: DestinationsPage,
  head: () => ({
    meta: [
      { title: "Destinations — Golden Takin Holidays" },
      { name: "description", content: "Explore Bhutan's sacred valleys: Paro, Thimphu, Punakha, Bumthang and beyond." },
      { property: "og:title", content: "Bhutan Destinations" },
      { property: "og:description", content: "From mountain capitals to spiritual valleys." },
    ],
  }),
});

const highlights: Record<string, string[]> = {
  paro: ["Taktsang (Tiger's Nest)", "Rinpung Dzong", "National Museum", "Chele La Pass"],
  thimphu: ["Buddha Dordenma", "Tashichho Dzong", "Weekend Market", "Motithang Takin Preserve"],
  punakha: ["Punakha Dzong", "Chimi Lhakhang", "Suspension Bridge", "Cherry blossoms"],
  bumthang: ["Kurjey Lhakhang", "Jambay Lhakhang", "Tang Valley", "Burning Lake"],
};

function DestinationsPage() {
  const [preview, setPreview] = useState<null | { name: string; image: string; slug: string }>(null);

  return (
    <>
      <PageHero
        eyebrow="Where to wander"
        title="Sacred destinations"
        subtitle="Every valley has a distinct rhythm: fortress towns, cliff monasteries, craft villages and quiet highland roads."
        image={punakha}
      />
      <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 sm:py-16">
        <SectionTitle
          eyebrow="Regional planner"
          title="Choose your anchor valleys"
          subtitle="Preview each valley in 360°, review highlights, then jump straight to matching tours."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {destinations.map((d, i) => {
            const relatedCount = tours.filter((t) => t.location.toLowerCase().includes(d.name.toLowerCase())).length;
            const dHighlights = highlights[d.slug] ?? ["Monasteries", "Local craft", "Trails", "Cuisine"];
            return (
              <Reveal key={d.slug} delay={i * 0.06}>
                <article className="group grid overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:shadow-deep lg:grid-cols-[1fr_0.86fr]">
                  <div className="relative min-h-72 overflow-hidden">
                    <img src={d.image} alt={d.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/25 to-transparent" />
                    <div className="absolute left-4 top-4 chip bg-background/90 text-cypress"><MapPin className="h-3 w-3" /> Bhutan</div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="font-display text-4xl text-hero-foreground sm:text-5xl">{d.name}</div>
                      <div className="mt-1 text-xs text-hero-foreground/80">{relatedCount} tour{relatedCount === 1 ? "" : "s"} · immersive 360° preview</div>
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-col justify-between gap-6 p-6 sm:p-7">
                    <div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {d.desc}. Visit ancient dzongs, monasteries and artisans whose craft has been refined over centuries.
                      </p>
                      <div className="mt-5 grid grid-cols-2 gap-2">
                        {dHighlights.map((h) => (
                          <div key={h} className="rounded-lg bg-muted px-3 py-2 text-xs font-medium text-foreground">{h}</div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link to="/tours" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-gold px-4 py-3 text-sm font-semibold text-primary-foreground shadow-gold transition hover:shadow-deep">
                        Explore tours <ArrowRight className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPreview({ name: d.name, image: d.image, slug: d.slug })}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-cypress transition hover:border-saffron hover:text-saffron"
                      >
                        <Compass className="h-4 w-4" /> 360° preview
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      {preview && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-ink/85 p-4 backdrop-blur" onClick={() => setPreview(null)}>
          <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-card shadow-deep" onClick={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border p-4">
              <div className="min-w-0">
                <div className="eyebrow text-saffron">Immersive preview</div>
                <div className="mt-1 font-display text-2xl">{preview.name} · 360°</div>
              </div>
              <button onClick={() => setPreview(null)} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-lg border border-border hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-4">
              <PanoramaViewer panoramas={[{ title: `${preview.name} valley`, image: preview.image, note: "Drag to rotate · scroll to zoom" }]} />
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-border p-4">
              <Link to="/tours" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-gold px-4 py-3 text-sm font-semibold text-primary-foreground">See {preview.name} tours <ArrowRight className="h-4 w-4" /></Link>
              <button onClick={() => setPreview(null)} className="rounded-xl border border-border px-4 py-3 text-sm font-semibold hover:bg-muted">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
