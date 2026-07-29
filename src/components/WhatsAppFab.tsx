import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl, useSiteSettings } from "@/lib/site-store";

export function WhatsAppFab() {
  const settings = useSiteSettings();
  if (!settings.whatsappNumber) return null;
  const href = buildWhatsAppUrl(
    settings.whatsappNumber,
    `Hi ${settings.companyName}, I'd like to plan a Bhutan trip.`,
  );
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-[70] grid h-14 w-14 place-items-center rounded-full text-white shadow-deep transition hover:scale-105 sm:h-16 sm:w-16"
      style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}
    >
      <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
      <span className="absolute inset-0 -z-10 rounded-full opacity-60 animate-pulse-gold" style={{ background: "#25D366" }} />
    </a>
  );
}
