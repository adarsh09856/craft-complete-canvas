import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo-takin.png";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border bg-card/70">
      <div className="ornate-border absolute top-0 inset-x-0" />
      <div className="mx-auto grid max-w-[1500px] gap-10 px-4 py-14 sm:px-6 sm:py-18 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="" className="w-12 h-12" />
            <div>
              <div className="font-display text-xl text-gradient-gold">Golden Takin Holidays</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Discover Bhutan, Experience Nature's Embrace</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">TCB-licensed Bhutanese tour operator crafting group, family, wellness, academic and celebration journeys. Custom itineraries, expert local guides, sustainable tourism.</p>
          <div className="mt-6 flex gap-3">
            {[Facebook, Instagram, Youtube].map((I, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-md border border-border text-cypress transition hover:border-gold hover:text-gold">
                <I className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-5 text-sm uppercase tracking-[0.2em] text-cypress">Explore</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/tours" className="hover:text-gold">All Tours</Link></li>
            <li><Link to="/destinations" className="hover:text-gold">Destinations</Link></li>
            <li><Link to="/experiences" className="hover:text-gold">Experiences</Link></li>
            <li><Link to="/about" className="hover:text-gold">About Bhutan</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-sm uppercase tracking-[0.2em] text-cypress">Company</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-gold">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link to="/plan" className="hover:text-gold">Plan with AI</Link></li>
            <li><Link to="/operations" className="hover:text-gold">Travel Desk</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-sm uppercase tracking-[0.2em] text-cypress">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cypress" /><span>Norzin Lam, Thimphu, Bhutan</span></li>
            <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-cypress" /><span>+975 17 11 22 33</span></li>
            <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-cypress" /><span>hello@goldentakinholidays.bt</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © 2026 Golden Takin Holidays · Crafted in the Last Shangri-La
      </div>
    </footer>
  );
}
