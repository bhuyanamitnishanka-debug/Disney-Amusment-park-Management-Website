export type UniverseType = 'disney' | 'marvel' | 'nautical_sailing' | 'all';

export interface ParkLand {
  id: string;
  name: string;
  theme: string;
  universe: 'disney' | 'marvel' | 'neutral';
  color: string;
  badge: string;
  icon: string;
  description: string;
  coordinates: { x: number; y: number; width: number; height: number };
}

export type RideStatus = 'operational' | 'boarding' | 'fastpass_priority' | 'maintenance' | 'weather_hold';

export interface Attraction {
  id: string;
  name: string;
  landId: string;
  universe: 'disney' | 'marvel';
  type: 'roller_coaster' | 'dark_ride' | 'sailing_water' | 'flight_simulator' | 'stunt_arena';
  status: RideStatus;
  waitTimeMinutes: number;
  capacityPerHour: number;
  currentThroughputPct: number;
  lightningLaneAvailable: boolean;
  lightningLaneWait: number;
  heightRequirementInches: number;
  coordinates: { x: number; y: number };
  activeVehicles: number;
  maxVehicles: number;
  description: string;
  speedMph: number;
  safetyScore: number;
}

export interface CharacterGreeting {
  id: string;
  name: string;
  universe: 'disney' | 'marvel';
  location: string;
  status: 'greeting' | 'break' | 'arriving';
  currentLineMinutes: number;
  nextAppearance: string;
  badge: string;
  avatarEmoji: string;
}

export interface ParadeShow {
  id: string;
  title: string;
  timeSlot: string;
  status: 'scheduled' | 'active_parade' | 'finale' | 'concluded';
  location: string;
  progressPercent: number;
  type: 'parade' | 'fireworks' | 'stunt_show';
}

export interface MaintenanceAlert {
  id: string;
  title: string;
  attractionId: string;
  priority: 'critical' | 'moderate' | 'routine';
  status: 'pending' | 'dispatched' | 'resolved';
  reportedAt: string;
  assignedCrew: string;
}

export interface MerchandiseItem {
  id: string;
  title: string;
  universe: 'disney' | 'marvel' | 'nautical_sailing';
  category: 'toy' | 'costume_replica' | 'collectible' | 'gadget' | 'sailing_model';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images?: string[];
  badge?: string;
  stock: number;
  inStockParkLocations: string[];
  character?: string;
  movieSeries?: string;
  isNewArrival?: boolean;
  isTopSeller?: boolean;
  isSailingVessel?: boolean;
  heroRating?: {
    power: number;
    tech: number;
    rarity: number;
  };
  features: string[];
  soundFx: 'magic_chime' | 'repulsor' | 'thunder' | 'web_shot' | 'ship_bell';
  description: string;
  specs: {
    material: string;
    scale: string;
    batteryRequired: string;
    ageRange: string;
  };
  sailingDeliveryAvailable: boolean;
}

export interface CartItem {
  item: MerchandiseItem;
  quantity: number;
  customEngraving?: string;
  deliveryOption: DeliveryOption;
}

export type DeliveryOption = 'park_locker' | 'ride_queue_runner' | 'resort_hotel' | 'sailing_cargo_home';

export interface OrderRecord {
  orderId: string;
  date: string;
  items: CartItem[];
  total: number;
  delivery: DeliveryOption;
  status: 'confirmed' | 'vault_assembled' | 'in_transit' | 'ready_for_pickup';
}

export interface ParkMemorySnapshot {
  id: string;
  title: string;
  date: string;
  locationName: string;
  landId: string;
  landName: string;
  universe: 'disney' | 'marvel';
  imageUrl: string;
  caption: string;
  highlightBadge: string;
  photographerType: string;
  imagenPrompt: string;
  cameraParameters?: {
    lens?: string;
    lighting?: string;
    aspectRatio?: string;
    style?: string;
  };
  tags: string[];
  likesCount: number;
  userLiked?: boolean;
  featured?: boolean;
  companions?: string[];
  ridePhotoStats?: {
    attractionName?: string;
    maxSpeedMph?: number;
    gForce?: string;
    score?: number;
  };
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  avatarHeroId: string;
  bio: string;
  membershipTier: string;
  favoriteAttractionIds: string[];
  favoriteCharacterIds: string[];
  wishlist: string[];
  pastPurchases: OrderRecord[];
  loyaltyPoints: number;
  lifetimePoints: number;
  loyaltyTier: LoyaltyTier;
  attendanceCheckIns: number;
  lastAttendanceDate?: string;
  loyaltyHistory: LoyaltyTransaction[];
  redeemedVouchers?: RedeemedPerkVoucher[];
  completedDailyChallengeIds?: string[];
  viewedStoreItemIds?: string[];
  parkMemories?: ParkMemorySnapshot[];
  sharedSocialPosts?: SimulatedSocialPost[];
}

export type SocialPlatform = 'magic_gram' | 'stark_net' | 'kingdom_book' | 'disney_story';

export interface SimulatedComment {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  isCharacter?: boolean;
  characterRole?: string;
  content: string;
  timestamp: string;
  likesCount: number;
  userLiked?: boolean;
}

