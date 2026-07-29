import { createFileRoute, Link } from "@tanstack/react-router";
import { experiences } from "@/lib/data";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { ArrowRight } from "lucide-react";
import festival from "@/assets/festival.jpg";

export const Route = createFileRoute("/experiences")({
  component: ExperiencesPage,
  head: () => ({
    meta: [
      { title: "Experiences — Royal Takin Tours" },
      { name: "description", content: "Signature Bhutanese experiences: monastic mornings, masked dances, hot stone baths and Himalayan treks." },
      { property: "og:title", content: "Bhutan Experiences" },
      { property: "og:description", content: "Signature moments crafted by local experts." },
    ],
  }),
});

function ExperiencesPage() {
  return (
    <>
      <PageHero eyebrow="Beyond sightseeing" title="Signature experiences" subtitle="Premium Bhutan moments organized into clear, bookable panels: spiritual, cultural, active and restorative." image={festival} />
      <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 sm:py-16">
      <SectionTitle eyebrow="Experience library" title="Choose the feeling of your journey" subtitle="The unforgettable moments that turn a holiday into a story." />
      <div className="space-y-8 sm:space-y-10">
        {experiences.map((e, i) => (
          <Reveal key={e.title}>
            <div className={`grid overflow-hidden rounded-lg border border-border bg-card shadow-card md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div className="relative min-h-72 overflow-hidden">
                <img src={e.image} alt={e.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1500ms] hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-tr from-ink/45 to-transparent" />
              </div>
              <div className="flex min-w-0 flex-col justify-center p-6 sm:p-10">
                <div className="mb-4 text-[10px] uppercase tracking-[0.35em] text-cypress">Experience {String(i + 1).padStart(2, "0")}</div>
                <h2 className="font-display text-5xl leading-none">{e.title}</h2>
                <p className="mb-8 mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">{e.desc} A guided immersion that few travelers ever see, delivered with the reverence it deserves.</p>
                <Link to="/tours" className="inline-flex w-fit items-center gap-2 rounded-md bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground transition hover:shadow-gold">
                  Add to my journey <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      </div>
    </>
  );
}
