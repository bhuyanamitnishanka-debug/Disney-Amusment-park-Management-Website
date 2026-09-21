import React, { useState } from 'react';
import { 
  LoyaltyReward, 
  RewardCategory, 
  RedeemedPerkVoucher, 
  UserProfile as UserProfileType, 
  LoyaltyTransaction,
  Attraction,
  CharacterGreeting,
  DailyParkChallenge,
  MerchandiseItem
} from '../types';
import { 
  REDEEMABLE_REWARDS, 
  LOYALTY_TIERS, 
  calculateTier, 
  getTierProgress, 
  POINTS_PER_ATTENDANCE_CHECKIN,
  DAILY_PARK_CHALLENGES,
  ALL_CHALLENGES_BONUS_POINTS
} from '../data/loyaltyData';
import { MERCHANDISE_CATALOG } from '../data/merchData';
import { DailyParkChallengesSection } from './DailyParkChallengesSection';
import { soundEffects } from '../services/audio';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Zap, 
  Crown, 
  Shield, 
  Gift, 
  Search, 
  Check, 
  Lock, 
  QrCode, 
  Barcode, 
  Clock, 
  Tag, 
  Ticket, 
  Heart, 
  ChevronRight, 
  ShoppingBag, 
  Star, 
  TrendingUp, 
  Flame, 
  Copy, 
  ExternalLink,
  Info,
  Calendar,
  Compass,
  Trophy,
  Target,
  CheckCircle2,
  Rocket,
  Camera,
  Utensils,
  Anchor,
  Eye,
  Award,
  RotateCcw,
  MapPin,
  Radio,
  Filter,
  PartyPopper,
  HelpCircle,
  AlertCircle,
  Share2
} from 'lucide-react';

interface LoyaltyRewardsMarketProps {
  user: UserProfileType;
  onUpdateUser: (updated: Partial<UserProfileType>) => void;
  attractions: Attraction[];
  characters: CharacterGreeting[];
  onNavigateToAttractionOnMap: (attractionId: string) => void;
  onNavigateToMerchStore: () => void;
  merchandiseCatalog?: MerchandiseItem[];
  onNavigateToSailing?: () => void;
  onOpenSocialShare?: (voucher?: RedeemedPerkVoucher) => void;
  onOpenSocialFeed?: () => void;
}

const CATEGORY_TABS: { id: RewardCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Perks', icon: '✨' },
  { id: 'fastpass', label: 'Instant Lightning Lane', icon: '⚡' },
  { id: 'meet_and_greet', label: 'VIP Character Meet & Greet', icon: '⭐' },
  { id: 'discount', label: 'Merchandise Discounts', icon: '🛍️' },
  { id: 'vip_access', label: 'VIP Park Access', icon: '👑' },
  { id: 'dining', label: 'Dining & Treats', icon: '🥨' },
];

