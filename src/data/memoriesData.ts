import { ParkMemorySnapshot } from '../types';

export const INITIAL_PARK_MEMORIES: ParkMemorySnapshot[] = [
  {
    id: 'mem_castle_fireworks',
    title: 'Starlight Wishes Over Cinderella Castle',
    date: 'Sept 20, 2026 • 9:45 PM',
    locationName: 'Central Plaza Hub & Royal Forecourt',
    landId: 'fantasyland',
    landName: 'Fantasyland & Cinderella Castle',
    universe: 'disney',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    caption: 'Gathered on the central promenade as the castle erupted in vibrant purple and gold projections with symphonic fireworks illuminating the starlit sky. The reflection in the royal moat was breathtaking.',
    highlightBadge: '🎆 Nighttime Spectacular',
    photographerType: 'Imagen 3 Pro Snapshot',
    imagenPrompt: 'Photorealistic vacation snapshot of Cinderella Castle illuminated by golden and violet fairy-tale projections, vibrant fireworks exploding overhead in a starlit night sky, reflections shimmering on the royal lagoon water, photorealistic cinematic theme park photo',
    cameraParameters: {
      lens: '35mm f/1.4 Summilux',
      lighting: 'Pyrotechnic Flares & Warm Royal Illumination',
      aspectRatio: '4:3',
      style: 'Cinematic High-Fidelity Snapshot'
    },
    tags: ['Fireworks', 'Nighttime Show', 'Cinderella Castle', 'Fantasyland', 'Family Magic'],
    likesCount: 142,
    userLiked: true,
    featured: true,
    companions: ['Pepper Potts', 'Morgan Stark', 'Happy Hogan'],
  },
  {
    id: 'mem_quinjet_twilight',
    title: 'Avengers Quinjet Rooftop Deployment',
    date: 'Sept 19, 2026 • 7:15 PM',
    locationName: 'Avengers HQ Rooftop Landing Pad',
    landId: 'avengers_campus',
    landName: 'Marvel Avengers Campus',
    universe: 'marvel',
    imageUrl: 'https://images.unsplash.com/photo-1517976487507-5b3b4b45a9b7?auto=format&fit=crop&w=1200&q=80',
    caption: 'Caught the twilight launch drill of the full-scale stealth tactical Quinjet above Stark Compound. Turbine exhaust hummed with blue repulsor energy as Captain Marvel gave the departure signal.',
    highlightBadge: '⚡ Stark Sector Patrol',
    photographerType: 'Avengers Security Cam (F.R.I.D.A.Y. AI)',
    imagenPrompt: 'Cinematic twilight snapshot of the Avengers Campus headquarters building with a sleek stealth Quinjet parked on the lighted landing pad, glowing neon Stark blue and crimson accents, hero patrol silhouette, hyper-detailed action photo',
    cameraParameters: {
      lens: '50mm f/1.8 Tactical Sensor',
      lighting: 'Arc Reactor Blue & Twilight Neon Glow',
      aspectRatio: '4:3',
      style: 'Stark Industries Security Capture'
    },
    tags: ['Avengers Campus', 'Quinjet', 'Stark Tech', 'Marvel Superheroes', 'Twilight'],
    likesCount: 98,
    userLiked: false,
    featured: false,
    companions: ['Peter Parker', 'James Rhodes (War Machine)'],
    ridePhotoStats: {
      attractionName: 'Avengers Flight Training Simulator',
      maxSpeedMph: 720,
      gForce: '4.8G',
      score: 98400
    }
  },
  {
    id: 'mem_space_mountain_warp',
    title: 'Space Mountain Warp Drive Ingress',
    date: 'Sept 18, 2026 • 3:30 PM',
    locationName: 'Sector 3 Omega Warp Chamber',
    landId: 'tomorrowland',
    landName: 'Tomorrowland & Space Port',
    universe: 'disney',
    imageUrl: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=80',
    caption: 'Official on-ride photo captured as our space rocket broke through the cosmic vortex. Screaming with joy into the starfields and neon nebula tunnels!',
    highlightBadge: '🚀 E-Ticket Thrill Photo',
    photographerType: 'Disney PhotoPass AI On-Ride Cam',
    imagenPrompt: 'Dramatic high-speed on-ride photo inside Space Mountain coaster showing neon blue and cyan laser light trails through dark starfields, guests screaming with hands raised in joyous thrill, motion blur and starry nebulas',
    cameraParameters: {
      lens: '24mm High-Speed Infrared Flash',
      lighting: 'Starlight Fiber-Optic & Neon Trails',
      aspectRatio: '4:3',
      style: 'High-Speed Action Coaster Cam'
    },
    tags: ['Space Mountain', 'Tomorrowland', 'Roller Coaster', 'On-Ride Photo', 'Hyperspeed'],
    likesCount: 115,
    userLiked: true,
    featured: false,
    companions: ['Bruce Banner', 'Ned Leeds'],
    ridePhotoStats: {
      attractionName: 'Space Mountain Cosmic Coaster',
      maxSpeedMph: 52,
      gForce: '3.4G',
      score: 87500
    }
  },
  {
    id: 'mem_pirates_galleon_sunset',
    title: 'The Black Pearl Hoisting Colors at Pirate Cove',
    date: 'Sept 17, 2026 • 6:40 PM',
    locationName: 'Isla de la Juventud Lagoon Dock',
    landId: 'adventureland',
    landName: 'Adventureland & Pirates Sailing Bay',
    universe: 'disney',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    caption: 'The authentic wooden sailing galleon moored against lush jungle cliffs at golden hour. Warm lanterns swaying gently in the tropical ocean breeze while sea shanties drifted across the cove.',
    highlightBadge: '🚢 High Seas Sailing',
    photographerType: 'Imagineering Drone 4K',
    imagenPrompt: 'Photorealistic golden hour snapshot of a 17th-century three-masted wooden pirate sailing galleon anchored in a misty tropical Caribbean lagoon, glowing lanterns hung on the rigging, coconut palms and waterfall in background',
    cameraParameters: {
      lens: '85mm f/1.4 Portrait Telephoto',
      lighting: 'Golden Hour Sunset & Lantern Ember',
      aspectRatio: '4:3',
      style: 'Vintage Nautical Adventure'
    },
    tags: ['Pirates of the Caribbean', 'Sailing Galleon', 'Adventureland', 'Sunset', 'High Seas'],
    likesCount: 84,
    userLiked: false,
    featured: false,
    companions: ['Captain Jack Sparrow', 'Will Turner'],
  },
  {
    id: 'mem_spiderman_encounter',
    title: 'Spider-Man Rooftop Acrobatics Greeting',
    date: 'Sept 16, 2026 • 11:20 AM',
    locationName: 'WEB Workshop Fire Escape',
    landId: 'avengers_campus',
    landName: 'Marvel Avengers Campus',
    universe: 'marvel',
    imageUrl: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&w=1200&q=80',
    caption: 'Got front-row spot as Spidey backflipped onto the brick facade, shot real web lines to test our repulsor gear, and taught us the official Avengers salute.',
    highlightBadge: '🕸️ Superhero Meet & Greet',
    photographerType: 'Disney PhotoPass Pro Photog',
    imagenPrompt: 'Vibrant action snapshot at Avengers Campus with Spider-Man perched on a brick wall posing dynamically, spider-bots glowing with orange lights below, sunny Californian theme park afternoon, high resolution',
    cameraParameters: {
      lens: '70mm f/2.8 Sports Lens',
      lighting: 'Bright Crisp Morning Daylight',
      aspectRatio: '4:3',
      style: 'Hero Action Portrait'
    },
    tags: ['Spider-Man', 'WEB Slingers', 'Avengers Campus', 'Hero Greeting', 'Marvel'],
    likesCount: 167,
    userLiked: true,
    featured: true,
    companions: ['Peter Parker', 'Tony Stark'],
    ridePhotoStats: {
      attractionName: 'WEB Slingers Spider-Bot Blaster',
      score: 142800
    }
  },
  {
    id: 'mem_pixar_pier_twilight',
    title: 'Golden Twilight Along Pixar Pier Boardwalk',
    date: 'Sept 15, 2026 • 7:55 PM',
    locationName: 'Paradise Bay Waterfront Promenade',
    landId: 'pixar_pier',
    landName: 'Pixar Pier & Toy Story Land',
    universe: 'disney',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    caption: 'A serene sunset stroll along the wooden boardwalk. The iconic wheel and coaster loop glowing with amber festival lights reflected in the calm waters of the bay.',
    highlightBadge: '🌅 Waterfront Vista',
    photographerType: 'Imagen 3 Pro Snapshot',
    imagenPrompt: 'Warm golden hour wide angle photograph of a classic amusement park boardwalk pier with a towering Ferris wheel and roller coaster track reflecting in tranquil bay water, strings of glowing festoon bulbs, nostalgic summer evening',
    cameraParameters: {
      lens: '28mm f/2.0 Wide Angle',
      lighting: 'Dusk Ambient & Festoon Warm Glow',
      aspectRatio: '4:3',
      style: 'Nostalgic Cinematic Boardwalk'
    },
    tags: ['Pixar Pier', 'Sunset', 'Boardwalk', 'Waterfront', 'Relaxation'],
    likesCount: 76,
    userLiked: false,
    featured: false,
  }
];