export interface SimulatedSocialPost {
  id: string;
  platform: SocialPlatform;
  postType: 'park_memory' | 'loyalty_redemption';
  referenceId: string; // memory.id or voucher.id
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorTier: string;
  createdAt: string;
  title: string;
  caption: string;
  locationName: string;
  landName: string;
  universe: 'disney' | 'marvel';
  imageUrl?: string;
  filterApplied?: string;
  tags: string[];
  taggedCharacters: string[];
  stickers: string[];
  audience: 'public' | 'allies' | 'family';
  // For Loyalty Redemptions:
  voucherData?: {
    rewardTitle: string;
    rewardCategory: string;
    icon: string;
    cost: number;
    voucherCode: string;
    barcode: string;
    tierTitle: string;
    expiresAt: string;
    selectedOption?: string;
  };
  // For Park Memories:
  ridePhotoStats?: {
    attractionName?: string;
    maxSpeedMph?: number;
    gForce?: string;
    score?: number;
  };
  // Social Engagement Metrics:
  likesCount: number;
  userLiked?: boolean;
  sharesCount: number;
  commentsCount: number;
  comments: SimulatedComment[];
  reactions?: {
    love?: number;
    magic?: number;
    wow?: number;
    cheer?: number;
  };
}

export interface DailyParkChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  pointsReward: number;
  category: 'ride' | 'store' | 'character' | 'dining' | 'exploration';
  difficulty: 'easy' | 'medium' | 'epic';
  targetCount: number;
  actionLabel: string;
  targetAttractionId?: string;
  targetLocationName?: string;
}

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export type RewardCategory = 
  | 'fastpass' 
  | 'meet_and_greet' 
  | 'discount' 
  | 'vip_access' 
  | 'dining' 
  | 'merchandise'
  | 'perk';

export interface LoyaltyTransaction {
  id: string;
  date: string;
  description: string;
  points: number; // positive for earned, negative for redeemed
  type: 'attendance' | 'merchandise' | 'bonus' | 'redeem';
}

export interface LoyaltyReward {
  id: string;
  title: string;
  cost: number;
  description: string;
  icon: string;
  category: RewardCategory;
  perkHighlights?: string[];
  terms?: string;
  badge?: string;
  popular?: boolean;
}

export interface RedeemedPerkVoucher {
  id: string;
  rewardId: string;
  title: string;
  category: RewardCategory;
  icon: string;
  cost: number;
  redeemedAt: string;
  expiresAt: string;
  code: string;
  barcode: string;
  status: 'active' | 'used';
  instructions: string;
  selectedOption?: string;
}

export type LocationCategory = 'attraction' | 'restaurant' | 'shop';

export interface ParkLocation {
  id: string;
  name: string;
  landId: string;
  category: LocationCategory;
  universe: 'disney' | 'marvel' | 'neutral';
  coordinates: { x: number; y: number };
  description: string;
  status?: string;
  waitTimeMinutes?: number;
  lightningLaneAvailable?: boolean;
  // Restaurant specific
  cuisine?: string;
  diningType?: string;
  mobileOrderAvailable?: boolean;
  // Shop specific
  merchSpecialty?: string;
  // Show / attraction specific
  nextShowTime?: string;
  image?: string;
}

export interface RouteNavigation {
  fromLocation: ParkLocation;
  toLocation: ParkLocation;
  distanceYards: number;
  estimatedMinutes: number;
  waypoints: { x: number; y: number }[];
  steps: string[];
}

export type RouteOptimizationStrategy = 'smart_wait' | 'min_walking' | 'balanced_dining';

export interface TripItineraryItem {
  id: string;
  locationId: string;
  location: ParkLocation;
  stepNumber: number;
  arrivalTime: string;
  waitTimeMinutes: number;
  experienceDurationMinutes: number;
  departureTime: string;
  walkingMinutesToNext: number;
  walkingYardsToNext: number;
  routeToNext?: RouteNavigation | null;
  customNotes?: string;
}

export interface TripItineraryPlan {
  id: string;
  title: string;
  startTime: string; // e.g., "09:00 AM"
  optimizationStrategy: RouteOptimizationStrategy;
  items: TripItineraryItem[];
  totalTripMinutes: number;
  totalWalkingMinutes: number;
  totalWalkingDistanceYards: number;
  totalWaitMinutes: number;
  totalExperienceMinutes: number;
  estimatedTimeSavedMinutes: number;
  fullRouteWaypoints: { x: number; y: number }[];
}

export interface WeatherForecastDay {
  id: string;
  day: string; // e.g. "Today (Mon)", "Tomorrow (Tue)", "Wed", "Thu", "Fri"
  date: string; // e.g. "Sep 21", "Sep 22", "Sep 23", etc.
  condition: 'sunny' | 'magic_hour' | 'night_sparkle' | 'rain_protocol' | 'partly_cloudy';
  conditionLabel: string;
  icon: string;
  highTempF: number;
  lowTempF: number;
  precipitationPct: number;
  windMph: number;
  humidityPct: number;
  uvIndex: number;
  parkAdvisory: string;
  fireworksViability: 'optimal' | 'favorable' | 'moderate' | 'high_risk';
  sailingConditions: 'smooth_waters' | 'moderate_breeze' | 'choppy_waters';
  recommendedAttractionType?: string;
}

export interface ParkTelemetry {
  attendance: number;
  maxCapacity: number;
  turnstileEntryRate: number; // guests per min
  guestSatisfaction: number; // percent
  activeParadeActive: boolean;
  weather: 'sunny' | 'magic_hour' | 'night_sparkle' | 'rain_protocol';
  temperatureF: number;
  fireworksCountdownSec: number;
  isFireworksActive: boolean;
  forecast: WeatherForecastDay[]; // 5-day weather forecast array
  weatherForecast?: WeatherForecastDay[]; // Alias for 5-day weather forecast array
}
