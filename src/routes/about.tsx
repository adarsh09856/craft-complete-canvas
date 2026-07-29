import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import culture from "@/assets/culture.jpg";
import festival from "@/assets/festival.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Golden Takin Holidays | Licensed Bhutan Tour Operator" },
      { name: "description", content: "Learn about Golden Takin Holidays, a TCB-licensed inbound tour operator based in Thimphu, Bhutan, committed to sustainable, high-value travel experiences." },
      { name: "keywords", content: "about Golden Takin Holidays, Bhutan tour operator Thimphu, TCB licensed tour operator, Bhutan travel company" },
      { property: "og:title", content: "About Golden Takin Holidays | Licensed Bhutan Tour Operator" },
      { property: "og:description", content: "Learn about Golden Takin Holidays, a TCB-licensed inbound tour operator based in Thimphu, Bhutan, committed to sustainable, high-value travel experiences." },
      { property: "og:image", content: festival },
    ],
  }),
});

const facts = [
  { n: "1907", l: "Monarchy founded" },
  { n: "38,394", l: "Square kilometres" },
  { n: "7,570m", l: "Highest peak (Gangkhar Puensum)" },
  { n: "1974", l: "First opened to tourism" },
];

const services = [
  { t: "Customised package tours", d: "Fifteen thematic Bhutan packages — culture, nature, trekking, MICE, weddings — reshaped around your pace and season." },
  { t: "Visa & permit processing", d: "Bhutan visa for foreign travellers, permits for Indian nationals, and SDF handling from start to finish." },
  { t: "Air & rail ticketing", d: "Drukair and Bhutan Airlines bookings, plus rail support to NJP / Bagdogra gateways for overland arrivals." },
  { t: "Hotels & resorts", d: "3-star to luxury reservations, including Uma Paro, Amankora and Six Senses, matched to budget and route." },
  { t: "Transport & transfers", d: "Chauffeur-driven cars, 4x4 SUVs and coaches, with Paro International Airport transfers on every itinerary." },
  { t: "Corporate, MICE & B2B", d: "Conference venues, gala dinners and team-building, plus DMC partnerships for agents, corporates and institutions." },
];


function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Land of the Thunder Dragon" title="About Bhutan" subtitle="A kingdom in the eastern Himalayas where happiness is a measure of progress and tradition lives alongside modernity." image={festival} />
      <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-16 grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center lg:gap-14">
        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-lg shadow-card">
            <img src={culture} alt="Monks" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </div>
        </Reveal>
        <Reveal>
          <div className="text-[10px] uppercase tracking-[0.28em] text-cypress">Context</div>
          <h2 className="mt-3 font-display text-5xl leading-none sm:text-6xl">The Last Shangri-La</h2>
          <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
            <p>Bhutan opened its borders to the world only in 1974, and to this day caps tourist numbers to preserve its environment and culture. It is the world's only carbon-negative country.</p>
            <p>Gross National Happiness — not GDP — is the official measure of progress. The four pillars: good governance, sustainable development, preservation of culture, and conservation of the environment.</p>
            <p>The state religion is Vajrayana Buddhism, threaded into every aspect of daily life. Monasteries cling to cliffs, prayer flags carry blessings on the wind, and architecture has not changed for centuries by royal decree.</p>
          </div>
        </Reveal>
      </div>

      <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((f, i) => (
          <Reveal key={f.l} delay={i * 0.08}>
            <div className="rounded-lg border border-border bg-card p-6 text-center shadow-card">
              <div className="font-display text-4xl text-gradient-gold sm:text-5xl">{f.n}</div>
              <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{f.l}</div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mb-16">
        <Reveal>
          <div className="text-[10px] uppercase tracking-[0.28em] text-cypress">What we handle</div>
          <h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">A full-service Bhutan travel desk</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.06}>
              <div className="h-full rounded-lg border border-border bg-card p-6 shadow-card hover-lift">
                <div className="font-display text-xl">{s.t}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>



      <Reveal>
        <div className="rounded-lg bg-ink p-8 text-center text-hero-foreground shadow-deep sm:p-12">
          <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Our promise</div>
          <h2 className="mt-3 font-display text-5xl leading-none">Local, measured, complete.</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-hero-foreground/70">
            We are a Bhutanese family-run company, founded by guides who grew up in these valleys. Every itinerary supports local artisans, family-run lodges and conservation projects.
          </p>
        </div>
      </Reveal>
    </div>
    </>
  );
}
