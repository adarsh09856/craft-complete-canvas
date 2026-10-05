import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Sparkles, UserRound, X, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import emblem from "@/assets/takin-emblem.png";
import { CurrencySelector } from "@/components/CurrencySelector";

const nav = [
  { to: "/", label: "Home" },
  { to: "/tours", label: "Tours" },
  { to: "/guidebook", label: "Guidebook" },
  { to: "/destinations", label: "Destinations" },
  { to: "/experiences", label: "Experiences" },
  { to: "/store", label: "Craft Store" },
  { to: "/b2b-portal", label: "B2B Trade" },
  { to: "/kyc", label: "Guest KYC" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export function Navbar({ onOpenPromo }: { onOpenPromo?: () => void }) {
  const { location } = useRouterState();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-background/95 py-2 shadow-card backdrop-blur-2xl border-b border-border/60"
          : "bg-background/80 py-3 backdrop-blur-xl border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 sm:px-6">
        {/* Brand Crest & Title */}
        <Link to="/" className="group flex min-w-0 items-center gap-3">
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

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center rounded-xl border border-border/70 bg-card/86 p-1 shadow-card backdrop-blur-xl xl:flex">
          {nav.map((n) => {
            const active = location.pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground shadow-card"
                    : "text-foreground/75 hover:bg-muted hover:text-foreground"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Multi-Currency Switcher */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          {/* Multi-Currency Dropdown */}
          <CurrencySelector compact />

          {/* AI Plan Link */}
          <Link
            to="/plan"
            className="hidden items-center gap-1.5 rounded-xl bg-gradient-gold px-3.5 py-2 text-xs sm:text-sm font-semibold text-primary-foreground transition-all hover:shadow-gold sm:inline-flex"
          >
            <Sparkles className="w-3.5 h-3.5" /> Plan Tour
          </Link>

          {/* Store CTA */}
          <Link
            to="/store"
            className="hidden items-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold transition hover:bg-gold hover:text-slate-950 md:inline-flex"
            title="Authentic Bhutanese Handicrafts"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Store
          </Link>

          {/* Operations / Account */}
          <Link
            to="/admin"
            className="hidden items-center gap-1 rounded-xl border border-border bg-card/70 px-2.5 py-2 text-xs font-semibold text-foreground/75 transition hover:text-gold lg:flex"
            title="Staff Operations & Lead Management"
          >
            <UserRound className="h-3.5 w-3.5" /> Staff
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card/90 text-foreground xl:hidden"
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="mx-4 mt-2 grid gap-1.5 rounded-xl border border-border bg-card p-4 shadow-card xl:hidden">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-foreground/85 hover:bg-muted hover:text-foreground font-medium"
            >
              {n.label}
            </Link>
          ))}
          
          <div className="mt-2 pt-3 border-t border-border grid grid-cols-2 gap-2">
            <Link
              to="/plan"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-gold px-3 py-2 text-xs font-bold text-primary-foreground"
            >
              <Sparkles className="w-3.5 h-3.5" /> Plan Tour
            </Link>
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-2 text-xs font-semibold text-foreground"
            >
              <UserRound className="w-3.5 h-3.5" /> Staff Portal
            </Link>
          </div>

          {onOpenPromo && (
            <button
              onClick={() => {
                setOpen(false);
                onOpenPromo();
              }}
              className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-gold/15 border border-gold/40 py-2 text-xs font-bold text-gold"
            >
              <Sparkles className="w-3.5 h-3.5" /> View Special Offer (WSUKSU26)
            </button>
          )}
        </div>
      )}
    </header>
  );
}
