import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { useCurrency } from "@/lib/currency";
import { ExternalLink, ShieldCheck, ShoppingBag, Sparkles, Star, Tag, Award } from "lucide-react";
import cultureImg from "@/assets/culture.jpg";

export const Route = createFileRoute("/store")({
  component: CraftStorePage,
  head: () => ({
    meta: [
      { title: "Bhutan Craft Store | Handicraft Association of Bhutan & Golden Takin Holidays" },
      {
        name: "description",
        content:
          "Authentic Bhutanese handicrafts, handwoven Yathra woolens, royal Kishuthara silks, sacred mineral pigment Thangkas, and certified high-altitude Cordyceps. Direct from the master artisans of Bhutan.",
      },
      { property: "og:title", content: "Bhutan Craft Store — Handcrafted in the Himalayas" },
    ],
  }),
});

interface CraftItem {
  id: string;
  slug: string;
  name: string;
  category: "textiles" | "sacred_art" | "woodcraft" | "agro_wellness";
  origin: string;
  artisanGroup: string;
  priceUSD: number;
  rating: number;
  reviewsCount: number;
  description: string;
  details: string[];
  imageUrl: string;
  badge?: string;
}

const CRAFT_PRODUCTS: CraftItem[] = [
  {
    id: "prod-1",
    slug: "bumthang-yathra-pure-wool-blanket",
    name: "Authentic Bumthang Yathra Pure Wool Blanket",
    category: "textiles",
    origin: "Chumey Valley, Bumthang",
    artisanGroup: "Chumey Weavers Cooperative & HAB",
    priceUSD: 115,
    rating: 5.0,
    reviewsCount: 28,
    description:
      "Handspun and handwoven pure sheep wool blanket featuring ancient geometric diamond motifs dyed with natural botanical pigments (walnut bark, madder root, wild indigo). Heavy, incredibly warm, and lifetime-durable.",
    details: ["100% Himalayan Sheep Wool", "Natural Botanical Dyes", "Size: 220cm x 140cm", "Certified Origin Stamp"],
    imageUrl: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80",
    badge: "Heritage Masterpiece",
  },
  {
    id: "prod-2",
    slug: "royal-lhuentse-kishuthara-silk-scarf",
    name: "Royal Lhuentse Kishuthara Raw Silk Scarf",
    category: "textiles",
    origin: "Khoma Village, Lhuentse",
    artisanGroup: "Khoma Women Weavers Association",
    priceUSD: 198,
    rating: 5.0,
    reviewsCount: 34,
    description:
      "Considered the crowning jewel of Bhutanese textile arts: intricate supplementary-weft patterning woven on backstrap looms taking up to 6 months of painstaking handwork. Sourced from the ancestral home of the Royal Dynasty.",
    details: ["Pure Raw Mulberry Silk", "Intricate Supplementary Weft", "Museum-Grade Artistry", "Signed by Master Weaver"],
    imageUrl: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80",
    badge: "Royal Collection",
  },
  {
    id: "prod-3",
    slug: "medicine-buddha-mineral-pigment-thangka",
    name: "Medicine Buddha Hand-Painted Mineral Thangka",
    category: "sacred_art",
    origin: "Thimphu Valley",
    artisanGroup: "National Institute for Zorig Chusum Alumni",
    priceUSD: 340,
    rating: 5.0,
    reviewsCount: 42,
    description:
      "Consecrated sacred Himalayan canvas painted strictly according to traditional iconographic proportions using crushed lapis lazuli, cinnabar, malachite, and 24-karat pure gold leaf. Framed in premium Bhutanese silk brocade.",
    details: ["Crushed Gemstone & 24K Gold Leaf", "Consecrated by Monastic Body", "Dimensions: 65cm x 45cm", "Authenticity Certificate"],
    imageUrl: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80",
    badge: "Consecrated Sacred Art",
  },
  {
    id: "prod-4",
    slug: "traditional-turned-wooden-dappa-bowls",
    name: "Traditional Turned Wooden Dappa Bowls (Airtight Pair)",
    category: "woodcraft",
    origin: "Trashiyangtse",
    artisanGroup: "Trashiyangtse Master Woodturners",
    priceUSD: 78,
    rating: 4.9,
    reviewsCount: 19,
    description:
      "Hand-turned from wild mountain maple burl wood (*Daza*). Designed with precision interlocking airtight rims so perfectly crafted that traditionally they were used to transport soups and tea over high mountain passes without spilling.",
    details: ["Mountain Maple Burl Wood", "Airtight Interlocking Seal", "Finished in Natural Plant Lacquer", "Pair of 2 Handcrafted Bowls"],
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "prod-5",
    slug: "certified-lunana-wild-cordyceps-grade-a",
    name: "Certified Lunana Wild Cordyceps Sinensis (10g Tin)",
    category: "agro_wellness",
    origin: "Lunana Alpine Meadows (4,400m)",
    artisanGroup: "National Bio-Trade & Highland Collectors",
    priceUSD: 290,
    rating: 5.0,
    reviewsCount: 56,
    description:
      "Government-auctioned, high-altitude wild Cordyceps (*Yartsa Gunbu*) hand-gathered in the glaciated alpine pastures of Lunana. Backed by the Royal Government of Bhutan forestry export verification seal and lab purity certificates.",
    details: ["Grade A Jumbo Wild Cordyceps", "High Bioactive Adenosine & Cordycepin", "Official Seal of Purity", "Tamper-Evident Sealed Tin"],
    imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
    badge: "Royal Government Certified",
  },
  {
    id: "prod-6",
    slug: "raw-organic-bumthang-clover-honey",
    name: "Raw Organic Bumthang Highland Clover Honey (500g)",
    category: "agro_wellness",
    origin: "Jakar, Bumthang",
    artisanGroup: "Bumthang Beekeepers Cooperative",
    priceUSD: 22,
    rating: 4.8,
    reviewsCount: 37,
    description:
      "Cold-extracted mountain honey gathered from wild white clover and pristine subalpine blossoms in the high Bumthang valley. Completely unheated, unfiltered, and rich in natural propolis and pollen enzymes.",
    details: ["100% Raw & Unheated", "Highland White Clover Nectar", "Glass Jar (500g)", "Zero Additives"],
    imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
  },
];

