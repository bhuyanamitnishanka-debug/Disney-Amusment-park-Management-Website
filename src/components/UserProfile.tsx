import React, { useState } from 'react';
import { 
  UserProfile as UserProfileType, 
  Attraction, 
  CharacterGreeting, 
  MerchandiseItem, 
  LoyaltyTransaction,
  LoyaltyReward,
  LoyaltyTier,
  RedeemedPerkVoucher
} from '../types';
import { soundEffects } from '../services/audio';
import confetti from 'canvas-confetti';
import { 
  User, 
  Heart, 
  Star, 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Shield, 
  Sparkles, 
  Edit3, 
  Check, 
  Trash2, 
  Compass, 
  Package, 
  ChevronRight, 
  LogIn, 
  Camera, 
  Flame,
  Award,
  Crown,
  Gift,
  Zap,
  TrendingUp,
  History,
  Lock,
  Unlock,
  AlertCircle,
  Share2,
  Radio
} from 'lucide-react';
import { 
  LOYALTY_TIERS, 
  REDEEMABLE_REWARDS, 
  calculateTier, 
  getTierProgress,
  POINTS_PER_DOLLAR,
  POINTS_PER_ATTENDANCE_CHECKIN 
} from '../data/loyaltyData';
import { ParkMemoriesSection } from './ParkMemoriesSection';

interface UserProfileProps {
  user: UserProfileType;
  onUpdateUser: (updated: Partial<UserProfileType>) => void;
  attractions: Attraction[];
  characters: CharacterGreeting[];
  merchandiseCatalog: MerchandiseItem[];
  onToggleFavoriteAttraction: (attractionId: string) => void;
  onToggleFavoriteCharacter: (characterId: string) => void;
  onToggleWishlist: (itemId: string) => void;
  onAddToCart: (item: MerchandiseItem) => void;
  onNavigateToAttractionOnMap: (attractionId: string) => void;
  onNavigateToRewardsMarket?: () => void;
  onOpenSocialShare?: (item?: any) => void;
  onOpenSocialFeed?: () => void;
}

