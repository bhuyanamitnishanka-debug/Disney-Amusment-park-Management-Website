import { LoyaltyTier, LoyaltyReward, DailyParkChallenge } from '../types';

export interface TierConfig {
  id: LoyaltyTier;
  title: string;
  minPoints: number;
  maxPoints: number | null;
  badgeEmoji: string;
  color: string;
  gradient: string;
  borderColor: string;
  perks: string[];
}

export const LOYALTY_TIERS: Record<LoyaltyTier, TierConfig> = {
  bronze: {
    id: 'bronze',
    title: 'Cadet Recruit',
    minPoints: 0,
    maxPoints: 499,
    badgeEmoji: '🥉',
    color: 'text-amber-600',
    gradient: 'from-amber-700/30 to-amber-900/30',
    borderColor: 'border-amber-600/40',
    perks: [
      'Earn 10 points per $1 on all Disney & Marvel merchandise',
      'Daily park attendance check-in bonus (+150 pts)',
      'Digital Marvel & Disney collectible badge passport',
    ],
  },
  silver: {
    id: 'silver',
    title: 'Sorcerer Vanguard',
    minPoints: 500,
    maxPoints: 1499,
    badgeEmoji: '🥈',
    color: 'text-slate-300',
    gradient: 'from-slate-400/30 to-slate-600/30',
    borderColor: 'border-slate-400/40',
    perks: [
      'All Bronze perks included',
      '5% discount on all park merchandise and toys',
      '1x Express Lightning Lane pass per visit',
      'Priority mobile order window at Pym Test Kitchen',
    ],
  },
  gold: {
    id: 'gold',
    title: 'Infinity Hero',
    minPoints: 1500,
    maxPoints: 3499,
    badgeEmoji: '🥇',
    color: 'text-amber-400',
    gradient: 'from-amber-400/30 via-yellow-500/20 to-amber-600/30',
    borderColor: 'border-amber-400/50',
    perks: [
      'All Silver perks included',
      '10% discount on all park merchandise & toy sailing models',
      'Free Stark laser engraving on all gear',
      'Reserved front-row viewing for Cinderella Castle fireworks',
      'Exclusive Marvel superhero meet & greet access',
    ],
  },
  platinum: {
    id: 'platinum',
    title: 'Stark Luminary VIP',
    minPoints: 3500,
    maxPoints: null,
    badgeEmoji: '💎',
    color: 'text-cyan-300',
    gradient: 'from-cyan-400/30 via-indigo-500/30 to-purple-600/30',
    borderColor: 'border-cyan-400/60',
    perks: [
      'All Gold perks included',
      '15% lifetime discount across all Disney & Marvel retail',
      'Unlimited park locker access & queue seat delivery',
      'VIP lounge access at Avengers Campus Stark Tower',
      'First access to limited-edition Quinjet sailing vessels',
    ],
  },
};

