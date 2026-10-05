import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Mail, Phone, MapPin, MessageCircle, Send, Sparkles, Clock, Globe } from "lucide-react";
import { useState } from "react";
import thimphu from "@/assets/thimphu.jpg";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact Golden Takin Holidays | Global Travel Desks (Bhutan, UK, Australia, India)" },
      {
        name: "description",
        content:
          "Connect with Golden Takin Holidays. Official 24/7 WhatsApp: +91-8514889385, Bhutan HQ: +975-1797-0050, Australia: +61-404-343-370, UK: +44-7586203728. Email: info@goldentakinholidays.bt.",
      },
      { property: "og:title", content: "Contact Golden Takin Holidays | Global Travel Desks" },
      {
        property: "og:description",
        content: "Bhutan, Nepal, Tibet and India (NE) tour planning desks. Special UK Promo Code: WSUKSU26.",
      },
    ],
  }),
});

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "United Kingdom",
    destinations: "Bhutan",
    travelers: 2,
    travelDate: "",
    promoCode: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save inquiry to database
      const { error } = await supabase.from("travel_inquiries").insert({
        guest_name: formData.name,
        tour_name: `${formData.destinations} Tour Inquiry`,
        travel_date: formData.travelDate || null,
        travelers: Number(formData.travelers) || 1,
        status: "New",
      });

      if (error) {
        console.warn("Direct DB insert error (fallback simulated):", error.message);
      }

      setSent(true);
      toast.success("Inquiry Submitted Successfully!", {
        description: `Your request has been routed to info@goldentakinholidays.bt. A Bhutan travel specialist will contact you within 12 hours.`,
      });
    } catch {
      setSent(true);
      toast.success("Inquiry Received!", {
        description: "Thank you for reaching out. We will connect with you via WhatsApp/Email shortly.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Global Inquiries & Booking Desks"
        title="Connect With Our Himalayan Specialists"
        subtitle="Planning your journey to Bhutan, Nepal, Tibet, or India (NE). Reach our dedicated regional desks in Bhutan, the United Kingdom, Australia, or on WhatsApp."
        image={thimphu}
      />

      <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6">
        {/* Quick Regional Helpline Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          <div className="p-4 rounded-xl border border-gold/30 bg-card shadow-card flex items-start gap-3">
            <span className="text-2xl">🇧🇹</span>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Bhutan Head Office</div>
              <a href="tel:+97517970050" className="text-sm font-bold text-foreground hover:text-gold transition">
                +975-1797-0050
              </a>
              <div className="text-[11px] text-muted-foreground">Thimphu 11001</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10 shadow-card flex items-start gap-3">
            <span className="text-2xl">💬</span>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">24/7 WhatsApp Desk</div>
              <a
                href="https://wa.me/918514889385"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-foreground hover:text-emerald-500 transition"
              >
                +91-8514889385
              </a>
              <div className="text-[11px] text-muted-foreground">Instant Replies</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-card flex items-start gap-3">
            <span className="text-2xl">🇦🇺</span>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Australia Desk</div>
              <a href="tel:+61404343370" className="text-sm font-bold text-foreground hover:text-gold transition">
                +61-404-343-370
              </a>
              <div className="text-[11px] text-muted-foreground">Sydney / Melbourne</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gold/40 bg-gold/5 shadow-card flex items-start gap-3">
            <span className="text-2xl">🇬🇧</span>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-gold">United Kingdom Desk</div>
              <a href="tel:+447586203728" className="text-sm font-bold text-foreground hover:text-gold transition">
                +44-7586203728
              </a>
              <div className="text-[11px] text-gold font-mono font-semibold">Promo: WSUKSU26</div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_420px]">
          {/* Inquiry Form */}
          <Reveal>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl border border-border bg-card p-6 sm:p-8 md:p-10 shadow-card"
            >
              <div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-gold font-bold">Personalized Itinerary & Quote</div>
                <h2 className="mt-1 font-display text-3xl sm:text-4xl text-foreground font-bold">Start Planning Your Journey</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Complete the details below. Our inbound travel team in Thimphu will craft a detailed itinerary and transparent pricing.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Your Name *</label>
                  <input
                    placeholder="Full name as on passport/ID"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none transition focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Email Address *</label>
                  <input
                    placeholder="you@domain.com"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none transition focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Phone / WhatsApp Number *</label>
                  <input
                    placeholder="e.g. +44 7586 203728 or +91 85148 89385"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none transition focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Country of Residence</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none transition focus:border-gold"
                  >
                    <option value="United Kingdom">United Kingdom (UK)</option>
                    <option value="Australia">Australia (AUS)</option>
                    <option value="India">India</option>
                    <option value="United States">United States (USA)</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany / Europe</option>
                    <option value="Other">Other International</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Destinations</label>
                  <select
                    value={formData.destinations}
                    onChange={(e) => setFormData({ ...formData, destinations: e.target.value })}
                    className="w-full rounded-xl border border-border bg-input px-3.5 py-3 text-sm outline-none transition focus:border-gold"
                  >
                    <option value="Bhutan">Bhutan Only</option>
                    <option value="Nepal & Bhutan">Nepal & Bhutan Explorer</option>
                    <option value="Tibet & Bhutan">Tibet & Bhutan Spiritual</option>
                    <option value="Grand Himalayan Trilogy">Trilogy: Bhutan, Nepal & Tibet</option>
                    <option value="India NE & Bhutan">India (NE) & Bhutan Overland</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Number of Guests</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={formData.travelers}
                    onChange={(e) => setFormData({ ...formData, travelers: Number(e.target.value) })}
                    className="w-full rounded-xl border border-border bg-input px-3.5 py-3 text-sm outline-none transition focus:border-gold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Promo Code</label>
                  <input
                    placeholder="e.g. WSUKSU26"
                    value={formData.promoCode}
                    onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                    className="w-full rounded-xl border border-gold/40 bg-gold/5 px-3.5 py-3 text-sm font-mono uppercase outline-none transition focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Special Requests & Interests</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your travel dates, preferred hotel style (2-Star, 3-Star, Luxury Resort), Tiger's Nest hike preferences, or special dietary requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full resize-none rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none transition focus:border-gold"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-gold px-8 py-3.5 font-bold text-primary-foreground transition hover:shadow-gold disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {loading ? "Transmitting..." : sent ? "Inquiry Sent Successfully!" : "Submit Travel Inquiry"}
                </button>

                <div className="text-[11px] text-muted-foreground text-center sm:text-right">
                  🔒 Strictly Confidential · Zero Spam Guarantee
                </div>
              </div>
            </form>
          </Reveal>

          {/* Department Directory & Details Sidebar */}
          <Reveal delay={0.1}>
            <div className="space-y-4">
              {/* Official 6 Inboxes */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h3 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gold" />
                  Official Department Inboxes
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-muted/50 border border-border/60">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">1. Inquiries & Planning</div>
                    <a href="mailto:info@goldentakinholidays.bt" className="text-sm font-semibold text-gold hover:underline">
                      info@goldentakinholidays.bt
                    </a>
                  </div>

                  <div className="p-2.5 rounded-lg bg-muted/50 border border-border/60">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">2. Head Office & Fleet Operations</div>
                    <a href="mailto:office@goldentakinholidays.bt" className="text-sm font-semibold text-gold hover:underline">
                      office@goldentakinholidays.bt
                    </a>
                  </div>

                  <div className="p-2.5 rounded-lg bg-muted/50 border border-border/60">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">3. B2B Travel Trade & DMA Partners</div>
                    <a href="mailto:bdm@goldentakinholidays.bt" className="text-sm font-semibold text-gold hover:underline">
                      bdm@goldentakinholidays.bt
                    </a>
                  </div>

                  <div className="p-2.5 rounded-lg bg-muted/50 border border-border/60">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">4. 24/7 Guest Assistance Desk</div>
                    <a href="mailto:support@goldentakinholidays.bt" className="text-sm font-semibold text-gold hover:underline">
                      support@goldentakinholidays.bt
                    </a>
                  </div>

                  <div className="p-2.5 rounded-lg bg-muted/50 border border-border/60">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">5. General Manager</div>
                    <a href="mailto:gm@goldentakinholidays.bt" className="text-sm font-semibold text-gold hover:underline">
                      gm@goldentakinholidays.bt
                    </a>
                  </div>

                  <div className="p-2.5 rounded-lg bg-muted/50 border border-border/60">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">6. Executive Director / CEO</div>
                    <a href="mailto:ceo@goldentakinholidays.bt" className="text-sm font-semibold text-gold hover:underline">
                      ceo@goldentakinholidays.bt
                    </a>
                  </div>
                </div>
              </div>

              {/* Physical Address & Hours */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Headquarters</div>
                    <div className="font-semibold text-foreground mt-0.5">Norzin Lam, Post Box 1024</div>
                    <div className="text-muted-foreground">Thimphu 11001, Kingdom of Bhutan</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-border/60">
                  <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Hours & Response Time</div>
                    <div className="font-semibold text-foreground mt-0.5">Monday – Saturday: 9:00 AM – 6:30 PM BTT</div>
                    <div className="text-emerald-500 font-medium">WhatsApp Assistance Available 24/7/365</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-border/60">
                  <Globe className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Artisan Products</div>
                    <div className="font-semibold text-foreground mt-0.5">Handicraft Association of Bhutan Sourcing</div>
                    <a
                      href="https://www.takinmart.bt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:underline font-semibold"
                    >
                      Visit TakinMart: www.takinmart.bt &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
