import React, { useState } from 'react';
import { 
  UserProfile as UserProfileType, 
  Attraction, 
  CharacterGreeting, 
  DailyParkChallenge, 
  MerchandiseItem 
} from '../types';
import { 
  DAILY_PARK_CHALLENGES, 
  ALL_CHALLENGES_BONUS_POINTS 
} from '../data/loyaltyData';
import { MERCHANDISE_CATALOG } from '../data/merchData';
import { soundEffects } from '../services/audio';
import { 
  Trophy, 
  Target, 
  CheckCircle2, 
  Sparkles, 
  Rocket, 
  ShoppingBag, 
  Camera, 
  Utensils, 
  Anchor, 
  Eye, 
  Award, 
  RotateCcw, 
  MapPin, 
  Radio, 
  ExternalLink, 
  Clock, 
  Flame, 
  ChevronRight, 
  Check, 
  Lock, 
  Zap, 
  ShieldCheck, 
  Info,
  Gift,
  Search
} from 'lucide-react';

interface DailyParkChallengesSectionProps {
  user: UserProfileType;
  attractions: Attraction[];
  characters: CharacterGreeting[];
  merchandiseCatalog?: MerchandiseItem[];
  onNavigateToAttractionOnMap: (attractionId: string) => void;
  onNavigateToMerchStore: () => void;
  onNavigateToSailing?: () => void;
  onCompleteChallenge: (challengeId: string, customMessage?: string) => void;
  onInspectStoreItem: (item: MerchandiseItem) => void;
  onClaimStoreChallenge: () => void;
  onSpaceMountainCheckIn: () => void;
  onClaimVaultBonus: () => void;
  isScanningSpaceMountain: boolean;
}

