import { useState, useRef, useEffect } from "react";
import { useCurrency, CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { ChevronDown } from "lucide-react";

export function CurrencySelector({ compact = false }: { compact?: boolean }) {
  const { currency, setCurrency, config } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Currency"
        className={`inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card/90 font-medium text-foreground transition hover:border-gold hover:text-gold ${
          compact ? "px-2 py-1 text-xs" : "px-3 py-2 text-xs sm:text-sm"
        }`}
      >
        <span className="text-sm">{config.flag}</span>
        <span className="font-semibold">{config.code}</span>
        <span className="text-muted-foreground text-[11px]">({config.symbol})</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card shadow-xl z-50 py-1.5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-muted-foreground border-b border-border/50">
            Select Currency
          </div>
          {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
            const item = CURRENCIES[code];
            const isSelected = item.code === currency;
            return (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setCurrency(code);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3.5 py-2 text-xs sm:text-sm text-left transition hover:bg-muted ${
                  isSelected ? "bg-gold/15 text-gold font-bold" : "text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.flag}</span>
                  <div>
                    <div className="font-medium">{item.code}</div>
                    <div className="text-[10px] text-muted-foreground">{item.name}</div>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold opacity-80">{item.symbol}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
