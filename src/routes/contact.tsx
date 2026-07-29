import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import thimphu from "@/assets/thimphu.jpg";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Golden Takin Holidays" },
      { name: "description", content: "Speak with a Bhutan specialist. Plan your bespoke journey today." },
      { property: "og:title", content: "Contact Golden Takin Holidays" },
      { property: "og:description", content: "Talk to a Bhutan specialist." },
    ],
  }),
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHero eyebrow="Get in touch" title="Talk to a specialist" subtitle="Tell us about the journey, group and dates. A Bhutanese specialist will reply with a structured next step within 24 hours." image={thimphu} />

      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <Reveal>
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); toast.success("Message saved", { description: "Your inquiry was added to the travel desk." }); }} className="space-y-4 rounded-lg border border-border bg-card p-5 shadow-card sm:p-8 md:p-10">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-cypress">Inquiry form</div>
              <h2 className="mt-2 font-display text-5xl leading-none">Start planning</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input placeholder="Full name" required className="w-full rounded-md border border-border bg-input px-4 py-3.5 outline-none transition focus:border-gold" />
              <input placeholder="Email" type="email" required className="w-full rounded-md border border-border bg-input px-4 py-3.5 outline-none transition focus:border-gold" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input placeholder="Phone (with country code)" className="w-full rounded-md border border-border bg-input px-4 py-3.5 outline-none transition focus:border-gold" />
              <input placeholder="Type of journey" list="journey-types" className="w-full rounded-md border border-border bg-input px-4 py-3.5 text-foreground/80 outline-none transition focus:border-gold" />
              <datalist id="journey-types">
                <option value="Culture Exchange" />
                <option value="Buddhist Pilgrimage" />
                <option value="Trekking" />
                <option value="Family & Leisure" />
                <option value="Bespoke" />
              </datalist>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input placeholder="Preferred dates" className="w-full rounded-md border border-border bg-input px-4 py-3.5 outline-none transition focus:border-gold" />
              <input placeholder="Number of travellers" type="number" className="w-full rounded-md border border-border bg-input px-4 py-3.5 outline-none transition focus:border-gold" />
            </div>
            <textarea required rows={5} placeholder="Tell us about your dream Bhutan trip..." className="w-full resize-none rounded-md border border-border bg-input px-4 py-3.5 outline-none transition focus:border-gold" />
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-gold px-8 py-4 font-medium text-primary-foreground transition hover:shadow-gold md:w-auto">
              <Send className="w-4 h-4" /> {sent ? "Message sent — kuzu zangpo!" : "Send message"}
            </button>
          </form>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-4">
            {[
              { icon: MapPin, t: "Visit our office", v: "Norzin Lam, Thimphu 11001, Bhutan" },
              { icon: Phone, t: "Call us", v: "+975 17 11 22 33" },
              { icon: Mail, t: "Email", v: "goldentakinholidays@gmail.com" },
              { icon: MessageCircle, t: "WhatsApp", v: "+975 17 11 22 33" },
            ].map(({ icon: I, t, v }) => (
              <div key={t} className="flex items-start gap-4 rounded-lg border border-border bg-card p-5 shadow-card">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-muted text-cypress"><I className="w-5 h-5" /></div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{t}</div>
                  <div className="text-foreground mt-1">{v}</div>
                </div>
              </div>
            ))}
            <div className="mt-2 rounded-lg bg-secondary p-6 text-secondary-foreground shadow-card">
              <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-gold-soft">Office hours</div>
              <div className="text-sm text-foreground/85">Mon — Sat · 9:00 AM — 6:00 PM BTT</div>
              <div className="mt-2 text-xs text-secondary-foreground/70">We typically reply within 24 hours, even on Sundays.</div>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
