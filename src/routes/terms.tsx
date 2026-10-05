import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldAlert, CheckCircle2, FileText, Ban, Compass, UserCheck } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Golden Takin Holidays" },
      { name: "description", content: "Official Inbound Travel Terms and Conditions, Immigration Identification Mandate, and Guest Regulations for Golden Takin Holidays." },
    ],
  }),
  component: TermsAndConditionsPage,
});

function TermsAndConditionsPage() {
  return (
    <article className="min-h-screen bg-background py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gold hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>

        <div className="mb-10 pb-6 border-b border-border">
          <div className="text-xs uppercase tracking-[0.25em] text-cypress font-semibold mb-2">Master Service Contract · 2026 Season</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground">Terms & Conditions</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            These statutory terms govern all inbound travel arrangements facilitated by <strong>Golden Takin Holidays</strong> (License No. DOT/TO/2026), under the sovereignty of the <strong>Royal Government of Bhutan</strong>, Department of Tourism (DoT), and Department of Immigration.
          </p>
        </div>

        {/* CRITICAL IMMIGRATION WARNING */}
        <div className="mb-10 rounded-2xl border-2 border-amber-500/60 bg-amber-500/10 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-500/20 text-amber-500">
              <ShieldAlert className="w-7 h-7" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">Mandatory Immigration Identification Regulations (Doc 17 & 18)</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                In strict compliance with the <strong>Department of Immigration, Ministry of Home Affairs, Royal Government of Bhutan</strong>:
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4" /> PERMITTED IDENTIFICATION
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    <li><strong>Original Indian Passport:</strong> Minimum 6 months validity from entry date.</li>
                    <li><strong>Original Election Voter ID (EPIC):</strong> Issued by Election Commission of India.</li>
                    <li><strong>Children Under 18:</strong> Original Birth Certificate + School ID if no passport.</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3">
                  <div className="font-bold text-destructive flex items-center gap-1.5 mb-1">
                    <Ban className="w-4 h-4" /> STRICTLY REJECTED FOR ENTRY
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    <li><strong>Aadhaar Cards:</strong> Strictly rejected by immigration authorities.</li>
                    <li><strong>PAN Cards & Driving Licenses:</strong> Not accepted for entry permits.</li>
                    <li><strong>Digital/Soft Copies:</strong> Original physical documents must be produced.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Articles */}
        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Compass className="w-5 h-5 text-gold" />
              Article 1: Mandatory Certified Tour Guides & Tourist Transport
            </h3>
            <p className="mb-2">
              Under Bhutanese law, independent backpacking, self-driving foreign-registered private vehicles, or unguided trekking is strictly prohibited across the Kingdom.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>All guest cohorts must be accompanied at all times by a Department of Tourism certified professional tour guide.</li>
              <li>Surface transfers must utilize commercial Bhutan tourist-registered vehicles (B-Plate) driven by seasoned mountain captains.</li>
              <li>Tours exceeding established checkpoints require route permits pre-cleared by the Department of Immigration.</li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gold" />
              Article 2: Sustainable Development Fee (SDF) Statutory Directives
            </h3>
            <p className="mb-2">
              All tourists visiting the Kingdom of Bhutan are legally subject to the Sustainable Development Fee (SDF), a sovereign levy channeled into free universal healthcare, education, carbon-neutral forestry, and heritage restoration:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Indian Nationals:</strong> INR 1,200 per adult per night (children 6–12 pay 50% / INR 600; children under 5 exempt).</li>
              <li><strong>International Travelers:</strong> USD 100 per adult per night (promotional statutory rate).</li>
              <li>The SDF must be collected in full prior to the issuance of the official visa clearance or border permit endorsement.</li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Ban className="w-5 h-5 text-destructive" />
              Article 3: Sacred Peak, Drone & Cultural Prohibitions
            </h3>
            <p className="mb-2">
              Visitors must respect Bhutan's sacred environmental ethics and Buddhist spiritual traditions:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Mountaineering Ban:</strong> Scaling peaks higher than 6,000 meters (including Gangkar Puensum, 7,570m — the world's highest unclimbed mountain) is strictly prohibited by royal decree as peaks are dwellings of guardian deities.</li>
              <li><strong>Drone Regulations:</strong> Flying unmanned aerial vehicles (UAVs / drones) without written clearance from the Bhutan Civil Aviation Authority (BCAA) is strictly banned and subjects devices to confiscation.</li>
              <li><strong>Tobacco Law:</strong> While personal consumption of tobacco is permitted in private spaces, commercial smoking in public spaces, Dzongs, and near monasteries is prohibited. Commercial sale of tobacco is heavily regulated.</li>
              <li><strong>Dzong & Temple Dress Code:</strong> Modest, respectful attire is mandatory. Shoulders and knees must be covered. Hats, shorts, sleeveless shirts, and open slippers are strictly prohibited inside religious sanctums.</li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-500" />
              Article 4: High-Altitude Acclimatization & Guest Duty-of-Care
            </h3>
            <p className="text-xs">
              Travel across Bhutan frequently traverses high passes including Dochula (3,120m) and Chele La (3,988m). Guests with cardiovascular or chronic respiratory conditions must submit a medical disclosure during the <Link to="/kyc" className="text-gold font-bold hover:underline">Mandatory KYC Onboarding</Link>. Golden Takin Holidays' vehicles carry portable medical oxygen canisters on all high-altitude sectors.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center text-xs text-muted-foreground">
          For legal inquiries or corporate contracts, contact our legal counsel at <a href="mailto:office@goldentakinholidays.bt" className="text-gold font-bold hover:underline">office@goldentakinholidays.bt</a>.
        </div>
      </div>
    </article>
  );
}
