import { useState, useEffect } from "react";
import { tours as defaultTours } from "./data";
import type { Tour } from "@/components/TourCard";
import { supabase } from "@/integrations/supabase/client";

const CUSTOM_TOURS_KEY = "gth_custom_tours";
const DELETED_SLUGS_KEY = "gth_deleted_tours";
const TOURS_EVENT = "gth-tours-updated";

/** Get merged list of default tours, custom/edited tours, and exclude deleted tours */
export function getStoredTours(): Tour[] {
  if (typeof window === "undefined") return defaultTours;

  try {
    const customToursRaw = localStorage.getItem(CUSTOM_TOURS_KEY);
    const deletedSlugsRaw = localStorage.getItem(DELETED_SLUGS_KEY);

    const customTours: Record<string, Tour> = customToursRaw ? JSON.parse(customToursRaw) : {};
    const deletedSlugs: string[] = deletedSlugsRaw ? JSON.parse(deletedSlugsRaw) : [];

    // Map default tours, replacing with custom edits if modified
    const merged = defaultTours
      .filter((t) => !deletedSlugs.includes(t.slug))
      .map((t) => customTours[t.slug] || t);

    // Append newly created tours that are not in default tours
    const defaultSlugs = new Set(defaultTours.map((t) => t.slug));
    for (const [slug, tour] of Object.entries(customTours)) {
      if (!defaultSlugs.has(slug) && !deletedSlugs.includes(slug)) {
        merged.push(tour);
      }
    }

    return merged;
  } catch (e) {
    console.error("Error reading stored tours:", e);
    return defaultTours;
  }
}

/** Reactive hook to subscribe to live tours list across public and admin pages */
export function useAllTours(): Tour[] {
  const [tours, setTours] = useState<Tour[]>(getStoredTours);

  useEffect(() => {
    const handleUpdate = () => {
      setTours(getStoredTours());
    };

    window.addEventListener(TOURS_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    // Try to fetch latest from Supabase if table exists
    (supabase as any)
      .from("tours")
      .select("*")
      .then(({ data, error }: any) => {
        if (!error && data && data.length > 0) {
          // Sync with local store
          const customToursRaw = localStorage.getItem(CUSTOM_TOURS_KEY);
          const current: Record<string, Tour> = customToursRaw ? JSON.parse(customToursRaw) : {};
          data.forEach((row: any) => {
            if (row.slug) {
              current[row.slug] = {
                slug: row.slug,
                title: row.title,
                category: row.category,
                duration: row.duration,
                nights: row.nights || row.duration,
                tagline: row.tagline || "",
                location: row.location || "Bhutan",
                price: row.price || 1200,
                image: row.image || "/assets/tigers-nest.jpg",
                desc: row.description || row.desc || "",
                overview: row.overview || "",
                highlights: Array.isArray(row.highlights) ? row.highlights : [],
                includes: Array.isArray(row.includes) ? row.includes : [],
                excludes: Array.isArray(row.excludes) ? row.excludes : [],
                itinerary: Array.isArray(row.itinerary) ? row.itinerary : [],
              };
            }
          });
          localStorage.setItem(CUSTOM_TOURS_KEY, JSON.stringify(current));
          setTours(getStoredTours());
        }
      })
      ;

    return () => {
      window.removeEventListener(TOURS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return tours;
}

/** Get a single tour by slug from merged stored tours */
export function getTourBySlug(slug: string): Tour | undefined {
  const all = getStoredTours();
  return all.find((t) => t.slug === slug);
}

/** Save or update a tour in the store (immediate public reflection) */
export function saveAdminTour(tour: Tour): void {
  if (typeof window === "undefined") return;

  try {
    const customToursRaw = localStorage.getItem(CUSTOM_TOURS_KEY);
    const deletedSlugsRaw = localStorage.getItem(DELETED_SLUGS_KEY);

    const customTours: Record<string, Tour> = customToursRaw ? JSON.parse(customToursRaw) : {};
    let deletedSlugs: string[] = deletedSlugsRaw ? JSON.parse(deletedSlugsRaw) : [];

    // Remove from deleted list if it was previously deleted
    deletedSlugs = deletedSlugs.filter((s) => s !== tour.slug);
    localStorage.setItem(DELETED_SLUGS_KEY, JSON.stringify(deletedSlugs));

    // Save/update tour
    customTours[tour.slug] = tour;
    localStorage.setItem(CUSTOM_TOURS_KEY, JSON.stringify(customTours));

    // Also attempt async sync to Supabase
    (supabase as any)
      .from("tours")
      .upsert({
        slug: tour.slug,
        title: tour.title,
        category: tour.category,
        duration: tour.duration,
        nights: tour.nights,
        tagline: tour.tagline,
        location: tour.location,
        price: tour.price,
        image: tour.image,
        desc: tour.desc,
        overview: tour.overview,
        highlights: tour.highlights,
        includes: tour.includes,
        excludes: tour.excludes,
        itinerary: tour.itinerary,
        updated_at: new Date().toISOString(),
      })
      .then(() => {}, () => {});

    // Dispatch global event for immediate reflection
    window.dispatchEvent(new Event(TOURS_EVENT));
  } catch (e) {
    console.error("Failed to save tour:", e);
  }
}

/** Delete a tour from the store (immediate public reflection) */
export function deleteAdminTour(slug: string): void {
  if (typeof window === "undefined") return;

  try {
    const customToursRaw = localStorage.getItem(CUSTOM_TOURS_KEY);
    const deletedSlugsRaw = localStorage.getItem(DELETED_SLUGS_KEY);

    const customTours: Record<string, Tour> = customToursRaw ? JSON.parse(customToursRaw) : {};
    const deletedSlugs: string[] = deletedSlugsRaw ? JSON.parse(deletedSlugsRaw) : [];

    delete customTours[slug];
    if (!deletedSlugs.includes(slug)) {
      deletedSlugs.push(slug);
    }

    localStorage.setItem(CUSTOM_TOURS_KEY, JSON.stringify(customTours));
    localStorage.setItem(DELETED_SLUGS_KEY, JSON.stringify(deletedSlugs));

    // Also attempt deletion in Supabase
    (supabase as any).from("tours").delete().eq("slug", slug).then(() => {}, () => {});

    // Dispatch event
    window.dispatchEvent(new Event(TOURS_EVENT));
  } catch (e) {
    console.error("Failed to delete tour:", e);
  }
}

/** Reset all tours to factory defaults */
export function resetToursToDefaults(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CUSTOM_TOURS_KEY);
  localStorage.removeItem(DELETED_SLUGS_KEY);
  window.dispatchEvent(new Event(TOURS_EVENT));
}