export function CraftStorePage() {
  const { formatPrice, currency } = useCurrency();
  const [selectedCat, setSelectedCat] = useState<string>("all");

  const filtered = selectedCat === "all"
    ? CRAFT_PRODUCTS
    : CRAFT_PRODUCTS.filter((p) => p.category === selectedCat);

  return (
    <>
      <PageHero
        eyebrow="Handicraft Association of Bhutan Partnership"
        title="Authentic Bhutanese Crafts & Sacred Arts"
        subtitle="Genuine textiles, consecrated thangkas, airtight dappa woodwork, and wild high-altitude agro-wellness treasures direct from master cottage artisans across the Kingdom."
        image={cultureImg}
      />

      <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6">
        {/* Association Partnership Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-gold/15 via-gold/5 to-card border border-gold/40 shadow-card flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4 text-center md:text-left">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gold/20 text-gold shrink-0">
              <Award className="w-8 h-8" />
            </span>
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-gold">Official Sourcing Alliance</div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-0.5">
                Handicraft Association of Bhutan (HAB)
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                Every purchase directly sustains traditional rural weavers, monastic painters, and high-altitude yak-herder communities with fair artisan compensation and certified geographical indication.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="text-center sm:text-right">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Promo Code for UK & Overseas</div>
              <div className="text-sm font-mono font-bold text-gold">WSUKSU26 (10% Off)</div>
            </div>
            <a
              href="https://www.takinmart.bt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gold text-slate-950 font-bold text-xs sm:text-sm shadow-md hover:bg-gold/90 transition"
            >
              <span>Visit TakinMart Platform</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {[
            { id: "all", label: "All Masterpieces" },
            { id: "textiles", label: "Handwoven Textiles" },
            { id: "sacred_art", label: "Buddhist Sacred Art" },
            { id: "woodcraft", label: "Traditional Woodcraft" },
            { id: "agro_wellness", label: "Himalayan Agro-Wellness" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                selectedCat === cat.id
                  ? "bg-primary text-primary-foreground shadow-card"
                  : "bg-card border border-border text-foreground/75 hover:bg-muted"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <Reveal key={item.id}>
              <div className="flex flex-col h-full rounded-2xl border border-border bg-card overflow-hidden shadow-card transition-all hover:shadow-gold/20 hover:border-gold/50 group">
                {/* Image */}
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-gold/40 text-[10px] font-bold text-gold">
                      {item.badge}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-card/90 backdrop-blur-md text-[11px] font-semibold text-foreground border border-border">
                    {item.origin}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-cypress">{item.artisanGroup}</span>
                      <span className="flex items-center gap-1 text-gold font-bold">
                        <Star className="w-3.5 h-3.5 fill-gold" /> {item.rating.toFixed(1)} ({item.reviewsCount})
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-foreground group-hover:text-gold transition">
                      {item.name}
                    </h3>

                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {item.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.details.map((detail, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-foreground/80">
                          {detail}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Purchase Action */}
                  <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-muted-foreground">Certified Price</div>
                      <div className="font-display text-xl font-bold text-foreground">
                        {formatPrice(item.priceUSD)}
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/918514889385?text=Hello%20Golden%20Takin%20Holidays%2C%20I%20am%20interested%20in%20purchasing%20the%20${encodeURIComponent(item.name)}%20(${item.slug}).`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-gold text-primary-foreground text-xs font-bold shadow hover:shadow-gold transition active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Order via Desk</span>
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Global Fulfillment & Authenticity Assurance */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-2xl border border-border bg-card shadow-card">
          <div className="flex items-start gap-3.5">
            <span className="p-3 rounded-xl bg-gold/15 text-gold shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <h4 className="font-display text-base font-bold text-foreground">100% Certified Origin</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Each textile and consecrated artwork is issued with an official Certificate of Provenance endorsed by the Handicraft Association of Bhutan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <span className="p-3 rounded-xl bg-gold/15 text-gold shrink-0">
              <Sparkles className="w-6 h-6" />
            </span>
            <div>
              <h4 className="font-display text-base font-bold text-foreground">Worldwide Insured Courier</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Dispatched directly from Thimphu via DHL Express and Bhutan Post EMS with full customs clearance, export permits, and phytosanitary papers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <span className="p-3 rounded-xl bg-gold/15 text-gold shrink-0">
              <Tag className="w-6 h-6" />
            </span>
            <div>
              <h4 className="font-display text-base font-bold text-foreground">UK Special Offer 'WSUKSU26'</h4>
              <p className="text-xs text-muted-foreground mt-1">
                UK travelers and clients returning from our journeys receive special privileges, waived parcel insurance, and direct artisan pricing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
