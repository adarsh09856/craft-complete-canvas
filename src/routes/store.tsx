import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { useCurrency } from "@/lib/currency";
import { ExternalLink, ShoppingBag, Sparkles, Star, Award, MessageCircle, Eye, CheckCircle2, ShieldCheck, Heart, Truck } from "lucide-react";
import cultureImg from "@/assets/culture.jpg";
import { buildWhatsAppUrl, useSiteSettings } from "@/lib/site-store";

export const Route = createFileRoute("/store")({
  component: CraftStorePage,
  head: () => ({
    meta: [
      { title: "TakinMart Bhutan Store | Authentic Himalayan Harvest & Master Crafts" },
      {
        name: "description",
        content:
          "Official TakinMart & Golden Takin Holidays Himalayan Store. Direct sourcing of high-altitude Cordyceps, wild Puthka honey, pure Shilajit, organic Lakadong turmeric, handwoven Bumthang Yathra woolens, and consecrated thangkas from Bhutan.",
      },
      { property: "og:title", content: "TakinMart Bhutan Store — Handcrafted in the Himalayas" },
    ],
  }),
});

interface StoreItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: "honey" | "wellness" | "pantry" | "crafts";
  categoryLabel: string;
  origin: string;
  artisanGroup: string;
  priceUSD: number;
  rating: number;
  reviewsCount: number;
  description: string;
  unit: string;
  details: string[];
  imageUrl: string;
  badge?: string;
  certification: string;
}

