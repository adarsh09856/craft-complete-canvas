import tigersNest from "@/assets/tigers-nest.jpg";
import culture from "@/assets/culture.jpg";
import trekking from "@/assets/trekking.jpg";
import punakha from "@/assets/punakha.jpg";
import thimphu from "@/assets/thimphu.jpg";
import bumthang from "@/assets/bumthang.jpg";
import festival from "@/assets/festival.jpg";
import type { Tour } from "@/components/TourCard";

export const tours: Tour[] = [
  { slug: "tigers-nest-pilgrimage", title: "Tiger's Nest Pilgrimage", category: "Buddhist Pilgrimage", duration: "7 Days", location: "Paro", price: 2890, image: tigersNest, desc: "Climb to the sacred Taktsang monastery clinging to a cliff 900m above the Paro valley.", rating: 4.9, difficulty: "Moderate", bestTime: "Mar–May · Sep–Nov" },
  { slug: "cultural-immersion", title: "Cultural Immersion", category: "Culture Exchange", duration: "9 Days", location: "Thimphu · Paro", price: 3450, image: culture, desc: "Live with local families, learn weaving and archery, and join monks for morning prayers.", rating: 4.8, difficulty: "Easy", bestTime: "Year-round" },
  { slug: "druk-path-trek", title: "Druk Path Trek", category: "Trekking", duration: "11 Days", location: "Paro to Thimphu", price: 4290, image: trekking, desc: "A high-altitude trek across alpine lakes, prayer-flag passes and ancient dzongs.", rating: 4.9, difficulty: "Hard", bestTime: "Apr–Jun · Sep–Oct" },
  { slug: "punakha-cherry-blossom", title: "Punakha Cherry Blossoms", category: "Nature & Adventure", duration: "6 Days", location: "Punakha Valley", price: 2490, image: punakha, desc: "Witness the jacaranda bloom around the most magnificent dzong in the Himalayas.", rating: 4.7, difficulty: "Easy", bestTime: "Mar–Apr" },
  { slug: "thimphu-weekend", title: "Thimphu Weekend Escape", category: "Family & Leisure", duration: "4 Days", location: "Thimphu", price: 1490, image: thimphu, desc: "A short, soulful weekend in the only capital without traffic lights.", rating: 4.8, difficulty: "Easy", bestTime: "Year-round" },
  { slug: "bumthang-spiritual", title: "Bumthang Spiritual Valley", category: "Buddhist Pilgrimage", duration: "8 Days", location: "Bumthang", price: 3190, image: bumthang, desc: "Visit the spiritual heartland of Bhutan with its oldest temples and rolling green valleys.", rating: 4.9, difficulty: "Moderate", bestTime: "Apr–Jun · Oct" },
  { slug: "tsechu-festival", title: "Tsechu Festival Tour", category: "Culture Exchange", duration: "10 Days", location: "Paro · Thimphu", price: 3890, image: festival, desc: "Experience the masked Cham dances during Bhutan's most sacred annual festival.", rating: 5.0, difficulty: "Easy", bestTime: "Festival dates" },
];

export const categories = ["All Tours", "Culture Exchange", "Buddhist Pilgrimage", "Corporate & MICE", "School & College", "Nature & Adventure", "Trekking", "Family & Leisure", "Weddings"];

export const destinations = [
  { name: "Paro", desc: "Sacred valley & airport gateway", image: tigersNest, slug: "paro" },
  { name: "Thimphu", desc: "Capital of a kingdom in the clouds", image: thimphu, slug: "thimphu" },
  { name: "Punakha", desc: "Former winter capital & dzong", image: punakha, slug: "punakha" },
  { name: "Bumthang", desc: "Spiritual heartland", image: bumthang, slug: "bumthang" },
];

export const experiences = [
  { title: "Monastic Mornings", desc: "Join monks at dawn for chants in a 7th-century lhakhang.", image: culture },
  { title: "Cham Dance Festivals", desc: "Masked dances that have been performed for 400 years.", image: festival },
  { title: "Himalayan Treks", desc: "From the gentle Druk Path to the legendary Snowman Trek.", image: trekking },
  { title: "Hot Stone Baths", desc: "Soothe trail-weary muscles in mineral-rich riverside baths.", image: bumthang },
];
