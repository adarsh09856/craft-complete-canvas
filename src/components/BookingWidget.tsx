import { useMemo, useState, type FormEvent } from "react";
import { Calendar, Check, ChevronRight, Mail, MessageCircle, Minus, Phone, Plus, Shield, Sparkles, User, Users } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { buildWhatsAppUrl, useSiteSettings } from "@/lib/site-store";

type Tour = { slug: string; title: string; price: number; duration: string };

const tiers = [
  { id: "explorer", name: "Explorer", mult: 1, perks: ["3★ heritage hotels", "Shared transport", "Group guide"] },
  { id: "signature", name: "Signature", mult: 1.35, perks: ["4★ boutique hotels", "Private vehicle", "Licensed guide", "Daily tea ceremony"] },
  { id: "royal", name: "Royal", mult: 1.85, perks: ["5★ Amankora-class stays", "Private chef", "Spa & wellness", "Bespoke access"] },
];

export function BookingWidget({ tour }: { tour: Tour }) {
  const settings = useSiteSettings();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [tier, setTier] = useState(tiers[1]);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const guests = adults + children;
  const total = useMemo(() => Math.round(tour.price * tier.mult * (adults + children * 0.6)), [tour.price, tier, adults, children]);

  const next = () => {
    if (step === 1 && !date) { toast.error("Pick a travel date"); return; }
    if (step === 2 && (!name || !email)) { toast.error("Name and email required"); return; }
    setStep((s) => (s === 1 ? 2 : 3));
  };

  const openWhatsApp = () => {
    const msg = `Hi ${settings.companyName},%0A%0AI'd like to book *${tour.title}* (${tier.name}).%0A· Date: ${date || "flexible"}%0A· Guests: ${adults} adults, ${children} children%0A· Estimate: ${formatPrice(total)}%0A· Name: ${name || "—"}%0A· Email: ${email || "—"}%0A· Phone: ${phone || "—"}%0A%0ANotes: ${notes || "—"}`;
    const url = buildWhatsAppUrl(settings.whatsappNumber, decodeURIComponent(msg));
    window.open(url, "_blank", "noopener");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("travel_inquiries").insert({
      guest_name: name.trim(),
      tour_name: `${tour.title} · ${tier.name}`,
      travel_date: date,
      travelers: guests,
      status: "New",
    });
    setSubmitting(false);
    if (error) { toast.error("Booking could not be saved", { description: error.message }); return; }
    if (settings.bookingMode === "whatsapp" && settings.whatsappNumber) {
      openWhatsApp();
      toast.success("Opening WhatsApp", { description: "Your booking is saved. Send the message to confirm." });
    } else {
      toast.success("Booking received", { description: "A specialist will contact you within 2 hours." });
    }
    setStep(3);
  };

  const stepper = (
    <div className="mb-5 grid grid-cols-3 gap-1">
      {[1, 2, 3].map((n) => (
        <div key={n} className={`h-1 rounded-full transition ${step >= n ? "bg-gradient-gold" : "bg-border"}`} />
      ))}
    </div>
  );

  return (
    <form onSubmit={submit} className="overflow-hidden rounded-2xl border border-border bg-card shadow-deep">
      <div className="border-b border-border bg-gradient-to-br from-card to-muted p-5 sm:p-6">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <span>From {tour.duration}</span>
          <span className="flex items-center gap-1 text-cypress"><Shield className="h-3 w-3" /> Free cancel · 30 days</span>
        </div>
        <div className="mt-2 flex items-end gap-2">
          <div className="font-display text-4xl text-gradient-gold sm:text-5xl">{formatPrice(total)}</div>
          <div className="pb-2 text-xs text-muted-foreground">total · {guests} {guests === 1 ? "guest" : "guests"}</div>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">{formatPrice(Math.round(total / Math.max(1, guests)))} per person · {tier.name}</div>
      </div>

      <div className="p-5 sm:p-6">
        {stepper}

        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Choose package</div>
              <div className="grid gap-2">
                {tiers.map((t) => (
                  <button key={t.id} type="button" onClick={() => setTier(t)} className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-3 text-left transition ${tier.id === t.id ? "border-saffron bg-saffron/10 shadow-card" : "border-border hover:bg-muted"}`}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-bold">{t.name} {tier.id === t.id && <Check className="h-4 w-4 text-saffron" />}</div>
                      <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{t.perks.join(" · ")}</div>
                    </div>
                    <div className="text-sm font-display text-gradient-gold">{formatPrice(Math.round(tour.price * t.mult))}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Stepper label="Adults" icon={<User className="h-4 w-4 text-saffron" />} value={adults} onChange={setAdults} min={1} />
              <Stepper label="Children" icon={<Users className="h-4 w-4 text-saffron" />} value={children} onChange={setChildren} min={0} />
            </div>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"><Calendar className="h-3.5 w-3.5 text-saffron" /> Travel date</span>
              <input type="date" required value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border border-border bg-input px-4 py-3 text-sm outline-none transition focus:border-saffron" />
            </label>

            <button type="button" onClick={next} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-gold py-4 text-sm font-bold text-primary-foreground transition hover:shadow-gold">
              Continue <ChevronRight className="h-4 w-4" />
            </button>
            {settings.bookingMode === "whatsapp" && settings.whatsappNumber && (
              <button type="button" onClick={openWhatsApp} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] bg-[#25D366]/10 py-3 text-sm font-bold text-[#128C7E] transition hover:bg-[#25D366] hover:text-white">
                <MessageCircle className="h-4 w-4" /> Book instantly on WhatsApp
              </button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 animate-fade-in">
            <Field icon={<User className="h-4 w-4" />} placeholder="Full name" value={name} onChange={setName} required />
            <Field icon={<Mail className="h-4 w-4" />} placeholder="Email" type="email" value={email} onChange={setEmail} required />
            <Field icon={<Phone className="h-4 w-4" />} placeholder="Phone (WhatsApp ok)" value={phone} onChange={setPhone} />
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Dietary, mobility, special requests…" rows={3} className="w-full resize-none rounded-lg border border-border bg-input px-4 py-3 text-sm outline-none transition focus:border-saffron" />

            <div className="grid gap-2 rounded-xl bg-muted p-4 text-xs">
              <Row k="Package" v={tier.name} />
              <Row k="Travel date" v={date} />
              <Row k="Guests" v={`${adults} adults · ${children} children`} />
              <div className="my-1 h-px bg-border" />
              <Row k="Total due" v={<span className="font-display text-base text-gradient-gold">{formatPrice(total)}</span>} />
            </div>

            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-2">
              <button type="button" onClick={() => setStep(1)} className="rounded-xl border border-border px-4 py-3 text-sm font-semibold transition hover:bg-muted">Back</button>
              <button type="submit" disabled={submitting} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-gold py-3 text-sm font-bold text-primary-foreground transition hover:shadow-gold disabled:opacity-60">
                <Sparkles className="h-4 w-4" /> {submitting ? "Confirming…" : "Confirm booking"}
              </button>
            </div>
            <p className="text-center text-[11px] text-muted-foreground">No card needed. We hold your spot and contact you within 2 hours.</p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-3 text-center animate-fade-in">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-cypress/15 text-cypress animate-scale-in">
              <Check className="h-8 w-8" />
            </div>
            <div>
              <div className="font-display text-2xl">Booking confirmed</div>
              <p className="mt-2 text-sm text-muted-foreground">A Bhutan specialist will reach out to {email} within 2 hours with permits, hotels and final pricing.</p>
            </div>
            <div className="rounded-xl bg-muted p-4 text-left text-xs">
              <Row k="Reference" v={`RTT-${Date.now().toString().slice(-6)}`} />
              <Row k="Tour" v={tour.title} />
              <Row k="Date" v={date} />
              <Row k="Hold value" v={formatPrice(total)} />
            </div>
            <button type="button" onClick={() => { setStep(1); setName(""); setEmail(""); setPhone(""); setNotes(""); }} className="text-xs font-semibold text-saffron hover:underline">Book another date →</button>
          </div>
        )}
      </div>
    </form>
  );
}

function Stepper({ label, icon, value, onChange, min }: { label: string; icon: React.ReactNode; value: number; onChange: (n: number) => void; min: number }) {
  return (
    <div className="rounded-xl border border-border bg-input p-3">
      <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{icon}{label}</div>
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-card transition hover:border-saffron hover:text-saffron"><Minus className="h-3.5 w-3.5" /></button>
        <span className="font-display text-2xl">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)} className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-card transition hover:border-saffron hover:text-saffron"><Plus className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );
}

function Field({ icon, placeholder, value, onChange, type = "text", required }: { icon: React.ReactNode; placeholder: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-lg border border-border bg-input px-3 transition focus-within:border-saffron">
      <span className="text-muted-foreground">{icon}</span>
      <input type={type} required={required} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="min-w-0 bg-transparent py-3 text-sm outline-none" />
    </label>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center justify-between gap-3"><span className="text-muted-foreground">{k}</span><span className="text-right font-semibold">{v}</span></div>;
}
