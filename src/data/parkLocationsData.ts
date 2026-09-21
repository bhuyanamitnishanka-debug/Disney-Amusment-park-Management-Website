import { ParkLocation, RouteNavigation } from '../types';

export const ALL_PARK_LOCATIONS: ParkLocation[] = [
  // --- ATTRACTIONS (Rides & Sailing Water Rides) ---
  {
    id: 'space_mountain',
    name: 'Space Mountain Cosmic Hyperspace',
    landId: 'tomorrowland',
    category: 'attraction',
    universe: 'disney',
    coordinates: { x: 78, y: 62 },
    description: 'High-speed dark coaster whipping through nebulas, shooting stars, and cosmic black holes.',
    status: 'operational',
    waitTimeMinutes: 55,
    lightningLaneAvailable: true,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'avengers_quinjet',
    name: 'Avengers: Flight of the Quinjet',
    landId: 'avengers_campus',
    category: 'attraction',
    universe: 'marvel',
    coordinates: { x: 75, y: 22 },
    description: 'Board Tony Stark’s next-gen sub-orbital Quinjet to defend Earth from an incoming interstellar invasion.',
    status: 'boarding',
    waitTimeMinutes: 65,
    lightningLaneAvailable: true,
    image: 'https://images.unsplash.com/photo-1517976487507-5b3b4b45a9b7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'web_slingers',
    name: 'Spider-Man: WEB Slingers Lab',
    landId: 'avengers_campus',
    category: 'attraction',
    universe: 'marvel',
    coordinates: { x: 82, y: 34 },
    description: 'Interactive shooter using gesture tracking to fire virtual webs and capture runaway Spider-Bots.',
    status: 'operational',
    waitTimeMinutes: 40,
    lightningLaneAvailable: true,
    image: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pirates_sailing',
    name: 'Pirates of the Caribbean: Sailing Armada',
    landId: 'adventureland',
    category: 'attraction',
    universe: 'disney',
    coordinates: { x: 18, y: 58 },
    description: 'Sail through misty Caribbean lagoons, pirate cannon battles, and Dead Man’s Cove on galleon boats.',
    status: 'operational',
    waitTimeMinutes: 25,
    lightningLaneAvailable: true,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'slinky_coaster',
    name: 'Slinky Dog Dash Coaster',
    landId: 'pixar_pier',
    category: 'attraction',
    universe: 'disney',
    coordinates: { x: 16, y: 26 },
    description: 'Stretch out on Slinky’s coils around Andy’s backyard track with thrilling double launches.',
    status: 'operational',
    waitTimeMinutes: 50,
    lightningLaneAvailable: true,
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'tron_lightcycle',
    name: 'TRON Lightcycle / Run',
    landId: 'tomorrowland',
    category: 'attraction',
    universe: 'disney',
    coordinates: { x: 86, y: 68 },
    description: 'Climb aboard your illuminated Lightcycle and race across the digital Frontier Grid at high speeds.',
    status: 'operational',
    waitTimeMinutes: 70,
    lightningLaneAvailable: true,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'falcon_run',
    name: 'Millennium Falcon: Smugglers Run',
    landId: 'star_wars',
    category: 'attraction',
    universe: 'disney',
    coordinates: { x: 48, y: 62 },
    description: 'Pilot, shoot, and engineer the fastest hunk of junk in the galaxy on a secret coaxium heist.',
    status: 'operational',
    waitTimeMinutes: 45,
    lightningLaneAvailable: true,
    image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'guardians_rewind',
    name: 'Guardians: Cosmic Rewind',
    landId: 'avengers_campus',
    category: 'attraction',
    universe: 'marvel',
    coordinates: { x: 74, y: 38 },
    description: 'Family-thrill omnicoaster that rotates 360 degrees while launching backward to retro pop songs.',
    status: 'operational',
    waitTimeMinutes: 80,
    lightningLaneAvailable: true,
    image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'jungle_sailing_cruise',
    name: 'Jungle River Sailing Safari',
    landId: 'adventureland',
    category: 'attraction',
    universe: 'disney',
    coordinates: { x: 12, y: 68 },
    description: 'Scenic water cruise through the Amazon, Congo, and Nile rivers steered by our famous wisecracking Skippers.',
    status: 'operational',
    waitTimeMinutes: 20,
    lightningLaneAvailable: false,
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=600&q=80',
  },

  // --- RESTAURANTS & DINING ---
  {
    id: 'pym_test_kitchen',
    name: 'Pym Test Kitchen & Tasting Lab',
    landId: 'avengers_campus',
    category: 'restaurant',
    universe: 'marvel',
    coordinates: { x: 80, y: 16 },
    description: 'Quantum-engineered dining utilizing Pym Particles to grow and shrink foods like giant pretzels and colossal chicken sandwiches.',
    status: 'mobile_order_active',
    waitTimeMinutes: 10,
    cuisine: 'Quantum Innovation & American Craft',
    diningType: 'Quick Service / Mobile Order',
    mobileOrderAvailable: true,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cinderella_royal_table',
    name: 'Cinderella’s Royal Table',
    landId: 'fantasyland',
    category: 'restaurant',
    universe: 'disney',
    coordinates: { x: 50, y: 22 },
    description: 'Dine inside the legendary Cinderella Castle banquet hall with soaring stained glass windows and royal princess greetings.',
    status: 'reservations_recommended',
    waitTimeMinutes: 25,
    cuisine: 'Signature Royal French-American',
    diningType: 'Fine Dining / Table Service',
    mobileOrderAvailable: false,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'blue_bayou_waterfront',
    name: 'Blue Bayou Pirates Waterfront Restaurant',
    landId: 'adventureland',
    category: 'restaurant',
    universe: 'disney',
    coordinates: { x: 22, y: 52 },
    description: 'Immerse in perpetual Louisiana bayou twilight while watching sailing galleon boats glide past your waterside table.',
    status: 'table_service_ready',
    waitTimeMinutes: 30,
    cuisine: 'Cajun, Creole & Fresh Seafood',
    diningType: 'Table Service Waterside',
    mobileOrderAvailable: false,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'docking_bay_7',
    name: 'Docking Bay 7 Food & Cargo',
    landId: 'star_wars',
    category: 'restaurant',
    universe: 'disney',
    coordinates: { x: 42, y: 68 },
    description: 'Chef Strono Tuggs travels the galaxy to prepare exotic interstellar delicacies in a working cargo freighter hangar.',
    status: 'mobile_order_active',
    waitTimeMinutes: 15,
    cuisine: 'Galactic Fusion & Smoked Ribs',
    diningType: 'Quick Service Mobile Pickup',
    mobileOrderAvailable: true,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'shawarma_palace',
    name: 'Shawarma Palace Avengers Cart',
    landId: 'avengers_campus',
    category: 'restaurant',
    universe: 'marvel',
    coordinates: { x: 70, y: 28 },
    description: 'Tony Stark’s favorite post-battle savory shawarma wraps, chicken & garlic spread, and impossible plant-based bites.',
    status: 'quick_walkup',
    waitTimeMinutes: 5,
    cuisine: 'Middle Eastern Street Food',
    diningType: 'Quick Walkup Cart',
    mobileOrderAvailable: true,
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cosmic_rays_cafe',
    name: 'Cosmic Ray’s Starlight Café',
    landId: 'tomorrowland',
    category: 'restaurant',
    universe: 'disney',
    coordinates: { x: 72, y: 58 },
    description: 'Enjoy burgers, chicken tenders, and fries while listening to the intergalactic lounge singer Sonny Eclipse on his astro-organ.',
    status: 'mobile_order_active',
    waitTimeMinutes: 12,
    cuisine: 'Burgers, Shakes & American Favorites',
    diningType: 'Quick Service Food Court',
    mobileOrderAvailable: true,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
  },

  // --- SHOPS & BAZAARS ---
  {
    id: 'stark_super_store',
    name: 'Stark Super Store & Collector’s Vault',
    landId: 'avengers_campus',
    category: 'shop',
    universe: 'marvel',
    coordinates: { x: 86, y: 24 },
    description: 'The premier headquarters for Marvel superhero toys, Stark tech electronic armor, and amphibious Quinjet models.',
    status: 'open_now',
    merchSpecialty: 'Marvel Action Toys, Iron Man Arc Gear & Naval Quinjets',
    image: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'web_suppliers',
    name: 'WEB Suppliers Gadget Depot',
    landId: 'avengers_campus',
    category: 'shop',
    universe: 'marvel',
    coordinates: { x: 84, y: 40 },
    description: 'Equip yourself with custom Spider-Bots, tactical web-shooters, and interactive WEB power bands.',
    status: 'open_now',
    merchSpecialty: 'Spider-Bots & WEB Gauntlets',
    image: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'emporium_main_street',
    name: 'The Emporium on Main Street U.S.A.',
    landId: 'fantasyland',
    category: 'shop',
    universe: 'disney',
    coordinates: { x: 50, y: 78 },
    description: 'The park’s grandest retail Victorian store spanning an entire city block, filled with Disney pins, apparel, and plush.',
    status: 'open_now',
    merchSpecialty: 'Disney 100th Platinum Collectibles & Apparel',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'plaza_del_sol_sailing_bazaar',
    name: 'Plaza del Sol Caribe Sailing Bazaar',
    landId: 'adventureland',
    category: 'shop',
    universe: 'disney',
    coordinates: { x: 26, y: 64 },
    description: 'Nautical maritime trade port offering handcrafted wooden Black Pearl sailing models, brass spyglasses, and doubloons.',
    status: 'open_now',
    merchSpecialty: 'Sailing Galleon Ships, Compasses & Pirate Gear',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'bibbidi_boutique',
    name: 'Bibbidi Bobbidi Boutique',
    landId: 'fantasyland',
    category: 'shop',
    universe: 'disney',
    coordinates: { x: 44, y: 28 },
    description: 'Enchanted salon where Fairy Godmother apprentices transform young guests into royal knights and storybook princesses.',
    status: 'open_now',
    merchSpecialty: 'Royal Gowns, Crystal Wands & Tiara Crowns',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'droid_depot_bazaar',
    name: 'Droid Depot & Black Spire Outpost',
    landId: 'star_wars',
    category: 'shop',
    universe: 'disney',
    coordinates: { x: 46, y: 54 },
    description: 'Custom droid building workshop and galactic scrap merchant carrying parts, lightsaber hilts, and astromechs.',
    status: 'open_now',
    merchSpecialty: 'Custom Droids & Galactic Kyber Crystals',
    image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=600&q=80',
  },
];