const TAKINMART_PRODUCTS: StoreItem[] = [
  // 1. Pure Shilajit
  {
    id: "jinlab-bhutanese-shilajit",
    slug: "jinlab-bhutanese-shilajit",
    name: "Pure Himalayan Bhutanese Shilajit Resin",
    tagline: "Harvested at 4,500m+ · 70%+ Fulvic Acid",
    category: "wellness",
    categoryLabel: "High-Altitude Wellness",
    origin: "High Alpine Glaciers, Bhutan",
    artisanGroup: "Jinlab Agro Products & Highland Foragers",
    priceUSD: 21,
    rating: 5.0,
    reviewsCount: 49,
    description: "Pure Grade-A Himalayan Shilajit resin wild-harvested at extreme altitudes above 4,500 meters in the pristine Bhutanese Himalayas. Purified with traditional herbal decoctions, containing over 85 trace ionic minerals and 70%+ bioactive fulvic acid for stamina, cognitive clarity, and vitality.",
    unit: "20g Jar",
    details: ["70%+ Bioactive Fulvic Acid", "85+ Trace Ionic Minerals", "Traditional Shodhana Purified", "Heavy Metal Tested & Certified"],
    imageUrl: "/products/jinlab-bhutanese-shilajit.png",
    badge: "Bestseller",
    certification: "Bhutan Department of Agriculture Verified",
  },
  // 2. Cordyceps Honey
  {
    id: "jinlab-cordyceps-honey",
    slug: "jinlab-cordyceps-honey",
    name: "Jinlab Cordyceps Infused Wild Honey",
    tagline: "Raw mountain honey infused with wild Cordyceps",
    category: "honey",
    categoryLabel: "Wild Honey",
    origin: "Bumthang Valley & Lunana",
    artisanGroup: "Bumthang Beekeepers Collective",
    priceUSD: 18,
    rating: 5.0,
    reviewsCount: 51,
    description: "Raw, cold-extracted wildflower honey from subalpine Bumthang, enriched with certified wild-harvested Cordyceps Sinensis. An extraordinary morning vitality elixir that bolsters natural immunity, lung capacity, and stamina.",
    unit: "250g Jar",
    details: ["100% Raw Wildflower Nectar", "Genuine Cordyceps Sinensis Infusion", "Cold-Extracted & Unheated", "Zero Additives or Artificial Sugars"],
    imageUrl: "/products/jinlab-cordyceps-honey.png",
    badge: "Royal Favorite",
    certification: "Authentic Himalayan Bio-Seal",
  },
  // 3. Stingless Bee Puthka Honey
  {
    id: "jinlab-stingless-bee-puthka-honey",
    slug: "jinlab-stingless-bee-puthka-honey",
    name: "Rare Stingless-Bee Puthka Honey",
    tagline: "Medicinal Melipona nectar · Extraordinary antioxidants",
    category: "honey",
    categoryLabel: "Wild Honey",
    origin: "Subtropical Virgin Forests, Tsirang",
    artisanGroup: "Tsirang Indigenous Foragers",
    priceUSD: 30,
    rating: 5.0,
    reviewsCount: 38,
    description: "Ultra-rare medicinal honey produced by tiny stingless Meliponini bees that forage on medicinal tree saps and forest botanicals. Distinctively tangy with high propolis content, celebrated for respiratory healing and tissue restoration.",
    unit: "100ml Bottle",
    details: ["Meliponini Stingless Bee Species", "Natural Antimicrobial Propolis", "Citrus & Resin Nuances", "Rare Small-Batch Harvest"],
    imageUrl: "/products/jinlab-stingless-bee-puthka-honey.png",
    badge: "Ultra Rare",
    certification: "Protected Forest Bio-Certificate",
  },
  // 4. Premium Multi-Flora Honey
  {
    id: "jinlab-premium-multi-flora-honey",
    slug: "jinlab-premium-multi-flora-honey",
    name: "Premium Multi-Flora Highland Honey",
    tagline: "Native Apis cerana bees · Pure subalpine nectar",
    category: "honey",
    categoryLabel: "Wild Honey",
    origin: "Bumthang Valley (2,800m)",
    artisanGroup: "Highland Apiaries Alliance",
    priceUSD: 11,
    rating: 4.9,
    reviewsCount: 67,
    description: "Unfiltered golden nectar gathered by native Himalayan bees foraging across white clover, wild apple blossoms, and mountain herbs. Retains all living floral pollen and beneficial digestive enzymes.",
    unit: "250g Jar",
    details: ["Native Apis cerana Himalayan Bees", "Living Pollen & Propolis Intact", "Rich Herbal Floral Aroma", "Unpasteurized & Pure"],
    imageUrl: "/products/jinlab-premium-multi-flora-honey.png",
    badge: "Gold Medal",
    certification: "Bhutan Agro Organic Seal",
  },
  // 5. Cordyceps Herbal Tea
  {
    id: "jinlab-himalayan-cordyceps-herbal-tea",
    slug: "jinlab-himalayan-cordyceps-herbal-tea",
    name: "Himalayan Cordyceps Herbal Tea",
    tagline: "Restorative high-altitude botanical infusion",
    category: "wellness",
    categoryLabel: "High-Altitude Wellness",
    origin: "High Valleys, Bhutan",
    artisanGroup: "Jinlab Herbal Masters",
    priceUSD: 11,
    rating: 4.9,
    reviewsCount: 40,
    description: "Delicately blended highland herbal infusion pairing real Cordyceps Sinensis with Bhutanese mint and alpine herbs. Soothing, earthy, naturally caffeine-free, and ideal for evening relaxation and altitude acclimatization.",
    unit: "20 Pyramid Sachets (30g)",
    details: ["Wild Lunana Cordyceps Extract", "Naturally Caffeine-Free", "High Elevation Herbs", "Eco-Friendly Biodegradable Sachets"],
    imageUrl: "/products/jinlab-cordyceps-tea-front.png",
    badge: "New",
    certification: "Carbon-Neutral Grown",
  },
  // 6. Lakadong Turmeric Powder
  {
    id: "jinlab-lakadong-turmeric-powder",
    slug: "jinlab-lakadong-turmeric-powder",
    name: "Organic Lakadong Turmeric Powder",
    tagline: "Highest Curcumin 7–9% · Pure volcanic mountain soil",
    category: "pantry",
    categoryLabel: "Mountain Pantry",
    origin: "Tsirang / Samdrup Jongkhar, Bhutan",
    artisanGroup: "Organic Farming Cooperatives",
    priceUSD: 5,
    rating: 4.9,
    reviewsCount: 58,
    description: "World-famous Lakadong variety prized for containing up to triple the curcumin concentration of regular turmeric. Deep amber hue, intense aroma, and unmatched anti-inflammatory potency.",
    unit: "250g Jar",
    details: ["7–9% Tested Curcumin Purity", "Pesticide & Chemical Free", "Stone-Ground Preservation", "Air-Tight Protective Packaging"],
    imageUrl: "/products/p-mustard-oil.jpg",
    badge: "High Curcumin",
    certification: "Certified Organic — Product of Bhutan",
  },
  // 7. Golden Trio Capsules
  {
    id: "jinlab-golden-trio-capsules",
    slug: "jinlab-golden-trio-capsules",
    name: "Golden Trio Vitality Capsules",
    tagline: "Turmeric · Highland Ginger · Black Pepper",
    category: "wellness",
    categoryLabel: "High-Altitude Wellness",
    origin: "Tsirang, Bhutan",
    artisanGroup: "Jinlab Agro Formulations",
    priceUSD: 25,
    rating: 5.0,
    reviewsCount: 32,
    description: "Master synergy formula: Lakadong turmeric and spicy mountain ginger paired with piperine from black pepper to increase nutrient bioavailability by up to 2,000%. 100% plant-based vegetarian pullulan capsules.",
    unit: "60 Capsules",
    details: ["Maximum Bioavailability Blend", "Joint Flexibility & Anti-Inflammatory", "Pullulan Vegan Plant Capsules", "Zero Fillers or Silicon Dioxide"],
    imageUrl: "/products/jinlab-organic-turmeric-capsules.png",
    badge: "Synergy Formula",
    certification: "Bhutan Department of Traditional Medicine Formulated",
  },
  // 8. Organic Black Turmeric
  {
    id: "jinlab-organic-black-turmeric-capsules",
    slug: "jinlab-organic-black-turmeric-capsules",
    name: "Organic Black Turmeric Capsules",
    tagline: "Curcuma Caesia · Rare sacred blue-black rhizome",
    category: "wellness",
    categoryLabel: "High-Altitude Wellness",
    origin: "Pristine Valleys, Bhutan",
    artisanGroup: "Highland Herbalists",
    priceUSD: 16,
    rating: 5.0,
    reviewsCount: 24,
    description: "One of the most sacred and rare rhizomes in Tibetan Sowa Rigpa healing. Curcuma Caesia has a distinct blue-violet interior rich in natural camphor, essential oils, and potent antioxidants for respiratory and cellular defense.",
    unit: "60 Capsules",
    details: ["Rare Curcuma Caesia Variety", "High Camphor & Polyphenols", "Single-Origin Soil Sourced", "Vegetarian Pullulan Capsules"],
    imageUrl: "/products/jinlab-organic-black-turmeric-capsules.png",
    badge: "Sacred Herb",
    certification: "Certified Organic Bhutan",
  },
  // 9. Black Ginger Capsules
  {
    id: "jinlab-black-ginger-capsules",
    slug: "jinlab-black-ginger-capsules",
    name: "Himalayan Black Ginger Capsules",
    tagline: "Kaempferia parviflora · Natural vigor & stamina",
    category: "wellness",
    categoryLabel: "High-Altitude Wellness",
    origin: "Subtropical Foothills, Bhutan",
    artisanGroup: "Jinlab Botanical Research",
    priceUSD: 14,
    rating: 4.9,
    reviewsCount: 29,
    description: "Known as Thai Ginseng / Himalayan Krachaidum, this purple-black root improves peripheral circulation, cellular energy synthesis (AMPK activation), and sustained stamina for hikers and athletes.",
    unit: "60 Capsules",
    details: ["Natural Nitric Oxide Precursor", "AMPK Metabolic Activation", "High Mountain Soil Grown", "Standardized Bioactive Flavones"],
    imageUrl: "/products/jinlab-black-ginger-capsules.png",
    badge: "Energy & Stamina",
    certification: "Pure Botanical Extract",
  },
  // 10. Chirata Detox Capsules
  {
    id: "jinlab-chirata-detox-capsules",
    slug: "jinlab-chirata-detox-capsules",
    name: "Chirata Detox & Liver Capsules",
    tagline: "Swertia Chirayita · Revered Himalayan bitter tonic",
    category: "wellness",
    categoryLabel: "High-Altitude Wellness",
    origin: "Tsirang, Bhutan",
    artisanGroup: "Jinlab Agro Products",
    priceUSD: 12,
    rating: 4.8,
    reviewsCount: 37,
    description: "Swertia Chirayita is the premier bitter herb of the Himalayas, celebrated for clearing heat, stimulating healthy bile production, and supporting deep hepatic liver detoxification.",
    unit: "60 Capsules",
    details: ["Pure Swertia Chirayita Herb", "Traditional Liver Cleansing Tonic", "Supports Healthy Blood Sugar", "Gentle Daily Digestive Reset"],
    imageUrl: "/products/jinlab-chirata-detox-capsules.png",
    badge: "Deep Detox",
    certification: "Traditional Medicine Standard",
  },
  // 11. Jinlab Avocado Jam
  {
    id: "jinlab-avocado-jam",
    slug: "jinlab-avocado-jam",
    name: "Artisanal Pure Avocado Fruit Spread",
    tagline: "60% Fresh Bhutanese Avocados · Smooth & nutrient dense",
    category: "pantry",
    categoryLabel: "Mountain Pantry",
    origin: "Tsirang Orchard Terraces",
    artisanGroup: "Tsirang Women's Food Guild",
    priceUSD: 30,
    rating: 4.9,
    reviewsCount: 22,
    description: "A culinary breakthrough made in small batches with 60% luscious organic avocados grown in Bhutan's sun-drenched valleys. Naturally smooth, buttery, lightly sweetened with pure cane sugar and a hint of lime.",
    unit: "220g Jar",
    details: ["60% Fresh Tree-Ripened Avocados", "Zero Preservatives or Pectin", "Rich in Monounsaturated Fats", "Exquisite on Sourdough Toast"],
    imageUrl: "/products/jinlab-avocado-jam.png",
    badge: "Gourmet Spread",
    certification: "Handcrafted in Small Batches",
  },
  // 12. Natural Red Kiwi Jam
  {
    id: "jinlab-natural-red-kiwi-jam",
    slug: "jinlab-natural-red-kiwi-jam",
    name: "Natural Red Kiwi Artisanal Jam",
    tagline: "Ruby-red mountain kiwis · Berry sweetness",
    category: "pantry",
    categoryLabel: "Mountain Pantry",
    origin: "Organic Valleys, Bhutan",
    artisanGroup: "Tsirang Artisanal Preserves",
    priceUSD: 7,
    rating: 4.8,
    reviewsCount: 19,
    description: "Prepared from rare red-centered kiwis grown in Bhutan's clean valleys. Sweet berry-like flavor profile naturally high in vitamin C, with a vibrant crimson color and delightful aroma.",
    unit: "220g Jar",
    details: ["Rare Red-Fleshed Kiwi Cultivar", "High Vitamin C Content", "Low Temperature Cooked", "Handmade in Copper Kettles"],
    imageUrl: "/products/jinlab-natural-red-kiwi-jam.png",
    badge: "Artisanal",
    certification: "Pure Fruit Preserve Seal",
  },
  // 13. Dalle Garlic Pickle
  {
    id: "jinlab-dalle-garlic-pickle",
    slug: "jinlab-dalle-garlic-pickle",
    name: "Traditional Dalle Garlic Pickle",
    tagline: "Whole mountain garlic & fiery Dalle cherry chillies",
    category: "pantry",
    categoryLabel: "Mountain Pantry",
    origin: "Tsirang, Bhutan",
    artisanGroup: "Traditional Home Kitchens",
    priceUSD: 4.5,
    rating: 4.7,
    reviewsCount: 28,
    description: "Whole peeled cloves of mountain garlic aged in cold-pressed mustard oil with fiery round Dalle peppers, fenugreek, and roasted cumin. The ultimate accompaniment to Bhutanese meals.",
    unit: "200g Jar",
    details: ["Cold-Pressed Mustard Oil Aged", "Native Dalle Khursani Chilies", "Whole Garlic Cloves", "Authentic Spicy Tang"],
    imageUrl: "/products/jinlab-dalle-garlic-pickle.png",
    badge: "Spicy",
    certification: "Authentic Bhutanese Recipe",
  },
  // 14. Fire Balls Dalle Paste
  {
    id: "jinlab-fire-balls-dalle-paste-pickle",
    slug: "jinlab-fire-balls-dalle-paste-pickle",
    name: "Fire Balls Dalle Paste Pickle",
    tagline: "Fiery Dalle cherry pepper purée with mountain spices",
    category: "pantry",
    categoryLabel: "Mountain Pantry",
    origin: "Tsirang, Bhutan",
    artisanGroup: "Jinlab Master Condiments",
    priceUSD: 5.5,
    rating: 4.8,
    reviewsCount: 45,
    description: "Pure crushed Dalle cherry chillies slow-simmered into an intense, fiery condiment. Irresistible on momos, curries, roast meats, and traditional noodle soups.",
    unit: "200g Jar",
    details: ["Intense Fire & Fragrance", "100% Native Dalle Peppers", "Traditional Spicing", "No Synthetic Colors"],
    imageUrl: "/products/jinlab-fire-balls-dalle-paste-pickle.png",
    badge: "Extra Hot",
    certification: "Tsirang Valley Harvest",
  },
  // 15. Heritage Red Rice
  {
    id: "bhutan-heritage-red-rice",
    slug: "bhutan-heritage-red-rice",
    name: "Bhutanese Heritage Organic Red Rice",
    tagline: "Mineral-rich glacial soil · Nutty flavor and ruby bran",
    category: "pantry",
    categoryLabel: "Mountain Pantry",
    origin: "Paro & Punakha Valleys",
    artisanGroup: "Heritage Rice Farmers Guild",
    priceUSD: 7,
    rating: 4.9,
    reviewsCount: 76,
    description: "The staple grain of the Kingdom, irrigated by high-altitude glacial snowmelt. Retains its nutritious red bran layer, providing natural magnesium, fiber, and a satisfying nutty chew.",
    unit: "1kg Cloth Bag",
    details: ["Glacial Snowmelt Irrigated", "Nutty Earthy Texture", "Rich in Iron & Antioxidants", "Semi-Milled Whole Grain"],
    imageUrl: "/products/p-red-rice.jpg",
    badge: "National Heritage",
    certification: "Bhutan Agricultural Product Seal",
  },
  // 16. Bumthang Yathra Blanket
  {
    id: "bumthang-yathra-pure-wool-blanket",
    slug: "bumthang-yathra-pure-wool-blanket",
    name: "Authentic Bumthang Yathra Pure Wool Blanket",
    tagline: "Handspun sheep wool · Ancient diamond geometric weave",
    category: "crafts",
    categoryLabel: "Master Crafts",
    origin: "Chumey Valley, Bumthang",
    artisanGroup: "Chumey Weavers Cooperative & HAB",
    priceUSD: 115,
    rating: 5.0,
    reviewsCount: 38,
    description: "Handspun and handwoven pure highland sheep wool blanket featuring ancient geometric diamond motifs dyed with natural walnut bark, madder root, and wild indigo. Exceptionally warm, durable, and heirloom-quality.",
    unit: "Size: 220cm × 140cm",
    details: ["100% Highland Sheep Wool", "Natural Botanical Pigment Dyes", "Hand-Woven on Backstrap Looms", "Handicraft Association Certified"],
    imageUrl: "/products/p-buckwheat.jpg",
    badge: "Heirloom Craft",
    certification: "Handicraft Association of Bhutan (HAB)",
  },
  // 17. Royal Kishuthara Silk Scarf
  {
    id: "royal-lhuentse-kishuthara-silk-scarf",
    slug: "royal-lhuentse-kishuthara-silk-scarf",
    name: "Royal Lhuentse Kishuthara Silk Scarf",
    tagline: "Crowning jewel of Bhutanese royal weaving",
    category: "crafts",
    categoryLabel: "Master Crafts",
    origin: "Khoma Village, Lhuentse",
    artisanGroup: "Khoma Women Weavers Association",
    priceUSD: 198,
    rating: 5.0,
    reviewsCount: 34,
    description: "The most prestigious textile art of the Kingdom: intricate supplementary-weft patterning woven on backstrap looms taking up to 4 months of meticulous handwork. Sourced from the ancestral seat of the Royal Dynasty.",
    unit: "Pure Silk (180cm × 45cm)",
    details: ["Pure Raw Mulberry Silk", "Intricate Supplementary Weft", "Museum-Grade Artistry", "Signed by Master Weaver"],
    imageUrl: "/products/p-suja.jpg",
    badge: "Royal Collection",
    certification: "Royal Weavers Guild Verification",
  },
  // 18. Medicine Buddha Thangka
  {
    id: "medicine-buddha-mineral-pigment-thangka",
    slug: "medicine-buddha-mineral-pigment-thangka",
    name: "Medicine Buddha Mineral Pigment Thangka",
    tagline: "Consecrated sacred canvas painted with crushed lapis & 24K gold",
    category: "crafts",
    categoryLabel: "Master Crafts",
    origin: "Thimphu Monastic Valley",
    artisanGroup: "Zorig Chusum Master Artists",
    priceUSD: 340,
    rating: 5.0,
    reviewsCount: 42,
    description: "Sacred Himalayan devotional canvas painted strictly according to traditional iconographic proportions using crushed lapis lazuli, cinnabar, malachite, and 24-karat pure gold leaf. Framed in authentic Bhutanese silk brocade.",
    unit: "Canvas (65cm × 45cm)",
    details: ["Crushed Gemstones & 24K Gold Leaf", "Consecrated by Monastic Body", "Traditional Silk Brocade Border", "Authenticity Certificate Included"],
    imageUrl: "/products/p-cordyceps.jpg",
    badge: "Consecrated Art",
    certification: "Institute for Zorig Chusum Consecration",
  },
];

