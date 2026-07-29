import { Link } from "@tanstack/react-router";
import { Clock, MapPin, ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

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
  return (
    <Link
      to="/tours/$slug"
      params={{ slug: tour.slug }}
      className="group relative block overflow-hidden rounded-lg bg-card shadow-card ring-1 ring-border transition-all duration-500 hover:-translate-y-1 hover:shadow-gold"
      style={{ animationDelay: `${idx * 80}ms` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img src={tour.image} alt={tour.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
        <div className="absolute left-4 top-4 max-w-[calc(100%-5rem)] rounded-full bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-cypress shadow-card backdrop-blur">{tour.category}</div>
        <div className="absolute right-4 top-4 grid h-10 w-10 translate-x-2 place-items-center rounded-full bg-background/90 text-gold opacity-0 shadow-card transition-all group-hover:translate-x-0 group-hover:opacity-100">
          <ArrowUpRight className="w-5 h-5" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 text-hero-foreground sm:p-6">
          <h3 className="mb-2 font-display text-2xl leading-tight transition-colors group-hover:text-gold-soft">{tour.title}</h3>
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-hero-foreground/72">{tour.desc}</p>
          <div className="mb-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.12em] text-hero-foreground/80">
            <span className="rounded-md bg-hero-foreground/12 px-2 py-1">★ {tour.rating ?? 4.8}</span>
            <span className="rounded-md bg-hero-foreground/12 px-2 py-1">{tour.difficulty ?? "Easy"}</span>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 text-xs">
            <div className="min-w-0 space-y-1 text-hero-foreground/75 sm:flex sm:gap-4 sm:space-y-0">
              <span className="flex min-w-0 items-center gap-1.5"><Clock className="h-3.5 w-3.5 shrink-0 text-gold" />{tour.duration}</span>
              <span className="flex min-w-0 items-center gap-1.5 truncate"><MapPin className="h-3.5 w-3.5 shrink-0 text-gold" />{tour.location}</span>
            </div>
            <div className="font-display text-xl text-gold-soft">{formatPrice(tour.price)}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