export const REDEEMABLE_REWARDS: LoyaltyReward[] = [
  // --- INSTANT LIGHTNING LANE ---
  {
    id: 'fastpass_instant',
    title: 'Instant Lightning Lane Queue Pass',
    cost: 400,
    description: 'Instant zero-wait queue skip for any headliner coaster or attraction across Disney WonderKingdom & Avengers Campus.',
    icon: '⚡',
    category: 'fastpass',
    badge: 'Most Popular',
    popular: true,
    perkHighlights: [
      'Valid for 1 immediate boarding scan today',
      'Accepted at Space Mountain, Flight of the Quinjet, and Pirates Sailing',
      'Direct barcode pass generated on mobile instantly',
    ],
    terms: 'Non-transferable. Valid during normal park operating hours today.',
  },
  {
    id: 'fastpass_quinjet_vip',
    title: 'Avengers Quinjet Priority Launch Boarding',
    cost: 550,
    description: 'Bypass the main queue directly to the cockpit briefing room for Flight of the Quinjet at Avengers Campus.',
    icon: '🚀',
    category: 'fastpass',
    badge: 'Stark Tech',
    popular: true,
    perkHighlights: [
      'Immediate priority cockpit boarding',
      'Exclusive pilot flight certificate signed by Tony Stark',
      'Includes front-row seating priority',
    ],
    terms: 'Subject to attraction operational status. Check in at Campus hangar turnstile.',
  },
  {
    id: 'fastpass_sailing_fleet',
    title: 'Sailing Hydrofoil Express Dock Pass',
    cost: 350,
    description: 'Expedited VIP boarding pass for the Caribbean Sailing Fleet and Pirates Hydrofoil Waterway.',
    icon: '⛵',
    category: 'fastpass',
    perkHighlights: [
      'Priority boarding at Grand Harbor Pier 4',
      'Skip standard standby lagoon wait',
      'Includes captain keepsake compass token',
    ],
    terms: 'Valid for up to 2 guests in the same party.',
  },

  // --- VIP CHARACTER MEET & GREET ---
  {
    id: 'vip_meet_avengers',
    title: 'VIP Character Meet & Greet: Iron Man & Spidey',
    cost: 700,
    description: 'Private 10-minute photo and interactive meet-and-greet in the Stark Industries Innovation Hangar with Tony Stark & Spider-Man.',
    icon: '🦾',
    category: 'meet_and_greet',
    badge: 'Exclusive',
    popular: true,
    perkHighlights: [
      'Private air-conditioned Stark laboratory greeting suite',
      'Unlimited digital Disney PhotoPass downloads included',
      'Commemorative Stark Industries Operative Badge',
      'Zero line waiting — scheduled direct entry',
    ],
    terms: 'Advance 15-minute check-in required at Stark Tower reception.',
  },
  {
    id: 'vip_meet_royalty',
    title: 'Royal Audience: Mickey & Queen Elsa',
    cost: 650,
    description: 'Step inside Cinderella Castle’s Royal Chamber for a private royal audience with Sorcerer Mickey and Queen Elsa.',
    icon: '👑',
    category: 'meet_and_greet',
    badge: 'Magical Moment',
    popular: true,
    perkHighlights: [
      'Exclusive private entrance through Castle Grand Arch',
      'PhotoPass commemorative castle portrait package',
      'Personalized signed magical autograph card',
    ],
    terms: 'Available daily from 11:00 AM to 7:00 PM.',
  },
  {
    id: 'vip_meet_wakanda',
    title: 'Wakandan Royal Guard Training with Black Panther',
    cost: 600,
    description: 'Meet King T’Challa in the Wakandan Outpost for an interactive vibranium technology demonstration and private portrait.',
    icon: '🐾',
    category: 'meet_and_greet',
    perkHighlights: [
      'Personalized Dora Milaje salute training',
      'Vibranium artifact showcase viewing',
      'Includes 2 high-resolution souvenir prints',
    ],
    terms: 'Valid at Avengers Campus Wakandan Outpost.',
  },

  // --- MERCHANDISE DISCOUNTS ---
  {
    id: 'merch_discount_25',
    title: '25% Off Marvel Toys & Sailing Ships',
    cost: 500,
    description: 'Enjoy a 25% discount voucher valid on any Marvel superhero action toy, remote-control Quinjet, or sailing ship model.',
    icon: '🛍️',
    category: 'discount',
    badge: 'High Value',
    popular: true,
    perkHighlights: [
      'Applies to entire toy & sailing model cart total',
      'Stackable with park loyalty member pricing',
      'Instant barcode usable online or at in-park retail stores',
    ],
    terms: 'One-time use. Maximum discount credit of $75.',
  },
  {
    id: 'merch_voucher_25_dollar',
    title: '$25 Kingdom Shopping Gift Credit',
    cost: 800,
    description: 'Direct $25 digital cash credit applicable towards any merchandise, collectible apparel, or Disney memorabilia.',
    icon: '💳',
    category: 'discount',
    perkHighlights: [
      '$25 flat reduction at checkout',
      'No minimum purchase required',
      'Usable both online in the app or scanned at park cash registers',
    ],
    terms: 'Single transaction voucher. No cash back.',
  },
  {
    id: 'merch_discount_15_storewide',
    title: '15% Storewide Merchandise Pass',
    cost: 350,
    description: '15% discount across all retail emporiums, Disney pins, ears, apparel, and Marvel collectibles today.',
    icon: '🏷️',
    category: 'discount',
    perkHighlights: [
      'Storewide validity across all park lands',
      'Valid for unlimited purchases for 24 hours',
    ],
    terms: 'Valid for 24 hours from time of redemption.',
  },
  {
    id: 'free_engraving',
    title: 'Custom Stark Laser Engraving & Gift Box',
    cost: 200,
    description: 'Custom personalized laser inscription on any Marvel action toy, shield, or sailing vessel, packed in a metallic gift box.',
    icon: '✨',
    category: 'discount',
    perkHighlights: [
      'Precision laser engraving of up to 30 characters',
      'Stark Industries commemorative metallic gift case',
      'Completed in under 5 minutes at Avengers Supply Co.',
    ],
    terms: 'Applicable to any toy purchased in-park or online.',
  },
  {
    id: 'collector_pin',
    title: 'Limited Avengers Campus Crest Pin',
    cost: 600,
    description: 'Exclusive numbered enamel collectible commemorative pin available only to verified loyalty operatives.',
    icon: '🛡️',
    category: 'merchandise',
    badge: 'Limited Edition',
    perkHighlights: [
      'Heavyweight die-cast metal with glow enamel',
      'Numbered certificate of authenticity',
      'Collect in-person at Avengers Campus Collector Emporium',
    ],
    terms: 'Limit 1 per loyalty operative.',
  },

  // --- VIP ACCESS & EXPERIENCES ---
  {
    id: 'fireworks_vip_viewing',
    title: 'Cinderella Castle Fireworks VIP Reserved View',
    cost: 900,
    description: 'Reserved front-row lawn seating with prime sightlines for the nightly fireworks and projection spectacular.',
    icon: '🎆',
    category: 'vip_access',
    badge: 'Spectacular',
    popular: true,
    perkHighlights: [
      'Unobstructed center-lawn viewing terrace',
      'Complimentary champagne or sparkling cider flute',
      'Private security entrance 30 minutes before showtime',
    ],
    terms: 'Check in at Castle Hub VIP podium by 8:30 PM.',
  },
  {
    id: 'stark_tower_lounge',
    title: 'Stark Tower VIP Lounge 1-Day Executive Pass',
    cost: 1200,
    description: 'Exclusive 1-day access to the top-floor Stark Tower Lounge featuring panoramic park views and complimentary refreshments.',
    icon: '🏙️',
    category: 'vip_access',
    badge: 'Ultra VIP',
    perkHighlights: [
      'Panoramic 360-degree terrace overlooking the entire Kingdom',
      'Unlimited gourmet espresso, artisan treats, and mocktails',
      'Ultra-fast Stark satellite Wi-Fi & device charging pods',
    ],
    terms: 'Valid for loyalty member plus 1 guest.',
  },
  {
    id: 'unlimited_locker_delivery',
    title: 'All-Day Locker & Ride-Side Package Courier',
    cost: 300,
    description: 'Complimentary biometric park locker rental and on-demand courier delivery of your purchases directly to ride exits.',
    icon: '📦',
    category: 'vip_access',
    perkHighlights: [
      'Unlimited access to Main Street or Avengers Campus lockers',
      'Shop hands-free with real-time courier notifications',
    ],
    terms: 'Valid for the entire operating day.',
  },

  // --- DINING & GOURMET TREATS ---
  {
    id: 'quantum_snack',
    title: 'Pym Kitchen Quantum Pretzel & Atomic Soda',
    cost: 250,
    description: 'Complimentary giant Quantum-expanded Bavarian pretzel with craft cheese dip and Quantum micro-bubble soda at Pym Test Kitchen.',
    icon: '🥨',
    category: 'dining',
    perkHighlights: [
      'Giant shared pretzel serves 2-3 people',
      'Choice of Atomic cheese sauce or craft beer mustard',
      'Fast-track mobile pickup window',
    ],
    terms: 'Redeem at Pym Test Kitchen pickup bay.',
  },
  {
    id: 'shawarma_palace_platter',
    title: 'Avengers Shawarma Palace Deluxe Platter',
    cost: 450,
    description: 'Tony Stark’s favorite post-battle chicken or Impossible falafel shawarma wrap platter with garlic fries and baklava.',
    icon: '🌯',
    category: 'dining',
    perkHighlights: [
      'Includes gourmet wrap, seasoned fries, and dessert',
      'Collector Avengers wrapping paper & souvenir napkin',
    ],
    terms: 'Valid at Shawarma Palace cart in Avengers Campus.',
  },
];

