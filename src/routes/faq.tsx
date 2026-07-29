import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ChevronDown, FileCheck2, Mountain, Plane, Shirt, Wallet } from "lucide-react";
import hero from "@/assets/festival.jpg";

type Faq = { q: string; a: string };

const sections: { id: string; title: string; icon: typeof Plane; blurb: string; items: Faq[] }[] = [
  {
    id: "visa",
    title: "Visa & entry frameworks",
    icon: FileCheck2,
    blurb: "Permits, e-Visa and the Sustainable Development Fee, handled end-to-end by our operations desk.",
    items: [
      {
        q: "What are the visa requirements for Bhutan, and how are they processed?",
        a: "Every international traveller needs an approved e-Visa or tourist permit before boarding a flight or crossing a land border. As a Department of Tourism licensed inbound operator, Golden Takin Holidays handles the whole clearance for you. We need a colour scan of your passport (valid at least 6 months beyond your departure from Bhutan), a recent passport-size photo on a plain background, and a completed personal details form. Approvals are usually stamped and emailed to you within 3 to 5 business days.",
      },
      {
        q: "What is the Sustainable Development Fee (SDF) and how does it apply?",
        a: "Bhutan follows a High Value, Low Volume tourism policy, and the SDF funds its conservation and free healthcare and education. Global tourists pay USD 100 per adult per night. Indian regional tourists with a valid passport or Voter ID pay a concessional BTN/INR 1,200 per adult per night. Children aged 6 to 12 get a 50% discount, and children 5 and under are fully exempt.",
      },
      {
        q: "Are there special procedures for travellers from India?",
        a: "Yes. Indian citizens enjoy streamlined entry and the lower SDF rate, but still need an approved e-Visa or entry permit before travelling. You must carry the identical physical document used in the permit application — a valid Indian passport or Election Commission Voter ID. Children under 18 without either may travel on an official English birth certificate alongside their parents' documents.",
      },
    ],
  },
  {
    id: "services",
    title: "Sector-wise travel services",
    icon: Mountain,
    blurb: "We do not run a one-size-fits-all model — ground execution is split into specialised thematic channels.",
    items: [
      {
        q: "What leisure and experiential tours do you operate?",
        a: "Fixed-departure group tours on high-capacity luxury coaches with bulk hotel allocations; family holidays built around child-friendly and elderly-accessible amenities with private chauffeured vehicles and tailored meals; and honeymoon or luxury getaways linking top-tier resorts such as COMO Uma Paro, Amankora and Six Senses, including traditional Bhutanese Buddhist wedding blessing ceremonies.",
      },
      {
        q: "What adventure and specialised expeditions are available?",
        a: "Alpine trekking from the beginner-friendly 4-day Druk Path Trek to the Jomolhari and Snowman treks, each backed by a dedicated ground crew, pack animals, camp chefs and emergency satellite communication. Wildlife and ornithology safaris run with local botanists and ornithologists, tracking the Black-Necked Crane in Phobjikha, the White-Bellied Heron and the Rufous-Necked Hornbill.",
      },
      {
        q: "Do you handle corporate MICE and educational exchange groups?",
        a: "Yes. We hold verified venue capacities across Thimphu and Paro, build custom team-building itineraries, and issue formatted corporate bids with tiered rate schedules. Academic institutional buyers get dedicated cultural-exchange programmes with school and monastic-institute visits.",
      },
    ],
  },
  {
    id: "logistics",
    title: "Logistics, transit & money",
    icon: Plane,
    blurb: "Flights, borders, fleets and payments — what to expect once you commit to the journey.",
    items: [
      {
        q: "How do we reach Bhutan, and what transport do you handle?",
        a: "By air, Paro International Airport connects with Delhi, Mumbai, Kolkata, Bangkok, Singapore and Kathmandu, flown exclusively by Drukair and Bhutan Airlines — we are an accredited ticketing agent and secure priority seating and group allocations. By road, you can cross from India at Phuentsholing (west), Gelephu (central) or Samdrup Jongkhar (east). On the ground we run luxury 4x4 SUVs, family utility vehicles and Toyota HiAce coaches with professional drivers trained for mountain terrain.",
      },
      {
        q: "What is the currency, and are digital payments accepted?",
        a: "The Bhutanese Ngultrum (BTN) is pegged 1:1 with the Indian Rupee, and INR notes (mainly 100 and 500) are accepted interchangeably at hotels, restaurants and shops. Cards and digital wallets work in high-end resorts and established galleries in Thimphu and Paro, but rarely in rural valleys — carry cash for tips, incidentals and village purchases.",
      },
      {
        q: "How do you manage disruptions during the trip?",
        a: "Our concierge stays reachable on WhatsApp throughout your journey. If a mountain pass closes or weather shifts in areas like Gasa or Haa, we reschedule the day, sync with your guide and driver in the field, and confirm revised hotel and meal arrangements before you feel the impact.",
      },
    ],
  },
  {
    id: "etiquette",
    title: "Dress code & etiquette",
    icon: Shirt,
    blurb: "Bhutan enforces respectful conduct at dzongs, temples and sacred landmarks.",
    items: [
      {
        q: "What is the dress code for monasteries and dzongs?",
        a: "Long trousers reaching the ankle or full-length skirts, shirts or blouses with long sleeves, and enclosed shoes. Shorts, short skirts, sleeveless and tank tops, open-toed sandals, flip-flops and caps are not permitted.",
      },
      {
        q: "Can I take photographs inside temples?",
        a: "You must remove shoes, hat and sunglasses before entering any inner sanctuary. Photography and video are strictly forbidden inside temple interiors, though open-air courtyards are generally fine.",
      },
      {
        q: "When is the best time to travel?",
        a: "March to May brings rhododendrons and major tshechu festivals; September to November delivers the clearest Himalayan views. Winter is the season for Black-Necked Cranes in Phobjikha, and the June to August monsoon is lush, quieter and better value.",
      },
    ],
  },
];

