import { useState, useEffect } from "react";
import { X, Copy, Check, Phone, MessageCircle, Sparkles } from "lucide-react";
import promoBanner from "@/assets/promo-banner.png";
import { toast } from "sonner";

const STORAGE_KEY = "gth_promo_popup_dismissed_v1";
const PROMO_CODE = "WSUKSU26";

interface PromoPopupModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function PromoPopupModal({ isOpen: controlledIsOpen, onClose }: PromoPopupModalProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  useEffect(() => {
    // Listen for custom trigger event from any navigation / footer link
    const handleOpenEvent = () => {
      setInternalIsOpen(true);
    };
    window.addEventListener("gth:open-promo", handleOpenEvent);
    return () => window.removeEventListener("gth:open-promo", handleOpenEvent);
  }, []);

  useEffect(() => {
    if (isControlled) return;

    // Check if dismissed recently (within 24 hours)
    try {
      const dismissedUntil = localStorage.getItem(STORAGE_KEY);
      if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
        return;
      }
    } catch {
      // ignore localStorage errors
    }

    // Delay popup slightly for smooth first impression
    const timer = setTimeout(() => {
      setInternalIsOpen(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [isControlled]);

  const handleClose = () => {
    if (isControlled) {
      onClose?.();
    } else {
      setInternalIsOpen(false);
    }

    if (dontShowAgain) {
      try {
        localStorage.setItem(STORAGE_KEY, String(Date.now() + 24 * 60 * 60 * 1000));
      } catch {
        // ignore
      }
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(PROMO_CODE);
    setCopied(true);
    toast.success("Promo Code Copied!", {
      description: `Use '${PROMO_CODE}' during booking for exclusive UK & international discounts.`,
    });
    setTimeout(() => setCopied(false), 2500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, dontShowAgain, isControlled]);

  if (!isOpen) return null;

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-card border border-gold/40 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 cursor-default"
        role="dialog"
        aria-modal="true"
        aria-label="Golden Takin Holidays Special Promotion"
      >
        {/* Floating Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close promotion popup"
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 hover:scale-110 transition-all border border-white/20 shadow-lg focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto overflow-x-hidden flex-1">
          {/* Main Visual Banner */}
          <div className="relative w-full bg-slate-950 overflow-hidden">
            <img
              src={promoBanner}
              alt="Explore Bhutan, Nepal, Tibet & India with Golden Takin Holidays"
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>

          {/* Quick Action Bar under Banner */}
          <div className="p-4 sm:p-6 bg-gradient-to-b from-card via-card to-muted/40 border-t border-border/80">
            {/* Promo Code Highlight */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-gold/10 border border-gold/40">
              <div className="flex items-center gap-2.5 text-center sm:text-left">
                <Sparkles className="w-5 h-5 text-gold shrink-0" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Special UK Offer</div>
                  <div className="text-sm sm:text-base font-bold text-foreground">
                    Use Promo Code: <span className="text-gold font-mono tracking-wider">{PROMO_CODE}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-slate-950 text-xs sm:text-sm font-bold shadow-md hover:bg-gold/90 transition-all active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied to Clipboard!" : "Copy Code"}
              </button>
            </div>

            {/* Direct Contact & WhatsApp Click-to-Action Grid */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs">
              <a
                href="https://wa.me/918514889385?text=Hi%20Golden%20Takin%20Holidays%2C%20I%20am%20interested%20in%20planning%20a%20tour."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition shadow-sm"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>WhatsApp Desk</span>
              </a>

              <a
                href="tel:+97517970050"
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg border border-border bg-card hover:bg-muted font-medium transition"
              >
                <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Bhutan HQ</span>
              </a>

              <a
                href="tel:+447586203728"
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg border border-border bg-card hover:bg-muted font-medium transition"
              >
                <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>UK Desk</span>
              </a>

              <a
                href="tel:+61404343370"
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg border border-border bg-card hover:bg-muted font-medium transition"
              >
                <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Australia Desk</span>
              </a>
            </div>

            {/* Bottom Dismiss / Controls */}
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="rounded border-border text-gold focus:ring-gold"
                />
                <span>Don't show this again today</span>
              </label>

              <button
                onClick={handleClose}
                className="hover:text-foreground underline underline-offset-4"
              >
                Continue to Website &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Promo badge is now cleanly featured in the announcement bar rather than colliding in the corner
export function PromoBadgeTrigger({ onOpen }: { onOpen?: () => void }) {
  return null;
}