export const POINTS_PER_DOLLAR = 10;
export const POINTS_PER_ATTENDANCE_CHECKIN = 150;

/**
 * Calculates current tier from lifetime earned points
 */
export function calculateTier(lifetimePoints: number): LoyaltyTier {
  if (lifetimePoints >= 3500) return 'platinum';
  if (lifetimePoints >= 1500) return 'gold';
  if (lifetimePoints >= 500) return 'silver';
  return 'bronze';
}

/**
 * Calculates progress towards next tier
 */
export function getTierProgress(lifetimePoints: number): {
  currentTier: TierConfig;
  nextTier: TierConfig | null;
  progressPercent: number;
  pointsToNext: number;
} {
  const currentTierId = calculateTier(lifetimePoints);
  const currentTier = LOYALTY_TIERS[currentTierId];

  if (currentTierId === 'platinum') {
    return {
      currentTier,
      nextTier: null,
      progressPercent: 100,
      pointsToNext: 0,
    };
  }

  const nextTierId: LoyaltyTier =
    currentTierId === 'bronze' ? 'silver' : currentTierId === 'silver' ? 'gold' : 'platinum';
  const nextTier = LOYALTY_TIERS[nextTierId];

  const tierRange = nextTier.minPoints - currentTier.minPoints;
  const earnedInRange = lifetimePoints - currentTier.minPoints;
  const progressPercent = Math.min(100, Math.max(0, Math.round((earnedInRange / tierRange) * 100)));
  const pointsToNext = Math.max(0, nextTier.minPoints - lifetimePoints);

  return {
    currentTier,
    nextTier,
    progressPercent,
    pointsToNext,
  };
}