export const LoyaltyRewardsMarket: React.FC<LoyaltyRewardsMarketProps> = ({
  user,
  onUpdateUser,
  attractions,
  characters,
  onNavigateToAttractionOnMap,
  onNavigateToMerchStore,
  merchandiseCatalog,
  onNavigateToSailing,
  onOpenSocialShare,
  onOpenSocialFeed,
}) => {
  const [activeMarketTab, setActiveMarketTab] = useState<'catalog' | 'challenges' | 'wallet'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAffordable, setOnlyAffordable] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'cost_asc' | 'cost_desc'>('popular');

  // Daily Challenge States
  const [activeChallengeCategory, setActiveChallengeCategory] = useState<'all' | 'ride' | 'store' | 'character' | 'dining' | 'exploration'>('all');
  const [isScanningSpaceMountain, setIsScanningSpaceMountain] = useState(false);
  const [inspectingMerchItem, setInspectingMerchItem] = useState<MerchandiseItem | null>(null);
  const [celebrationToast, setCelebrationToast] = useState<{ title: string; points: number; message: string } | null>(null);

  // Modal states for redemption
  const [selectedRewardToRedeem, setSelectedRewardToRedeem] = useState<LoyaltyReward | null>(null);
  const [selectedRideOption, setSelectedRideOption] = useState<string>('Space Mountain');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('1:30 PM - 2:00 PM (Afternoon Access)');
  const [selectedStoreOption, setSelectedStoreOption] = useState<string>('Avengers Campus Supply & Marvel Toy Depot');
  const [redeemedPassToShow, setRedeemedPassToShow] = useState<RedeemedPerkVoucher | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Fallback-safe user values
  const loyaltyPoints = user.loyaltyPoints ?? 2450;
  const lifetimePoints = user.lifetimePoints ?? 2950;
  const loyaltyTier = user.loyaltyTier ?? 'gold';
  const attendanceCheckIns = user.attendanceCheckIns ?? 8;
  const loyaltyHistory = user.loyaltyHistory ?? [];
  const redeemedVouchers = user.redeemedVouchers ?? [];
  const completedDailyChallengeIds = user.completedDailyChallengeIds ?? [];
  const viewedStoreItemIds = user.viewedStoreItemIds ?? [];

  const tierProgress = getTierProgress(lifetimePoints);
  const currentTierConfig = LOYALTY_TIERS[loyaltyTier] || LOYALTY_TIERS.gold;

  const activeVouchersCount = redeemedVouchers.filter((v) => v.status === 'active').length;

  // Daily Challenges Tracking Metrics
  const completedChallengesCount = DAILY_PARK_CHALLENGES.filter((c) =>
    completedDailyChallengeIds.includes(c.id)
  ).length;
  const allChallengesCompleted = completedChallengesCount === DAILY_PARK_CHALLENGES.length;
  const isVaultClaimed = completedDailyChallengeIds.includes('daily_vault_bonus');

  const totalDailyPointsEarned =
    DAILY_PARK_CHALLENGES.filter((c) => completedDailyChallengeIds.includes(c.id)).reduce(
      (acc, c) => acc + c.pointsReward,
      0
    ) + (isVaultClaimed ? ALL_CHALLENGES_BONUS_POINTS : 0);

  const totalDailyPointsPossible =
    DAILY_PARK_CHALLENGES.reduce((acc, c) => acc + c.pointsReward, 0) + ALL_CHALLENGES_BONUS_POINTS;

  // Space Mountain attraction info
  const spaceMountainAttraction = attractions.find(
    (a) => a.id === 'space_mountain' || a.id.toLowerCase().includes('space')
  );

  // Character greeting info for Avengers Campus
  const ironManGreeting = characters.find(
    (c) => c.name.toLowerCase().includes('iron man') || c.name.toLowerCase().includes('tony stark')
  );

  // Featured merchandise for quick inspect
  const catalogSource =
    merchandiseCatalog && merchandiseCatalog.length > 0 ? merchandiseCatalog : MERCHANDISE_CATALOG;
  const featuredStoreItems = catalogSource
    .filter((item) => item.universe === 'marvel' || item.isSailingVessel)
    .slice(0, 4);

  // Filter rewards
  const filteredRewards = REDEEMABLE_REWARDS.filter((reward) => {
    if (selectedCategory !== 'all' && reward.category !== selectedCategory) {
      return false;
    }
    if (onlyAffordable && reward.cost > loyaltyPoints) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = reward.title.toLowerCase().includes(q);
      const matchDesc = reward.description.toLowerCase().includes(q);
      const matchCategory = reward.category.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchCategory;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'popular') {
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return a.cost - b.cost;
    }
    if (sortBy === 'cost_asc') return a.cost - b.cost;
    if (sortBy === 'cost_desc') return b.cost - a.cost;
    return 0;
  });

  // Daily check-in quick boost
  const handleDailyCheckIn = () => {
    soundEffects.playFireworksBoom();
    soundEffects.playMagicChime();

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#ec4899', '#ffffff'],
    });

    const ptsEarned = POINTS_PER_ATTENDANCE_CHECKIN;
    const nextPoints = loyaltyPoints + ptsEarned;
    const nextLifetime = lifetimePoints + ptsEarned;
    const nextTier = calculateTier(nextLifetime);
    const nextCheckIns = attendanceCheckIns + 1;

    const newTx: LoyaltyTransaction = {
      id: 'tx_att_' + Date.now(),
      date: 'Just Now',
      description: `Park Attendance Daily Check-in (+${ptsEarned} pts)`,
      points: ptsEarned,
      type: 'attendance',
    };

    onUpdateUser({
      loyaltyPoints: nextPoints,
      lifetimePoints: nextLifetime,
      loyaltyTier: nextTier,
      attendanceCheckIns: nextCheckIns,
      lastAttendanceDate: 'Today',
      loyaltyHistory: [newTx, ...loyaltyHistory],
    });
  };

  // Complete a daily park challenge
  const handleCompleteChallenge = (challengeId: string, customMessage?: string) => {
    const challenge = DAILY_PARK_CHALLENGES.find((c) => c.id === challengeId);
    if (!challenge) return;
    if (completedDailyChallengeIds.includes(challengeId)) return;

    soundEffects.playFireworksBoom();
    soundEffects.playMagicChime();

    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#ffffff'],
    });

    const ptsEarned = challenge.pointsReward;
    const nextPoints = loyaltyPoints + ptsEarned;
    const nextLifetime = lifetimePoints + ptsEarned;
    const nextTier = calculateTier(nextLifetime);

    const newTx: LoyaltyTransaction = {
      id: 'tx_chal_' + Date.now(),
      date: 'Just Now',
      description: `🎯 Daily Challenge Completed: ${challenge.title}`,
      points: ptsEarned,
      type: 'bonus',
    };

    const nextCompleted = [...completedDailyChallengeIds, challengeId];

    onUpdateUser({
      loyaltyPoints: nextPoints,
      lifetimePoints: nextLifetime,
      loyaltyTier: nextTier,
      completedDailyChallengeIds: nextCompleted,
      loyaltyHistory: [newTx, ...loyaltyHistory],
    });

    setCelebrationToast({
      title: challenge.title,
      points: ptsEarned,
      message: customMessage || `Earned +${ptsEarned} Loyalty Points!`,
    });

    setTimeout(() => {
      setCelebrationToast(null);
    }, 4500);
  };

  // Specific handler for Space Mountain Check-In
  const handleSpaceMountainCheckIn = () => {
    if (completedDailyChallengeIds.includes('challenge_space_mountain')) return;
    setIsScanningSpaceMountain(true);
    soundEffects.playClick();

    setTimeout(() => {
      setIsScanningSpaceMountain(false);
      handleCompleteChallenge(
        'challenge_space_mountain',
        'MagicPass GPS beacon confirmed at Space Mountain Tomorrowland launch bay!'
      );
    }, 850);
  };

  // Specific handler for Inspecting Store Toys
  const handleInspectStoreItem = (item: MerchandiseItem) => {
    soundEffects.playClick();
    setInspectingMerchItem(item);

    const currentViewed = user.viewedStoreItemIds ?? [];
    if (!currentViewed.includes(item.id)) {
      const updatedViewed = [...currentViewed, item.id];
      onUpdateUser({
        viewedStoreItemIds: updatedViewed,
      });

      if (
        updatedViewed.length >= 3 &&
        !completedDailyChallengeIds.includes('challenge_view_store_items')
      ) {
        soundEffects.playMagicChime();
        setCelebrationToast({
          title: 'Store Inspection Complete (3/3)',
          points: 100,
          message: 'Ready to claim +100 Loyalty Points for viewing 3 store items!',
        });
      }
    }
  };

  // Specific handler for Claiming Store Challenge
  const handleClaimStoreChallenge = () => {
    if (viewedStoreItemIds.length < 3) {
      soundEffects.playClick();
      return;
    }
    handleCompleteChallenge(
      'challenge_view_store_items',
      `Inspected ${viewedStoreItemIds.length} store items! +100 Loyalty Points awarded!`
    );
  };

  // Claim Grand All-Challenges Vault Bonus (+250 points)
  const handleClaimVaultBonus = () => {
    if (!allChallengesCompleted || isVaultClaimed) return;

    soundEffects.playFireworksBoom();
    soundEffects.playMagicChime();

    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#fbbf24', '#ffffff', '#ef4444', '#3b82f6'],
    });

    const ptsEarned = ALL_CHALLENGES_BONUS_POINTS;
    const nextPoints = loyaltyPoints + ptsEarned;
    const nextLifetime = lifetimePoints + ptsEarned;
    const nextTier = calculateTier(nextLifetime);

    const newTx: LoyaltyTransaction = {
      id: 'tx_vault_' + Date.now(),
      date: 'Just Now',
      description: `🏆 Grand Daily Park Vault Master Bonus Claimed`,
      points: ptsEarned,
      type: 'bonus',
    };

    onUpdateUser({
      loyaltyPoints: nextPoints,
      lifetimePoints: nextLifetime,
      loyaltyTier: nextTier,
      completedDailyChallengeIds: [...completedDailyChallengeIds, 'daily_vault_bonus'],
      loyaltyHistory: [newTx, ...loyaltyHistory],
    });

    setCelebrationToast({
      title: 'Grand Vault Master Bonus',
      points: ptsEarned,
      message: 'All daily park challenges cleared! Stark Vault unlocked with +250 points!',
    });

    setTimeout(() => {
      setCelebrationToast(null);
    }, 5000);
  };

  // Open redemption modal
  const handleOpenRedeemModal = (reward: LoyaltyReward) => {
    if (loyaltyPoints < reward.cost) {
      soundEffects.playClick();
      return;
    }
    soundEffects.playMagicChime();
    setSelectedRewardToRedeem(reward);
    if (reward.category === 'fastpass') {
      setSelectedRideOption('Space Mountain Coaster');
    } else if (reward.category === 'meet_and_greet') {
      setSelectedTimeSlot('2:00 PM - 2:30 PM (Stark Innovation Hangar)');
    } else {
      setSelectedStoreOption('Avengers Campus Supply & Marvel Toy Depot');
    }
  };

  // Confirm redemption and generate pass voucher
  const handleConfirmRedemption = () => {
    if (!selectedRewardToRedeem) return;
    const reward = selectedRewardToRedeem;

    if (loyaltyPoints < reward.cost) return;

    soundEffects.playFireworksBoom();
    soundEffects.playMagicChime();

    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'],
    });

    const prefix = 
      reward.category === 'fastpass' ? 'LL-PASS' :
      reward.category === 'meet_and_greet' ? 'VIP-MEET' :
      reward.category === 'discount' ? 'DISC' : 'PERK';
    const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    const voucherCode = `${prefix}-${randomCode}-${Math.floor(100 + Math.random() * 900)}`;

    let selectedDetail = '';
    let instructionsText = '';

    if (reward.category === 'fastpass') {
      selectedDetail = `Attraction: ${selectedRideOption}`;
      instructionsText = `Scan this digital pass at the Lightning Lane touchpoint entrance of ${selectedRideOption}. Cast Member verification enabled.`;
    } else if (reward.category === 'meet_and_greet') {
      selectedDetail = `Session: ${selectedTimeSlot}`;
      instructionsText = `Present this pass at the VIP Guest Concierge podium 10 minutes before your scheduled window. Includes digital PhotoPass downloads.`;
    } else if (reward.category === 'discount') {
      selectedDetail = `Location: ${selectedStoreOption}`;
      instructionsText = `Show this discount barcode to the Cast Member cashier at checkout or enter the code during in-app mobile checkout.`;
    } else {
      selectedDetail = 'WonderKingdom Park Services';
      instructionsText = 'Scan or present barcode to any guest relations Cast Member or participating location.';
    }

    const newVoucher: RedeemedPerkVoucher = {
      id: 'voucher_' + Date.now(),
      rewardId: reward.id,
      title: reward.title,
      category: reward.category,
      icon: reward.icon,
      cost: reward.cost,
      redeemedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      expiresAt: '11:59 PM Today',
      code: voucherCode,
      barcode: `*${voucherCode.replace(/-/g, '')}*`,
      status: 'active',
      instructions: instructionsText,
      selectedOption: selectedDetail,
    };

    const nextPoints = loyaltyPoints - reward.cost;
    const newTx: LoyaltyTransaction = {
      id: 'tx_red_' + Date.now(),
      date: 'Just Now',
      description: `Redeemed: ${reward.title} (${voucherCode})`,
      points: -reward.cost,
      type: 'redeem',
    };

    onUpdateUser({
      loyaltyPoints: nextPoints,
      loyaltyHistory: [newTx, ...loyaltyHistory],
      redeemedVouchers: [newVoucher, ...redeemedVouchers],
    });

    setSelectedRewardToRedeem(null);
    setRedeemedPassToShow(newVoucher);
    setActiveMarketTab('wallet');
  };

  // Mark voucher as used / redeemed
  const handleMarkVoucherUsed = (voucherId: string) => {
    soundEffects.playClick();
    const updated = redeemedVouchers.map((v) =>
      v.id === voucherId ? { ...v, status: 'used' as const } : v
    );
    onUpdateUser({
      redeemedVouchers: updated,
    });
    if (redeemedPassToShow?.id === voucherId) {
      setRedeemedPassToShow({ ...redeemedPassToShow, status: 'used' });
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    soundEffects.playClick();
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* HERO BANNER: LOYALTY REWARDS MARKET */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                <span>Loyalty Rewards Market</span>
              </span>
              <span className={`px-2.5 py-1 rounded-full bg-slate-950/80 border ${currentTierConfig.borderColor} ${currentTierConfig.color} text-xs font-bold flex items-center gap-1`}>
                <span>{currentTierConfig.badgeEmoji}</span>
                <span>{currentTierConfig.title} Operative</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Exchange Points for Exclusive <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-amber-200">Park Perks & FastPasses</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Redeem your loyalty points for Instant Lightning Lane line skips, VIP Character Meet & Greets with Tony Stark & Sorcerer Mickey, and 25% merchandise discounts across Disney WonderKingdom.
            </p>
          </div>

          {/* Points Balance & Quick Actions Card */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-4 bg-slate-950/70 p-5 rounded-2xl border border-amber-500/40 shadow-inner">
            <div className="text-center sm:text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Available Loyalty Balance
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-amber-300 flex items-center justify-center sm:justify-end gap-1.5">
                <Sparkles className="w-6 h-6 text-amber-400" />
                <span>{loyaltyPoints.toLocaleString()}</span>
                <span className="text-sm text-amber-400/80 font-sans font-medium">pts</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Lifetime Earned: <strong className="text-slate-200">{lifetimePoints.toLocaleString()} pts</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="market-quick-checkin-btn"
                onClick={handleDailyCheckIn}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                title="Log daily park attendance visit to earn +150 points"
              >
                <span>🏰</span>
                <span>Check In (+150 pts)</span>
              </button>

              <button
                id="market-view-challenges-btn"
                onClick={() => {
                  soundEffects.playMagicChime();
                  setActiveMarketTab('challenges');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeMarketTab === 'challenges'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black'
                    : 'bg-slate-900 hover:bg-slate-800 text-emerald-300 border-emerald-500/40'
                }`}
                title="View today's park challenges to earn bonus loyalty points"
              >
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>Daily Quests</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-emerald-400 text-[10px] font-bold">
                  {completedChallengesCount}/{DAILY_PARK_CHALLENGES.length}
                </span>
              </button>

              <button
                id="market-view-wallet-btn"
                onClick={() => {
                  soundEffects.playClick();
                  setActiveMarketTab(activeMarketTab === 'wallet' ? 'catalog' : 'wallet');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeMarketTab === 'wallet'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                <Ticket className="w-4 h-4 text-amber-400" />
                <span>My Passes</span>
                {activeVouchersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {activeVouchersCount}
                  </span>
                )}
              </button>

              {onOpenSocialFeed && (
                <button
                  id="market-social-feed-btn"
                  onClick={() => {
                    soundEffects.playMagicChime();
                    onOpenSocialFeed();
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap bg-slate-900 hover:bg-slate-850 text-cyan-300 border-cyan-500/40"
                  title="View fellow park guests' loyalty redemptions on the social feed"
                >
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <span>Social Feed</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Mini Tier Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Tier Status: <strong className={currentTierConfig.color}>{currentTierConfig.title}</strong></span>
            {tierProgress.nextTier && (
              <span className="text-slate-400">
                • {tierProgress.pointsToNext.toLocaleString()} pts to {tierProgress.nextTier.title} {tierProgress.nextTier.badgeEmoji}
              </span>
            )}
          </div>

          <div className="w-full sm:w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${tierProgress.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* VIEW SWITCHER: CATALOG VS DAILY CHALLENGES VS WALLET */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="tab-market-catalog"
            onClick={() => {
              soundEffects.playClick();
              setActiveMarketTab('catalog');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeMarketTab === 'catalog'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Perks Market Catalog</span>
          </button>

          <button
            id="tab-market-challenges"
            onClick={() => {
              soundEffects.playMagicChime();
              setActiveMarketTab('challenges');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              activeMarketTab === 'challenges'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Daily Park Challenges</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                allChallengesCompleted
                  ? 'bg-amber-400 text-slate-950 font-black animate-pulse'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {completedChallengesCount}/{DAILY_PARK_CHALLENGES.length}
            </span>
          </button>

          <button
            id="tab-market-wallet"
            onClick={() => {
              soundEffects.playMagicChime();
              setActiveMarketTab('wallet');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              activeMarketTab === 'wallet'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>My Redeemed Digital Passes ({redeemedVouchers.length})</span>
            {activeVouchersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[10px] font-bold animate-pulse">
                {activeVouchersCount} Active
              </span>
            )}
          </button>
        </div>

        {/* Quick helper shortcuts */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => onNavigateToMerchStore()}
            className="text-slate-400 hover:text-purple-300 flex items-center gap-1 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
            <span>Spend in Store</span>
          </button>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* VIEW 1: CATALOG OF PERKS FOR EXCHANGE */}
      {/* ======================================================================= */}
      {activeMarketTab === 'catalog' && (
        <div className="space-y-6">

          {/* Daily Challenges Quick Spotlight Strip */}
          <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 p-4 sm:p-5 rounded-2xl border border-emerald-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl shadow-emerald-950/20">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0 shadow-inner">
                <Target className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                    <span>🎯</span>
                    <span>Today's Daily Park Challenges</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                    {completedChallengesCount} of {DAILY_PARK_CHALLENGES.length} Completed
                  </span>
                  <span className="text-[11px] text-amber-400 font-mono font-bold">
                    +{totalDailyPointsEarned} pts earned
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Earn bonus loyalty points daily by checking in to Space Mountain, inspecting store merchandise, and meeting heroes!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
              {!completedDailyChallengeIds.includes('challenge_space_mountain') && (
                <button
                  onClick={handleSpaceMountainCheckIn}
                  disabled={isScanningSpaceMountain}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/20 active:scale-95 transition-all"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>{isScanningSpaceMountain ? 'Scanning...' : 'Check In Space Mtn (+120)'}</span>
                </button>
              )}

              <button
                onClick={() => {
                  soundEffects.playMagicChime();
                  setActiveMarketTab('challenges');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/30 active:scale-95 transition-all"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Open Challenges ({completedChallengesCount}/{DAILY_PARK_CHALLENGES.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          {/* Filter Bar & Search Controls */}
          <div className="space-y-4">
            
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORY_TABS.map((tab) => {
                const isSelected = selectedCategory === tab.id;
                const count = tab.id === 'all' 
                  ? REDEEMABLE_REWARDS.length 
                  : REDEEMABLE_REWARDS.filter((r) => r.category === tab.id).length;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedCategory(tab.id);
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                      isSelected ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search, Affordability Checkbox & Sort */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              
              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search perks (e.g. Lightning Lane, 25%, Iron Man)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end text-xs">
                
                {/* Affordable only toggle */}
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyAffordable}
                    onChange={(e) => {
                      soundEffects.playClick();
                      setOnlyAffordable(e.target.checked);
                    }}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700 focus:ring-0 focus:ring-offset-0"
                  />
                  <span>Affordable with my balance</span>
                </label>

                {/* Sort Selector */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
                >
                  <option value="popular">Recommended / Featured</option>
                  <option value="cost_asc">Points: Low to High</option>
                  <option value="cost_desc">Points: High to Low</option>
                </select>
              </div>

            </div>
          </div>

          {/* PERKS CARDS GRID */}
          {filteredRewards.length === 0 ? (
            <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 space-y-3">
              <div className="text-4xl">🎟️</div>
              <h3 className="text-base font-bold text-white">No perks match your current filters</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try clearing your search query or unchecking "Affordable with my balance" to preview all loyalty perks.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setOnlyAffordable(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRewards.map((reward) => {
                const canAfford = loyaltyPoints >= reward.cost;
                const pointsNeeded = reward.cost - loyaltyPoints;

                // Category theme accent
                const categoryColor = 
                  reward.category === 'fastpass' ? 'border-amber-500/40 bg-amber-500/10 text-amber-300' :
                  reward.category === 'meet_and_greet' ? 'border-purple-500/40 bg-purple-500/10 text-purple-300' :
                  reward.category === 'discount' ? 'border-red-500/40 bg-red-500/10 text-red-300' :
                  reward.category === 'vip_access' ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' :
                  'border-emerald-500/40 bg-emerald-500/10 text-emerald-300';

                return (
                  <div
                    key={reward.id}
                    className={`relative rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                      canAfford
                        ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-slate-800 hover:border-amber-500/60 shadow-xl hover:shadow-amber-500/10'
                        : 'bg-slate-900/60 border-slate-850 opacity-80 hover:opacity-95'
                    }`}
                  >
                    {/* Top Tag / Badge */}
                    {reward.badge && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <Flame className="w-3 h-3 text-red-700" />
                          <span>{reward.badge}</span>
                        </span>
                      </div>
                    )}

                    {/* Card Content Header */}
                    <div className="p-5 sm:p-6 space-y-4">
                      
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-3xl shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform">
                          {reward.icon}
                        </div>

                        <div className="space-y-1 flex-1 pr-12">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border inline-block ${categoryColor}`}>
                            {reward.category.replace('_', ' ')}
                          </span>
                          <h3 className="text-base font-bold text-white leading-snug group-hover:text-amber-300 transition-colors">
                            {reward.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {reward.description}
                      </p>

                      {/* Perk Highlights Checklist */}
                      {reward.perkHighlights && reward.perkHighlights.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs">
                          {reward.perkHighlights.map((hl, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-slate-300 text-[11px] leading-tight">
                              <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                              <span>{hl}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer: Cost & Exchange CTA */}
                    <div className="p-5 sm:p-6 pt-3 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Perk Cost
                        </span>
                        <div className="text-xl font-black font-mono text-amber-300 flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>{reward.cost}</span>
                          <span className="text-xs text-amber-400/80 font-sans font-medium">pts</span>
                        </div>
                      </div>

                      <button
                        id={`exchange-perk-btn-${reward.id}`}
                        onClick={() => handleOpenRedeemModal(reward)}
                        disabled={!canAfford}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 whitespace-nowrap ${
                          canAfford
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-amber-500/20'
                            : 'bg-slate-800/80 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? (
                          <>
                            <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                            <span>Exchange Perk</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5 text-slate-500" />
                            <span>Need {pointsNeeded} pts</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* HOW TO EARN MORE POINTS CALLOUT */}
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-6 sm:p-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <span>How to Rapidly Accumulate Loyalty Points</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Stack points across everyday park activities and merchandise toy purchases
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDailyCheckIn}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <span>🏰</span>
                  <span>Daily Check-in (+150 pts)</span>
                </button>

                <button
                  onClick={() => onNavigateToMerchStore()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Shop Toys (10 pts/$1)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-xl">🏰</span>
                <h4 className="text-xs font-bold text-white mt-1.5">Turnstile Check-In</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">+150 points for every daily visit logged at WonderKingdom or Avengers Campus.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-xl">🛍️</span>
                <h4 className="text-xs font-bold text-white mt-1.5">Merchandise Spending</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Earn 10 points for every $1 spent on toys, sailing models, and collector apparel.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-xl">👑</span>
                <h4 className="text-xs font-bold text-white mt-1.5">Tier Upgrades</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Reach Gold and Platinum tiers to unlock automated 10-15% retail discounts and VIP passes.</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================================= */}
      {/* VIEW 2: DAILY PARK CHALLENGES */}
      {/* ======================================================================= */}
      {activeMarketTab === 'challenges' && (
        <DailyParkChallengesSection
          user={user}
          attractions={attractions}
          characters={characters}
          merchandiseCatalog={merchandiseCatalog}
          onNavigateToAttractionOnMap={onNavigateToAttractionOnMap}
          onNavigateToMerchStore={onNavigateToMerchStore}
          onNavigateToSailing={onNavigateToSailing}
          onCompleteChallenge={handleCompleteChallenge}
          onInspectStoreItem={handleInspectStoreItem}
          onClaimStoreChallenge={handleClaimStoreChallenge}
          onSpaceMountainCheckIn={handleSpaceMountainCheckIn}
          onClaimVaultBonus={handleClaimVaultBonus}
          isScanningSpaceMountain={isScanningSpaceMountain}
        />
      )}

      {/* ======================================================================= */}
      {/* VIEW 3: MY REDEEMED DIGITAL PASSES WALLET */}
      {/* ======================================================================= */}
      {activeMarketTab === 'wallet' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Ticket className="w-5 h-5 text-amber-400" />
                <span>My Redeemed Digital Perk Passes</span>
              </h2>
              <p className="text-xs text-slate-400">
                Present these digital passes and barcodes to Disney and Avengers Campus Cast Members at attraction entrances and store registers.
              </p>
            </div>

            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveMarketTab('catalog');
              }}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Gift className="w-4 h-4" />
              <span>Redeem More Perks</span>
            </button>
          </div>

          {redeemedVouchers.length === 0 ? (
            <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 space-y-4">
              <div className="text-5xl">🎟️</div>
              <h3 className="text-lg font-bold text-white">Your Perk Wallet is Currently Empty</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                You haven't exchanged any loyalty points for digital passes yet. Browse the market to get an Instant Lightning Lane, VIP Character greeting, or 25% discount voucher!
              </p>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setActiveMarketTab('catalog');
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
              >
                Browse Rewards Market
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {redeemedVouchers.map((voucher) => {
                const isActive = voucher.status === 'active';

                return (
                  <div
                    key={voucher.id}
                    className={`relative rounded-3xl border overflow-hidden transition-all shadow-xl flex flex-col justify-between ${
                      isActive
                        ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border-amber-500/40'
                        : 'bg-slate-900/60 border-slate-800 opacity-60'
                    }`}
                  >
                    {/* Holographic Header Bar */}
                    <div className="bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{voucher.icon}</span>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                            Disney • Marvel Official Digital Pass
                          </span>
                          <h4 className="text-sm font-bold text-white line-clamp-1">{voucher.title}</h4>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}>
                        {isActive ? 'ACTIVE • READY TO SCAN' : 'REDEEMED'}
                      </span>
                    </div>

                    {/* Voucher Body Details */}
                    <div className="p-5 space-y-4 flex-1">
                      
                      {voucher.selectedOption && (
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-amber-300 flex items-center gap-2">
                          <Compass className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <span>{voucher.selectedOption}</span>
                        </div>
                      )}

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {voucher.instructions}
                      </p>

                      {/* Barcode & Pass Code Simulation */}
                      <div className="p-4 rounded-2xl bg-white text-slate-950 text-center space-y-2 shadow-inner">
                        <div className="font-mono text-2xl tracking-[0.25em] font-black py-1 select-none overflow-x-auto">
                          {voucher.barcode}
                        </div>
                        <div className="flex items-center justify-center gap-2 pt-1 border-t border-slate-200">
                          <span className="text-xs font-mono font-bold tracking-widest text-slate-800">
                            {voucher.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(voucher.code, voucher.id)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                            title="Copy code"
                          >
                            {copiedCodeId === voucher.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Issued: {voucher.redeemedAt}</span>
                        <span>Expires: <strong className="text-amber-300">{voucher.expiresAt}</strong></span>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setRedeemedPassToShow(voucher)}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Enlarge</span>
                        </button>

                        {onOpenSocialShare && (
                          <button
                            onClick={() => {
                              soundEffects.playMagicChime();
                              onOpenSocialShare(voucher);
                            }}
                            className="px-3 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-cyan-500/30 transition-colors"
                            title="Share this Loyalty Perk Redemption to MagicGram, StarkNet, or KingdomBook"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share</span>
                          </button>
                        )}
                      </div>

                      {isActive ? (
                        <button
                          onClick={() => handleMarkVoucherUsed(voucher.id)}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          title="Simulate Cast Member scanning this pass at ride entrance"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Cast Member Scanned</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 font-semibold italic">
                          Pass already redeemed
                        </span>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: REDEEM PERK CONFIRMATION & CUSTOMIZATION */}
      {/* ======================================================================= */}
      {selectedRewardToRedeem && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 rounded-2xl bg-slate-950 border border-slate-800">
                  {selectedRewardToRedeem.icon}
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Confirm Points Exchange
                  </span>
                  <h3 className="text-lg font-bold text-white">{selectedRewardToRedeem.title}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedRewardToRedeem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedRewardToRedeem.description}
              </p>

              {/* Specific Customization based on category */}
              {selectedRewardToRedeem.category === 'fastpass' && (
                <div className="space-y-2 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-amber-300 block flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Select Priority Attraction for Instant Lightning Lane:</span>
                  </label>
                  <select
                    value={selectedRideOption}
                    onChange={(e) => setSelectedRideOption(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400"
                  >
                    <option value="Space Mountain Coaster">Space Mountain Coaster (Tomorrowland)</option>
                    <option value="Avengers Quinjet Flight Experience">Flight of the Quinjet (Avengers Campus)</option>
                    <option value="Pirates of the Caribbean Sailing Lagoon">Pirates Sailing Lagoon (Adventure Pier)</option>
                    <option value="Guardians of the Galaxy: Cosmic Rewind">Guardians: Cosmic Rewind (Marvel Ops)</option>
                    <option value="Big Thunder Mountain Railroad">Big Thunder Mountain (Frontierland)</option>
                  </select>
                </div>
              )}

              {selectedRewardToRedeem.category === 'meet_and_greet' && (
                <div className="space-y-2 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-purple-300 block flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5" />
                    <span>Select VIP Character Encounter Session Window:</span>
                  </label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-purple-400"
                  >
                    <option value="11:30 AM - 12:00 PM (Morning Private Session)">11:30 AM - 12:00 PM (Morning Private Session)</option>
                    <option value="2:00 PM - 2:30 PM (Stark Innovation Hangar)">2:00 PM - 2:30 PM (Stark Innovation Hangar)</option>
                    <option value="4:30 PM - 5:00 PM (Avengers Campus Hangar)">4:30 PM - 5:00 PM (Avengers Campus Hangar)</option>
                    <option value="6:30 PM - 7:00 PM (Twilight VIP Session)">6:30 PM - 7:00 PM (Twilight VIP Session)</option>
                  </select>
                </div>
              )}

              {selectedRewardToRedeem.category === 'discount' && (
                <div className="space-y-2 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-red-300 block flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Redemption Venue:</span>
                  </label>
                  <select
                    value={selectedStoreOption}
                    onChange={(e) => setSelectedStoreOption(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-red-400"
                  >
                    <option value="Avengers Campus Supply & Marvel Toy Depot">Avengers Campus Supply & Marvel Toy Depot</option>
                    <option value="In-App Mobile Toy Cart & Hydrofoil Shipping">In-App Mobile Toy Cart & Express Delivery</option>
                    <option value="Emporium on Main Street U.S.A.">Emporium on Main Street U.S.A.</option>
                    <option value="Collector's Warehouse & Pin Trading Post">Collector's Warehouse & Pin Trading Post</option>
                  </select>
                </div>
              )}

              {/* Point Deduction Ledger Math */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Current Points Balance:</span>
                  <span className="font-mono font-bold text-white">{loyaltyPoints.toLocaleString()} pts</span>
                </div>
                <div className="flex justify-between text-xs text-rose-400 font-bold">
                  <span>Perk Exchange Cost:</span>
                  <span className="font-mono">-{selectedRewardToRedeem.cost} pts</span>
                </div>
                <div className="flex justify-between text-xs text-amber-300 font-black pt-2 border-t border-slate-800">
                  <span>Remaining Balance:</span>
                  <span className="font-mono">{(loyaltyPoints - selectedRewardToRedeem.cost).toLocaleString()} pts</span>
                </div>
              </div>

              {selectedRewardToRedeem.terms && (
                <p className="text-[11px] text-slate-400 italic">
                  * Note: {selectedRewardToRedeem.terms}
                </p>
              )}
            </div>

            {/* Modal Action Buttons */}
            <div className="p-6 bg-slate-950/80 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedRewardToRedeem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                id="confirm-points-exchange-submit-btn"
                onClick={handleConfirmRedemption}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Confirm Exchange ({selectedRewardToRedeem.cost} pts)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: FULL SCREEN PASS / BARCODE ENLARGEMENT */}
      {/* ======================================================================= */}
      {redeemedPassToShow && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border-2 border-amber-400 shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{redeemedPassToShow.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-400">Official Park Pass</span>
                  <h3 className="text-base font-bold text-white">{redeemedPassToShow.title}</h3>
                </div>
              </div>

              <button
                onClick={() => setRedeemedPassToShow(null)}
                className="text-slate-400 hover:text-white font-bold text-xl p-1"
              >
                ✕
              </button>
            </div>

            {redeemedPassToShow.selectedOption && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300 font-semibold">
                {redeemedPassToShow.selectedOption}
              </div>
            )}

            {/* Giant High-Contrast Barcode for Scanner Touchpoints */}
            <div className="p-6 rounded-2xl bg-white text-slate-950 text-center space-y-3 shadow-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                Hold Screen Near Touchpoint Scanner
              </span>

              <div className="font-mono text-3xl sm:text-4xl tracking-[0.2em] font-black py-2 select-none">
                {redeemedPassToShow.barcode}
              </div>

              <div className="text-sm font-mono font-black tracking-widest text-slate-900 bg-slate-100 py-1.5 rounded-lg">
                {redeemedPassToShow.code}
              </div>
            </div>

            <p className="text-xs text-slate-300 text-center leading-relaxed">
              {redeemedPassToShow.instructions}
            </p>

            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
              <span>Status: <strong className={redeemedPassToShow.status === 'active' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {redeemedPassToShow.status.toUpperCase()}
              </strong></span>
              <span>Valid: <strong className="text-amber-300">{redeemedPassToShow.expiresAt}</strong></span>
            </div>

            <div className="flex items-center gap-3 pt-2 flex-wrap sm:flex-nowrap">
              {redeemedPassToShow.status === 'active' && (
                <button
                  onClick={() => handleMarkVoucherUsed(redeemedPassToShow.id)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark as Scanned</span>
                </button>
              )}

              {onOpenSocialShare && (
                <button
                  onClick={() => {
                    const pass = redeemedPassToShow;
                    setRedeemedPassToShow(null);
                    soundEffects.playMagicChime();
                    onOpenSocialShare(pass);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                  title="Share this redeemed VIP pass to MagicGram, StarkNet, or KingdomBook"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Pass</span>
                </button>
              )}

              <button
                onClick={() => setRedeemedPassToShow(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* QUICK-INSPECT MERCHANDISE ITEM MODAL */}
      {inspectingMerchItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-rose-500/40 p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40 uppercase tracking-wider">
                  Store Item Inspected
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  {inspectingMerchItem.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {inspectingMerchItem.category} • Character: {inspectingMerchItem.character}
                </p>
              </div>

              <button
                onClick={() => setInspectingMerchItem(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={inspectingMerchItem.image}
                alt={inspectingMerchItem.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700 text-xs font-bold text-amber-300">
                ${inspectingMerchItem.price.toFixed(2)}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {inspectingMerchItem.description}
            </p>

            {/* Challenge Progress Status Banner */}
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Recorded for "View 3 items in store" challenge!</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">
                {Math.min(3, viewedStoreItemIds.length)}/3 Viewed
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setInspectingMerchItem(null);
                  onNavigateToMerchStore();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View in Merchandise Store</span>
              </button>
              <button
                onClick={() => setInspectingMerchItem(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING CELEBRATION TOAST */}
      {celebrationToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl bg-slate-900 border border-emerald-400 p-4 shadow-2xl shadow-emerald-950/50 flex items-start gap-3.5 animate-bounce">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0 text-xl">
            🎉
          </div>
          <div className="space-y-0.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                Challenge Completed!
              </span>
              <span className="font-mono font-black text-xs text-amber-300">
                +{celebrationToast.points} pts
              </span>
            </div>
            <h4 className="text-xs font-bold text-white">
              {celebrationToast.title}
            </h4>
            <p className="text-[11px] text-slate-300">
              {celebrationToast.message}
            </p>
          </div>
          <button
            onClick={() => setCelebrationToast(null)}
            className="text-slate-400 hover:text-white text-xs font-bold ml-1"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
};
