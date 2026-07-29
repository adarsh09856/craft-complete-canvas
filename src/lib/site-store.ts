// Site settings store. Persists to localStorage and notifies subscribers so
// the admin panel can update home hero, WhatsApp booking number, booking mode
// and announcements without a rebuild.
import { useSyncExternalStore } from "react";

export type BookingMode = "whatsapp" | "form";

export type SiteSettings = {
  companyName: string;
  whatsappNumber: string; // digits only, with country code e.g. 97517123456
  bookingMode: BookingMode;
  heroTitle: string;
  heroSubtitle: string;
  announcement: string;
  supportEmail: string;
  supportPhone: string;
};

const KEY = "rtt.site.v1";

export const DEFAULT_SETTINGS: SiteSettings = {
  companyName: "Royal Takin Tours",
  whatsappNumber: "97517123456",
  bookingMode: "whatsapp",
  heroTitle: "The Last Shangri-La, lived slowly.",
  heroSubtitle:
    "Bespoke Bhutan journeys — culture, pilgrimage and high mountain trails, planned end-to-end with a modern travel desk, AI assist and a 360° preview of every destination.",
  announcement: "Spring 2026 dates open · Free cancellation up to 30 days",
  supportEmail: "hello@royaltakintours.com",
  supportPhone: "+975 17 123 456",
};

function read(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<SiteSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

const listeners = new Set<() => void>();

export function getSiteSettings(): SiteSettings {
  return read();
}

export function saveSiteSettings(next: Partial<SiteSettings>) {
  const merged = { ...read(), ...next };
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(merged));
  listeners.forEach((l) => l());
}

export function useSiteSettings(): SiteSettings {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      const onStorage = (e: StorageEvent) => { if (e.key === KEY) cb(); };
      if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(cb);
        if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
      };
    },
    () => read(),
    () => DEFAULT_SETTINGS,
  );
}

export function buildWhatsAppUrl(number: string, message: string) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
