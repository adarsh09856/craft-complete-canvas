import { Link } from "@tanstack/react-router";
import { Clock, MapPin, ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { brochures } from "@/lib/brochures";

export type ItineraryDay = { day: number; title: string; desc: string };

export type Tour = {
  slug: string;
  title: string;
  category: string;
  duration: string;
  location: string;
  price: number;
  image: string;
  desc: string;
  rating?: number;
  difficulty?: string;
  bestTime?: string;
  nights?: string;
  tagline?: string;
  groupSize?: string;
  idealFor?: string;
  overview?: string;
  highlights?: string[];
  includes?: string[];
  excludes?: string[];
  itinerary?: ItineraryDay[];
};

export function TourCard({ tour, idx = 0 }: { tour: Tour; idx?: number }) {
  const poster = brochures[tour.slug] ?? tour.image;
  return (
    <Link
      to="/tours/$slug"
      params={{ slug: tour.slug }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-border transition-all duration-500 hover:-translate-y-1 hover:shadow-gold"
      style={{ animationDelay: `${idx * 80}ms` }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-ink">
        <img src={poster} alt={`${tour.title} brochure`} loading="lazy" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-2xl" aria-hidden />
        <img src={poster} alt={tour.title} loading="lazy" className="relative h-full w-full object-contain transition-transform duration-1000 group-hover:scale-[1.04]" />
        <div className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] rounded-full bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-cypress shadow-card backdrop-blur">{tour.category}</div>
        <div className="absolute right-4 top-4 grid h-10 w-10 translate-x-2 place-items-center rounded-full bg-background/90 text-gold opacity-0 shadow-card transition-all group-hover:translate-x-0 group-hover:opacity-100">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="mb-2 font-display text-2xl leading-tight transition-colors group-hover:text-gold">{tour.title}</h3>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{tour.desc}</p>
        <div className="mb-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          <span className="rounded-md bg-muted px-2 py-1">★ {tour.rating ?? 4.8}</span>
          <span className="rounded-md bg-muted px-2 py-1">{tour.difficulty ?? "Easy"}</span>
          {tour.groupSize && <span className="rounded-md bg-muted px-2 py-1">{tour.groupSize}</span>}
        </div>
        <div className="mt-auto grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 border-t border-border pt-4 text-xs">
          <div className="min-w-0 space-y-1 text-muted-foreground sm:flex sm:gap-4 sm:space-y-0">
            <span className="flex min-w-0 items-center gap-1.5"><Clock className="h-3.5 w-3.5 shrink-0 text-gold" />{tour.duration}</span>
            <span className="flex min-w-0 items-center gap-1.5 truncate"><MapPin className="h-3.5 w-3.5 shrink-0 text-gold" />{tour.location}</span>
          </div>
          <div className="font-display text-xl text-gold">{formatPrice(tour.price)}</div>
        </div>
      </div>
    </Link>
  );
}
