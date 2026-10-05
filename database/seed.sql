-- ====================================================================
-- SEED DATA FOR GOLDEN TAKIN HOLIDAYS (TRAVEL PLATFORM)
-- Ingested directly from 26 PDF Master Documents & Client Specifications
-- ====================================================================

-- 1. DESTINATIONS (Bhutan, Nepal, Tibet, India NE)
INSERT INTO destinations (slug, name, country, region, elevation_m, tagline, description, highlights, best_seasons, travel_tips, image_url)
VALUES
('thimphu', 'Thimphu', 'Bhutan', 'Western Bhutan', 2334, 'The Capital of Gross National Happiness', 
 'The vibrant capital of the Kingdom of Bhutan blending traditional Himalayan architecture with progressive modernity.',
 '["Tashichho Dzong", "Buddha Dordenma (169ft)", "National Memorial Chorten", "Motithang Takin Preserve", "Simply Bhutan Living Museum"]'::jsonb,
 '["March to May", "September to November"]'::jsonb,
 '["Full sleeves and collared shirts required in Tashichho Dzong", "Ngultrum pegged 1:1 with INR", "UPI/RuPay accepted in major shops"]'::jsonb,
 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80'),

('paro', 'Paro Valley', 'Bhutan', 'Western Bhutan', 2200, 'Home to the Sacred Tiger''s Nest',
 'A breathtaking valley housing Bhutan''s sole international airport and the legendary cliffside Paro Taktsang.',
 '["Paro Taktsang (Tiger''s Nest)", "Rinpung Dzong", "National Museum (Ta Dzong)", "Kyichu Lhakhang (7th Century)", "Dumtse Lhakhang"]'::jsonb,
 '["March to May", "September to November"]'::jsonb,
 '["Start Tiger''s Nest hike before 7:30 AM to beat midday heat", "Walking poles and sturdy hiking shoes recommended"]'::jsonb,
 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'),

('punakha', 'Punakha Valley', 'Bhutan', 'Central Bhutan', 1242, 'The Ancient Winter Capital & Palace of Happiness',
 'A lush subtropical valley nestled at the confluence of the Pho Chhu and Mo Chhu rivers.',
 '["Punakha Dzong (Pungtang Dechen Photrang)", "160m Suspension Bridge", "Chimi Lhakhang (Fertility Temple)", "Khamsum Yulley Namgyal Chorten"]'::jsonb,
 '["October to April"]'::jsonb,
 '["Warmer climate than Thimphu; ideal winter destination", "Excellent gentle white-water river rafting"]'::jsonb,
 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'),

('kathmandu', 'Kathmandu Valley', 'Nepal', 'Bagmati Province', 1400, 'The Valley of Seven UNESCO World Heritage Sites',
 'The mystical cultural capital of Nepal, famed for living heritage, medieval palace squares, and sacred stupas.',
 '["Boudhanath Stupa", "Pashupatinath Temple", "Bhaktapur Durbar Square", "Swayambhunath Monkey Temple", "Patan Durbar Square"]'::jsonb,
 '["September to November", "March to May"]'::jsonb,
 '["Airport visas on arrival available for most nationalities", "Direct Drukair/Bhutan Airlines flights connect Kathmandu with Paro (1 hour flight past Mt. Everest)"]'::jsonb,
 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'),

('pokhara', 'Pokhara & Annapurna Foothills', 'Nepal', 'Gandaki Province', 822, 'The Gateway to the Himalayas',
 'Picturesque lakeside city nestled under the dramatic shadows of Mt. Machapuchare (Fishtail) and the Annapurna Range.',
 '["Phewa Lake Boating", "Sarangkot Sunrise Viewpoint", "World Peace Pagoda", "Davis Falls & Gupteshwor Cave", "Annapurna Panoramic Vistas"]'::jsonb,
 '["October to December", "February to April"]'::jsonb,
 '["Ideal complement to Bhutan cultural circuits; excellent short hiking trails and wellness resorts"]'::jsonb,
 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'),

('lhasa', 'Lhasa & Mt. Kailash', 'Tibet', 'Tibet Autonomous Region', 3656, 'The Sacred Spiritual Roof of the World',
 'The ancient spiritual heart of Tibetan Buddhism, crowned by the majestic Potala Palace and Barkhor pilgrim circuit.',
 '["Potala Palace (Winter Residence of Dalai Lamas)", "Jokhang Temple (House of Jowo Rinpoche)", "Barkhor Street Kora", "Sera Monastery Monks Debate", "Drepung Monastery", "Mt. Kailash Sacred Kora"]'::jsonb,
 '["May to October"]'::jsonb,
 '["Tibet Travel Permit (TTP) required in advance", "Acclimatize for first 48 hours without strenuous exertion", "Stay hydrated at 3,650m altitude"]'::jsonb,
 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80')
ON CONFLICT (slug) DO NOTHING;

-- 2. INGESTED TOUR PACKAGES (Docs 2-12 + Cross-Border Circuits)
INSERT INTO tour_packages (
  slug, title, category, countries, duration_nights, duration_days, route, accommodation_tier, meal_plan, transport_type,
  price_usd, price_inr, price_aud, price_eur, price_gbp, sdf_included, daily_sdf_inr, daily_sdf_usd,
  highlights, inclusions, exclusions, featured
) VALUES
-- 2.1 Higher Education Academic Excursions (Docs 2, 3, 4)
('bhutan-college-excursion-4n5d', 'Bhutan Higher Education Academic Field Study (4N/5D)', 'college_academic', ARRAY['Bhutan'], 4, 5,
 'Hasimara/Phuentsholing -> Thimphu -> Paro -> Phuentsholing', '2-Star DoT-Certified Hotel', 'AP (Breakfast, Lunch, Dinner)',
 'Dedicated Bhutan Tourist Coaster Bus', 420.00, 24500.00, 640.00, 390.00, 335.00, false, 1200.00, 100.00,
 '["Folk Heritage Museum Anthropological Survey", "Motithang Takin Preserve Ecology", "Buddha Dordenma Geo-Spatial Observation", "Paro Rinpung Dzong Architecture", "1 Faculty FOC per 15 Students"]'::jsonb,
 '["2-Star twin/triple sharing accommodation", "All meals (AP plan)", "Dedicated Coaster bus with driver & fuel", "Licensed English-speaking academic guide", "Permit generation & monument entry fees"]'::jsonb,
 '["Government SDF fee (payable separately)", "Personal expenses & tips", "Travel insurance", "Train/air tickets to Hasimara/Bagdogra"]'::jsonb, true),

('bhutan-college-excursion-5n6d', 'Bhutan Higher Education Academic Field Study (5N/6D)', 'college_academic', ARRAY['Bhutan'], 5, 6,
 'Hasimara/Phuentsholing -> Thimphu -> Dochula -> Punakha -> Paro -> Phuentsholing', '2-Star DoT-Certified Hotel', 'AP (Breakfast, Lunch, Dinner)',
 'Dedicated Bhutan Tourist Coaster Bus', 510.00, 29800.00, 780.00, 475.00, 405.00, false, 1200.00, 100.00,
 '["Dochula Pass 108 Chortens Montane Forest Transect", "Punakha Dzong Himalayan River Confluence Study", "Chimi Lhakhang Cultural Ethnography", "Paro Valley Geological Assessment"]'::jsonb,
 '["2-Star accommodation", "AP meals", "Coaster transport", "Academic guide", "Internal route permits"]'::jsonb,
 '["SDF fees", "Laundry/personal items", "Train tickets"]'::jsonb, false),

('bhutan-college-excursion-6n7d', 'Bhutan Comprehensive Academic Field Study (6N/7D)', 'college_academic', ARRAY['Bhutan'], 6, 7,
 'Phuentsholing -> Thimphu -> Dochula -> Punakha -> Paro -> Tiger''s Nest -> Phuentsholing', '2-Star DoT-Certified Hotel', 'AP (Breakfast, Lunch, Dinner)',
 'Dedicated Bhutan Tourist Coaster Bus', 595.00, 34900.00, 910.00, 550.00, 470.00, false, 1200.00, 100.00,
 '["Full Tiger''s Nest (Paro Taktsang) High-Altitude Ecosystem Hike", "National Institute for Zorig Chusum (13 Traditional Arts)", "Agro-forestry field analysis in Punakha Valley"]'::jsonb,
 '["2-Star accommodation", "All meals", "Coaster transport", "Permits & entries", "Fieldwork certificates"]'::jsonb,
 '["SDF fees", "Insurance", "Beverages"]'::jsonb, false),

-- 2.2 Corporate MICE & Dealer Incentives (Docs 5, 6, 7)
('bhutan-corporate-retreat-4n5d', 'Bhutan Executive Corporate & Dealer Retreat (4N/5D)', 'corporate_mice', ARRAY['Bhutan'], 4, 5,
 'Phuentsholing -> Thimphu -> Paro -> Phuentsholing', '3-Star Premium Hotels & Resorts', 'Deluxe Buffet & Gala Dinner',
 'Luxury Tourist Coach / Executive SUVs', 650.00, 42000.00, 995.00, 605.00, 515.00, false, 1200.00, 100.00,
 '["Half-day conference hall with AV equipment", "Khaddar scarf welcome ceremony", "Gala banquet dinner with traditional dance troupe", "Archery (Dha) team competition"]'::jsonb,
 '["3-Star Premium resort rooms", "All meals including gala dinner", "Conference facilities", "AC Coaster / Innova fleet", "English-speaking executive guide"]'::jsonb,
 '["SDF fees", "Alcoholic beverages", "Airfares"]'::jsonb, true),

('bhutan-corporate-retreat-5n6d', 'Bhutan Executive Corporate & Dealer Retreat with Rafting (5N/6D)', 'corporate_mice', ARRAY['Bhutan'], 5, 6,
 'Phuentsholing -> Thimphu -> Dochula -> Punakha -> Paro -> Phuentsholing', '3-Star Premium Hotels & Resorts', 'Deluxe Buffet & Gala Dinner',
 'Luxury Tourist Coach / Executive SUVs', 780.00, 49500.00, 1190.00, 725.00, 620.00, false, 1200.00, 100.00,
 '["Punakha Pho Chhu gentle river rafting team challenge", "Dochula Himalayan panorama sunrise", "Traditional herbal hot stone bath vouchers", "Corporate award presentation gala"]'::jsonb,
 '["3-Star Premium hotels", "All meals", "River rafting gears & safety escorts", "Conference setup", "Gala banquet with cultural troupe"]'::jsonb,
 '["SDF fees", "Personal spa upgrades", "Flights"]'::jsonb, false),

('bhutan-corporate-retreat-6n7d', 'Bhutan Grand Corporate & Leadership MICE Odyssey (6N/7D)', 'corporate_mice', ARRAY['Bhutan'], 6, 7,
 'Phuentsholing -> Thimphu -> Dochula -> Punakha -> Paro -> Tiger''s Nest -> Phuentsholing', '3-Star Premium Hotels & Resorts', 'Deluxe Buffet & Gala Dinner',
 'Luxury Tourist Coach / Executive SUVs', 890.00, 56500.00, 1360.00, 830.00, 710.00, false, 1200.00, 100.00,
 '["Full Taktsang Monastery ascent with pony assistance option", "Executive wellness & meditation session at ancient monastery", "Two gala theme nights", "High-level networking banquets"]'::jsonb,
 '["3-Star Premium hotels", "Deluxe catering", "Complete sightseeing & transport", "Guide & entry fees", "Gala dinners"]'::jsonb,
 '["SDF fees", "Flight tickets", "Gratuities"]'::jsonb, false),

-- 2.3 Royal Romantic Honeymoon (Docs 11, 12)
('bhutan-royal-honeymoon-5n6d', 'Royal Bhutan Romantic Honeymoon Escape (5N/6D)', 'romantic_honeymoon', ARRAY['Bhutan'], 5, 6,
 'Phuentsholing/Paro -> Thimphu -> Punakha -> Paro', 'Handpicked 3-Star Valley-View Boutique Resorts', 'Deluxe MAP / AP (Breakfast & Dinner)',
 'Private Dedicated Executive SUV (Innova Crysta / Creta)', 950.00, 58000.00, 1450.00, 885.00, 755.00, false, 1200.00, 100.00,
 '["Private candlelight dinner with valley vista", "Authentic Dotsho (river stone herbal hot bath) for two", "Complimentary Bhutanese Zumzin peach wine & artisanal chocolates", "Traditional Gho & Kira couple photoshoot", "Monastery butter lamp blessing for marriage longevity"]'::jsonb,
 '["Boutique resort stays with romantic room decoration", "Private SUV with personal chauffeur-guide", "Candlelight dinner setup", "Herbal hot stone bath session", "All entry permits"]'::jsonb,
 '["SDF fees", "Personal shopping", "Flight tickets"]'::jsonb, true),

('bhutan-royal-honeymoon-6n7d', 'Royal Bhutan Romantic Honeymoon & Scenic Retreat (6N/7D)', 'romantic_honeymoon', ARRAY['Bhutan'], 6, 7,
 'Phuentsholing/Paro -> Thimphu -> Dochula -> Punakha -> Paro -> Tiger''s Nest', 'Handpicked 3-Star Valley-View Boutique Resorts', 'Deluxe MAP / AP (Breakfast & Dinner)',
 'Private Dedicated Executive SUV (Innova Crysta / Creta)', 1120.00, 69000.00, 1710.00, 1040.00, 890.00, false, 1200.00, 100.00,
 '["Secluded riverside champagne/wine picnic lunch in Punakha", "Dochula Himalayan sunrise couples coffee", "Private Taktsang pilgrimage hike", "Couple Ayurvedic spa session in Paro"]'::jsonb,
 '["Luxury boutique resorts", "Private SUV throughout", "Picnic lunch & candlelight dinner", "Couple herbal stone bath", "Sightseeing & entry passes"]'::jsonb,
 '["SDF fees", "Airfare", "Personal tips"]'::jsonb, false),

-- 2.4 Multi-Country Cross-Border Circuits (Nepal, Tibet, Bhutan)
('nepal-bhutan-cultural-odyssey-9n10d', 'Himalayan Kingdoms: Nepal & Bhutan Cultural Explorer (9N/10D)', 'himalayan_combo', ARRAY['Nepal', 'Bhutan'], 9, 10,
 'Kathmandu (3N) -> Paro (1N) -> Thimphu (2N) -> Punakha (1N) -> Paro (2N)', '4-Star Boutique (Nepal) & 3-Star Premium (Bhutan)', 'Breakfast & Special Dinners',
 'Private SUV & Flight (Kathmandu to Paro scenic flight past Mt. Everest)', 1850.00, 125000.00, 2820.00, 1720.00, 1470.00, false, 1200.00, 100.00,
 '["Kathmandu: Pashupatinath, Boudhanath & Bhaktapur World Heritage", "Scenic mountain flight with Everest aerial view", "Bhutan: Tiger''s Nest, Punakha Dzong, Buddha Dordenma", "Cross-border cultural contrast of Hinduism & Vajrayana Buddhism"]'::jsonb,
 '["Accommodation in Kathmandu & Bhutan", "Daily breakfast & Bhutan all-meals", "Kathmandu-Paro flight ticket", "Private guides in both countries", "All heritage monument permits"]'::jsonb,
 '["Bhutan SDF fee", "Nepal entry visa", "International flights to Kathmandu / from Paro"]'::jsonb, true),

('tibet-bhutan-spiritual-trans-himalaya-11n12d', 'Spiritual Roof of the World: Tibet & Bhutan Overland & Air (11N/12D)', 'himalayan_combo', ARRAY['Tibet', 'Bhutan'], 11, 12,
 'Lhasa (4N) -> Shigatse (1N) -> Kathmandu (2N transit) -> Paro (1N) -> Thimphu (2N) -> Paro (1N)', '4-Star Tibetan Heritage Stays & 3-Star Bhutan Boutique', 'Breakfast & Traditional Local Dinners',
 'Private SUV / Mini-Coach & Mountain Flight', 2650.00, 185000.00, 4050.00, 2460.00, 2110.00, false, 1200.00, 100.00,
 '["Lhasa: Majestic Potala Palace & Jokhang Temple Barkhor pilgrim kora", "Monks philosophical debating at Sera Monastery", "Yamdrok Sacred Turquoise Lake & Karola Glacier", "Bhutan: Paro Taktsang, Tashichho Dzong & Dochula Pass"]'::jsonb,
 '["Tibet Travel Permit (TTP) processing", "Boutique heritage stays in Lhasa & Bhutan", "Expert local Tibetan & Bhutanese Buddhist guides", "Ground transfers & scenic mountain flights", "Monastery admission fees"]'::jsonb,
 '["Bhutan SDF fee", "China/Tibet Visa & Nepal transit visa", "Personal altitude medication (Diamox)"]'::jsonb, true),

('grand-himalayan-trilogy-14n15d', 'The Grand Himalayan Trilogy: Bhutan, Nepal & Tibet (14N/15D)', 'himalayan_combo', ARRAY['Nepal', 'Tibet', 'Bhutan'], 14, 15,
 'Kathmandu (3N) -> Lhasa (4N) -> Kathmandu (1N) -> Thimphu (2N) -> Punakha (1N) -> Paro (3N)', '4-Star Premium & Luxury Boutique Resorts', 'All Breakfasts, Bhutan AP Meals & Cultural Banquets',
 'Private SUV, Luxury Coach & Regional Mountain Flights', 3450.00, 248000.00, 5270.00, 3210.00, 2750.00, false, 1200.00, 100.00,
 '["The ultimate sacred Himalayan trilogy across 3 extraordinary cultures", "Pashupatinath & Boudhanath in Nepal", "Potala Palace & Yamdrok Lake in Tibet", "Tiger''s Nest & Punakha Dzong in Bhutan", "Panoramic Himalayan flights connecting the three realms"]'::jsonb,
 '["All hotel accommodations across 3 countries", "All regional connecting flights (KTM-LXA-KTM-PBH)", "All entry permits, Tibet group permit & Bhutan route permits", "Private English-speaking guides & chauffeurs", "Welcome & farewell traditional dinners"]'::jsonb,
 '["Bhutan SDF fee", "Visas for Nepal & China/Tibet", "International flights to/from your home country"]'::jsonb, true)
ON CONFLICT (slug) DO NOTHING;
