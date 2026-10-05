import { Phone, MessageCircle, Sparkles } from "lucide-react";

export function TopContactBar({ onOpenPromo }: { onOpenPromo: () => void }) {
  return (
    <div className="bg-slate-950 text-slate-200 border-b border-gold/20 text-[11px] sm:text-xs">
      <div className="mx-auto max-w-[1500px] px-4 py-1.5 sm:px-6 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Global Contact Desks */}
        <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto py-0.5 scrollbar-none">
          <a
            href="tel:+97517970050"
            className="flex items-center gap-1.5 hover:text-gold transition whitespace-nowrap"
            title="Bhutan Head Office"
          >
            <span>🇧🇹</span>
            <Phone className="w-3 h-3 text-gold" />
            <span className="font-medium">+975-1797-0050</span>
          </a>

          <a
            href="https://wa.me/918514889385?text=Hi%20Golden%20Takin%20Holidays%2C%20I%20would%20like%20to%20enquire%20about%20a%20Bhutan%20tour."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition whitespace-nowrap"
            title="Official WhatsApp Assistance"
          >
            <MessageCircle className="w-3 h-3" />
            <span className="font-medium">+91-8514889385</span>
          </a>

          <a
            href="tel:+61404343370"
            className="hidden md:flex items-center gap-1.5 hover:text-gold transition whitespace-nowrap"
            title="Australia Desk"
          >
            <span>🇦🇺</span>
            <Phone className="w-3 h-3 text-gold" />
            <span>+61-404-343-370</span>
          </a>

          <a
            href="tel:+447586203728"
            className="hidden lg:flex items-center gap-1.5 hover:text-gold transition whitespace-nowrap"
            title="United Kingdom Desk"
          >
            <span>🇬🇧</span>
            <Phone className="w-3 h-3 text-gold" />
            <span>+44-7586203728</span>
          </a>
        </div>

        {/* Right: UK Special Promo Banner */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPromo}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold/15 border border-gold/40 text-gold hover:bg-gold/25 transition text-[11px] font-semibold"
          >
            <Sparkles className="w-3 h-3" />
            <span>UK Promo: <span className="font-mono tracking-wider font-bold">WSUKSU26</span></span>
          </button>

          <a
            href="https://www.takinmart.bt"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block text-muted-foreground hover:text-foreground text-[11px] transition"
          >
            Artisan Store: <span className="text-gold">takinmart.bt</span> &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
