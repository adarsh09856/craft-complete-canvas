import birdwatching from "@/assets/brochures/birdwatching-tours.asset.json";
import buddhist from "@/assets/brochures/buddhist-culture-tours.asset.json";
import corporate from "@/assets/brochures/corporate-meetups-mice.asset.json";
import family from "@/assets/brochures/family-tours.asset.json";
import geographical from "@/assets/brochures/geographical-expedition.asset.json";
import group from "@/assets/brochures/group-tours-classic-bhutan-circuit.asset.json";
import hiking from "@/assets/brochures/hiking-and-trekking.asset.json";
import wedding from "@/assets/brochures/himalayan-wedding-ceremonies.asset.json";
import historical from "@/assets/brochures/historical-tours.asset.json";
import honeymoon from "@/assets/brochures/honeymoon-trips.asset.json";
import nature from "@/assets/brochures/nature-and-eco-tours.asset.json";
import school from "@/assets/brochures/school-college-cultural-exchange.asset.json";
import tropical from "@/assets/brochures/tropical-expedition.asset.json";
import wildlife from "@/assets/brochures/wildlife-safari.asset.json";
import yoga from "@/assets/brochures/yoga-and-meditation-tours.asset.json";

/** Official Golden Takin Holidays package brochures, keyed by tour slug. */
export const brochures: Record<string, string> = {
  "group-tours-classic-bhutan-circuit": group.url,
  "family-tours": family.url,
  "nature-and-eco-tours": nature.url,
  "geographical-expedition": geographical.url,
  "historical-tours": historical.url,
  "wildlife-safari": wildlife.url,
  "tropical-expedition": tropical.url,
  "buddhist-culture-tours": buddhist.url,
  "hiking-and-trekking": hiking.url,
  "birdwatching-tours": birdwatching.url,
  "corporate-meetups-mice": corporate.url,
  "yoga-and-meditation-tours": yoga.url,
  "school-college-cultural-exchange": school.url,
  "honeymoon-trips": honeymoon.url,
  "himalayan-wedding-ceremonies": wedding.url,
};