export function CraftStorePage() {
  const { formatPrice, currency } = useCurrency();
  const settings = useSiteSettings();
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<StoreItem | null>(null);

  const filtered = selectedCat === "all"
    ? TAKINMART_PRODUCTS
    : TAKINMART_PRODUCTS.filter((p) => p.category === selectedCat);

  const handleWhatsAppInquiry = (item: StoreItem) => {
    const text = `Hello Golden Takin / TakinMart team, I am interested in purchasing "${item.name}" (${item.unit}, approx ${formatPrice(item.priceUSD)}). Could you please assist me with availability and international delivery?`;
    const url = buildWhatsAppUrl(settings.whatsappNumber || "+918514889385", text);
    window.open(url, "_blank");
  };

  return (
    <>
      <PageHero
        eyebrow="Official TakinMart & Golden Takin Sourcing Alliance"
        title="Authentic Bhutanese Harvest & Master Crafts"
        subtitle="Genuine Himalayan Shilajit, rare Puthka honey, organic cordyceps tea, handwoven Yathra woolens, and consecrated sacred art direct from master cottage artisans across the Kingdom."
        image={cultureImg}
      />

      <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6">
        {/* TakinMart Partnership Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-gold/20 via-gold/10 to-card border border-gold/40 shadow-card flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gold/25 text-gold shrink-0 shadow-soft">
              <Award className="w-8 h-8" />
            </span>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs uppercase font-bold tracking-wider text-gold">
                <ShieldCheck className="w-4 h-4" /> Official TakinMart Sourcing Alliance
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-1">
                Authentic Products from TakinMart &amp; Bhutan Agro Cooperatives
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                Every jar of wild honey, vial of Himalayan shilajit, and handwoven blanket supports traditional mountain beekeepers and rural craftspeople. Delivered worldwide with guaranteed authenticity certificates.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="text-center sm:text-right">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Special Guest Promo Code</div>
              <div className="text-sm font-mono font-bold text-gold">WSUKSU26 (10% Off)</div>
            </div>
            <a
              href="https://www.takinmart.bt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gold text-slate-950 font-bold text-xs sm:text-sm shadow-md hover:bg-gold/90 transition hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore TakinMart Online</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {[
            { id: "all", label: "All Authentic Treasures" },
            { id: "honey", label: "Wild Honey & Bee Products" },
            { id: "wellness", label: "High-Altitude Wellness & Shilajit" },
            { id: "pantry", label: "Mountain Pantry & Spices" },
            { id: "crafts", label: "Handwoven Textiles & Sacred Art" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                selectedCat === cat.id
                  ? "bg-primary text-primary-foreground shadow-card"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card shadow-card transition-all duration-300 hover:border-gold/60 hover:shadow-hover"
            >
              <div>
                {/* Image Banner */}
                <div className="relative aspect-square overflow-hidden bg-secondary/50">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {item.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-soft">
                      {item.badge}
                    </span>
                  )}
                  <span className="absolute right-3 top-3 rounded-full bg-background/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-foreground shadow-soft border border-border">
                    {item.unit}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gold">
                    {item.categoryLabel} · {item.origin}
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground mt-1 line-clamp-1 group-hover:text-gold transition">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 italic line-clamp-1">
                    "{item.tagline}"
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="font-semibold text-foreground">{item.rating}</span>
                    <span>({item.reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Bottom Price & Dual Actions */}
              <div className="p-5 pt-0 border-t border-border/50 mt-2">
                <div className="flex items-baseline justify-between pt-3 mb-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Direct Price</div>
                    <div className="font-display text-xl font-extrabold text-foreground">
                      {formatPrice(item.priceUSD)}
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Authentic
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleWhatsAppInquiry(item)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-500 hover:text-white transition"
                    title="Inquire directly on WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Inquire</span>
                  </button>

                  <a
                    href={`https://www.takinmart.bt/products/${item.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-gold px-3 py-2.5 text-xs font-bold text-primary-foreground shadow-soft hover:shadow-gold transition"
                    title="Order on TakinMart platform"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>TakinMart</span>
                    <ExternalLink className="w-3 h-3 opacity-75" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Delivery Guarantee Banner */}
        <div className="mt-16 rounded-3xl border border-border bg-card p-8 shadow-card grid md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary shrink-0">
              <Truck className="w-6 h-6" />
            </span>
            <div>
              <div className="font-bold text-sm text-foreground">Express International Shipping</div>
              <div className="text-xs text-muted-foreground mt-0.5">Air freight dispatch directly from Paro / Thimphu to your doorstep worldwide.</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/20 text-gold shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <div className="font-bold text-sm text-foreground">100% Origin Guaranteed</div>
              <div className="text-xs text-muted-foreground mt-0.5">Certified by Bhutan Agriculture &amp; Food Regulatory Authority (BAFRA).</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 shrink-0">
              <Heart className="w-6 h-6" />
            </span>
            <div>
              <div className="font-bold text-sm text-foreground">Empowering Highland Farmers</div>
              <div className="text-xs text-muted-foreground mt-0.5">Fair trade revenue returns directly to rural herders and master cottage artisans.</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
