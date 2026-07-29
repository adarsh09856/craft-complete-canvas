import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Globe, Sparkles, X } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/logo-takin.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/tours", label: "Tours" },
  { to: "/experiences", label: "Experiences" },
  { to: "/destinations", label: "Destinations" },
  { to: "/about", label: "About Bhutan" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const { location } = useRouterState();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    h();
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled || open ? "bg-background/94 py-2 shadow-card backdrop-blur-2xl" : "bg-background/78 py-3 backdrop-blur-xl"}`}>
      <div className="mx-auto grid max-w-[1500px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6 lg:flex lg:justify-between">
        <Link to="/" className="group flex min-w-0 items-center gap-3">
          <img src={logo} alt="Golden Takin Holidays" className="h-10 w-10 shrink-0 transition-transform duration-500 group-hover:rotate-12 sm:h-11 sm:w-11" />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-base font-bold text-primary sm:text-lg">Golden Takin Holidays</div>
            <div className="truncate text-[9px] uppercase tracking-[0.22em] text-muted-foreground sm:text-[10px]">Journey with Happiness</div>
          </div>
        </Link>

        <nav className="hidden items-center rounded-xl border border-border/70 bg-card/86 p-1 shadow-card backdrop-blur-xl lg:flex">
          {nav.map((n) => {
            const active = location.pathname === n.to;
            return (
              <Link key={n.to} to={n.to} className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-foreground/72 hover:bg-muted hover:text-foreground"}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link to="/plan" className="hidden items-center gap-2 rounded-xl bg-gradient-gold px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-gold md:inline-flex">
            <Sparkles className="w-4 h-4" /> Plan with AI
          </Link>
          <button className="hidden items-center gap-1 rounded-xl border border-border bg-card/70 px-3 py-2 text-sm text-foreground/70 transition hover:text-gold md:flex">
            <Globe className="w-4 h-4" /> EN
          </button>
          <button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card/90 text-foreground lg:hidden" aria-label="Open menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-4 mt-2 grid gap-2 rounded-lg border border-border bg-card p-3 shadow-card lg:hidden">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-foreground/85 hover:bg-muted hover:text-foreground">
              {n.label}
            </Link>
          ))}
          <Link to="/plan" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-secondary px-4 py-3 text-sm text-secondary-foreground">
            <Sparkles className="h-4 w-4" /> Plan with AI
          </Link>
        </div>
      )}
    </header>
  );
}