const PRESET_AVATARS = [
  { id: 'iron_man', label: 'Iron Man', emoji: '🦾', url: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&w=200&q=80' },
  { id: 'mickey', label: 'Sorcerer Mickey', emoji: '🪄', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80' },
  { id: 'spiderman', label: 'Spider-Man', emoji: '🕸️', url: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&w=200&q=80' },
  { id: 'elsa', label: 'Queen Elsa', emoji: '❄️', url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80' },
  { id: 'cap', label: 'Captain America', emoji: '🛡️', url: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?auto=format&fit=crop&w=200&q=80' },
  { id: 'black_panther', label: 'Black Panther', emoji: '🐾', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=200&q=80' },
  { id: 'black_pearl', label: 'Pirate Captain', emoji: '⛵', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80' },
];

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onUpdateUser,
  attractions,
  characters,
  merchandiseCatalog,
  onToggleFavoriteAttraction,
  onToggleFavoriteCharacter,
  onToggleWishlist,
  onAddToCart,
  onNavigateToAttractionOnMap,
  onNavigateToRewardsMarket,
  onOpenSocialShare,
  onOpenSocialFeed,
}) => {
  const [activeTab, setActiveTab] = useState<'loyalty' | 'favorites' | 'wishlist' | 'purchases' | 'memories' | 'account'>('loyalty');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(user.bio);
  const [displayNameInput, setDisplayNameInput] = useState(user.displayName);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [redeemedAlert, setRedeemedAlert] = useState<string | null>(null);

  // Fallback-safe loyalty values
  const loyaltyPoints = user.loyaltyPoints ?? 2450;
  const lifetimePoints = user.lifetimePoints ?? 2950;
  const loyaltyTier = user.loyaltyTier ?? 'gold';
  const attendanceCheckIns = user.attendanceCheckIns ?? 8;
  const loyaltyHistory = user.loyaltyHistory ?? [];

  const tierProgress = getTierProgress(lifetimePoints);
  const currentTierConfig = LOYALTY_TIERS[loyaltyTier] || LOYALTY_TIERS.gold;

  // Calculate points by source
  const pointsFromMerch = user.pastPurchases.reduce((acc, o) => acc + Math.round(o.total * POINTS_PER_DOLLAR), 0);
  const pointsFromAttendance = attendanceCheckIns * POINTS_PER_ATTENDANCE_CHECKIN;

  // Login inputs
  const [loginName, setLoginName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginTier, setLoginTier] = useState('Stark Industries VIP Operative');

  // Favorite items resolved
  const favoriteRides = attractions.filter((a) => user.favoriteAttractionIds.includes(a.id));
  const favoriteChars = characters.filter((c) => user.favoriteCharacterIds.includes(c.id));
  const wishlistedItems = merchandiseCatalog.filter((m) => user.wishlist.includes(m.id));

  const handleSaveBio = () => {
    soundEffects.playMagicChime();
    onUpdateUser({
      bio: bioInput.trim(),
      displayName: displayNameInput.trim() || user.displayName,
    });
    setIsEditingBio(false);
    setSaveSuccessMessage(true);
    setTimeout(() => setSaveSuccessMessage(false), 2500);
  };

  const handleSelectAvatar = (avatar: typeof PRESET_AVATARS[0]) => {
    soundEffects.playClick();
    onUpdateUser({
      avatarUrl: avatar.url,
      avatarHeroId: avatar.id,
    });
    setShowAvatarPicker(false);
  };

  const handleQuickSwitchUser = (name: string, email: string, tier: string, avatarUrl: string, initialPoints = 2450, initialLifetime = 2950) => {
    soundEffects.playMagicChime();
    const calculatedTier = calculateTier(initialLifetime);
    onUpdateUser({
      displayName: name,
      email: email,
      membershipTier: tier,
      avatarUrl: avatarUrl,
      loyaltyPoints: initialPoints,
      lifetimePoints: initialLifetime,
      loyaltyTier: calculatedTier,
      bio: `Official ${name} profile active. Ready for park missions, Disney adventures, and Stark tech deployment.`,
    });
    setDisplayNameInput(name);
    setBioInput(`Official ${name} profile active.`);
    setIsLoginModalOpen(false);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName.trim()) return;
    soundEffects.playMagicChime();
    onUpdateUser({
      displayName: loginName.trim(),
      email: loginEmail.trim() || `${loginName.toLowerCase().replace(/\s+/g, '')}@wonderkingdom.disney.com`,
      membershipTier: loginTier,
    });
    setDisplayNameInput(loginName.trim());
    setIsLoginModalOpen(false);
  };

  // Earning points: Park Attendance Check-in
  const handleCheckInAttendance = () => {
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
      description: `Park Attendance Daily Check-in (Visit #${nextCheckIns})`,
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

    setRedeemedAlert(`🏰 Attendance Confirmed! You earned +${ptsEarned} Loyalty Points!`);
    setTimeout(() => setRedeemedAlert(null), 3500);
  };

  // Redeeming reward
  const handleRedeemReward = (reward: LoyaltyReward) => {
    if (loyaltyPoints < reward.cost) {
      soundEffects.playClick();
      alert(`Insufficient points! You need ${reward.cost - loyaltyPoints} more points to redeem ${reward.title}.`);
      return;
    }

    soundEffects.playMagicChime();
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#f59e0b', '#10b981', '#3b82f6'],
    });

    const nextPoints = loyaltyPoints - reward.cost;
    const newTx: LoyaltyTransaction = {
      id: 'tx_red_' + Date.now(),
      date: 'Just Now',
      description: `Redeemed Reward: ${reward.title}`,
      points: -reward.cost,
      type: 'redeem',
    };

    const voucherCode = `PERK-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
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
      instructions: `Present this official digital pass to any Disney WonderKingdom or Avengers Campus Cast Member for verification.`,
    };

    onUpdateUser({
      loyaltyPoints: nextPoints,
      loyaltyHistory: [newTx, ...loyaltyHistory],
      redeemedVouchers: [newVoucher, ...(user.redeemedVouchers ?? [])],
    });

    setRedeemedAlert(`🎉 Redeemed ${reward.title}! Digital pass added to your Rewards Market Wallet.`);
    setTimeout(() => setRedeemedAlert(null), 4000);
  };

  return (
    <div className="space-y-8">
      
      {/* Profile Header & Bio Card with Integrated Loyalty Summary */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left flex-1">
            {/* Avatar with Changer */}
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-400/60 shadow-xl shadow-amber-500/10">
                <img
                  src={user.avatarUrl}
                  alt={user.displayName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setShowAvatarPicker(!showAvatarPicker);
                }}
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 shadow-lg transition-transform hover:scale-110"
                title="Change Avatar Picture"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* User Details */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {user.displayName}
                </h1>
                
                {/* Reward Tier Pill */}
                <span className={`px-2.5 py-0.5 rounded-full bg-slate-950/80 border ${currentTierConfig.borderColor} ${currentTierConfig.color} text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-sm`}>
                  <span>{currentTierConfig.badgeEmoji}</span>
                  <span>{currentTierConfig.title} Tier</span>
                </span>
              </div>

              <p className="text-xs text-slate-400 font-mono">{user.email}</p>

              {/* Bio Section */}
              {isEditingBio ? (
                <div className="space-y-2 pt-2 max-w-xl">
                  <input
                    type="text"
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    placeholder="Display Name"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                  <textarea
                    rows={2}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    maxLength={160}
                    placeholder="Tell other park adventurers about your favorite rides and heroes..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveBio}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-md"
                    >
                      <Check className="w-3.5 h-3.5" /> Save Bio
                    </button>
                    <button
                      onClick={() => {
                        setBioInput(user.bio);
                        setIsEditingBio(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-1 flex items-start gap-2 justify-center sm:justify-start">
                  <p className="text-xs text-slate-300 leading-relaxed italic max-w-xl">
                    "{user.bio}"
                  </p>
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      setIsEditingBio(true);
                    }}
                    className="text-slate-400 hover:text-amber-300 p-1"
                    title="Edit Bio"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {saveSuccessMessage && (
                <span className="text-[11px] text-emerald-400 font-semibold animate-pulse block">
                  ✓ Profile bio updated successfully
                </span>
              )}

              {/* Quick Memories Pill */}
              {user.parkMemories && user.parkMemories.length > 0 && (
                <div className="pt-2 flex items-center gap-2 justify-center sm:justify-start">
                  <button
                    onClick={() => {
                      soundEffects.playMagicChime();
                      setActiveTab('memories');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-850 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5 text-rose-400" />
                    <span>{user.parkMemories.length} Park Memories</span>
                    {user.parkMemories[0]?.imageUrl && (
                      <img
                        src={user.parkMemories[0].imageUrl}
                        alt="Recent memory"
                        referrerPolicy="no-referrer"
                        className="w-4 h-4 rounded-full object-cover border border-amber-400/60"
                      />
                    )}
                    <span className="text-[10px] text-amber-300">View Album →</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Loyalty Card & Attendance Check-In Button in Header Banner */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-end justify-between gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/90 shadow-inner">
            <div className="text-center sm:text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Disney & Marvel Loyalty Points
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono flex items-center justify-center sm:justify-end gap-1.5">
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
                <span>{loyaltyPoints.toLocaleString()}</span>
                <span className="text-xs text-amber-400/80 font-sans font-normal">pts</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium block">
                Lifetime: <strong className="text-slate-200">{lifetimePoints.toLocaleString()}</strong> pts
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="header-daily-checkin-btn"
                onClick={handleCheckInAttendance}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all active:scale-95"
                title="Earn +150 loyalty points by logging today's park attendance visit"
              >
                <span>🏰</span>
                <span>Check-in Visit (+150 pts)</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setIsLoginModalOpen(true);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
                title="Switch Account"
              >
                <LogIn className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Floating Success Alert */}
        {redeemedAlert && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center justify-between animate-bounce">
            <span>{redeemedAlert}</span>
            <button onClick={() => setRedeemedAlert(null)} className="text-emerald-400 hover:text-white text-sm font-bold ml-2">✕</button>
          </div>
        )}

        {/* Avatar Selector Dropdown */}
        {showAvatarPicker && (
          <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              <span>Choose Your Disney & Marvel Hero Profile Picture:</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
              {PRESET_AVATARS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => handleSelectAvatar(av)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    user.avatarHeroId === av.id
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 scale-105'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  <img
                    src={av.url}
                    alt={av.label}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <span className="text-[10px] font-semibold truncate w-full text-center">{av.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        
        {/* TAB 1: LOYALTY POINTS & REWARDS */}
        <button
          id="profile-tab-loyalty"
          onClick={() => {
            soundEffects.playMagicChime();
            setActiveTab('loyalty');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'loyalty'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'text-amber-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Loyalty Points & Rewards ({loyaltyPoints} pts)</span>
        </button>

        <button
          id="profile-tab-favorites"
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('favorites');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'favorites'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Favorites ({favoriteRides.length} rides • {favoriteChars.length} heroes)</span>
        </button>

        <button
          id="profile-tab-wishlist"
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('wishlist');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'wishlist'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Wishlist ({wishlistedItems.length})</span>
        </button>

        <button
          id="profile-tab-purchases"
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('purchases');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'purchases'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Past Purchases ({user.pastPurchases.length})</span>
        </button>

        <button
          id="profile-tab-memories"
          onClick={() => {
            soundEffects.playMagicChime();
            setActiveTab('memories');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'memories'
              ? 'bg-gradient-to-r from-rose-600 via-amber-600 to-orange-600 text-white shadow-md shadow-rose-600/30'
              : 'text-rose-300/90 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Camera className="w-4 h-4 text-rose-400" />
          <span>Park Memories ({user.parkMemories?.length ?? 0})</span>
          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-[10px] text-amber-300 font-mono">
            Imagen
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LOYALTY POINTS TRACKING & REWARDS DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'loyalty' && (
        <div className="space-y-8">
          
          {/* Main Tier Progress Card */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
            <div className="relative z-10 space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl sm:text-4xl">{currentTierConfig.badgeEmoji}</span>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                        <span>Current Status:</span>
                        <span className={currentTierConfig.color}>{currentTierConfig.title} Tier</span>
                      </h2>
                      <p className="text-xs text-slate-300">
                        Earn points through park attendance visits and merchandise toy purchases
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-amber-500/40 text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Available Balance</span>
                    <span className="text-2xl font-black font-mono text-amber-300">{loyaltyPoints.toLocaleString()} pts</span>
                  </div>
                </div>
              </div>

              {/* Tier Progress Bar */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span>Tier Progress ({tierProgress.progressPercent}%)</span>
                  </span>
                  {tierProgress.nextTier ? (
                    <span className="text-slate-400 font-mono">
                      <strong className="text-amber-300">{tierProgress.pointsToNext.toLocaleString()} points</strong> needed for {tierProgress.nextTier.title} {tierProgress.nextTier.badgeEmoji}
                    </span>
                  ) : (
                    <span className="text-cyan-300 font-bold flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5" /> Highest VIP Tier Achieved!
                    </span>
                  )}
                </div>

                <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-400 transition-all duration-700 shadow-md"
                    style={{ width: `${tierProgress.progressPercent}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>{currentTierConfig.title} ({currentTierConfig.minPoints} pts)</span>
                  {tierProgress.nextTier && (
                    <span>Next: {tierProgress.nextTier.title} ({tierProgress.nextTier.minPoints} pts)</span>
                  )}
                </div>
              </div>

              {/* Earn Points Action Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* Method 1: Park Attendance Check-in */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center text-lg flex-shrink-0">
                      🏰
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">Park Attendance Check-in</h3>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                          +150 PTS / VISIT
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Scan in at the WonderKingdom or Avengers Campus turnstiles to log your attendance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div className="text-xs text-slate-400">
                      <span>Total Check-ins: </span>
                      <strong className="text-white">{attendanceCheckIns} visits</strong>
                      <span className="text-emerald-400 font-mono ml-1">({attendanceCheckIns * POINTS_PER_ATTENDANCE_CHECKIN} pts earned)</span>
                    </div>

                    <button
                      onClick={handleCheckInAttendance}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1 active:scale-95"
                    >
                      <span>Check In (+150 pts)</span>
                    </button>
                  </div>
                </div>

                {/* Method 2: Merchandise Toy Purchases */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 flex items-center justify-center text-lg flex-shrink-0">
                      🛍️
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">Merchandise & Toy Purchases</h3>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                          10 PTS / $1 SPENT
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Earn automatic points on all Marvel toys, Quinjet sailing models, and Disney collectibles.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div className="text-xs text-slate-400">
                      <span>Past Orders: </span>
                      <strong className="text-white">{user.pastPurchases.length} orders</strong>
                      <span className="text-amber-300 font-mono ml-1">({pointsFromMerch} pts earned)</span>
                    </div>

                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        setActiveTab('purchases');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                    >
                      <span>View Orders</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* SECTION: REDEEM REWARDS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-400" />
                  <span>Redeem Loyalty Rewards</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Trade your earned loyalty points for gift vouchers, queue passes, and exclusive collectibles
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 hidden sm:block">
                  Points Available: <strong className="text-amber-300 font-mono">{loyaltyPoints.toLocaleString()}</strong>
                </span>

                {onNavigateToRewardsMarket && (
                  <button
                    id="profile-jump-to-rewards-market-btn"
                    onClick={() => {
                      soundEffects.playMagicChime();
                      onNavigateToRewardsMarket();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open Rewards Market →</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {REDEEMABLE_REWARDS.map((reward) => {
                const canAfford = loyaltyPoints >= reward.cost;

                return (
                  <div
                    key={reward.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                      canAfford
                        ? 'bg-slate-900 border-slate-800 hover:border-amber-500/50 shadow-lg'
                        : 'bg-slate-900/50 border-slate-850 opacity-75'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-3xl p-2 rounded-xl bg-slate-950 border border-slate-800">{reward.icon}</span>
                        <div className="text-right">
                          <span className="text-base font-black font-mono text-amber-300">
                            {reward.cost} pts
                          </span>
                          <span className="text-[10px] text-slate-400 block capitalize">{reward.category}</span>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-white">{reward.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{reward.description}</p>
                    </div>

                    <button
                      onClick={() => handleRedeemReward(reward)}
                      disabled={!canAfford}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Redeem for {reward.cost} pts</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Need {reward.cost - loyaltyPoints} more pts</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION: ALL TIERS & PERKS BREAKDOWN */}
          <div className="space-y-4 pt-2">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span>Loyalty Reward Tiers & Exclusive Perks</span>
              </h3>
              <p className="text-xs text-slate-400">
                Level up your tier through attendance and merchandise to unlock discounts and VIP access
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(Object.keys(LOYALTY_TIERS) as LoyaltyTier[]).map((tierKey) => {
                const tier = LOYALTY_TIERS[tierKey];
                const isCurrent = loyaltyTier === tierKey;
                const isUnlocked = lifetimePoints >= tier.minPoints;

                return (
                  <div
                    key={tier.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                      isCurrent
                        ? `bg-gradient-to-b ${tier.gradient} border-2 ${tier.borderColor} ring-2 ring-amber-400/20 shadow-xl`
                        : isUnlocked
                        ? 'bg-slate-900 border-slate-800'
                        : 'bg-slate-900/40 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{tier.badgeEmoji}</span>
                        {isCurrent ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                            CURRENT
                          </span>
                        ) : isUnlocked ? (
                          <span className="text-emerald-400 text-xs flex items-center gap-1 font-bold">
                            <Unlock className="w-3.5 h-3.5" /> Unlocked
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs flex items-center gap-1 font-semibold">
                            <Lock className="w-3.5 h-3.5" /> {tier.minPoints} pts
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className={`text-base font-bold ${tier.color}`}>{tier.title}</h4>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {tier.maxPoints ? `${tier.minPoints} - ${tier.maxPoints} pts` : `${tier.minPoints}+ pts`}
                        </span>
                      </div>

                      <ul className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                        {tier.perks.map((p, i) => (
                          <li key={i} className="flex items-start gap-1.5 leading-tight">
                            <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isUnlocked ? 'text-emerald-400' : 'text-slate-600'}`} />
                            <span className={isUnlocked ? 'text-slate-200' : 'text-slate-500'}>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION: LOYALTY TRANSACTION HISTORY */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <History className="w-5 h-5 text-cyan-400" />
                  <span>Points Activity & Transaction Ledger</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time record of all points earned and redeemed across your account
                </p>
              </div>

              <span className="text-xs text-slate-400 font-mono">
                {loyaltyHistory.length} Recorded Entries
              </span>
            </div>

            {loyaltyHistory.length === 0 ? (
              <div className="py-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 text-xs text-slate-400">
                No loyalty transactions logged yet. Check in to the park or buy merchandise to start earning!
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/80 shadow-lg divide-y divide-slate-800/80">
                {loyaltyHistory.map((tx) => {
                  const isEarn = tx.points > 0;

                  return (
                    <div key={tx.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                          tx.type === 'attendance'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : tx.type === 'merchandise'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : tx.type === 'redeem'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}>
                          {tx.type === 'attendance' ? '🏰' : tx.type === 'merchandise' ? '🛍️' : tx.type === 'redeem' ? '🎟️' : '⭐'}
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-white">{tx.description}</h4>
                          <span className="text-[10px] text-slate-400">{tx.date}</span>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end">
                        <span className={`text-sm font-black font-mono ${isEarn ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isEarn ? `+${tx.points}` : tx.points} pts
                        </span>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">{tx.type}</span>

                        {onOpenSocialShare && tx.type === 'redeem' && (
                          <button
                            onClick={() => {
                              soundEffects.playMagicChime();
                              const matchedVoucher = user.redeemedVouchers?.find(
                                (v) => tx.description.includes(v.code) || tx.description.includes(v.title)
                              );
                              onOpenSocialShare(
                                matchedVoucher || {
                                  id: 'v_share_' + Date.now(),
                                  title: tx.description.replace(/^Redeemed:\s*/, ''),
                                  category: 'vip_access',
                                  icon: '🎟️',
                                  cost: Math.abs(tx.points),
                                  code: 'PERK-VIP',
                                  redeemedAt: tx.date,
                                  instructions: 'Present this perk confirmation at guest relations.',
                                  status: 'active',
                                  barcode: '*PERKVIP*',
                                  expiresAt: '11:59 PM Today',
                                }
                              );
                            }}
                            className="mt-1 px-2 py-0.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1 transition-colors"
                            title="Share this perk redemption to the guest social feed"
                          >
                            <Share2 className="w-2.5 h-2.5" />
                            <span>Share</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FAVORITE RIDES & CHARACTERS */}
      {/* ========================================================================= */}
      {activeTab === 'favorites' && (
        <div className="space-y-6">
          {/* Favorite Rides */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                Favorite Attractions & Coasters
              </h2>
              <p className="text-xs text-slate-400">Live wait times, lightning lanes, and instant navigation</p>
            </div>

            {favoriteRides.length === 0 ? (
              <div className="py-12 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 text-xs text-slate-400 space-y-2">
                <p>You haven’t saved any favorite rides yet.</p>
                <p>Open the Interactive Map and click the heart on any ride or coaster to save it here!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteRides.map((ride) => (
                  <div
                    key={ride.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                          {ride.landId.toUpperCase()}
                        </span>
                        <h3 className="text-sm font-bold text-white">{ride.name}</h3>
                      </div>

                      <button
                        onClick={() => {
                          soundEffects.playClick();
                          onToggleFavoriteAttraction(ride.id);
                        }}
                        className="text-red-500 hover:text-slate-400 p-1"
                        title="Remove from favorites"
                      >
                        <Heart className="w-4 h-4 fill-red-500" />
                      </button>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" /> Wait Time:
                        </span>
                        <span className="font-mono font-bold text-amber-300">
                          {ride.waitTimeMinutes} mins
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Lightning Lane:</span>
                        <span className={`font-semibold ${ride.lightningLaneAvailable ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {ride.lightningLaneAvailable ? 'Available' : 'Standby Only'}
                        </span>
                      </div>

                      <button
                        onClick={() => onNavigateToAttractionOnMap(ride.id)}
                        className="w-full mt-2 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-blue-600 hover:text-white text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span>Locate on Map</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Favorite Characters */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Saved Favorite Characters
              </h2>
              <p className="text-xs text-slate-400">Meet & Greet live status, line times, and sanctuary locations</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteChars.map((char) => (
                <div
                  key={char.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{char.avatarEmoji}</span>
                      <div>
                        <h3 className="text-sm font-bold text-white">{char.name}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          {char.location}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        onToggleFavoriteCharacter(char.id);
                      }}
                      className="text-red-500 hover:text-slate-400 p-1"
                      title="Remove character"
                    >
                      <Heart className="w-4 h-4 fill-red-500" />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      char.status === 'greeting' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {char.status === 'greeting' ? 'Active Greeting' : 'On Short Break'}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">{char.nextAppearance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MERCHANDISE WISHLIST */}
      {/* ========================================================================= */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              Merchandise & Marvel Toy Wishlist
            </h2>
            <p className="text-xs text-slate-400">Items you’ve bookmarked for in-park pickup or sailing cargo shipping</p>
          </div>

          {wishlistedItems.length === 0 ? (
            <div className="py-12 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 text-xs text-slate-400 space-y-2">
              <p>Your merchandise wishlist is currently empty.</p>
              <p>Click the heart icon on any Marvel toy or Disney collectible in the store to save it here!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all flex gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-xl object-cover bg-slate-950 flex-shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="text-xs font-bold text-white line-clamp-1">{item.title}</h3>
                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            onToggleWishlist(item.id);
                          }}
                          className="text-slate-500 hover:text-red-400 p-1"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-amber-300">${item.price.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => {
                        soundEffects.playMagicChime();
                        onAddToCart(item);
                      }}
                      className="mt-2 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PAST PURCHASES & ORDER RECEIPTS */}
      {/* ========================================================================= */}
      {activeTab === 'purchases' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Package className="w-5 h-5 text-cyan-400" />
                Past Purchases & In-Park Dispatches
              </h2>
              <p className="text-xs text-slate-400">Order receipts, smart locker codes, and loyalty points earned</p>
            </div>

            <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono">
              Total Points Earned: +{pointsFromMerch} pts
            </span>
          </div>

          {user.pastPurchases.length === 0 ? (
            <div className="py-12 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 text-xs text-slate-400">
              No previous orders found. Add items to your cart and complete checkout to see them listed here!
            </div>
          ) : (
            <div className="space-y-4">
              {user.pastPurchases.map((order) => {
                const pointsFromOrder = Math.round(order.total * POINTS_PER_DOLLAR);

                return (
                  <div
                    key={order.orderId}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">Order #{order.orderId}</span>
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                            {order.delivery.toUpperCase().replace(/_/g, ' ')}
                          </span>
                          
                          {/* Order Loyalty Points Badge */}
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black font-mono flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>+{pointsFromOrder} pts earned</span>
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{order.date}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-white font-mono">${order.total.toFixed(2)}</span>
                        <span className="text-[10px] text-emerald-400 block font-semibold">
                          Status: {order.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2">
                      {order.items.map((cartItem, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs text-slate-300">
                          <div className="flex items-center gap-2">
                            <img
                              src={cartItem.item.image}
                              alt={cartItem.item.title}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-lg object-cover bg-slate-950"
                            />
                            <div>
                              <span className="font-medium text-white">{cartItem.item.title}</span>
                              <span className="text-slate-500 ml-2">x{cartItem.quantity}</span>
                              {cartItem.customEngraving && (
                                <span className="block text-[10px] text-amber-400 italic">
                                  Engraving: "{cartItem.customEngraving}"
                                </span>
                              )}
                            </div>
                          </div>

                          <span className="font-mono text-slate-400">
                            ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Locker Passcode: <strong className="text-white font-mono">#9021-STARK</strong></span>
                      <span>Express Runner: <strong className="text-amber-300">JARVIS Auto-Dispatch</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PARK MEMORIES ALBUM & IMAGEN GENERATIVE SNAPSHOTS */}
      {/* ========================================================================= */}
      {activeTab === 'memories' && (
        <ParkMemoriesSection
          user={user}
          onUpdateUser={onUpdateUser}
          onNavigateToAttractionOnMap={onNavigateToAttractionOnMap}
          onOpenSocialShare={onOpenSocialShare}
          onOpenSocialFeed={onOpenSocialFeed}
        />
      )}

      {/* Switch Account Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <LogIn className="w-5 h-5 text-amber-400" />
                <span>Switch Park Account</span>
              </h3>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400">Quick Switch to Preset Operative:</span>
              <div className="space-y-2">
                <button
                  onClick={() =>
                    handleQuickSwitchUser(
                      'Tony Stark',
                      'tony.stark@starkindustries.com',
                      'Stark Industries VIP Operative',
                      'https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&w=200&q=80',
                      3250,
                      3650
                    )
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🦾</span>
                    <div>
                      <span className="text-xs font-bold text-white block">Tony Stark</span>
                      <span className="text-[10px] text-cyan-400">Platinum VIP (3,250 pts)</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-amber-300 font-bold">Select</span>
                </button>

                <button
                  onClick={() =>
                    handleQuickSwitchUser(
                      'Peter Parker',
                      'peter.parker@dailybugle.com',
                      'Avengers Junior Recruit',
                      'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&w=200&q=80',
                      850,
                      950
                    )
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🕸️</span>
                    <div>
                      <span className="text-xs font-bold text-white block">Peter Parker</span>
                      <span className="text-[10px] text-slate-300">Silver Vanguard (850 pts)</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-amber-300 font-bold">Select</span>
                </button>

                <button
                  onClick={() =>
                    handleQuickSwitchUser(
                      'Elena Castillo',
                      'elena.castillo@disneykingdom.org',
                      'Disney Magic Keyholder',
                      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80',
                      1800,
                      2100
                    )
                  }
                  className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🪄</span>
                    <div>
                      <span className="text-xs font-bold text-white block">Elena Castillo</span>
                      <span className="text-[10px] text-amber-400">Gold Hero (1,800 pts)</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-amber-300 font-bold">Select</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleCustomLogin} className="pt-3 border-t border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-400">Or Log In with Custom Credentials:</span>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20"
              >
                Log In & Sync Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