const valleys = [
  { hub: "Thimphu (HQ)", alt: "~2,320 m", highlights: "Buddha Dordenma, Tashichho Dzong, National Memorial Chorten", season: "Year-round" },
  { hub: "Paro", alt: "~2,200 m", highlights: "Taktsang (Tiger's Nest), Rinpung Dzong, Kyichu Lhakhang", season: "Mar–May & Sep–Nov" },
  { hub: "Punakha & Wangdue", alt: "~1,250 m", highlights: "Punakha Dzong, suspension bridge, Chimi Lhakhang", season: "Sep–May" },
  { hub: "Bumthang Valley", alt: "~2,800 m", highlights: "Jambay Lhakhang, Kurjey Lhakhang, Jakar Dzong", season: "Mar–May & Oct–Nov" },
  { hub: "Haa & Gasa", alt: ">2,900 m", highlights: "Remote homestays, alpine wilderness, Gasa hot springs", season: "Apr–Oct" },
];

const sdf = [
  { t: "Global tourists", v: "USD 100", s: "per adult, per night" },
  { t: "Indian regional", v: "INR 1,200", s: "per adult, per night" },
  { t: "Children 6–12", v: "50% off", s: "of the applicable daily SDF" },
  { t: "Children under 6", v: "Exempt", s: "no SDF payable" },
];

const allFaqs = sections.flatMap((s) => s.items);

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: "Bhutan Travel FAQ | Visa, SDF, Permits & Logistics" },
      { name: "description", content: "Answers on Bhutan visas, the Sustainable Development Fee, Indian permits, flights, currency, dress code and valley routes — from Golden Takin Holidays, a licensed inbound operator." },
      { name: "keywords", content: "Bhutan visa FAQ, Bhutan SDF cost, Bhutan permit for Indians, Bhutan travel questions, Bhutan dress code" },
      { property: "og:title", content: "Bhutan Travel FAQ | Visa, SDF, Permits & Logistics" },
      { property: "og:description", content: "Answers on Bhutan visas, the Sustainable Development Fee, Indian permits, flights, currency, dress code and valley routes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: allFaqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
});

