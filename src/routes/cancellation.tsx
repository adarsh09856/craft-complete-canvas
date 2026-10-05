import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle, ShieldCheck, CheckCircle2, Clock, Phone, Mail } from "lucide-react";

export const Route = createFileRoute("/cancellation")({
  head: () => ({
    meta: [
      { title: "Cancellation & Refund Policy — Golden Takin Holidays" },
      { name: "description", content: "Official cancellation and refund policy for Indian (INR) and International (USD) travelers under the Bhutan Tourism Levy Act and DoT regulations." },
    ],
  }),
  component: CancellationPolicyPage,
});

function CancellationPolicyPage() {
  return (
    <article className="min-h-screen bg-background py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gold hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>

        <div className="mb-10 pb-6 border-b border-border">
          <div className="text-xs uppercase tracking-[0.25em] text-cypress font-semibold mb-2">Statutory Policy · Version 3.2</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground">Cancellation & Refund Policy</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Formulated in strict adherence to the <strong>Bhutan Tourism Levy Act</strong>, Department of Tourism (DoT) directives, Association of Bhutanese Tour Operators (ABTO) code of ethics, and Royal Monetary Authority (RMA) foreign exchange guidelines.
          </p>
        </div>

        {/* Dual Tier Overview */}
        <div className="grid gap-6 sm:grid-cols-2 mb-12">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 font-display text-lg font-bold text-foreground mb-3">
              <span className="text-xl">🇮🇳</span> Regional Guests (India / INR)
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Pertains to travelers holding valid Indian Passports or original Election Voter ID Cards paying in Indian Rupees (INR) or Ngultrum (Nu.).
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">45+ Days Prior:</span>
                <span className="font-bold text-foreground">10% Administrative Fee</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">30–44 Days Prior:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">25% Cancellation Charge</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">15–29 Days Prior:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">50% Cancellation Charge</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">&lt; 14 Days / No-show:</span>
                <span className="font-bold text-destructive">100% Non-Refundable</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 font-display text-lg font-bold text-foreground mb-3">
              <span className="text-xl">🌐</span> International Guests (USD / FX)
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Pertains to all non-regional travelers holding international passports paying in US Dollars (USD), Euros, GBP, or AUD subject to Tashel visa and SDF clearance.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">45+ Days Prior:</span>
                <span className="font-bold text-foreground">10% Processing Fee</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">30–44 Days Prior:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">25% Cancellation Charge</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">15–29 Days Prior:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">50% Cancellation Charge</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">&lt; 14 Days / No-show:</span>
                <span className="font-bold text-destructive">100% Non-Refundable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Statutory Provisions */}
        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold" />
              1. Government Sustainable Development Fee (SDF) Rules
            </h2>
            <p className="mb-3">
              The Sustainable Development Fee (SDF) is a statutory sovereign levy collected by Golden Takin Holidays on behalf of the <strong>Department of Revenue & Customs, Royal Government of Bhutan</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li><strong>Prior to Visa/Permit Issuance:</strong> 100% of the SDF amount is refundable if the booking is cancelled before the formal entry permit or visa has been processed.</li>
              <li><strong>Post Visa/Permit Endorsement:</strong> Once an entry permit or visa is endorsed into the Department of Immigration's Tashel system, the government SDF is strictly non-refundable under the Bhutan Tourism Levy Act, except in verified medical emergencies approved directly by the Tourism Council.</li>
              <li><strong>Indian SDF Rate:</strong> INR 1,200 per adult per night (children 6–12 pay 50% / INR 600; children under 5 exempt).</li>
              <li><strong>International SDF Rate:</strong> USD 100 per adult per night (promotional rate reduced from USD 200).</li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              2. Peak Season Festival (Tshechu) Non-Refundable Exceptions
            </h2>
            <p className="mb-3">
              Due to exceptionally high international demand and strict hotel allotment guarantees during major religious festivals:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li><strong>Tshechu Bookings:</strong> Bookings encompassing the <em>Paro Tshechu</em> (March/April), <em>Thimphu Tshechu</em> (September/October), and <em>Punakha Dromche</em> require non-refundable hotel deposits. Any cancellation within 45 days of festival dates incurs a 100% forfeiture of hotel costs.</li>
              <li><strong>Airline Tickets (Drukair / Bhutan Airlines):</strong> International flight sectors to Paro (PBH) are governed exclusively by carrier carriage policies. Ticket cancellation fees range from 25% up to 100% depending on ticket fare class.</li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cypress" />
              3. Refund Disbursement Timelines & Channels
            </h2>
            <p className="mb-3">
              All approved refunds are audited by the Golden Takin Holidays finance desk and remitted in full compliance with Royal Monetary Authority (RMA) foreign exchange regulations:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li><strong>Processing Window:</strong> Refunds are processed within 14 to 21 banking working days following official receipt of written cancellation.</li>
              <li><strong>Disbursement Method:</strong> Funds are returned strictly via the original source channel: Bank of Bhutan / Bhutan National Bank SWIFT wire for international transfers, or direct NEFT/RTGS/UPI for Indian travelers.</li>
              <li><strong>Banking Charges:</strong> Intermediary corresponding bank transfer charges and foreign exchange commission fees are borne by the remittee.</li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              4. Unforeseen Force Majeure & Natural Disruptions
            </h2>
            <p className="text-xs">
              In events of catastrophic road landslides, severe Himalayan snowstorms, closed mountain passes (Dochula / Chele La), civil aviation groundings, or bilateral border closures, Golden Takin Holidays provides free-of-cost itinerary re-routing or issues a <strong>100% Future Travel Credit Voucher</strong> valid for 24 months from the original date of travel.
            </p>
          </section>
        </div>

        {/* Cancellation Desk Contacts */}
        <div className="mt-12 rounded-2xl border border-gold/40 bg-gold/5 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-display text-lg font-bold text-foreground">Need to submit a cancellation or reschedule request?</div>
              <p className="text-xs text-muted-foreground mt-1">Please submit your request in writing with your booking confirmation reference number.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:support@goldentakinholidays.bt"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-slate-950 font-bold text-xs shadow hover:bg-gold/90 transition"
              >
                <Mail className="w-3.5 h-3.5" /> support@goldentakinholidays.bt
              </a>
              <a
                href="tel:+97517970050"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground font-medium text-xs hover:border-gold transition"
              >
                <Phone className="w-3.5 h-3.5 text-gold" /> +975-1797-0050
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
