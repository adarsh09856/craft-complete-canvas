import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Lock, ShieldCheck, Database, Eye, RefreshCw, Mail } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Data Privacy Policy — Golden Takin Holidays" },
      { name: "description", content: "Official Data Privacy Policy of Golden Takin Holidays, compliant with the Information Communications and Media (ICM) Act of Bhutan 2018 and international data standards." },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <article className="min-h-screen bg-background py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gold hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>

        <div className="mb-10 pb-6 border-b border-border">
          <div className="text-xs uppercase tracking-[0.25em] text-cypress font-semibold mb-2">Effective: March 2026 · Version 3.2</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground">Data Privacy Policy</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Golden Takin Holidays operates under the visionary statutory framework of the <strong>Information Communications and Media (ICM) Act of Bhutan 2018</strong>, Department of Tourism (DoT) directives, and international cross-border data protection principles.
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold" />
              1. Commitment to Privacy & Gross National Happiness (GNH) Values
            </h2>
            <p>
              In alignment with Bhutan's <strong>Gross National Happiness (GNH)</strong> philosophy, we believe that genuine hospitality begins with mutual respect, ethical transparency, and the conscientious guardianship of personal privacy. We never commercialize, broker, or monetize guest information.
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-cypress" />
              2. Traveler KYC Data Collected & Purpose of Processing
            </h2>
            <p className="mb-3">
              We collect only the minimum data required to facilitate sovereign travel compliance and ensure guest safety across high-altitude Himalayan terrain:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li><strong>Government Immigration Clearances:</strong> Passport copies, Voter ID numbers, biometric photos, and nationality details submitted exclusively to the Department of Immigration (Tashel portal) for issuance of tourist visas and entry permits.</li>
              <li><strong>Medical & Safety Profiling:</strong> Blood group, chronic respiratory/cardiovascular alerts, altitude sickness history, and emergency next-of-kin contacts utilized solely by our expedition safety team and local hospital triage.</li>
              <li><strong>Hospitality Logistics:</strong> Dietary preferences (vegetarian/Jain/allergies) shared with accredited partner hotels and resort kitchens.</li>
              <li><strong>Financial Transactions:</strong> Wire confirmation receipts, bank SWIFT references, and payment order IDs for tax reporting under the Royal Monetary Authority (RMA).</li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-gold" />
              3. Data Retention & Sovereign Storage Architecture
            </h2>
            <p className="mb-3">
              All guest documents and database records are housed in encrypted, self-hosted PostgreSQL infrastructure with role-based access control (RBAC):
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li><strong>Retention Period:</strong> Active travel files are maintained for the statutory duration required by Bhutanese tax and immigration audit laws (3 years), following which digital identity scans are securely scrubbed.</li>
              <li><strong>Zero Third-Party Marketing:</strong> We never share guest details with advertising platforms, data brokers, or external commercial networks.</li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-500" />
              4. Traveler Data Rights & Access Requests
            </h2>
            <p className="text-xs">
              Guests retain the right to inspect, correct, or request the deletion of their personal records once statutory visa compliance requirements have concluded. Inquiries regarding data privacy may be directed to our Data Protection Officer at <a href="mailto:support@goldentakinholidays.bt" className="text-gold font-bold hover:underline">support@goldentakinholidays.bt</a>.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
