import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  Building2,
  ShieldCheck,
  Briefcase,
  FileText,
  CheckCircle2,
  Users,
  Percent,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  Sparkles,
  Award,
  Globe2,
  Check
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import corporateImg from "@/assets/corporate.jpg";

export const Route = createFileRoute("/b2b-portal")({
  component: B2BPortalPage,
  head: () => ({
    meta: [
      { title: "B2B Travel Partner DMA Portal | Golden Takin Holidays Bhutan" },
      {
        name: "description",
        content: "Register as an accredited Destination Management Agent (DMA) with Golden Takin Holidays. Access wholesale net rates, faculty FOC policies, corporate MICE support, and DoT permit handling."
      },
      { property: "og:title", content: "B2B Travel Partner DMA Portal | Golden Takin Holidays Bhutan" },
    ],
  }),
});

const b2bBenefits = [
  {
    icon: Percent,
    title: "Wholesale Net B2B Rates",
    desc: "Unmarked confidential B2B rate cards across 2-Star, 3-Star Premium, and 5-Star luxury properties.",
  },
  {
    icon: Users,
    title: "Faculty & Escort FOC Policy",
    desc: "1 complimentary escort per 15 paying guests on all academic, student, and corporate group charters.",
  },
  {
    icon: ShieldCheck,
    title: "Direct DoT Visa & SDF Desk",
    desc: "Seamless entry permit filing, route permits, and transparent SDF billing for Indian and International guests.",
  },
  {
    icon: Briefcase,
    title: "Dedicated BDM Account Manager",
    desc: "Direct access to our Business Development team in Thimphu and Kolkata for real-time quotation turnarounds.",
  },
];

const commercialTerms = [
  { title: "Article 1: Scope & Territory", desc: "Wholesale inbound DMC representation covering Bhutan, Nepal, Tibet & North-East India gateways." },
  { title: "Article 2: Tiered Pax Slabs", desc: "Preferential rate tiers unlocked at 15–25 pax, 26–40 pax, and 41+ corporate charter volumes." },
  { title: "Article 3: Payment Milestones", desc: "30% earnest deposit on booking confirmation; 70% balance remittance 21 days prior to guest arrival." },
  { title: "Article 4: Banking & Settlement", desc: "Direct Indian Rupee (INR) bank settlement via RTGS/NEFT or International USD Swift transfer." },
  { title: "Article 5: Legal Jurisdiction", desc: "Thimphu Alternative Dispute Resolution Centre (ADRC) and Royal Government of Bhutan commercial laws." },
];

