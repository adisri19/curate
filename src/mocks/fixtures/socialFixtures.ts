import { RawSocialPost } from "@/services/normalizers/socialNormalizer";

const authors = [
  { name: "Sarah Chen", handle: "@sarahc_dev", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80" },
  { name: "Marcus Brody", handle: "@marcus_fin", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80" },
  { name: "Elena Rostova", handle: "@elena_ai", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80" },
  { name: "David Kim", handle: "@dkim_sports", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80" },
  { name: "Amina Al-Mansoor", handle: "@amina_health", avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=80" },
  { name: "Lucas Vance", handle: "@lucas_sci", avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&q=80" },
  { name: "Maya Patel", handle: "@maya_ux", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80" },
  { name: "Julian Thorne", handle: "@jthorne_cinema", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&q=80" },
  { name: "Kavita Reddy", handle: "@kavita_builds", avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&q=80" },
  { name: "Tariq Edwards", handle: "@tariq_markets", avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&q=80" },
];

const postTemplates: Array<{
  text: string;
  hashtags: string[];
  imageUrl?: string;
  authorIndex: number;
}> = [
  // 1-10: Tech & AI
  {
    text: "Just benchmarked the new compiler pipeline in Next.js 16. Server component payload serialization is almost 40% faster. Unreal gains for high-traffic dashboards!\n\nCheck out the flame graph in the thread.",
    hashtags: ["technology", "webdev", "nextjs"],
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    authorIndex: 0,
  },
  {
    text: "Autonomous agents are shifting from prompt engineering to harness engineering. It's all about verifiable tool execution, environment sandboxes, and structured validation loops.",
    hashtags: ["technology", "ai", "engineering"],
    authorIndex: 2,
  },
  {
    text: "Building frontend apps that degrade gracefully when APIs are offline or rate-limited should be standard practice, not an afterthought. Always design the empty & cached states first.",
    hashtags: ["webdev", "frontend", "architecture"],
    authorIndex: 6,
  },
  {
    text: "Small language models running locally with WebGPU via ONNX runtime are achieving 85 tokens/sec in Chrome. The privacy and latency implications are massive.",
    hashtags: ["technology", "ai", "webgpu"],
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    authorIndex: 2,
  },
  {
    text: "Redux Toolkit + RTK Query remains one of the cleanest patterns for complex apps that need offline persistence, normalized caching, and optimistic UI updates in one place.",
    hashtags: ["technology", "webdev", "react"],
    authorIndex: 0,
  },
  {
    text: "The CSS `:has()` selector paired with container queries has completely eliminated 80% of the resize listener hooks I used to write. Modern CSS is genuinely a joy.",
    hashtags: ["webdev", "css", "technology"],
    authorIndex: 6,
  },
  {
    text: "If your database queries are taking >50ms, check your composite indexes before you reach for Redis caching. 9 times out of 10, index alignment solves it.",
    hashtags: ["technology", "database", "backend"],
    authorIndex: 8,
  },
  {
    text: "Accessible keyboard navigation isn't a checkbox for audits — it makes your product exponentially faster and more intuitive for power users as well.",
    hashtags: ["webdev", "accessibility", "ux"],
    authorIndex: 6,
  },
  {
    text: "Exploring hybrid vector + lexical search ranking algorithms for our knowledge base. Reciprocal Rank Fusion (RRF) gives consistently better recall than pure cosine similarity.",
    hashtags: ["technology", "ai", "search"],
    authorIndex: 2,
  },
  {
    text: "Shipped our first zero-runtime CSS migration in production today. Bundle size dropped by 64KB gzipped and First Contentful Paint improved by 210ms.",
    hashtags: ["technology", "webdev", "performance"],
    authorIndex: 8,
  },

  // 11-20: Finance & Markets
  {
    text: "Treasury yields are reacting sharply to today's labor and productivity prints. Investors are pricing in sustained productivity dividends from enterprise automation.",
    hashtags: ["finance", "markets", "economy"],
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    authorIndex: 1,
  },
  {
    text: "Venture debt is seeing a major resurgence as founders seek non-dilutive runway extension ahead of late-stage growth rounds. Terms are significantly tighter than 2021.",
    hashtags: ["finance", "startups", "venturecapital"],
    authorIndex: 9,
  },
  {
    text: "Interesting dynamic in renewable microgrids: localized energy storage yields are outperforming traditional utility dividends across Southern Europe.",
    hashtags: ["finance", "energy", "sustainability"],
    authorIndex: 1,
  },
  {
    text: "Personal finance rule that never fails: automate 20% of net income into index funds on payday, ignore short-term market noise, and let compound interest do the heavy lifting.",
    hashtags: ["finance", "investing"],
    authorIndex: 9,
  },
  {
    text: "Fintech infrastructure companies are increasingly becoming bank-chartered to capture interest on operating balances directly rather than relying purely on interchange fees.",
    hashtags: ["finance", "business", "fintech"],
    authorIndex: 1,
  },
  {
    text: "Real estate private equity is heavily reallocating into cold-storage logistics facilities near metropolitan hubs to support immediate grocery delivery infrastructure.",
    hashtags: ["finance", "realestate", "business"],
    authorIndex: 9,
  },
  {
    text: "The convergence of programmable liquidity with cross-border wholesale settlement is cutting settlement cycles from T+2 to T+0 across several bilateral corridors.",
    hashtags: ["finance", "banking", "technology"],
    authorIndex: 1,
  },
  {
    text: "Seed stage rounds in climate hardware have bucked the overall tech funding slump. Investors recognize that physical decarbonization infrastructure is non-negotiable.",
    hashtags: ["finance", "startups", "climate"],
    imageUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80",
    authorIndex: 9,
  },
  {
    text: "A reminder that bull markets make people feel like geniuses; bear markets make people build resilient balance sheets.",
    hashtags: ["finance", "markets"],
    authorIndex: 1,
  },
  {
    text: "Decentralized physical infrastructure networks (DePIN) are demonstrating real operational revenue in decentralized cellular data and compute verification.",
    hashtags: ["finance", "crypto", "technology"],
    authorIndex: 9,
  },

  // 21-30: Sports & Fitness
  {
    text: "What an intense 90 minutes of high-press football tonight! The tactical adjustment to invert fullbacks into the central midfield completely unlocked the opposing defense.",
    hashtags: ["sports", "football", "tactics"],
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80",
    authorIndex: 3,
  },
  {
    text: "Recovery science has evolved so much. Zone 2 aerobic base work combined with adequate sleep and cold contrast baths will do more for longevity than any supplement stack.",
    hashtags: ["sports", "fitness", "health"],
    authorIndex: 4,
  },
  {
    text: "That fourth-quarter sequence with back-to-back transition steals and corner threes was pure poetry. Championship momentum is won on defense first.",
    hashtags: ["sports", "basketball", "nba"],
    authorIndex: 3,
  },
  {
    text: "Training for my third ultra-marathon: nutrition timing during the 30km training blocks is where races are truly won or lost. Practice your gut tolerance early.",
    hashtags: ["sports", "running", "fitness"],
    authorIndex: 3,
  },
  {
    text: "High-intensity interval training (HIIT) 2x a week + resistance training 3x a week is the gold standard for preserving lean muscle mass while improving VO2 max.",
    hashtags: ["sports", "health", "fitness"],
    authorIndex: 4,
  },
  {
    text: "The data analytics revolution in tennis: serve trajectory tracking and return depth analysis have fundamentally altered how baseline players construct points.",
    hashtags: ["sports", "tennis", "analytics"],
    authorIndex: 3,
  },
  {
    text: "Consistency beats intensity every single day. A 45-minute structured workout you repeat 4 times a week will always outperform an unsustainable 2-hour workout you burn out on.",
    hashtags: ["fitness", "discipline", "sports"],
    authorIndex: 4,
  },
  {
    text: "Formula 1 aerodynamic updates heading into the European leg are going to shake up the midfield battle. Floor edge vortex control is separating tenths of a second.",
    hashtags: ["sports", "f1", "motorsport"],
    authorIndex: 3,
  },
  {
    text: "Olympic weightlifting is 90% mobility and bar path precision. If your catch position is unstable, adding weight to the bar only reinforces biomechanical errors.",
    hashtags: ["fitness", "sports", "weightlifting"],
    authorIndex: 4,
  },
  {
    text: "Incredible sportsmanship on display at the track and field nationals today. Athletes helping a fallen competitor across the line before celebrating their own qualification.",
    hashtags: ["sports", "athletics", "inspiration"],
    authorIndex: 3,
  },

  // 31-40: Science & Space
  {
    text: "The latest high-resolution imagery from the orbital solar observatory captures coronal mass ejections in unprecedented ultraviolet clarity. Solar physics is entering a golden age.",
    hashtags: ["science", "astronomy", "space"],
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    authorIndex: 5,
  },
  {
    text: "Solid-state electrolyte battery chemistry achieved 800 cycles at 95% retention in laboratory tests. The commercialization pathway looks clearer than ever.",
    hashtags: ["science", "technology", "energy"],
    authorIndex: 5,
  },
  {
    text: "Fascinating paper in Nature on neuroplasticity in adulthood: targeted auditory stimuli during slow-wave sleep significantly enhance motor memory consolidation.",
    hashtags: ["science", "neuroscience", "health"],
    authorIndex: 4,
  },
  {
    text: "Deep-sea submersibles exploring the Mariana Trench discovered five previously unrecorded bioluminescent organisms. We know less about our own oceans than the lunar surface.",
    hashtags: ["science", "oceanography", "biology"],
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    authorIndex: 5,
  },
  {
    text: "Synthetic biology approaches to carbon capture using engineered cyanobacteria show 12x higher photosynthetic efficiency compared to natural terrestrial plants.",
    hashtags: ["science", "climate", "biology"],
    authorIndex: 5,
  },
  {
    text: "Gravitational wave detectors caught an unexpected neutron star collision accompanied by an intense gamma-ray burst. Multi-messenger astronomy continues to deliver.",
    hashtags: ["science", "astrophysics", "space"],
    authorIndex: 5,
  },
  {
    text: "Cryo-electron microscopy resolution has pushed past the 1-angstrom threshold. Watching macromolecular protein complexes fold in real time is no longer science fiction.",
    hashtags: ["science", "biotech", "chemistry"],
    authorIndex: 4,
  },
  {
    text: "Antarctic ice core data provides an unbroken atmospheric gas archive stretching back 1.5 million years. The precision of mass spectrometry today is staggering.",
    hashtags: ["science", "climate", "earth"],
    authorIndex: 5,
  },
  {
    text: "Quantum entanglement experiments across a 1,200 km satellite link verify Bell inequality violations with zero detection loopholes. The foundations of physics stand firm.",
    hashtags: ["science", "physics", "quantum"],
    authorIndex: 5,
  },
  {
    text: "Re-wilding keystone apex predators in temperate ecosystems triggers rapid trophic cascades that restore riverbanks and native flora in under a decade.",
    hashtags: ["science", "ecology", "nature"],
    authorIndex: 5,
  },

  // 41-50: Entertainment & Cinema
  {
    text: "Rewatched Villeneuve's Dune Part 2 in IMAX 70mm. The sound design alone — using organic insect vibrations and throat singing — deserves every award in cinematic history.",
    hashtags: ["entertainment", "cinema", "movies"],
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    authorIndex: 7,
  },
  {
    text: "Practical effects combined with minimal CGI enhancement will always look more tactile and timeless than full green-screen rendering. The lighting interacts naturally with actors' eyes.",
    hashtags: ["entertainment", "filmmaking", "cinema"],
    authorIndex: 7,
  },
  {
    text: "Original screenplay writing is having a renaissance at indie film festivals. Audiences are hungry for unexpected narrative structures that don't follow formulaic franchise beats.",
    hashtags: ["entertainment", "writing", "cinema"],
    authorIndex: 7,
  },
  {
    text: "The orchestral score for historical biopics requires so much nuance. When the strings hold a sustained dissonance under dialogue, you feel the tension in your chest.",
    hashtags: ["entertainment", "music", "movies"],
    authorIndex: 7,
  },
  {
    text: "Cinematography masterclass: notice how natural ambient light changes from warm golden hours to cool dusk tones to reflect the protagonist's descent into moral ambiguity.",
    hashtags: ["entertainment", "cinema", "photography"],
    authorIndex: 7,
  },
  {
    text: "Interactive narrative fiction and episodic game direction are converging. Some of the best dramatic writing in modern media is happening in narrative video games.",
    hashtags: ["entertainment", "gaming", "storytelling"],
    authorIndex: 7,
  },
  {
    text: "Streaming platforms need to stop burying foreign language masterpieces behind three sub-menus. Global cinema deserves equal hero placement on the front page.",
    hashtags: ["entertainment", "movies", "streaming"],
    authorIndex: 7,
  },
  {
    text: "The transition from film negative scans to 4K HDR restoration has rescued so many classic 1970s neo-noirs. The grain texture is pure art.",
    hashtags: ["entertainment", "cinema", "restoration"],
    authorIndex: 7,
  },
  {
    text: "Film recommendation of the week: seek out Korean psychological thrillers from the early 2000s if you want airtight plotting and visceral character motivations.",
    hashtags: ["entertainment", "movies", "recommendation"],
    authorIndex: 7,
  },
  {
    text: "Nothing beats the communal atmosphere of a packed midnight premiere in an independent art-house theater. Long live the theatrical experience.",
    hashtags: ["entertainment", "cinema"],
    authorIndex: 7,
  },

  // 51-65: Health, Business & Modern Work
  {
    text: "Circadian biology principle: get 10-15 minutes of direct morning sunlight into your eyes before checking emails. It sets your cortisol pulse and guarantees better melatonin release at night.",
    hashtags: ["health", "wellness", "sleep"],
    authorIndex: 4,
  },
  {
    text: "Hydration with balanced electrolytes matters more than simply chugging plain water. Sodium, potassium, and magnesium keep cellular pumps operating efficiently under cognitive load.",
    hashtags: ["health", "nutrition", "wellness"],
    authorIndex: 4,
  },
  {
    text: "The biggest productivity unlock for remote leadership is written clarity. If you can't articulate a product spec in 3 bullet points, you haven't thought through the problem yet.",
    hashtags: ["business", "leadership", "productivity"],
    authorIndex: 8,
  },
  {
    text: "Culture isn't free snacks or ping pong tables; culture is how decisions are made when the CEO isn't in the room and what behaviors get rewarded under pressure.",
    hashtags: ["business", "startups", "culture"],
    authorIndex: 8,
  },
  {
    text: "Micro-breaks during intense coding or analysis sessions: 20 seconds looking at an object 20 feet away every 20 minutes (20-20-20 rule) saves your eyesight and reduces headache frequency.",
    hashtags: ["health", "work", "wellness"],
    authorIndex: 4,
  },
  {
    text: "Customer discovery interviews should focus entirely on past behavior, not hypothetical future promises. 'When was the last time you paid to solve this?' is the only question that matters.",
    hashtags: ["business", "startups", "product"],
    authorIndex: 8,
  },
  {
    text: "Preventing burnout starts with boundary hygiene. Turn off work notifications after 7 PM. Creative problem-solving requires periods of absolute mental downtime.",
    hashtags: ["health", "worklife", "mentalhealth"],
    authorIndex: 4,
  },
  {
    text: "Early-stage founders: do things that don't scale until you deeply understand the friction points. Automating a broken onboarding flow only scales confusion.",
    hashtags: ["business", "startups", "entrepreneurship"],
    authorIndex: 8,
  },
  {
    text: "Strength training in older adults is the single most predictive metric for independence and fall prevention. Progressive overload preserves bone density.",
    hashtags: ["health", "fitness", "longevity"],
    authorIndex: 4,
  },
  {
    text: "Great products feel like magic because someone obsessed over the 100 micro-interactions that most teams cut from sprint scope.",
    hashtags: ["business", "design", "ux"],
    authorIndex: 6,
  },
  {
    text: "Cold plunge enthusiasts: the real benefit isn't fat loss, it's the 2.5x dopamine baseline elevation that persists for hours after deliberate cold exposure.",
    hashtags: ["health", "wellness", "recovery"],
    authorIndex: 4,
  },
  {
    text: "Good code is readable before it is clever. If the junior engineer joining next month can't understand your abstractions in 10 minutes, you built the wrong thing.",
    hashtags: ["technology", "programming", "software"],
    authorIndex: 0,
  },
  {
    text: "Sustainable businesses focus on retention before acquisition. Leaky buckets can't be filled by aggressive paid advertising.",
    hashtags: ["business", "startups", "growth"],
    authorIndex: 8,
  },
  {
    text: "Mindful breathing for 3 minutes activates the parasympathetic nervous system and downregulates acute stress responses during high-stakes presentations.",
    hashtags: ["health", "mindfulness", "wellness"],
    authorIndex: 4,
  },
  {
    text: "Curated content feeds that give users full control over their categories and reordering are the antidote to algorithmic rage-baiting. Empower the reader.",
    hashtags: ["technology", "design", "ux", "webdev"],
    authorIndex: 6,
  },
];

// Generate deterministic seeded dataset of 65 posts
export const mockSocialPosts: RawSocialPost[] = postTemplates.map((template, index) => {
  const author = authors[template.authorIndex % authors.length];
  // Deterministic timestamp: staggered backwards from 2026-03-01
  const hoursAgo = index * 3.5;
  const baseDate = new Date("2026-03-01T12:00:00Z");
  const postDate = new Date(baseDate.getTime() - hoursAgo * 3600 * 1000).toISOString();

  const likes = 24 + ((index * 37) % 450);
  const retweets = 5 + ((index * 13) % 120);

  return {
    id: `post_${index + 1}`,
    text: template.text,
    author: {
      name: author.name,
      handle: author.handle,
      avatarUrl: author.avatarUrl,
    },
    hashtags: template.hashtags,
    imageUrl: template.imageUrl,
    createdAt: postDate,
    likes,
    retweets,
  };
});