export interface MemoryPresetTemplate {
  id: string;
  name: string;
  landName: string;
  landId: string;
  universe: 'disney' | 'marvel';
  defaultPrompt: string;
  suggestedBadge: string;
  imageUrl: string;
}

export const IMAGEN_PRESET_TEMPLATES: MemoryPresetTemplate[] = [
  {
    id: 'preset_frozen_ice_palace',
    name: "Queen Elsa's Crystallized Ice Palace",
    landName: 'Fantasyland & Cinderella Castle',
    landId: 'fantasyland',
    universe: 'disney',
    defaultPrompt: 'Photorealistic snapshot of Queen Elsas towering glowing crystalline ice palace under the northern lights aurora borealis, snowflakes twinkling in the crisp mountain air, Disney fantasy park memory',
    suggestedBadge: '❄️ Frozen Magic Moment',
    imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'preset_falcon_cockpit',
    name: "Millennium Falcon Smuggler's Flight Deck",
    landName: "Galaxy's Edge Outpost",
    landId: 'star_wars',
    universe: 'disney',
    defaultPrompt: 'Cinematic snapshot inside the cockpit of the Millennium Falcon jumping to hyperspace, bright blue hyperspace star streaks out the front viewport, glowing instrument consoles, photorealistic Star Wars outpost memory',
    suggestedBadge: '🛸 Hyperspace Jump',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'preset_ironman_flight_lab',
    name: 'Tony Stark Repulsor Armor Prototyping Bay',
    landName: 'Marvel Avengers Campus',
    landId: 'avengers_campus',
    universe: 'marvel',
    defaultPrompt: 'Futuristic theme park snapshot of Tony Starks subterranean armor laboratory with glowing holographic HUD schematics, gleaming gold-titanium Mark armor standing in glass containment pods, crisp studio lighting',
    suggestedBadge: '🦾 Stark Armor Vault',
    imageUrl: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'preset_sailing_hydrofoil',
    name: 'Quinjet Amphibious Hydrofoil Skimming Waves',
    landName: 'Adventureland & Pirates Sailing Bay',
    landId: 'adventureland',
    universe: 'marvel',
    defaultPrompt: 'Action snapshot of a sleek naval Quinjet hydrofoil vessel carving turquoise lagoon waves under tropical sunshine, white sea foam spray, tropical palms on distant shoreline, cinematic adventure',
    suggestedBadge: '🌊 Naval Tactical Hydrofoil',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  }
];