export const DailyParkChallengesSection: React.FC<DailyParkChallengesSectionProps> = ({
  user,
  attractions,
  characters,
  merchandiseCatalog,
  onNavigateToAttractionOnMap,
  onNavigateToMerchStore,
  onNavigateToSailing,
  onCompleteChallenge,
  onInspectStoreItem,
  onClaimStoreChallenge,
  onSpaceMountainCheckIn,
  onClaimVaultBonus,
  isScanningSpaceMountain,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'ride' | 'store' | 'character' | 'dining' | 'exploration'
  >('all');

  const completedDailyChallengeIds = user.completedDailyChallengeIds ?? [];
  const viewedStoreItemIds = user.viewedStoreItemIds ?? [];

  // Metrics
  const completedChallengesCount = DAILY_PARK_CHALLENGES.filter((c) =>
    completedDailyChallengeIds.includes(c.id)
  ).length;
  const allChallengesCompleted = completedChallengesCount === DAILY_PARK_CHALLENGES.length;
  const isVaultClaimed = completedDailyChallengeIds.includes('daily_vault_bonus');

  const totalPointsEarnedToday =
    DAILY_PARK_CHALLENGES.filter((c) => completedDailyChallengeIds.includes(c.id)).reduce(
      (sum, c) => sum + c.pointsReward,
      0
    ) + (isVaultClaimed ? ALL_CHALLENGES_BONUS_POINTS : 0);

  const totalPossiblePoints =
    DAILY_PARK_CHALLENGES.reduce((sum, c) => sum + c.pointsReward, 0) +
    ALL_CHALLENGES_BONUS_POINTS;

  const progressPercent = Math.round(
    (completedChallengesCount / DAILY_PARK_CHALLENGES.length) * 100
  );

  // Space Mountain attraction details
  const spaceMountain = attractions.find(
    (a) => a.id === 'space_mountain' || a.id.toLowerCase().includes('space')
  );

  // Available merchandise catalog
  const catalog =
    merchandiseCatalog && merchandiseCatalog.length > 0
      ? merchandiseCatalog
      : MERCHANDISE_CATALOG;

  // Filtered store toys for quick inspection
  const quickInspectToys = catalog
    .filter((item) => item.universe === 'marvel' || item.isSailingVessel)
    .slice(0, 4);

  // Filtered challenges based on tab
  const filteredChallenges = DAILY_PARK_CHALLENGES.filter((c) => {
    if (selectedCategory === 'all') return true;
    return c.category === selectedCategory;
  });

  return (
    <div className="space-y-8" id="daily-park-challenges-container">
      
      {/* HEADER & DASHBOARD CARD */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/80 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>Daily Park Operations & Challenges</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Resets in ~14h 22m (12:00 AM PST)</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Complete Daily Park Challenges to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">Earn Bonus Loyalty Points</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Check in to Tomorrowland's Space Mountain, inspect the latest Marvel superhero action toys in the depot, and meet heroes across WonderKingdom to rapidly boost your loyalty tier.
            </p>
          </div>

          {/* Daily Points Counter & Progress Box */}
          <div className="w-full lg:w-auto bg-slate-950/80 p-5 rounded-2xl border border-emerald-500/40 shadow-inner flex flex-col sm:flex-row lg:flex-col items-center justify-between gap-4">
            <div className="text-center sm:text-right lg:text-right w-full sm:w-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Today's Challenge Points
              </span>
              <div className="text-3xl font-black font-mono text-emerald-400 flex items-center justify-center sm:justify-end gap-1.5">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                <span>+{totalPointsEarnedToday}</span>
                <span className="text-sm text-emerald-400/70 font-sans font-medium">/ +{totalPossiblePoints} pts</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                {completedChallengesCount} of {DAILY_PARK_CHALLENGES.length} Tasks Finished
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full sm:w-48 lg:w-48 space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Daily Completion</span>
                <span className="text-emerald-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/40"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* GRAND STARK DAILY VAULT BONUS BANNER */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            isVaultClaimed
              ? 'bg-emerald-950/40 border-emerald-500/40'
              : allChallengesCompleted
              ? 'bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20 animate-pulse'
              : 'bg-slate-950/60 border-slate-800'
          }`}>
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-2xl shadow-md ${
                isVaultClaimed
                  ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400'
                  : allChallengesCompleted
                  ? 'bg-amber-400 text-slate-950 font-black ring-4 ring-amber-400/30'
                  : 'bg-slate-800/80 border border-slate-700 text-slate-400'
              }`}>
                {isVaultClaimed ? '🏆' : allChallengesCompleted ? '🔓' : '🔒'}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                    <span>Stark Grand Vault Master Bonus</span>
                  </span>
                  <span className="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/40">
                    +{ALL_CHALLENGES_BONUS_POINTS} PTS
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {isVaultClaimed
                    ? '✓ You have claimed today’s Grand Vault bonus! +250 points added to your loyalty balance.'
                    : allChallengesCompleted
                    ? 'Sensational! All 5 daily challenges completed. The Stark Grand Vault is unlocked!'
                    : `Complete all ${DAILY_PARK_CHALLENGES.length} daily park missions to unlock the Stark Vault (+250 points bonus).`}
                </p>
              </div>
            </div>

            <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
              {isVaultClaimed ? (
                <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Vault Claimed (+250)</span>
                </div>
              ) : allChallengesCompleted ? (
                <button
                  id="claim-grand-vault-btn"
                  onClick={onClaimVaultBonus}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Trophy className="w-4 h-4 text-slate-950" />
                  <span>Claim Stark Vault (+250 pts)</span>
                </button>
              ) : (
                <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{completedChallengesCount}/{DAILY_PARK_CHALLENGES.length} Completed to Unlock</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* CATEGORY FILTER CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Challenges', icon: '🎯' },
          { id: 'ride', label: 'Space & Coaster Rides', icon: '🚀' },
          { id: 'store', label: 'Toy & Merch Depot', icon: '🛍️' },
          { id: 'character', label: 'Hero Greetings', icon: '🦾' },
          { id: 'dining', label: 'Quantum Treats', icon: '🥨' },
          { id: 'exploration', label: 'Sailing Fleet', icon: '⛵' },
        ].map((tab) => {
          const isSelected = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundEffects.playClick();
                setSelectedCategory(tab.id as any);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800 hover:bg-slate-850'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* CHALLENGES LIST CONTAINER */}
      <div className="grid grid-cols-1 gap-6">

        {/* ================================================================= */}
        {/* 1. CHECK IN TO SPACE MOUNTAIN */}
        {/* ================================================================= */}
        {(selectedCategory === 'all' || selectedCategory === 'ride') && (
          <div
            id="challenge-card-space-mountain"
            className={`rounded-3xl border p-6 transition-all duration-300 relative overflow-hidden ${
              completedDailyChallengeIds.includes('challenge_space_mountain')
                ? 'bg-slate-900/60 border-emerald-500/40'
                : 'bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/50 border-cyan-500/40 shadow-xl'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl shadow-lg ${
                  completedDailyChallengeIds.includes('challenge_space_mountain')
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                    : 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                }`}>
                  🚀
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                      Check in to Space Mountain
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 flex items-center gap-1">
                      <span>🎢</span>
                      <span>Tomorrowland Star Port</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-black border border-amber-500/40">
                      +120 PTS
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    Scan your MagicPass GPS beacon at Space Mountain: Cosmic Star-Voyage in Tomorrowland to verify your coaster visit.
                  </p>

                  {/* Attraction telemetry bar */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Coaster Status: <strong className="text-slate-200">Operational</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>Standby Wait: <strong className="text-cyan-300">{spaceMountain?.waitTimeMinutes ?? 45} min</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>Lightning Lane: <strong className="text-amber-300">Ready</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0">
                {completedDailyChallengeIds.includes('challenge_space_mountain') ? (
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Checked In (+120 pts Claimed)</span>
                    </span>
                    <button
                      onClick={() => onNavigateToAttractionOnMap('space_mountain')}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
                      title="View Space Mountain on Park Map"
                    >
                      <MapPin className="w-4 h-4 text-cyan-400" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                    <button
                      id="action-checkin-space-mountain"
                      onClick={onSpaceMountainCheckIn}
                      disabled={isScanningSpaceMountain}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      {isScanningSpaceMountain ? (
                        <>
                          <Radio className="w-4 h-4 animate-spin text-slate-950" />
                          <span>Scanning Beacon...</span>
                        </>
                      ) : (
                        <>
                          <Rocket className="w-4 h-4 text-slate-950" />
                          <span>Check In to Space Mountain (+120 pts)</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onNavigateToAttractionOnMap('space_mountain')}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>View on Map</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Radar scan animation overlay when scanning */}
            {isScanningSpaceMountain && (
              <div className="mt-4 p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-3 animate-pulse">
                <Radio className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Transmitting MagicPass cryptographic telemetry to Tomorrowland Star Port antenna...</span>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* 2. VIEW 3 ITEMS IN THE STORE */}
        {/* ================================================================= */}
        {(selectedCategory === 'all' || selectedCategory === 'store') && (
          <div
            id="challenge-card-store-items"
            className={`rounded-3xl border p-6 transition-all duration-300 relative overflow-hidden ${
              completedDailyChallengeIds.includes('challenge_view_store_items')
                ? 'bg-slate-900/60 border-emerald-500/40'
                : 'bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/40 border-rose-500/40 shadow-xl'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl shadow-lg ${
                  completedDailyChallengeIds.includes('challenge_view_store_items')
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-500/20 border border-rose-500/50 text-rose-300'
                }`}>
                  🛍️
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                      View 3 items in the store
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40 flex items-center gap-1">
                      <span>⚡</span>
                      <span>Avengers Supply & Toy Depot</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-black border border-amber-500/40">
                      +100 PTS
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    Inspect 3 Marvel superhero action toys or hydrofoil sailing vessels in the park merchandise catalog to claim your retail exploration reward.
                  </p>

                  {/* Progress bar */}
                  <div className="pt-2 max-w-md space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">
                        Inspected Items: <strong className="text-slate-200">{viewedStoreItemIds.length}</strong> of 3 required
                      </span>
                      <span className={`font-bold ${viewedStoreItemIds.length >= 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {viewedStoreItemIds.length >= 3 ? 'Goal Reached!' : `${Math.max(0, 3 - viewedStoreItemIds.length)} more needed`}
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          viewedStoreItemIds.length >= 3
                            ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                            : 'bg-gradient-to-r from-rose-500 to-amber-400'
                        }`}
                        style={{ width: `${Math.min(100, (viewedStoreItemIds.length / 3) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Column */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0">
                {completedDailyChallengeIds.includes('challenge_view_store_items') ? (
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Challenge Completed (+100 pts Claimed)</span>
                    </span>
                    <button
                      onClick={() => onNavigateToMerchStore()}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
                      title="Open Full Merchandise Store"
                    >
                      <ShoppingBag className="w-4 h-4 text-rose-400" />
                    </button>
                  </div>
                ) : viewedStoreItemIds.length >= 3 ? (
                  <button
                    id="action-claim-store-challenge"
                    onClick={onClaimStoreChallenge}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all animate-bounce"
                  >
                    <Trophy className="w-4 h-4 text-slate-950" />
                    <span>Claim +100 Points Reward!</span>
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button
                      onClick={() => onNavigateToMerchStore()}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Browse Store Depot</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* QUICK-INSPECT INTERACTIVE TOY SHELF */}
            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Eye className="w-4 h-4 text-rose-400" />
                  <span>Quick-Inspect Toy Shelf (Click any item to inspect & advance challenge):</span>
                </div>
                <button
                  onClick={() => onNavigateToMerchStore()}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                >
                  <span>View All In Store</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickInspectToys.map((toy) => {
                  const isInspected = viewedStoreItemIds.includes(toy.id);
                  return (
                    <div
                      key={toy.id}
                      onClick={() => onInspectStoreItem(toy)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                        isInspected
                          ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400'
                          : 'bg-slate-950/60 border-slate-800 hover:border-rose-500/50 hover:bg-slate-900'
                      }`}
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900 mb-2 border border-slate-800">
                        <img
                          src={toy.image}
                          alt={toy.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        {isInspected && (
                          <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center gap-0.5 shadow-md">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Inspected</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-rose-300 transition-colors">
                          {toy.title}
                        </h4>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-amber-400 font-bold">${toy.price}</span>
                          <span className="text-slate-400 text-[10px]">{toy.category}</span>
                        </div>

                        <button
                          type="button"
                          className={`w-full mt-1 py-1 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                            isInspected
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800 group-hover:bg-rose-600 text-slate-300 group-hover:text-white'
                          }`}
                        >
                          <Eye className="w-3 h-3" />
                          <span>{isInspected ? 'View Specs Again' : 'Inspect Toy (+1)'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* 3. MEET TONY STARK OR SPIDER-MAN */}
        {/* ================================================================= */}
        {(selectedCategory === 'all' || selectedCategory === 'character') && (
          <div
            id="challenge-card-meet-ironman"
            className={`rounded-3xl border p-6 transition-all duration-300 relative overflow-hidden ${
              completedDailyChallengeIds.includes('challenge_meet_ironman')
                ? 'bg-slate-900/60 border-emerald-500/40'
                : 'bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border-amber-500/40 shadow-xl'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl shadow-lg ${
                  completedDailyChallengeIds.includes('challenge_meet_ironman')
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                    : 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                }`}>
                  🦾
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                      Meet Tony Stark or Spider-Man
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40 flex items-center gap-1">
                      <span>⭐</span>
                      <span>Stark Innovation Hangar</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-black border border-amber-500/40">
                      +90 PTS
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    Visit the Stark Innovation Hangar in Avengers Campus for superhero diagnostics, suit demonstrations, and a personalized PhotoPass greeting.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Greeting: <strong className="text-slate-200">Active Live Greeting</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Greeting Queue: <strong className="text-amber-300">15 min wait</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0">
                {completedDailyChallengeIds.includes('challenge_meet_ironman') ? (
                  <span className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Encounter Logged (+90 pts Claimed)</span>
                  </span>
                ) : (
                  <button
                    id="action-log-hero-encounter"
                    onClick={() =>
                      onCompleteChallenge(
                        'challenge_meet_ironman',
                        'Hero greeting confirmed at Stark Innovation Hangar! PhotoPass linked!'
                      )
                    }
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Camera className="w-4 h-4 text-slate-950" />
                    <span>Log Hero PhotoPass (+90 pts)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 4. EXPLORE PYM KITCHEN TREATS */}
        {/* ================================================================= */}
        {(selectedCategory === 'all' || selectedCategory === 'dining') && (
          <div
            id="challenge-card-pym-dining"
            className={`rounded-3xl border p-6 transition-all duration-300 relative overflow-hidden ${
              completedDailyChallengeIds.includes('challenge_pym_dining')
                ? 'bg-slate-900/60 border-emerald-500/40'
                : 'bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-emerald-500/40 shadow-xl'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl shadow-lg ${
                  completedDailyChallengeIds.includes('challenge_pym_dining')
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                    : 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                }`}>
                  🥨
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                      Explore Pym Kitchen Treats
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1">
                      <span>🧪</span>
                      <span>Pym Test Kitchen</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-black border border-amber-500/40">
                      +75 PTS
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    Check out Quantum pretzel treats, enlarged Pym particles sliders, and micro-bubble atomic sodas at Avengers Campus culinary lab.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800">
                      🥨 Quantum Bavarian Pretzel (Enlarged 300%)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800">
                      🥤 Micro-Particle Blue Energy Soda
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0">
                {completedDailyChallengeIds.includes('challenge_pym_dining') ? (
                  <span className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Menu Explored (+75 pts Claimed)</span>
                  </span>
                ) : (
                  <button
                    id="action-sample-pym-menu"
                    onClick={() =>
                      onCompleteChallenge(
                        'challenge_pym_dining',
                        'Pym Test Kitchen Quantum Bites catalog reviewed! +75 points earned!'
                      )
                    }
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Utensils className="w-4 h-4 text-slate-950" />
                    <span>Sample Quantum Treats (+75 pts)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 5. TRACK THE HYDROFOIL SAILING FLEET */}
        {/* ================================================================= */}
        {(selectedCategory === 'all' || selectedCategory === 'exploration') && (
          <div
            id="challenge-card-hydrofoil-fleet"
            className={`rounded-3xl border p-6 transition-all duration-300 relative overflow-hidden ${
              completedDailyChallengeIds.includes('challenge_hydrofoil_fleet')
                ? 'bg-slate-900/60 border-emerald-500/40'
                : 'bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border-cyan-500/40 shadow-xl'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl shadow-lg ${
                  completedDailyChallengeIds.includes('challenge_hydrofoil_fleet')
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                    : 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                }`}>
                  ⛵
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                      Track the Hydrofoil Sailing Fleet
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 flex items-center gap-1">
                      <span>🌊</span>
                      <span>Adventureland Caribbean Pier</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-black border border-amber-500/40">
                      +85 PTS
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    Observe the high-speed hydrofoil sailing galleons and Stark Quinjet vessels traversing the WonderKingdom waterways.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span>Caribbean Fleet: <strong className="text-slate-200">4 Hydrofoils Active</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800">
                      <Anchor className="w-3 h-3 text-cyan-400" />
                      <span>Speed: <strong className="text-cyan-300">28 knots cruising</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0">
                {completedDailyChallengeIds.includes('challenge_hydrofoil_fleet') ? (
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Fleet Tracked (+85 pts Claimed)</span>
                    </span>
                    {onNavigateToSailing && (
                      <button
                        onClick={() => onNavigateToSailing()}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
                        title="Open Sailing Fleet Radar"
                      >
                        <Anchor className="w-4 h-4 text-cyan-400" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button
                      id="action-track-hydrofoil-fleet"
                      onClick={() =>
                        onCompleteChallenge(
                          'challenge_hydrofoil_fleet',
                          'Hydrofoil galleon positions recorded! +85 points added to loyalty wallet!'
                        )
                      }
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      <Anchor className="w-4 h-4 text-slate-950" />
                      <span>Log Fleet Sighting (+85 pts)</span>
                    </button>

                    {onNavigateToSailing && (
                      <button
                        onClick={() => onNavigateToSailing()}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5"
                      >
                        <Radio className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Sailing Map</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
