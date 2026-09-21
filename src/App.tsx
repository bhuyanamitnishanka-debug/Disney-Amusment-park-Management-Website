import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ParkMap } from './components/ParkMap';
import { OperationsDashboard } from './components/OperationsDashboard';
import { MerchandiseStore } from './components/MerchandiseStore';
import { MarvelToySailingSection } from './components/MarvelToySailingSection';
import { UserProfile } from './components/UserProfile';
import { LoyaltyRewardsMarket } from './components/LoyaltyRewardsMarket';
import { SailingTrackingView } from './components/SailingTrackingView';
import { TripPlannerSection } from './components/TripPlannerSection';
import { CartDrawer } from './components/CartDrawer';
import { AIConciergeModal } from './components/AIConciergeModal';
import { SocialShareModal } from './components/SocialShareModal';
import { SocialFeedModal } from './components/SocialFeedModal';
import { INITIAL_SIMULATED_SOCIAL_POSTS } from './data/socialFeedData';
import { 
  INITIAL_LANDS, 
  INITIAL_ATTRACTIONS, 
  INITIAL_CHARACTERS, 
  INITIAL_PARADES, 
  INITIAL_ALERTS, 
  INITIAL_TELEMETRY 
} from './data/parkData';
import { MERCHANDISE_CATALOG } from './data/merchData';
import { 
  ParkLand, 
  Attraction, 
  CharacterGreeting, 
  ParadeShow, 
  MaintenanceAlert, 
  ParkTelemetry, 
  MerchandiseItem, 
  CartItem, 
  DeliveryOption,
  UserProfile as UserProfileType,
  OrderRecord,
  LoyaltyTransaction,
  ParkMemorySnapshot,
  RedeemedPerkVoucher,
  SimulatedSocialPost
} from './types';
import { soundEffects } from './services/audio';
import { calculateTier, POINTS_PER_DOLLAR } from './data/loyaltyData';
import { INITIAL_PARK_MEMORIES } from './data/memoriesData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'trip_planner' | 'operations' | 'merch' | 'marvel_toy_sailing' | 'sailing' | 'profile' | 'loyalty_market'>('map');
  const [lands] = useState<ParkLand[]>(INITIAL_LANDS);
  const [attractions, setAttractions] = useState<Attraction[]>(INITIAL_ATTRACTIONS);
  const [characters, setCharacters] = useState<CharacterGreeting[]>(INITIAL_CHARACTERS);
  const [parades, setParades] = useState<ParadeShow[]>(INITIAL_PARADES);
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>(INITIAL_ALERTS);
  const [telemetry, setTelemetry] = useState<ParkTelemetry>(INITIAL_TELEMETRY);
  const [merchItems] = useState<MerchandiseItem[]>(MERCHANDISE_CATALOG);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('disney_marvel_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User Profile state with localStorage persistence and loyalty tracking
  const [userProfile, setUserProfile] = useState<UserProfileType>(() => {
    const defaultProfile: UserProfileType = {
      id: 'user_tony_stark',
      displayName: 'Tony Stark',
      email: 'tony.stark@starkindustries.com',
      avatarUrl: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&w=200&q=80',
      avatarHeroId: 'iron_man',
      bio: 'Genius, billionaire, superhero toy engineer. Designing repulsor toys, testing Quantum Pym Kitchen items, and commissioning Marvel sailing hydrofoils.',
      membershipTier: 'Stark Industries VIP Operative',
      favoriteAttractionIds: ['space_mountain', 'avengers_quinjet', 'pirates_sailing'],
      favoriteCharacterIds: ['iron_man', 'spider_man', 'mickey'],
      wishlist: ['quinjet_hydrofoil_sailing', 'iron_man_arc_gauntlet', 'black_pearl_sailing_ship'],
      loyaltyPoints: 2450,
      lifetimePoints: 2950,
      loyaltyTier: 'gold',
      attendanceCheckIns: 8,
      lastAttendanceDate: 'Yesterday',
      pastPurchases: [
        {
          orderId: 'WK-89021',
          date: 'Today, 2:15 PM',
          items: [
            {
              item: MERCHANDISE_CATALOG[0], // Quinjet Hydrofoil
              quantity: 1,
              customEngraving: 'Property of Stark Industries',
              deliveryOption: 'park_locker',
            },
          ],
          total: 89.99,
          delivery: 'park_locker',
          status: 'confirmed',
        },
      ],
      loyaltyHistory: [
        {
          id: 'tx_init_1',
          date: 'Today, 2:15 PM',
          description: 'Merchandise Order #WK-89021 (Quinjet Hydrofoil) - 10 pts/$1',
          points: 900,
          type: 'merchandise',
        },
        {
          id: 'tx_init_2',
          date: 'Yesterday, 10:30 AM',
          description: 'Park Attendance Daily Visit Check-in (+150 pts)',
          points: 150,
          type: 'attendance',
        },
        {
          id: 'tx_init_3',
          date: '3 Days Ago',
          description: 'Avengers Campus Grand Opening Welcome Bonus',
          points: 1500,
          type: 'bonus',
        },
        {
          id: 'tx_init_4',
          date: '5 Days Ago',
          description: 'Redeemed Instant Lightning Lane Pass (-400 pts)',
          points: -400,
          type: 'redeem',
        },
      ],
      redeemedVouchers: [
        {
          id: 'voucher_init_1',
          rewardId: 'fastpass_instant',
          title: 'Instant Lightning Lane Queue Pass',
          category: 'fastpass',
          icon: '⚡',
          cost: 400,
          redeemedAt: '1:15 PM, Today',
          expiresAt: '11:59 PM Today',
          code: 'LL-AVENG-88241',
          barcode: '*LLAVENG88241*',
          status: 'active',
          instructions: 'Scan this digital pass at the Lightning Lane touchpoint entrance of Space Mountain Coaster. Cast Member verified.',
          selectedOption: 'Attraction: Space Mountain Coaster',
        },
      ],
      completedDailyChallengeIds: [],
      viewedStoreItemIds: ['marvel_ironman_helmet'],
      parkMemories: INITIAL_PARK_MEMORIES,
      sharedSocialPosts: INITIAL_SIMULATED_SOCIAL_POSTS,
    };

    try {
      const saved = localStorage.getItem('disney_marvel_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultProfile,
          ...parsed,
          loyaltyPoints: parsed.loyaltyPoints ?? defaultProfile.loyaltyPoints,
          lifetimePoints: parsed.lifetimePoints ?? defaultProfile.lifetimePoints,
          loyaltyTier: parsed.loyaltyTier ?? defaultProfile.loyaltyTier,
          attendanceCheckIns: parsed.attendanceCheckIns ?? defaultProfile.attendanceCheckIns,
          loyaltyHistory: parsed.loyaltyHistory ?? defaultProfile.loyaltyHistory,
          redeemedVouchers: parsed.redeemedVouchers ?? defaultProfile.redeemedVouchers,
          completedDailyChallengeIds: parsed.completedDailyChallengeIds ?? defaultProfile.completedDailyChallengeIds,
          viewedStoreItemIds: parsed.viewedStoreItemIds ?? defaultProfile.viewedStoreItemIds,
          parkMemories: (parsed.parkMemories && parsed.parkMemories.length > 0) ? parsed.parkMemories : defaultProfile.parkMemories,
          sharedSocialPosts: (parsed.sharedSocialPosts && parsed.sharedSocialPosts.length > 0) ? parsed.sharedSocialPosts : defaultProfile.sharedSocialPosts,
        };
      }
    } catch (e) {
      console.error(e);
    }
    return defaultProfile;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSocialFeedOpen, setIsSocialFeedOpen] = useState(false);
  const [socialSharePayload, setSocialSharePayload] = useState<{
    isOpen: boolean;
    memory?: ParkMemorySnapshot;
    voucher?: RedeemedPerkVoucher;
  }>({ isOpen: false });

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('disney_marvel_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Persist user profile
  useEffect(() => {
    try {
      localStorage.setItem('disney_marvel_user_profile', JSON.stringify(userProfile));
    } catch (e) {
      console.error(e);
    }
  }, [userProfile]);

  // Live periodic park fluctuation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const delta = Math.floor(Math.random() * 15) - 6;
        const nextAtt = Math.max(20000, Math.min(prev.maxCapacity, prev.attendance + delta));
        return {
          ...prev,
          attendance: nextAtt,
          turnstileEntryRate: Math.max(90, Math.min(240, prev.turnstileEntryRate + (Math.floor(Math.random() * 9) - 4))),
        };
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Ride dispatch handler
  const handleDispatchRide = (attractionId: string) => {
    setAttractions((prev) =>
      prev.map((a) => {
        if (a.id === attractionId) {
          const nextActive = a.activeVehicles >= a.maxVehicles ? 1 : a.activeVehicles + 1;
          const waitReduction = Math.max(5, a.waitTimeMinutes - 5);
          return {
            ...a,
            activeVehicles: nextActive,
            waitTimeMinutes: waitReduction,
            status: 'operational',
          };
        }
        return a;
      })
    );
  };

  // Toggle lightning lane
  const handleToggleLightningLane = (attractionId: string) => {
    setAttractions((prev) =>
      prev.map((a) => (a.id === attractionId ? { ...a, lightningLaneAvailable: !a.lightningLaneAvailable } : a))
    );
  };

  // Update ride status
  const handleUpdateRideStatus = (attractionId: string, status: Attraction['status']) => {
    setAttractions((prev) =>
      prev.map((a) => (a.id === attractionId ? { ...a, status } : a))
    );
  };

  // Weather update
  const handleUpdateWeather = (weather: ParkTelemetry['weather']) => {
    setTelemetry((prev) => {
      const nextTemp = weather === 'night_sparkle' ? 68 : weather === 'magic_hour' ? 74 : weather === 'rain_protocol' ? 65 : 78;
      const updatedForecast = prev.forecast ? prev.forecast.map((day, idx) => {
        if (idx === 0) {
          const conditionLabel = weather === 'sunny' ? 'Radiant Sunshine & Clear Skies' :
            weather === 'magic_hour' ? 'Warm & Golden Amber Sunset' :
            weather === 'night_sparkle' ? 'Crisp Twilight & Starlight' : 'Passing Afternoon Showers (Active Protocol)';
          const icon = weather === 'sunny' ? '☀️' : weather === 'magic_hour' ? '🌅' : weather === 'night_sparkle' ? '✨' : '🌧️';
          return {
            ...day,
            condition: weather,
            conditionLabel,
            icon,
            precipitationPct: weather === 'rain_protocol' ? 85 : 5,
            parkAdvisory: weather === 'rain_protocol' 
              ? 'Rain protocol active: Outdoor coasters on weather hold; high indoor dark ride and Pym Kitchen traffic.'
              : 'Optimal conditions across all outdoor and indoor lands; regular parade and fireworks schedule.',
          };
        }
        return day;
      }) : prev.forecast;

      return {
        ...prev,
        weather,
        temperatureF: nextTemp,
        forecast: updatedForecast,
        weatherForecast: updatedForecast,
      };
    });

    if (weather === 'rain_protocol') {
      setAttractions((prev) =>
        prev.map((a) => (a.type === 'roller_coaster' ? { ...a, status: 'weather_hold', waitTimeMinutes: 10 } : a))
      );
    } else {
      setAttractions((prev) =>
        prev.map((a) => (a.status === 'weather_hold' ? { ...a, status: 'operational', waitTimeMinutes: 45 } : a))
      );
    }
  };

  // Simulate crowd surge
  const handleSimulateCrowdSurge = () => {
    soundEffects.playMagicChime();
    setTelemetry((prev) => ({
      ...prev,
      attendance: Math.min(prev.maxCapacity, prev.attendance + 1850),
      turnstileEntryRate: 230,
    }));
    setAttractions((prev) =>
      prev.map((a) => ({ ...a, waitTimeMinutes: Math.min(120, a.waitTimeMinutes + 10) }))
    );
  };

  // Character status toggle
  const handleToggleCharacterStatus = (characterId: string) => {
    setCharacters((prev) =>
      prev.map((c) =>
        c.id === characterId
          ? {
              ...c,
              status: c.status === 'greeting' ? 'break' : 'greeting',
              currentLineMinutes: c.status === 'greeting' ? 0 : 30,
            }
          : c
      )
    );
  };

  // Resolve alert
  const handleResolveAlert = (alertId: string) => {
    soundEffects.playClick();
    setAlerts((prev) =>
      prev.map((alt) => (alt.id === alertId ? { ...alt, status: 'resolved' } : alt))
    );
  };

  // Trigger show/parade
  const handleTriggerShow = (showId: string) => {
    setParades((prev) =>
      prev.map((show) => {
        if (show.id === showId) {
          return {
            ...show,
            status: show.status === 'active_parade' ? 'scheduled' : 'active_parade',
            progressPercent: show.status === 'active_parade' ? 0 : 75,
          };
        }
        return show;
      })
    );
  };

  // Cart operations
  const handleAddToCart = (item: MerchandiseItem, customEngraving?: string) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id
            ? { ...ci, quantity: ci.quantity + 1, customEngraving: customEngraving || ci.customEngraving }
            : ci
        );
      }
      return [
        ...prev,
        {
          item,
          quantity: 1,
          customEngraving,
          deliveryOption: 'park_locker',
        },
      ];
    });
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((ci) => (ci.item.id === itemId ? { ...ci, quantity: newQty } : ci))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    soundEffects.playClick();
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // User Profile actions
  const handleToggleFavoriteAttraction = (attractionId: string) => {
    soundEffects.playClick();
    setUserProfile((prev) => {
      const exists = prev.favoriteAttractionIds.includes(attractionId);
      return {
        ...prev,
        favoriteAttractionIds: exists
          ? prev.favoriteAttractionIds.filter((id) => id !== attractionId)
          : [...prev.favoriteAttractionIds, attractionId],
      };
    });
  };

  const handleToggleFavoriteCharacter = (characterId: string) => {
    soundEffects.playClick();
    setUserProfile((prev) => {
      const exists = prev.favoriteCharacterIds.includes(characterId);
      return {
        ...prev,
        favoriteCharacterIds: exists
          ? prev.favoriteCharacterIds.filter((id) => id !== characterId)
          : [...prev.favoriteCharacterIds, characterId],
      };
    });
  };

  const handleToggleWishlist = (itemId: string) => {
    soundEffects.playClick();
    setUserProfile((prev) => {
      const exists = prev.wishlist.includes(itemId);
      return {
        ...prev,
        wishlist: exists
          ? prev.wishlist.filter((id) => id !== itemId)
          : [...prev.wishlist, itemId],
      };
    });
  };

  const handleUpdateUserProfile = (updated: Partial<UserProfileType>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  // Checkout completion -> Add to UserProfile pastPurchases & EARN LOYALTY POINTS!
  const handleCheckoutSuccess = (order: {
    orderId: string;
    items: CartItem[];
    total: number;
    delivery: DeliveryOption;
  }) => {
    const newRecord: OrderRecord = {
      orderId: order.orderId,
      date: 'Just Now',
      items: order.items,
      total: order.total,
      delivery: order.delivery,
      status: 'confirmed',
    };

    // Calculate loyalty points earned (10 points per dollar spent)
    const earnedPoints = Math.round(order.total * POINTS_PER_DOLLAR);
    const purchaseTx: LoyaltyTransaction = {
      id: 'tx_ord_' + order.orderId,
      date: 'Just Now',
      description: `Merchandise Purchase (Order #${order.orderId} - ${order.items.length} item${order.items.length > 1 ? 's' : ''})`,
      points: earnedPoints,
      type: 'merchandise',
    };

    setUserProfile((prev) => {
      const currentLifetime = prev.lifetimePoints ?? 2950;
      const currentPoints = prev.loyaltyPoints ?? 2450;
      const nextLifetime = currentLifetime + earnedPoints;
      const nextPoints = currentPoints + earnedPoints;
      const nextTier = calculateTier(nextLifetime);

      return {
        ...prev,
        loyaltyPoints: nextPoints,
        lifetimePoints: nextLifetime,
        loyaltyTier: nextTier,
        pastPurchases: [newRecord, ...prev.pastPurchases],
        loyaltyHistory: [purchaseTx, ...(prev.loyaltyHistory ?? [])],
      };
    });

    handleClearCart();
    setActiveTab('sailing');
  };

  const handleOpenSocialShare = (item?: ParkMemorySnapshot | RedeemedPerkVoucher) => {
    soundEffects.playMagicChime();
    if (!item) {
      setSocialSharePayload({ isOpen: true });
      return;
    }
    if ('imageUrl' in item) {
      setSocialSharePayload({ isOpen: true, memory: item as ParkMemorySnapshot });
    } else {
      setSocialSharePayload({ isOpen: true, voucher: item as RedeemedPerkVoucher });
    }
  };

  const handlePublishSocialPost = (post: SimulatedSocialPost) => {
    const existingPosts = userProfile.sharedSocialPosts || INITIAL_SIMULATED_SOCIAL_POSTS;
    const updatedPosts = [post, ...existingPosts];
    handleUpdateUserProfile({
      sharedSocialPosts: updatedPosts
    });
  };

  const handleUpdateSocialPost = (updatedPost: SimulatedSocialPost) => {
    const existingPosts = userProfile.sharedSocialPosts || INITIAL_SIMULATED_SOCIAL_POSTS;
    const nextPosts = existingPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p));
    handleUpdateUserProfile({
      sharedSocialPosts: nextPosts,
    });
  };

  const totalCartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* App Header with Live Loyalty Points & Reward Tier Status */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
        attendance={telemetry.attendance}
        maxCapacity={telemetry.maxCapacity}
        userAvatarUrl={userProfile.avatarUrl}
        userName={userProfile.displayName}
        wishlistCount={userProfile.wishlist.length}
        loyaltyPoints={userProfile.loyaltyPoints ?? 2450}
        loyaltyTier={userProfile.loyaltyTier ?? 'gold'}
        onOpenSocialFeed={() => setIsSocialFeedOpen(true)}
        onOpenSocialShare={() => handleOpenSocialShare()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* TAB: INTERACTIVE MAP */}
        {activeTab === 'map' && (
          <ParkMap
            lands={lands}
            attractions={attractions}
            onDispatchRide={handleDispatchRide}
            onToggleLightningLane={handleToggleLightningLane}
            onUpdateRideStatus={handleUpdateRideStatus}
            favoriteAttractionIds={userProfile.favoriteAttractionIds}
            onToggleFavoriteAttraction={handleToggleFavoriteAttraction}
            onNavigateToMerchStore={() => setActiveTab('merch')}
            onNavigateToMarvelSection={() => setActiveTab('marvel_toy_sailing')}
            onNavigateToTripPlanner={() => setActiveTab('trip_planner')}
          />
        )}

        {/* TAB: TRIP PLANNER VIEW */}
        {activeTab === 'trip_planner' && (
          <TripPlannerSection
            onNavigateToMap={(locId) => {
              soundEffects.playMagicChime();
              setActiveTab('map');
            }}
            onNavigateToMerch={() => {
              soundEffects.playMagicChime();
              setActiveTab('merch');
            }}
          />
        )}

        {/* TAB: DEDICATED MARVEL SUPERHERO TOY SAILING SECTION */}
        {activeTab === 'marvel_toy_sailing' && (
          <MarvelToySailingSection
            items={merchItems}
            onAddToCart={handleAddToCart}
            wishlistIds={userProfile.wishlist}
            onToggleWishlist={handleToggleWishlist}
            onOpenCart={() => setIsCartOpen(true)}
            onViewItem={(item) => {
              const currentViewed = userProfile.viewedStoreItemIds ?? [];
              if (!currentViewed.includes(item.id)) {
                handleUpdateUserProfile({
                  viewedStoreItemIds: [...currentViewed, item.id],
                });
              }
            }}
          />
        )}

        {/* TAB: KINGDOM MERCHANDISE STORE */}
        {activeTab === 'merch' && (
          <MerchandiseStore
            items={merchItems}
            onAddToCart={handleAddToCart}
            wishlistIds={userProfile.wishlist}
            onToggleWishlist={handleToggleWishlist}
            onNavigateToMarvelSection={() => setActiveTab('marvel_toy_sailing')}
          />
        )}

        {/* TAB: PARK COMMAND & OPERATIONS */}
        {activeTab === 'operations' && (
          <OperationsDashboard
            telemetry={telemetry}
            characters={characters}
            parades={parades}
            alerts={alerts}
            attractions={attractions}
            onUpdateWeather={handleUpdateWeather}
            onSimulateCrowdSurge={handleSimulateCrowdSurge}
            onToggleCharacterStatus={handleToggleCharacterStatus}
            onResolveAlert={handleResolveAlert}
            onTriggerShow={handleTriggerShow}
          />
        )}

        {/* TAB: SAILING CARGO TRACKING */}
        {activeTab === 'sailing' && (
          <SailingTrackingView />
        )}

        {/* TAB: USER PROFILE SYSTEM WITH LOYALTY POINTS TRACKING */}
        {activeTab === 'profile' && (
          <UserProfile
            user={userProfile}
            onUpdateUser={handleUpdateUserProfile}
            attractions={attractions}
            characters={characters}
            merchandiseCatalog={merchItems}
            onToggleFavoriteAttraction={handleToggleFavoriteAttraction}
            onToggleFavoriteCharacter={handleToggleFavoriteCharacter}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onNavigateToAttractionOnMap={(attractionId) => {
              soundEffects.playMagicChime();
              setActiveTab('map');
            }}
            onNavigateToRewardsMarket={() => {
              soundEffects.playMagicChime();
              setActiveTab('loyalty_market');
            }}
            onOpenSocialShare={handleOpenSocialShare}
            onOpenSocialFeed={() => setIsSocialFeedOpen(true)}
          />
        )}

        {/* TAB: LOYALTY REWARDS MARKET */}
        {activeTab === 'loyalty_market' && (
          <LoyaltyRewardsMarket
            user={userProfile}
            onUpdateUser={handleUpdateUserProfile}
            attractions={attractions}
            characters={characters}
            merchandiseCatalog={merchItems}
            onNavigateToAttractionOnMap={(attractionId) => {
              soundEffects.playMagicChime();
              setActiveTab('map');
            }}
            onNavigateToMerchStore={() => {
              soundEffects.playMagicChime();
              setActiveTab('marvel_toy_sailing');
            }}
            onNavigateToSailing={() => {
              soundEffects.playMagicChime();
              setActiveTab('sailing');
            }}
            onOpenSocialShare={handleOpenSocialShare}
            onOpenSocialFeed={() => setIsSocialFeedOpen(true)}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      {/* AI Park Genie & JARVIS Modal */}
      <AIConciergeModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />

      {/* Social Share Composer Modal */}
      <SocialShareModal
        isOpen={socialSharePayload.isOpen}
        onClose={() => setSocialSharePayload({ isOpen: false })}
        user={userProfile}
        memoryToShare={socialSharePayload.memory}
        voucherToShare={socialSharePayload.voucher}
        onPostPublished={handlePublishSocialPost}
        onViewSocialFeed={() => {
          setSocialSharePayload({ isOpen: false });
          setIsSocialFeedOpen(true);
        }}
      />

      {/* Live Guest Social Feed Modal */}
      <SocialFeedModal
        isOpen={isSocialFeedOpen}
        onClose={() => setIsSocialFeedOpen(false)}
        user={userProfile}
        posts={userProfile.sharedSocialPosts || INITIAL_SIMULATED_SOCIAL_POSTS}
        onUpdatePost={handleUpdateSocialPost}
        onOpenCreateShare={() => {
          setIsSocialFeedOpen(false);
          setSocialSharePayload({ isOpen: true });
        }}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>🏰 Disney WonderKingdom & Marvel Avengers Campus OS</span>
            <span>•</span>
            <span className="text-slate-400">Live Operating System & Marvel Superhero Toy Sailing Pavilion</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Walt Disney Imagineering</span>
            <span>•</span>
            <span>Stark Industries Applied Sciences</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