function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="GTH-OPS-FAQ-2026"
        title="Travel FAQ"
        subtitle="Everything travellers ask us before landing in Paro — visas, the Sustainable Development Fee, transport, money and monastery etiquette."
        image={hero}
      >
        <div className="grid grid-cols-2 gap-2 text-center">
          {sdf.slice(0, 2).map((s) => (
            <div key={s.t} className="rounded-xl border border-hero-foreground/15 bg-hero-foreground/10 p-3 backdrop-blur-xl">
              <div className="text-xl font-bold text-gold">{s.v}</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-hero-foreground/68">{s.t}</div>
            </div>
          ))}
        </div>
      </PageHero>

      <div className="section-shell py-12 sm:px-6 sm:py-16">
        <Reveal>
          <div className="mb-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sdf.map((s) => (
              <div key={s.t} className="rounded-xl border border-border bg-card p-5 shadow-card hover-lift">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-cypress"><Wallet className="h-3.5 w-3.5" /> SDF</div>
                <div className="mt-3 font-display text-3xl text-gradient-gold">{s.v}</div>
                <div className="mt-1 text-sm font-semibold">{s.t}</div>
                <div className="text-xs text-muted-foreground">{s.s}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="min-w-0 space-y-10">
            {sections.map((section, si) => (
              <Reveal key={section.id} delay={si * 0.05}>
                <section id={section.id} className="scroll-mt-28">
                  <div className="mb-5 flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold/40 bg-gold/10 text-gold">
                      <section.icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-display text-2xl leading-tight sm:text-3xl">{section.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{section.blurb}</p>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {section.items.map((item) => <FaqItem key={item.q} item={item} />)}
                  </div>
                </section>
              </Reveal>
            ))}

            <Reveal>
              <section className="scroll-mt-28">
                <h2 className="mb-4 font-display text-2xl sm:text-3xl">Regional valley route matrix</h2>
                <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="bg-muted text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Valley hub</th>
                        <th className="px-4 py-3">Altitude</th>
                        <th className="px-4 py-3">Signature highlights</th>
                        <th className="px-4 py-3">Ideal season</th>
                      </tr>
                    </thead>
                    <tbody>
                      {valleys.map((v) => (
                        <tr key={v.hub} className="border-t border-border/70">
                          <td className="px-4 py-3 font-semibold">{v.hub}</td>
                          <td className="px-4 py-3 text-gold">{v.alt}</td>
                          <td className="px-4 py-3 text-muted-foreground">{v.highlights}</td>
                          <td className="px-4 py-3 text-muted-foreground">{v.season}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </Reveal>
          </div>

          <aside className="grid gap-4 lg:sticky lg:top-24">
            <div className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="text-[10px] uppercase tracking-[0.24em] text-cypress">Jump to</div>
              <div className="mt-3 grid gap-1.5">
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="rounded-lg px-3 py-2 text-sm text-foreground/75 transition hover:bg-muted hover:text-foreground">{s.title}</a>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-gold/35 bg-gradient-to-b from-gold/12 to-transparent p-5 shadow-card">
              <h3 className="font-display text-xl">Still have a question?</h3>
              <p className="mt-2 text-sm text-muted-foreground">Our Thimphu desk answers visa, permit and itinerary queries within one business day.</p>
              <div className="mt-4 grid gap-2">
                <Link to="/contact" className="rounded-lg bg-gradient-gold px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-gold">Talk to us</Link>
                <Link to="/plan" className="rounded-lg border border-border px-4 py-2.5 text-center text-sm font-semibold text-foreground/80 transition hover:bg-muted">Ask the AI planner</Link>
              </div>
              <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                <div>Head office · Norzin Lam, Thimphu, Bhutan</div>
                <div>Branches · Sydney, Australia · New York, USA</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function FaqItem({ item }: { item: Faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`overflow-hidden rounded-xl border bg-card shadow-card transition ${open ? "border-gold/45" : "border-border"}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 text-left sm:px-5"
      >
        <span className="min-w-0 text-sm font-semibold sm:text-base">{item.q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-gold transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="px-4 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-5">{item.a}</p>
        </div>
      </div>
    </div>
  );
}