export const ALL_CHALLENGES_BONUS_POINTS = 250;

export const DAILY_PARK_CHALLENGES: DailyParkChallenge[] = [
  {
    id: 'challenge_space_mountain',
    title: 'Check in to Space Mountain',
    description: 'Scan your MagicPass beacon at Space Mountain: Cosmic Star-Voyage in Tomorrowland.',
    icon: '🚀',
    pointsReward: 120,
    category: 'ride',
    difficulty: 'easy',
    targetCount: 1,
    actionLabel: 'Check In to Space Mountain',
    targetAttractionId: 'space_mountain',
    targetLocationName: 'Tomorrowland Star Port',
  },
  {
    id: 'challenge_view_store_items',
    title: 'View 3 items in the store',
    description: 'Inspect 3 Marvel superhero action toys or hydrofoil sailing vessels in the park merchandise depot.',
    icon: '🛍️',
    pointsReward: 100,
    category: 'store',
    difficulty: 'easy',
    targetCount: 3,
    actionLabel: 'Inspect Store Toys',
    targetLocationName: 'Avengers Supply & Toy Depot',
  },
  {
    id: 'challenge_meet_ironman',
    title: 'Meet Tony Stark or Spider-Man',
    description: 'Visit the Stark Innovation Hangar in Avengers Campus for superhero diagnostics & PhotoPass.',
    icon: '🦾',
    pointsReward: 90,
    category: 'character',
    difficulty: 'medium',
    targetCount: 1,
    actionLabel: 'Locate at Avengers Campus',
    targetLocationName: 'Stark Innovation Hangar',
  },
  {
    id: 'challenge_pym_dining',
    title: 'Explore Pym Kitchen Treats',
    description: 'Check out Quantum pretzel treats and micro-bubble atomic sodas at Pym Test Kitchen.',
    icon: '🥨',
    pointsReward: 75,
    category: 'dining',
    difficulty: 'easy',
    targetCount: 1,
    actionLabel: 'View Quantum Treats',
    targetLocationName: 'Pym Test Kitchen',
  },
  {
    id: 'challenge_hydrofoil_fleet',
    title: 'Track the Hydrofoil Sailing Fleet',
    description: 'Observe the sailing galleons and hydrofoil vessels traversing Caribbean waters.',
    icon: '⛵',
    pointsReward: 85,
    category: 'exploration',
    difficulty: 'medium',
    targetCount: 1,
    actionLabel: 'Track Sailing Fleet',
    targetLocationName: 'Adventureland Pier',
  },
];

