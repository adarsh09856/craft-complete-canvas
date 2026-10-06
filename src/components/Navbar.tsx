import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Sparkles, UserRound, X, ShoppingBag, ChevronDown, Compass, BookOpen, ShieldCheck, HelpCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import emblem from "@/assets/takin-emblem.png";
import { CurrencySelector } from "@/components/CurrencySelector";

const primaryNav = [
  { to: "/tours", label: "Tours & Journeys" },
  { to: "/destinations", label: "Destinations" },
  { to: "/experiences", label: "Experiences" },
  { to: "/guidebook", label: "Travel Guide" },
  { to: "/store", label: "TakinMart Store", isStore: true },
  { to: "/contact", label: "Contact" },
];

export function Navbar({ onOpenPromo }: { onOpenPromo?: () => void }) {
  const { location } = useRouterState();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (portalRef.current && !portalRef.current.contains(e.target as Node)) {
        setPortalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-background/95 py-2.5 shadow-card backdrop-blur-2xl border-b border-border/70"
          : "bg-background/85 py-3 backdrop-blur-xl border-b border-border/30"
      }`}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand Crest & Title */}
        <Link to="/" className="group flex min-w-0 items-center gap-3 shrink-0">
          <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-gold/40 bg-cream shadow-card transition-transform duration-500 group-hover:scale-105 sm:h-12 sm:w-12">
            <img src={emblem} alt="Golden Takin Holidays Crest" className="h-full w-full scale-[1.18] object-contain" />
          </span>
          <div className="min-w-0 leading-tight">
            <div className="truncate font-display text-base font-extrabold tracking-tight text-primary sm:text-lg">
              <span className="text-gradient-gold">Golden</span> Takin Holidays
            </div>
            <div className="truncate text-[9px] uppercase tracking-[0.22em] text-muted-foreground sm:text-[10px]">
              Bhutan · Nepal · Tibet · India(NE)
            </div>
          </div>
        </Link>

        {/* Streamlined Desktop Navigation Links (Clean, Spacious, Luxury) */}
        <nav className="hidden items-center rounded-xl border border-border/70 bg-card/90 p-1 shadow-card backdrop-blur-xl lg:flex">
          {primaryNav.map((n) => {
            const active = location.pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-card font-semibold"
                    : n.isStore
                    ? "text-gold font-semibold hover:bg-gold/15"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground"
                }`}
              >
                {n.isStore && <ShoppingBag className="w-3.5 h-3.5 text-gold" />}
                {n.label}
              </Link>
            );
          })}

          {/* Traveler Hub Dropdown (Houses B2B, KYC, FAQ, Staff) */}
          <div className="relative inline-block text-left" ref={portalRef}>
            <button
              type="button"
              onClick={() => setPortalOpen(!portalOpen)}
              className="rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground flex items-center gap-1 transition"
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${portalOpen ? "rotate-180" : ""}`} />
            </button>

            {portalOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-hover z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-muted-foreground border-b border-border/50">
                  Traveler &amp; Trade Hub
                </div>
                <div className="py-1 space-y-0.5">
                  <Link
                    to="/faq"
                    onClick={() => setPortalOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-foreground/85 hover:bg-muted hover:text-foreground transition font-medium"
                  >
                    <HelpCircle className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-semibold">FAQ &amp; Visas</div>
                      <div className="text-[10px] text-muted-foreground">SDF rules, flight routes</div>
                    </div>
                  </Link>

                  <Link
                    to="/kyc"
                    onClick={() => setPortalOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-foreground/85 hover:bg-muted hover:text-foreground transition font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 text-gold" />
                    <div>
                      <div className="font-semibold">Guest KYC Portal</div>
                      <div className="text-[10px] text-muted-foreground">Passport upload &amp; permits</div>
                    </div>
                  </Link>

                  <Link
                    to="/b2b-portal"
                    onClick={() => setPortalOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-foreground/85 hover:bg-muted hover:text-foreground transition font-medium"
                  >
                    <Compass className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div className="font-semibold">B2B Trade Portal</div>
                      <div className="text-[10px] text-muted-foreground">Tour operators &amp; agents</div>
                    </div>
                  </Link>

                  <Link
                    to="/admin"
                    onClick={() => setPortalOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-foreground/85 hover:bg-muted hover:text-foreground transition font-medium"
                  >
                    <UserRound className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">Staff Console</div>
                      <div className="text-[10px] text-muted-foreground">Operations desk</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Action Controls & Multi-Currency Switcher */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Multi-Currency Dropdown */}
          <CurrencySelector compact />

          {/* Luxury CTA Button */}
          <Link
            to="/plan"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-gold px-4 py-2 text-xs sm:text-sm font-bold text-primary-foreground shadow-soft transition-all hover:shadow-gold hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5" /> Plan Tour
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card/90 text-foreground lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="mx-4 mt-2 grid gap-1.5 rounded-2xl border border-border bg-card p-5 shadow-hover lg:hidden max-h-[82vh] overflow-y-auto">
          <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground px-2">Main Journeys</div>
          {primaryNav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className={`rounded-xl px-3 py-2.5 text-sm font-medium flex items-center justify-between ${
                n.isStore ? "bg-gold/10 text-gold font-bold" : "text-foreground/85 hover:bg-muted hover:text-foreground"
              }`}
            >
              <span>{n.label}</span>
              {n.isStore && <ShoppingBag className="w-4 h-4" />}
            </Link>
          ))}

          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground px-2 mb-1.5">Traveler &amp; Trade Hub</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link to="/faq" onClick={() => setOpen(false)} className="rounded-lg p-2 bg-muted/60 hover:bg-muted font-medium">FAQ &amp; Visas</Link>
              <Link to="/kyc" onClick={() => setOpen(false)} className="rounded-lg p-2 bg-muted/60 hover:bg-muted font-medium">Guest KYC</Link>
              <Link to="/b2b-portal" onClick={() => setOpen(false)} className="rounded-lg p-2 bg-muted/60 hover:bg-muted font-medium">B2B Trade</Link>
              <Link to="/admin" onClick={() => setOpen(false)} className="rounded-lg p-2 bg-muted/60 hover:bg-muted font-medium">Staff Portal</Link>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-border">
            <Link
              to="/plan"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-gold py-3 text-sm font-bold text-primary-foreground shadow-gold"
            >
              <Sparkles className="w-4 h-4" /> Plan Tailor-Made Journey
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
