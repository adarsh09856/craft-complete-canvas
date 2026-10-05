import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Search, Mountain, Compass, ShieldCheck, Heart, Sparkles, MapPin, Feather, Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/guidebook")({
  head: () => ({
    meta: [
      { title: "Bhutan Travel Guidebook (2026–27 Edition) — Golden Takin Holidays" },
      { name: "description", content: "Comprehensive 20-chapter encyclopedia of Bhutan travel: Gross National Happiness, history, major Dzongs, Tiger's Nest hike guide, Tshechu festivals, UPI payments, and cultural etiquette." },
    ],
  }),
  component: GuidebookPage,
});

const chapters = [
  {
    id: 1,
    title: "1. The Land of the Thunder Dragon (Druk Yul)",
    subtitle: "Geography, Climate & Sacred Landscapes",
    category: "Geography",
    content:
      "Bhutan, known natively as Druk Yul ('Land of the Thunder Dragon'), is a landlocked Himalayan kingdom nestled between India and the Tibetan Autonomous Region of China. Encompassing 38,394 square kilometers, the kingdom transitions precipitously from sub-tropical southern plains (200m) to glaciated eastern Himalayan summits exceeding 7,500m. The country is divided into three distinct agro-ecological zones: the southern Duars, the temperate central inner valleys, and the northern alpine zone. It remains the world's only carbon-negative sovereign nation, constitutionally bound to maintain at least 60% forest cover in perpetuity (currently exceeding 71%).",
  },
  {
    id: 2,
    title: "2. Gross National Happiness (GNH)",
    subtitle: "The Philosophical Core of the Kingdom",
    category: "Philosophy & Governance",
    content:
      "Conceived in 1972 by His Majesty Jigme Singye Wangchuck, the Fourth Druk Gyalpo, Gross National Happiness asserts that sustainable development must balance material well-being with spiritual, emotional, and ecological harmony. GNH is codified through 4 Pillars: 1) Sustainable & Equitable Socio-Economic Development, 2) Environmental Conservation, 3) Preservation & Promotion of Culture, and 4) Good Governance. These pillars branch into 9 Domains and 33 Core Indicators measured periodically by the Centre for Bhutan & GNH Studies to guide all national legislation.",
  },
  {
    id: 3,
    title: "3. The Wangchuck Dynasty & Monarchy",
    subtitle: "Unification & Transition to Democratic Constitutional Monarchy",
    category: "History",
    content:
      "Bhutan was unified in the early 17th century by Zhabdrung Ngawang Namgyal, who instituted a dual governance system (Chhoeshid) dividing temporal authority (Druk Desi) and spiritual leadership (Je Khenpo). In 1907, Sir Ugyen Wangchuck was unanimously crowned the first hereditary King (Druk Gyalpo). Under His Majesty the Fourth King, Bhutan peacefully transitioned into a democratic constitutional monarchy in 2008. Today, His Majesty King Jigme Khesar Namgyel Wangchuck (the Fifth King) and Her Majesty Queen Jetsun Pema steer the nation toward global innovation with the Gelephu Mindfulness City special administrative region.",
  },
  {
    id: 4,
    title: "4. Major Dzongs: Fortress-Monasteries of Bhutan",
    subtitle: "Architectural Marvels Built Without Blueprints or Nails",
    category: "Heritage & Architecture",
    content:
      "Dzongs are massive fortified complexes that uniquely combine district administrative headquarters and monastic centers. Constructed from stone, compacted earth, and interlocking timber without a single iron nail or written blueprint: 1) Punakha Dzong ('Palace of Great Happiness'), perched majestically at the confluence of the Pho Chhu and Mo Chhu rivers; 2) Tashichho Dzong, the royal government seat in Thimphu; 3) Rinpung Dzong ('Fortress on a Heap of Jewels') in Paro, renowned for its cantilever bridge and annual festival courtyard.",
  },
  {
    id: 5,
    title: "5. Paro Taktsang (Tiger's Nest) Expedition Guide",
    subtitle: "Sacred Pilgrimage to the Cliffside Sanctuary",
    category: "Trekking & Pilgrimage",
    content:
      "Perched precariously on a vertical granite cliff 900 meters above the Paro Valley floor (3,120m altitude), Paro Taktsang is Bhutan's most sacred pilgrimage site. According to legend, Guru Padmasambhava (Guru Rinpoche) flew here on the back of a tigress in the 8th century to subdue negative demons and meditated in the cliffside cave for three years, three months, and three days. The trek spans 4.5 km each way (approx. 4–6 hours round trip) through fragrant blue pine forests. Horses can be hired for the ascent up to the midpoint cafeteria. Proper walking shoes, hydration, and walking sticks are strongly advised.",
  },
  {
    id: 6,
    title: "6. Religious Festivals (Tshechus) & Sacred Cham Dances",
    subtitle: "Living Buddhist Epics, Masked Dances & Sacred Thongdrels",
    category: "Culture & Festivals",
    content:
      "Tshechus are annual religious festivals held on the tenth day of a lunar month in honor of Guru Rinpoche. Celebrated with theatrical vitality, monks and laymen perform sacred masked dances (Cham) dressed in elaborate silk brocades representing deities, heroes, and wrathful protectors. Key festivals: Paro Tshechu (Spring), Thimphu Tshechu (Autumn), and Jambay Lhakhang Drup in Bumthang. The climax of major festivals is the unfurling of the colossal Thongdrel (religious silk applique tapestry) at pre-dawn, which bestows instant spiritual liberation on all who gaze upon it.",
  },
  {
    id: 7,
    title: "7. High Himalayan Mountain Passes",
    subtitle: "Dochula (3,120m), Chele La (3,988m), Pele La & Yotong La",
    category: "Geography",
    content:
      "Bhutan's winding east-west highway traverses legendary high passes: 1) Dochula Pass (3,120m): Renowned for its 108 Druk Wangyal Chortens and breathtaking panoramic views of snow-capped peaks including Gangkar Puensum (7,570m); 2) Chele La Pass (3,988m): The highest motorable road pass in Bhutan, linking Paro to the secluded Haa Valley, surrounded by fluttering prayer flags and Himalayan rhododendrons; 3) Pele La (3,420m), the traditional divide between Western and Central Bhutan.",
  },
  {
    id: 8,
    title: "8. Sustainable Development Fee (SDF) & Visa Regulations",
    subtitle: "High Value, Low Volume Sovereign Tourism Policy",
    category: "Travel Logistics",
    content:
      "Bhutan regulates inbound tourism through its hallmark 'High Value, Low Volume' framework. All international visitors must pay the statutory Sustainable Development Fee (SDF): USD 100/night/adult for international travelers, and INR 1,200/night/adult for regional Indian guests. Visas and entry permits are processed digitally through certified tour operators like Golden Takin Holidays via the government's Tashel portal. Indian travelers require either an original valid Indian Passport (6 months validity) or an original Election Voter ID Card (Aadhaar/PAN are strictly not accepted).",
  },
  {
    id: 9,
    title: "9. Currency, Banking & Integrated UPI / RuPay Acceptance",
    subtitle: "Bhutanese Ngultrum (Nu.), Indian Rupee & Modern Digital QR",
    category: "Financial Guide",
    content:
      "The national currency is the Bhutanese Ngultrum (BTN / Nu.), pegged 1:1 with the Indian Rupee (INR). Indian currency notes (up to ₹500 denominations) are freely accepted everywhere. In partnership with the National Payments Corporation of India (NPCI) and the Royal Monetary Authority (RMA), Bhutan became the first international nation to integrate unified UPI payments: BHIM, Google Pay, PhonePe, and RuPay cards are accepted seamlessly across hotels, restaurants, and retail shops in Thimphu and Paro. International credit cards (Visa/Mastercard) are accepted at major 3-Star to 5-Star resorts.",
  },
  {
    id: 10,
    title: "10. Traditional Cuisine & Bhutanese Culinary Heritage",
    subtitle: "Ema Datshi, Red Rice, Suja Tea & Himalayan Delicacies",
    category: "Culinary",
    content:
      "Bhutanese cuisine is hearty, organic, and famously spicy. The national dish is Ema Datshi, a fiery combination of green chili peppers and artisanal organic cow/yak cheese. Other favorites include Kewa Datshi (potato and cheese), Shamu Datshi (mushroom and cheese), Momos (dumplings filled with pork, beef, or cabbage and datshi), red rice (cultivated in the high valleys of Paro and Punakha), and Suja (traditional butter tea churned with salt and yak butter). Bhutanese peach wine (Zumzin) and Druk 11000 beer are celebrated local beverages.",
  },
  {
    id: 11,
    title: "11. Cultural Etiquette & Dzong Visitation Protocol",
    subtitle: "Dressing Modestly, Circumambulation & Buddhist Reverence",
    category: "Etiquette",
    content:
      "Bhutanese culture is anchored in deep mutual respect. In Dzongs, monasteries, and religious monuments: 1) Dress respectfully: Arms and legs must be fully covered (no shorts, sleeveless tops, or open flip-flops); 2) Always walk clockwise (circumambulate) around Chortens, Mani walls, and inner temple altars; 3) Remove hats and shoes before stepping onto monastery timber floors; 4) Photography is strictly prohibited inside the inner temple sanctums; 5) Speak in quiet, reverent tones.",
  },
  {
    id: 12,
    title: "12. Flora, Fauna & Conservation: Home of the Takin",
    subtitle: "Carbon-Negative Sanctuaries, Takin, Red Pandas & Black-Necked Cranes",
    category: "Wildlife & Nature",
    content:
      "Over 71% of Bhutan is cloaked in pristine forests, interconnected by an expansive biological corridor network. Bhutan is home to rare species: the Takin (Budorcas taxicolor, the national animal with the head of a goat and body of a cow), the Bengal Tiger roaming up to 4,000m, Snow Leopards, Red Pandas, Golden Langurs, and the endangered Black-Necked Crane wintering in the glacial wetlands of Phobjikha and Bumdeling. Over 770 bird species make Bhutan a paradise for birdwatchers.",
  },
  {
    id: 13,
    title: "13. World-Famous Trekking Circuits of Bhutan",
    subtitle: "Druk Path, Jomolhari Trek & The Legendary Snowman Trek",
    category: "Trekking",
    content:
      "Bhutan offers pristine wilderness trekking with zero commercial crowds: 1) Druk Path Trek (5–6 Days): Classic ridge trek connecting Paro and Thimphu past crystal alpine lakes; 2) Jomolhari Trek (8–9 Days): Scenic wilderness route beneath the sacred pyramid peak of Mt. Jomolhari (7,326m); 3) The Snowman Trek (25–28 Days): Widely considered the toughest mountain trek on Earth, traversing 11 high passes above 4,500m across the remote Lunana highlands.",
  },
  {
    id: 14,
    title: "14. Traditional Healing: Dotsho (Herbal Hot Stone Baths)",
    subtitle: "River Minerals, Roasted Artemisia & Therapeutic Mountain Waters",
    category: "Wellness",
    content:
      "The traditional Bhutanese hot stone bath (Dotsho) is an ancient healing ritual practiced for centuries. Clean river stones are heated over open hardwood fires until glowing orange, then submerged into a wooden tub filled with fresh mountain spring water. The thermal reaction cracks the stones, releasing deep therapeutic minerals and sulfur. Fresh medicinal Artemisia leaves (Khempa) are infused, relieving muscle tension, joint inflammation, and high-altitude fatigue.",
  },
  {
    id: 15,
    title: "15. The 13 Traditional Arts & Crafts (Zorig Chusum)",
    subtitle: "Weaving, Wood carving, Painting, Clay Sculpture & Metallurgy",
    category: "Arts & Crafts",
    content:
      "Bhutan's material culture is embodied in the Zorig Chusum (13 Traditional Arts), preserved with royal patronage: 1) Shingzo (Carpentry), 2) Dozo (Masonry), 3) Parzo (Carving), 4) Lhazo (Painting & Thangka), 5) Jimzo (Clay Sculpture), 6) Lugzo (Bronze Casting), 7) Shagzo (Woodturning/Dappa bowls), 8) Garzo (Blacksmithing), 9) Troezo (Silver & Gold Jewelry), 10) Tsharzo (Bamboo weaving), 11) Dezo (Papermaking), 12) Tshemzo (Tailoring & Applique), and 13) Thagzo (Weaving Yathra wool and Kishuthara raw silk).",
  },
  {
    id: 16,
    title: "16. Trans-Himalayan Combinations: Nepal & Tibet",
    subtitle: "Kathmandu Valley, Pokhara, Lhasa, Potala & Mt. Kailash",
    category: "Multi-Country",
    content:
      "Golden Takin Holidays operates seamless cross-border Himalayan expeditions combining Bhutan with Nepal and Tibet. Travelers can explore Kathmandu's UNESCO pagoda squares and Pokhara's Annapurna vistas, then take the dramatic mountain flight directly past Mt. Everest into Paro. For Buddhist pilgrims, our 11N/12D circuit links the sacred Potala Palace and Jokhang Temple in Lhasa with Paro Taktsang and Punakha in Bhutan.",
  },
  {
    id: 17,
    title: "17. Health, Altitude Acclimatization & Safety Protocol",
    subtitle: "Hydration, Diamox, Oxygen Availability & Medical Triage",
    category: "Health & Safety",
    content:
      "Most itineraries in Western Bhutan range between 2,200m (Paro/Thimphu) and 3,120m (Dochula/Taktsang). Acclimatization is generally gentle, but staying hydrated (3+ liters of water daily) and minimizing strenuous exertion on Day 1 is recommended. Golden Takin Holidays' vehicles carry portable medical oxygen canisters on all pass crossings. Universal healthcare in Bhutan is free, and the National Referral Hospital (JDWNRH) in Thimphu provides modern emergency trauma and medical care.",
  },
  {
    id: 18,
    title: "18. Telecommunications, SIM Cards & Connectivity",
    subtitle: "B-Mobile (Bhutan Telecom) & TashiCell 4G/5G Networks",
    category: "Travel Logistics",
    content:
      "Bhutan boasts comprehensive 4G mobile data coverage across all major valleys and highways. Tourist SIM cards are readily available upon arrival at Paro International Airport or the Phuentsholing border office from either B-Mobile or TashiCell. Presentation of your tourist permit and passport is required for instant SIM activation. Tourist data packages are affordable (approx. Nu. 500–1,000 for 10–25 GB). High-speed Wi-Fi is standard in all 3-Star to 5-Star hotels.",
  },
  {
    id: 19,
    title: "19. Shopping, Souvenirs & Export Regulations",
    subtitle: "Certified Handicrafts, Red Rice, Cordyceps & Antique Bans",
    category: "Shopping",
    content:
      "Authentic souvenirs to bring home: handwoven Bumthang Yathra wool blankets, Lhuentse raw silk scarves, mineral-pigment thangkas, turned wooden Dappa bowls, Lunana wild Cordyceps sinensis, and organic mountain honey (available at www.takinmart.bt). Critical Export Law: Exporting genuine antiques or religious artifacts older than 100 years is strictly illegal under the Cultural Heritage Act of Bhutan. Always request a seal of authenticity from the Department of Culture when purchasing high-value sacred artwork.",
  },
  {
    id: 20,
    title: "20. Overland Gateways & Flight Logistics",
    subtitle: "Paro Airport (PBH), Phuentsholing, Gelephu & Samdrup Jongkhar",
    category: "Entry Logistics",
    content:
      "Entering Bhutan: 1) Air: Drukair (Royal Bhutan Airlines) and Bhutan Airlines operate scheduled flights into Paro International Airport (PBH) from Delhi, Kolkata, Bangkok, Kathmandu, Singapore, Dhaka, and Guwahati; 2) Overland Border Gateways: Phuentsholing (via Hasimara/Alipurduar/NJP in West Bengal), Gelephu (Central South), and Samdrup Jongkhar (Eastern gateway via Guwahati). Golden Takin Holidays manages seamless VIP airport receptions and border-gate immigration escorts.",
  },
];

function GuidebookPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Geography", "History", "Philosophy & Governance", "Heritage & Architecture", "Culture & Festivals", "Trekking & Pilgrimage", "Financial Guide", "Culinary", "Travel Logistics"];

  const filtered = chapters.filter((c) => {
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      c.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <article className="min-h-screen bg-background py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gold hover:underline mb-8">
          <BookOpen className="w-4 h-4" /> Return to Home
        </Link>

        {/* Hero Section */}
        <div className="mb-12 pb-8 border-b border-border">
          <div className="text-xs uppercase tracking-[0.28em] text-cypress font-semibold mb-2">Golden Takin Holidays · Official Reference</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground">Bhutan Traveler Guidebook (2026–27)</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed max-w-3xl">
            Synthesized directly from the 20-chapter comprehensive destination master documents (Docs 24, 25 & 26). Your authoritative encyclopedia covering history, Gross National Happiness, major Dzongs, Tiger's Nest hiking protocols, UPI payments, and cultural etiquette.
          </p>

          {/* Search & Filter Bar */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chapters, Dzongs, festivals, GNH, Tiger's Nest, UPI..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs transition ${
                  selectedCategory === cat
                    ? "bg-gold text-slate-950 font-bold shadow"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Chapter Count */}
        <div className="mb-6 text-xs text-muted-foreground font-mono">
          Showing {filtered.length} of {chapters.length} chapters
        </div>

        {/* Chapter Feed */}
        <div className="space-y-6">
          {filtered.map((chap) => (
            <div key={chap.id} className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card hover:border-gold/50 transition">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-cypress/15 text-cypress font-semibold">
                  {chap.category}
                </span>
                <span className="text-xs text-muted-foreground font-mono">Chapter {chap.id} of 20</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">{chap.title}</h2>
              <div className="text-xs font-semibold text-gold mt-1 mb-4">{chap.subtitle}</div>
              <p className="text-sm leading-relaxed text-muted-foreground">{chap.content}</p>
            </div>
          ))}
        </div>

        {/* CTA Box */}
        <div className="mt-16 rounded-2xl border border-gold/40 bg-gold/5 p-8 text-center">
          <h3 className="font-display text-2xl font-bold text-foreground">Ready to Experience Bhutan in Person?</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
            Browse our 28 authentic tour packages curated directly from our official itineraries or consult with our licensed Bhutan travel specialists.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link to="/tours" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-slate-950 font-bold text-sm shadow hover:bg-gold/90 transition">
              Explore 28 Packages <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/plan" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground font-medium text-sm hover:border-gold transition">
              Custom Trip Planner
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