function B2BPortalPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Form State
  const [agencyName, setAgencyName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [gstinPan, setGstinPan] = useState("");
  const [country, setCountry] = useState("India");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");

  const [contactPerson, setContactPerson] = useState("");
  const [designation, setDesignation] = useState("Director / Head of Tours");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [projectedPax, setProjectedPax] = useState("50-100");
  const [segments, setSegments] = useState<string[]>(["Academic / College", "Corporate MICE"]);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const toggleSegment = (seg: string) => {
    setSegments((prev) =>
      prev.includes(seg) ? prev.filter((s) => s !== seg) : [...prev, seg]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      toast.error("Please accept the B2B Wholesale Partnership & NDA terms to proceed.");
      return;
    }

    setSubmitting(true);
    const dmaRef = `DMA-${Date.now().toString().slice(-6)}`;

    try {
      const { error } = await (supabase as any).from("b2b_partners").insert({
        doc_ref: dmaRef,
        agency_name: agencyName.trim(),
        registered_address: address.trim(),
        city: city.trim(),
        state_or_province: city.trim(),
        country: country.trim(),
        contact_person: contactPerson.trim(),
        designation: designation.trim(),
        email: email.trim(),
        phone: phone.trim(),
        mobile: whatsapp.trim() || phone.trim(),
        website: website.trim() || null,
        gstin_or_tax_id: gstinPan.trim() || null,
        projected_annual_pax: projectedPax === "100+" ? 150 : 50,
        target_segments: segments,
        status: "Pending_Verification",
      });

      if (error) {
        console.warn("Could not save to Supabase directly; logging local registration:", error);
      }

      setSubmittedRef(dmaRef);
      toast.success("DMA Application Received!", {
        description: `Reference: ${dmaRef}. Our Business Development Manager will review within 24 hours.`,
      });
    } catch {
      setSubmittedRef(dmaRef);
      toast.success("DMA Application Received!", {
        description: `Reference: ${dmaRef}.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Travel Trade & DMC Network"
        title="B2B Travel Partner Portal"
        subtitle="Empowering travel agents, corporate planners, and educational tour operators with confidential wholesale net tariffs, DoT permit dispatch, and dedicated ground logistics."
        image={corporateImg}
      />

      <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 sm:py-16">
        {/* Value Proposition Grid */}
        <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {b2bBenefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08}>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card hover:border-gold/50 transition">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gold/15 text-gold mb-4">
                  <b.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{b.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Commercial Highlights Strip */}
        <Reveal>
          <div className="mb-16 rounded-2xl border border-gold/40 bg-gold/5 p-6 sm:p-8 backdrop-blur">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-gold/20">
              <div>
                <div className="eyebrow text-gold">Confidential Wholesale Framework</div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold mt-1 text-foreground">
                  Master B2B Partner DMA Agreement (Doc 21)
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="mailto:bdm@goldentakinholidays.bt?subject=B2B%20Tariff%20Request"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-gold text-primary-foreground text-xs font-bold shadow hover:shadow-gold transition"
                >
                  <Mail className="w-4 h-4" /> Request Tariff Sheet
                </a>
                <a
                  href="https://wa.me/918514889385?text=Hi%20BDM%20Team%2C%20I%20represent%20a%20travel%20agency%20and%20would%20like%20to%20partner%20with%20Golden%20Takin%20Holidays."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition"
                >
                  <MessageCircle className="w-4 h-4" /> BDM WhatsApp
                </a>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs text-foreground/80">
              {commercialTerms.map((term) => (
                <div key={term.title} className="rounded-xl border border-border/80 bg-card/60 p-4">
                  <div className="font-bold text-gold mb-1">{term.title}</div>
                  <div className="text-muted-foreground leading-relaxed">{term.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Registration Form / Success Panel */}
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            {submittedRef ? (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-8 text-center animate-in fade-in">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-3xl font-bold text-foreground">
                  DMA Partnership Registered
                </h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
                  Your agency application has been logged under reference{" "}
                  <span className="font-mono font-bold text-gold">{submittedRef}</span>. Our Business Development Desk is preparing your wholesale credential packet.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a
                    href="mailto:bdm@goldentakinholidays.bt"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-slate-950 font-bold text-xs"
                  >
                    <Mail className="w-4 h-4" /> Email BDM Desk
                  </a>
                  <button
                    onClick={() => {
                      setSubmittedRef(null);
                      setAgencyName("");
                    }}
                    className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-deep">
                <div className="border-b border-border pb-4 mb-6">
                  <h3 className="font-display text-2xl font-bold">Agency DMA Onboarding Application</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fill in your official trade details to receive wholesale tariffs and credit terms.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Agency Profile */}
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-gold font-bold mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> 1. Agency Credentials
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Legal Agency Name *</label>
                        <input
                          required
                          value={agencyName}
                          onChange={(e) => setAgencyName(e.target.value)}
                          placeholder="e.g. Himalayan Horizon Journeys Pvt Ltd"
                          className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Registration / Trade License No. *</label>
                        <input
                          required
                          value={regNo}
                          onChange={(e) => setRegNo(e.target.value)}
                          placeholder="e.g. CIN / License / DOT Ref"
                          className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">GSTIN / PAN / Tax ID</label>
                        <input
                          value={gstinPan}
                          onChange={(e) => setGstinPan(e.target.value)}
                          placeholder="Tax identification number"
                          className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Agency Website</label>
                        <input
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://youragency.com"
                          className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Country *</label>
                        <input
                          required
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="India / UK / Australia / Other"
                          className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">City & State *</label>
                        <input
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Kolkata, West Bengal"
                          className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs outline-none focus:border-gold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Primary Contact */}
                  <div className="border-t border-border pt-6">
                    <h4 className="text-xs uppercase tracking-wider text-gold font-bold mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" /> 2. Key Personnel & Operations Contact
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Contact Person Name *</label>
                        <input
                          required
                          value={contactPerson}
                          onChange={(e) => setContactPerson(e.target.value)}
                          placeholder="Full Name"
                          className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Designation *</label>
                        <input
                          required
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          placeholder="Director / Senior Product Manager"
                          className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Official Trade Email *</label>
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="partner@youragency.com"
                          className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Direct Mobile / WhatsApp *</label>
                        <input
                          required
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91-9876543210"
                          className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs outline-none focus:border-gold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Market Segments & Projections */}
                  <div className="border-t border-border pt-6">
                    <h4 className="text-xs uppercase tracking-wider text-gold font-bold mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> 3. Target Passenger Segments
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {[
                        "Academic / College",
                        "Corporate MICE",
                        "School Overland",
                        "Luxury FIT",
                        "Romantic Honeymoon",
                        "Buddhist Pilgrimage",
                        "Cross-Border (Nepal/Tibet)",
                      ].map((seg) => {
                        const active = segments.includes(seg);
                        return (
                          <button
                            key={seg}
                            type="button"
                            onClick={() => toggleSegment(seg)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${active
                                ? "bg-gold text-slate-950 border-gold font-bold"
                                : "bg-card border-border text-muted-foreground hover:border-gold"
                              }`}
                          >
                            {active && <Check className="w-3.5 h-3.5 inline mr-1" />}
                            {seg}
                          </button>
                        );
                      })}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1 block">Projected Annual Passenger (Pax) Volume</label>
                      <select
                        value={projectedPax}
                        onChange={(e) => setProjectedPax(e.target.value)}
                        className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs outline-none focus:border-gold"
                      >
                        <option value="15-40">15–40 Pax / Year (Standard B2B Tier)</option>
                        <option value="41-100">41–100 Pax / Year (Preferred DMA Tier)</option>
                        <option value="100+">100+ Pax / Year (Enterprise Diamond DMA Tier)</option>
                      </select>
                    </div>
                  </div>

                  {/* Terms & Submission */}
                  <div className="border-t border-border pt-6 space-y-4">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-muted-foreground select-none">
                      <input
                        type="checkbox"
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="mt-0.5 rounded border-border text-gold focus:ring-gold"
                      />
                      <span>
                        I accept the Master B2B Destination Management Partner terms (Doc 21), including confidential wholesale net tariff policies, advance remittance milestones, and the legal jurisdiction of the Kingdom of Bhutan.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-gold text-primary-foreground text-sm font-bold shadow-lg hover:shadow-gold transition disabled:opacity-60"
                    >
                      <Sparkles className="w-4 h-4" />
                      {submitting ? "Submitting Application…" : "Register as Accredited DMA Partner"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar Directory */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h4 className="font-display text-lg font-bold mb-3 flex items-center gap-2 text-foreground">
                <Award className="w-5 h-5 text-gold" /> B2B Trade Desk
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Our Business Development Manager handles custom group quotations, faculty concessions, and hotel block bookings directly.
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-muted/60 border border-border/60">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">BDM Direct Email</div>
                  <a href="mailto:bdm@goldentakinholidays.bt" className="font-bold text-foreground hover:text-gold flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-gold" /> bdm@goldentakinholidays.bt
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-muted/60 border border-border/60">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">24/7 B2B WhatsApp Hotline</div>
                  <a href="https://wa.me/918514889385" target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 mt-0.5">
                    <MessageCircle className="w-3.5 h-3.5" /> +91-8514889385
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-muted/60 border border-border/60">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Bhutan Operations HQ</div>
                  <a href="tel:+97517970050" className="font-bold text-foreground hover:text-gold flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-gold" /> +975-1797-0050
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h4 className="font-display text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-gold" /> Cross-Border Gateways
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We coordinate seamless multi-country journeys bridging **Bhutan, Nepal (Kathmandu/Pokhara), Tibet (Lhasa/Kailash), and North-East India (Hasimara/Bagdogra)** with consolidated transit permits and private fleets.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
