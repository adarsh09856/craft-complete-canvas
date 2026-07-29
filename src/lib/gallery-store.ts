// Lightweight client-side store for admin-managed 360° panoramas per tour slug.
// Persists in localStorage so admins can add/remove panoramas and the tour
// detail page picks them up immediately on the next visit.

export type GalleryPanorama = { title: string; image: string; note?: string };

const KEY = "rtt.panoramas.v1";

function read(): Record<string, GalleryPanorama[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, GalleryPanorama[]>;
  } catch {
    return {};
  }
}

function write(map: Record<string, GalleryPanorama[]>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(map));
}

export function getPanoramas(slug: string): GalleryPanorama[] {
  return read()[slug] ?? [];
}

export function getAllPanoramas(): Record<string, GalleryPanorama[]> {
  return read();
}

export function setPanoramas(slug: string, list: GalleryPanorama[]) {
  const map = read();
  map[slug] = list;
  write(map);
}

export function addPanorama(slug: string, pano: GalleryPanorama) {
  setPanoramas(slug, [...getPanoramas(slug), pano]);
}

export function removePanorama(slug: string, index: number) {
  setPanoramas(slug, getPanoramas(slug).filter((_, i) => i !== index));
}
