import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Shield, 
  ShoppingBag, 
  Volume2, 
  VolumeX, 
  Bot, 
  Compass, 
  Clock, 
  Users, 
  Flame,
  User,
  Heart,
  Anchor,
  Award,
  Crown,
  Radio,
  Share2
} from 'lucide-react';
import { soundEffects } from '../services/audio';
import confetti from 'canvas-confetti';
import { LoyaltyTier } from '../types';
import { LOYALTY_TIERS } from '../data/loyaltyData';

interface HeaderProps {
  activeTab: 'map' | 'trip_planner' | 'operations' | 'merch' | 'marvel_toy_sailing' | 'sailing' | 'profile' | 'loyalty_market';
  setActiveTab: (tab: 'map' | 'trip_planner' | 'operations' | 'merch' | 'marvel_toy_sailing' | 'sailing' | 'profile' | 'loyalty_market') => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAI: () => void;
  attendance: number;
  maxCapacity: number;
  userAvatarUrl?: string;
  userName?: string;
  wishlistCount?: number;
  loyaltyPoints?: number;
  loyaltyTier?: LoyaltyTier;
  onOpenSocialFeed?: () => void;
  onOpenSocialShare?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  onOpenAI,
  attendance,
  maxCapacity,
  userAvatarUrl,
  userName = 'Tony Stark',
  wishlistCount = 0,
  loyaltyPoints = 2450,
  loyaltyTier = 'gold',
  onOpenSocialFeed,
  onOpenSocialShare,
}) => {
  const [isMuted, setIsMuted] = useState(soundEffects.getIsMuted());
  const [currentTime, setCurrentTime] = useState('');

  const currentTierConfig = LOYALTY_TIERS[loyaltyTier] || LOYALTY_TIERS.gold;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEffects.playClick();
    }
  };

  const triggerCastleCelebration = () => {
    soundEffects.playFireworksBoom();
    soundEffects.playMagicChime();

    // Launch multi-stage canvas confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#ef4444', '#f59e0b', '#ec4899', '#ffffff'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 250);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              id="magic-castle-celebration-trigger"
              onClick={triggerCastleCelebration}
              className="group relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform"
              title="Click to trigger Cinderella Castle Magical Fireworks!"
            >
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center group-hover:bg-opacity-80 transition-all">
                <span className="text-xl sm:text-2xl transform group-hover:scale-110 transition-transform">🏰</span>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('map');
              }}
              className="text-left focus:outline-none"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                    Disney <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-red-500">WonderKingdom</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-950/80 text-red-400 border border-red-800/60">
                    <Shield className="w-2.5 h-2.5 mr-1 text-red-400" /> Marvel Ops
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Live Animated Park Grid</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-[11px] text-slate-400">{currentTime}</span>
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Pill Bar (Desktop & Tablet) */}
          <nav className="hidden xl:flex items-center bg-slate-900/90 p-1.5 rounded-full border border-slate-800 shadow-inner gap-0.5">
            <button
              id="nav-tab-map"
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('map');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'map'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <span>🏰</span>
              <span>Interactive Map</span>
            </button>

            {/* Trip Planner View */}
            <button
              id="nav-tab-trip-planner"
              onClick={() => {
                soundEffects.playMagicChime();
                setActiveTab('trip_planner');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'trip_planner'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/30 font-bold ring-2 ring-cyan-400/40'
                  : 'text-cyan-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Trip Planner</span>
            </button>

            {/* Dedicated Marvel Superhero Toy Sailing Section */}
            <button
              id="nav-tab-marvel-toy-sailing"
              onClick={() => {
                soundEffects.playRepulsorBlast();
                setActiveTab('marvel_toy_sailing');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'marvel_toy_sailing'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-600/30 font-bold ring-2 ring-red-400/40'
                  : 'text-red-300 hover:text-white hover:bg-red-950/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-red-400" />
              <span>Marvel Toy Sailing</span>
            </button>

            <button
              id="nav-tab-merch"
              onClick={() => {
                soundEffects.playMagicChime();
                setActiveTab('merch');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'merch'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <span>🛍️</span>
              <span>Kingdom Merch</span>
            </button>

            <button
              id="nav-tab-operations"
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('operations');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'operations'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <span>⚡</span>
              <span>Command Ops</span>
            </button>

            <button
              id="nav-tab-sailing"
              onClick={() => {
                soundEffects.playShipBell();
                setActiveTab('sailing');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'sailing'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Anchor className="w-3.5 h-3.5 text-emerald-300" />
              <span>Sailing Fleet</span>
            </button>

            <button
              id="nav-tab-loyalty-market"
              onClick={() => {
                soundEffects.playMagicChime();
                setActiveTab('loyalty_market');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'loyalty_market'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/30 font-black ring-2 ring-amber-300/50'
                  : 'text-amber-300 hover:text-white hover:bg-amber-950/40 border border-amber-500/30'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Rewards Market</span>
            </button>

            <button
              id="nav-tab-profile"
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('profile');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <User className="w-3.5 h-3.5 text-indigo-300" />
              <span>User Profile</span>
              {wishlistCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Tools: Loyalty Tier Badge, AI, Sound, Cart, User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* LOYALTY STATUS & REWARD TIER BADGE ON HEADER */}
            <button
              id="header-loyalty-status-badge"
              onClick={() => {
                soundEffects.playMagicChime();
                setActiveTab('loyalty_market');
              }}
              className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 hover:from-slate-850 hover:to-indigo-900/90 border border-amber-500/40 hover:border-amber-400/80 shadow-md shadow-amber-500/10 transition-all hover:scale-[1.02] active:scale-95 text-left"
              title={`Loyalty Status: ${currentTierConfig.title} • ${loyaltyPoints.toLocaleString()} Points available. Click to browse the Loyalty Rewards Market.`}
            >
              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm sm:text-base group-hover:rotate-6 transition-transform">
                <span>{currentTierConfig.badgeEmoji}</span>
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${currentTierConfig.color}`}>
                    {currentTierConfig.title}
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-amber-300 font-mono font-extrabold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  <span>{loyaltyPoints.toLocaleString()} pts</span>
                </div>
              </div>
            </button>

            {/* Social Feed Hub Trigger */}
            {onOpenSocialFeed && (
              <button
                id="social-feed-header-btn"
                onClick={() => {
                  soundEffects.playMagicChime();
                  onOpenSocialFeed();
                }}
                className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-950/60 to-purple-950/60 hover:from-rose-900/80 hover:to-purple-900/80 border border-rose-500/40 hover:border-rose-400 text-slate-200 text-xs font-bold transition-all shadow-sm active:scale-95"
                title="Open Live Guest Social Feed (MagicGram, StarkNet, KingdomBook)"
              >
                <div className="relative">
                  <Radio className="w-3.5 h-3.5 text-rose-400" />
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                </div>
                <span className="hidden md:inline">Social Feed</span>
              </button>
            )}

            {/* AI Park Genie & JARVIS Modal Trigger */}
            <button
              id="ai-concierge-btn"
              onClick={() => {
                soundEffects.playMagicChime();
                onOpenAI();
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-700/60 text-indigo-200 text-xs font-medium transition-all shadow-sm"
              title="Open AI Concierge & JARVIS Tactical Advisor"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden lg:inline">Genie & JARVIS AI</span>
            </button>

            {/* Sound Toggle */}
            <button
              id="sound-mute-toggle-btn"
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title={isMuted ? 'Unmute park sound effects' : 'Mute sound effects'}
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Cart Button */}
            <button
              id="cart-drawer-trigger-btn"
              onClick={() => {
                soundEffects.playClick();
                onOpenCart();
              }}
              className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-red-600/20 transition-all active:scale-95"
              title="View Toy Cart & Express Delivery"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-red-700 text-[11px] font-black shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Avatar Quick Button */}
            <button
              id="header-user-profile-btn"
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('profile');
              }}
              className={`flex items-center gap-1.5 p-1 rounded-xl border transition-all ${
                activeTab === 'profile'
                  ? 'border-indigo-400 bg-indigo-950/60 ring-2 ring-indigo-500/40'
                  : 'border-slate-800 bg-slate-900 hover:border-slate-700'
              }`}
              title="Open User Profile & Favorites"
            >
              {userAvatarUrl ? (
                <img
                  src={userAvatarUrl}
                  alt={userName}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover"
                />
              ) : (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-900 flex items-center justify-center text-xs">
                  👤
                </div>
              )}
              <span className="text-xs text-slate-300 font-semibold hidden lg:inline max-w-[70px] truncate pr-1">
                {userName.split(' ')[0]}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex xl:hidden items-center justify-around py-2 border-t border-slate-800/80 gap-1 text-[11px] overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('map');
            }}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 whitespace-nowrap ${
              activeTab === 'map' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            <span>🏰</span> Map
          </button>

          <button
            onClick={() => {
              soundEffects.playMagicChime();
              setActiveTab('trip_planner');
            }}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 whitespace-nowrap ${
              activeTab === 'trip_planner' ? 'bg-cyan-600 text-white font-bold' : 'text-cyan-300'
            }`}
          >
            <Compass className="w-3 h-3" /> Planner
          </button>

          <button
            onClick={() => {
              soundEffects.playRepulsorBlast();
              setActiveTab('marvel_toy_sailing');
            }}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 whitespace-nowrap ${
              activeTab === 'marvel_toy_sailing' ? 'bg-red-600 text-white font-bold' : 'text-red-400'
            }`}
          >
            <Shield className="w-3 h-3" /> Marvel Sailing
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('merch');
            }}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 whitespace-nowrap ${
              activeTab === 'merch' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            <span>🛍️</span> Store
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('operations');
            }}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 whitespace-nowrap ${
              activeTab === 'operations' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            <span>⚡</span> Ops
          </button>

          <button
            onClick={() => {
              soundEffects.playShipBell();
              setActiveTab('sailing');
            }}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 whitespace-nowrap ${
              activeTab === 'sailing' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            <Anchor className="w-3 h-3 text-emerald-300" /> Sailing
          </button>

          <button
            onClick={() => {
              soundEffects.playMagicChime();
              setActiveTab('loyalty_market');
            }}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 whitespace-nowrap ${
              activeTab === 'loyalty_market' ? 'bg-amber-500 text-slate-950 font-black' : 'text-amber-300'
            }`}
          >
            <span>🎖️</span> Rewards Market
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('profile');
            }}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 whitespace-nowrap ${
              activeTab === 'profile' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            <span>{currentTierConfig.badgeEmoji}</span>
            <span>Profile ({loyaltyPoints}p)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