// Central Park Hub coordinate where main walkways converge
const CENTRAL_HUB_COORDINATES = { x: 50, y: 48 };

/**
 * Calculates a realistic walking route between two park locations via the Central Castle Hub walkways
 */
export function calculateParkRoute(fromId: string, toId: string): RouteNavigation | null {
  const fromLocation = ALL_PARK_LOCATIONS.find((l) => l.id === fromId);
  const toLocation = ALL_PARK_LOCATIONS.find((l) => l.id === toId);

  if (!fromLocation || !toLocation || fromLocation.id === toLocation.id) {
    return null;
  }

  // Calculate Euclidean distance in percentage units, map to realistic park yards
  const directDx = toLocation.coordinates.x - fromLocation.coordinates.x;
  const directDy = toLocation.coordinates.y - fromLocation.coordinates.y;
  const directDistance = Math.sqrt(directDx * directDx + directDy * directDy);

  // Generate intermediate path waypoints routed smoothly through the central promenade hub
  const waypoints: { x: number; y: number }[] = [
    { x: fromLocation.coordinates.x, y: fromLocation.coordinates.y },
  ];

  // If locations are on opposite sides of park, detour through central hub for realistic pedestrian walkway
  const isOppositeSides = Math.abs(directDx) > 30 || Math.abs(directDy) > 35;
  if (isOppositeSides) {
    // Walkway into central hub
    const midX1 = (fromLocation.coordinates.x + CENTRAL_HUB_COORDINATES.x) / 2;
    const midY1 = (fromLocation.coordinates.y + CENTRAL_HUB_COORDINATES.y) / 2;
    waypoints.push({ x: midX1, y: midY1 });
    waypoints.push({ x: CENTRAL_HUB_COORDINATES.x, y: CENTRAL_HUB_COORDINATES.y });

    // Walkway out of central hub towards destination
    const midX2 = (CENTRAL_HUB_COORDINATES.x + toLocation.coordinates.x) / 2;
    const midY2 = (CENTRAL_HUB_COORDINATES.y + toLocation.coordinates.y) / 2;
    waypoints.push({ x: midX2, y: midY2 });
  } else {
    // Direct curved promenade
    const curveMidX = (fromLocation.coordinates.x + toLocation.coordinates.x) / 2 + (directDy > 0 ? 4 : -4);
    const curveMidY = (fromLocation.coordinates.y + toLocation.coordinates.y) / 2 + (directDx > 0 ? -4 : 4);
    waypoints.push({ x: curveMidX, y: curveMidY });
  }

  waypoints.push({ x: toLocation.coordinates.x, y: toLocation.coordinates.y });

  // Calculate real park walking distance and minutes
  const distanceYards = Math.round(directDistance * 11.5 + (isOppositeSides ? 90 : 35));
  // Walking speed approx 85 yards per minute
  const estimatedMinutes = Math.max(1, Math.round(distanceYards / 85));

  // Build descriptive step-by-step turn guidance
  const steps: string[] = [
    `Start outside ${fromLocation.name}`,
    isOppositeSides
      ? `Proceed along the promenade toward Cinderella Castle Central Hub`
      : `Follow the scenic garden pathway toward ${toLocation.landId.replace('_', ' ').toUpperCase()}`,
    isOppositeSides
      ? `Cross the bridge plaza and turn toward ${toLocation.name}`
      : `Continue straight past the landmark plaza`,
    `Arrive at your destination: ${toLocation.name}`,
  ];

  return {
    fromLocation,
    toLocation,
    distanceYards,
    estimatedMinutes,
    waypoints,
    steps,
  };
}
