import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, MessageCircle, ShieldCheck, ExternalLink, Sparkles } from "lucide-react";
import emblem from "@/assets/takin-emblem.png";

export function Footer({ onOpenPromo }: { onOpenPromo?: () => void }) {
  return (
    <footer className="relative mt-24 border-t border-border bg-slate-950 text-slate-200">
      <div className="ornate-border absolute top-0 inset-x-0" />
      
      {/* Top Banner inside Footer */}
      <div className="border-b border-border/40 bg-slate-900/60 py-6">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 border border-gold/40 text-gold">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <div className="font-display text-sm sm:text-base font-bold text-white">Department of Tourism (DoT) Licensed DMC</div>
              <div className="text-xs text-slate-400">Headquartered in Thimphu, Kingdom of Bhutan · License & TCB Verified</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onOpenPromo && (
              <button
                onClick={onOpenPromo}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gold text-slate-950 text-xs font-bold shadow hover:bg-gold/90 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>UK Promo Code: <span className="font-mono">WSUKSU26</span></span>
              </button>
            )}
            <a
              href="https://www.takinmart.bt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-slate-300 hover:text-white hover:border-gold transition"
            >
              <span>TakinMart Store</span>
              <ExternalLink className="w-3 h-3 text-gold" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mx-auto grid max-w-[1500px] gap-10 px-4 py-14 sm:px-6 sm:py-18 md:grid-cols-2 lg:grid-cols-5">
        {/* Brand Column */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <img src={emblem} alt="Golden Takin Holidays" className="w-12 h-12 object-contain rounded-xl border border-gold/30 bg-cream p-1" />
            <div>
              <div className="font-display text-xl font-bold text-white">
                <span className="text-gold">Golden</span> Takin Holidays
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Journeys That Stay With You</div>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-md">
            Kingdom of Bhutan's licensed premier inbound operator crafting tailor-made cultural tours, academic field studies, corporate MICE retreats, romantic honeymoon escapes, and cross-border Himalayan circuits across Bhutan, Nepal, Tibet, and India (NE).
          </p>

          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-gold shrink-0" />
              <span>Norzin Lam, Post Box 1024, Thimphu, Kingdom of Bhutan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold font-mono font-bold">Web:</span>
              <a href="https://www.goldentakinholidays.bt" className="hover:text-gold transition">www.goldentakinholidays.bt</a>
              <span>·</span>
              <a href="https://www.takinmart.bt" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition">www.takinmart.bt</a>
            </div>
          </div>
        </div>

        {/* Global Contact Desks Column */}
        <div>
          <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-gold font-bold">Global Contact Desks</h4>
          <ul className="space-y-3 text-xs text-slate-300">
            <li>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Bhutan Head Office</div>
              <a href="tel:+97517970050" className="flex items-center gap-1.5 hover:text-gold transition mt-0.5">
                <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                <span className="font-medium">+975-1797-0050</span>
              </a>
            </li>

            <li>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">24/7 Official WhatsApp</div>
              <a
                href="https://wa.me/918514889385"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition mt-0.5"
              >
                <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="font-medium">+91-8514889385</span>
              </a>
            </li>

            <li>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Australia Support Desk</div>
              <a href="tel:+61404343370" className="flex items-center gap-1.5 hover:text-gold transition mt-0.5">
                <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>+61-404-343-370</span>
              </a>
            </li>

            <li>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">United Kingdom Desk</div>
              <a href="tel:+447586203728" className="flex items-center gap-1.5 hover:text-gold transition mt-0.5">
                <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>+44-7586203728</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Official 6 Inboxes Column */}
        <div>
          <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-gold font-bold">Official Departments</h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li>
              <a href="mailto:info@goldentakinholidays.bt" className="flex items-center gap-1.5 hover:text-gold transition">
                <Mail className="w-3 h-3 text-gold/70" />
                <span>info@goldentakinholidays.bt</span>
              </a>
              <div className="text-[9px] text-slate-500 pl-4.5">Inquiries & Planning</div>
            </li>

            <li>
              <a href="mailto:office@goldentakinholidays.bt" className="flex items-center gap-1.5 hover:text-gold transition">
                <Mail className="w-3 h-3 text-gold/70" />
                <span>office@goldentakinholidays.bt</span>
              </a>
              <div className="text-[9px] text-slate-500 pl-4.5">Operations & Fleet</div>
            </li>

            <li>
              <a href="mailto:bdm@goldentakinholidays.bt" className="flex items-center gap-1.5 hover:text-gold transition">
                <Mail className="w-3 h-3 text-gold/70" />
                <span>bdm@goldentakinholidays.bt</span>
              </a>
              <div className="text-[9px] text-slate-500 pl-4.5">B2B Partners & DMAs</div>
            </li>

            <li>
              <a href="mailto:support@goldentakinholidays.bt" className="flex items-center gap-1.5 hover:text-gold transition">
                <Mail className="w-3 h-3 text-gold/70" />
                <span>support@goldentakinholidays.bt</span>
              </a>
              <div className="text-[9px] text-slate-500 pl-4.5">24/7 Guest Assistance</div>
            </li>

            <li>
              <a href="mailto:gm@goldentakinholidays.bt" className="flex items-center gap-1.5 hover:text-gold transition">
                <Mail className="w-3 h-3 text-gold/70" />
                <span>gm@goldentakinholidays.bt</span>
              </a>
              <div className="text-[9px] text-slate-500 pl-4.5">General Manager</div>
            </li>

            <li>
              <a href="mailto:ceo@goldentakinholidays.bt" className="flex items-center gap-1.5 hover:text-gold transition">
                <Mail className="w-3 h-3 text-gold/70" />
                <span>ceo@goldentakinholidays.bt</span>
              </a>
              <div className="text-[9px] text-slate-500 pl-4.5">Executive Leadership</div>
            </li>
          </ul>
        </div>

        {/* Explore & Compliance Links */}
        <div>
          <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-gold font-bold">Destinations & Trade</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/tours" className="hover:text-gold transition">All 28 Tour Packages</Link></li>
            <li><Link to="/guidebook" className="text-gold hover:underline transition font-semibold">20-Chapter Bhutan Guidebook</Link></li>
            <li><Link to="/b2b-portal" className="text-gold hover:underline transition font-semibold">B2B Partner DMA Portal</Link></li>
            <li><Link to="/kyc" className="text-gold hover:underline transition font-semibold">Mandatory Guest KYC & Permits</Link></li>
            <li><Link to="/terms" className="hover:text-gold transition">Terms & Immigration Rules</Link></li>
            <li><Link to="/cancellation" className="hover:text-gold transition">Cancellation & Refunds</Link></li>
            <li><Link to="/privacy" className="hover:text-gold transition">Data Privacy Policy</Link></li>
            <li><Link to="/store" className="hover:text-gold transition">Bhutan Craft Store</Link></li>
            <li><Link to="/faq" className="hover:text-gold transition">Traveler FAQ & SDF Rates</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright & Legal Links */}
      <div className="border-t border-border/40 py-6 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-[1500px] px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>© 2026 Golden Takin Holidays. Kingdom of Bhutan · All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs">
            <Link to="/guidebook" className="hover:text-gold transition">Guidebook</Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-gold transition">Terms</Link>
            <span>·</span>
            <Link to="/cancellation" className="hover:text-gold transition">Cancellation</Link>
            <span>·</span>
            <Link to="/privacy" className="hover:text-gold transition">Privacy</Link>
            <span>·</span>
            <Link to="/kyc" className="hover:text-gold transition">KYC Intake</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
