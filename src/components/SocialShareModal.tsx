import React, { useState, useEffect } from 'react';
import { 
  ParkMemorySnapshot, 
  RedeemedPerkVoucher, 
  UserProfile, 
  SimulatedSocialPost, 
  SocialPlatform,
  SimulatedComment 
} from '../types';
import { 
  SOCIAL_PLATFORMS, 
  PHOTO_FILTERS, 
  CHARACTER_AUTO_REACTIONS, 
  PhotoFilterOption 
} from '../data/socialFeedData';
import { soundEffects } from '../services/audio';
import confetti from 'canvas-confetti';
import { 
  X, 
  Share2, 
  Check, 
  Sparkles, 
  Heart, 
  MessageSquare, 
  Repeat, 
  Send, 
  Sliders, 
  Tag, 
  Users, 
  Globe, 
  Shield, 
  Copy, 
  Zap, 
  Award, 
  QrCode, 
  Compass, 
  Volume2, 
  Eye,
  Camera
} from 'lucide-react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  memoryToShare?: ParkMemorySnapshot | null;
  voucherToShare?: RedeemedPerkVoucher | null;
  user: UserProfile;
  onPostPublished: (newPost: SimulatedSocialPost) => void;
  onViewSocialFeed?: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  memoryToShare,
  voucherToShare,
  user,
  onPostPublished,
  onViewSocialFeed,
}) => {
  if (!isOpen) return null;

  // Determine what type of item we are sharing
  const [shareType, setShareType] = useState<'memory' | 'voucher'>(
    voucherToShare ? 'voucher' : 'memory'
  );

  // Selected social platform
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('magic_gram');

  // Filter effect for photos
  const [selectedFilter, setSelectedFilter] = useState<PhotoFilterOption>(PHOTO_FILTERS[0]);

  // Form custom state
  const [caption, setCaption] = useState('');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [selectedTaggedCharacters, setSelectedTaggedCharacters] = useState<string[]>([]);
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);
  const [audience, setAudience] = useState<'public' | 'allies' | 'family'>('public');

  // Success state
  const [publishedPost, setPublishedPost] = useState<SimulatedSocialPost | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Active memory or voucher
  const activeMemory = memoryToShare || (user.parkMemories && user.parkMemories[0]) || null;
  const activeVoucher = voucherToShare || (user.redeemedVouchers && user.redeemedVouchers[0]) || null;

  // Sync default captions and tags on open or when target changes
  useEffect(() => {
    if (shareType === 'voucher' && activeVoucher) {
      setCaption(
        `Just unlocked my ${activeVoucher.title}! ${activeVoucher.selectedOption ? `Target: ${activeVoucher.selectedOption}. ` : ''}Redeemed ${activeVoucher.cost} loyalty points with zero standby wait! 🎟️✨`
      );
      setSelectedHashtags(['#LoyaltyPerks', '#WonderKingdom', '#VIPAccess', '#FastPassSkip']);
      setSelectedStickers(['🎟️ Official Pass', '👑 VIP Reward']);
      setSelectedTaggedCharacters(['Sorcerer Mickey']);
    } else if (activeMemory) {
      setCaption(
        `${activeMemory.title}: ${activeMemory.caption} ✨`
      );
      setSelectedHashtags([
        `#${activeMemory.landName.split('&')[0].replace(/\s+/g, '')}`,
        activeMemory.universe === 'marvel' ? '#AvengersCampus' : '#DisneyMagic',
        '#ParkMemories',
        '#WonderKingdom'
      ]);
      setSelectedStickers([
        activeMemory.highlightBadge,
        activeMemory.universe === 'marvel' ? '⚡ Arc Reactor VIP' : '🏰 Castle Certified'
      ]);
      setSelectedTaggedCharacters(activeMemory.companions || [activeMemory.universe === 'marvel' ? 'Tony Stark' : 'Cinderella']);
    }
    setPublishedPost(null);
  }, [shareType, activeMemory, activeVoucher]);

  // Quick caption suggestions
  const getCaptionSuggestions = () => {
    if (shareType === 'voucher' && activeVoucher) {
      return [
        `Skipped the line with my ${activeVoucher.title}! Best loyalty points ever spent! ⚡`,
        `VIP treatment today! Claimed ${activeVoucher.title} for ${activeVoucher.cost} pts 🎟️`,
        `Disney WonderKingdom loyalty perks are next-level. Just redeemed ${activeVoucher.title}! ✨`,
      ];
    }
    if (activeMemory?.universe === 'marvel') {
      return [
        `Suiting up at Avengers Campus! Telemetry clocked maximum thrills. ⚡🚀`,
        `Stark Industries approved our tactical deployment today! Quinjet launch was wild! 🛡️`,
        `High scores and repulsor blasts! Best day at Marvel Avengers Campus. 🕸️`,
      ];
    }
    return [
      `Pure fairy tale magic right in the heart of WonderKingdom! ✨🏰`,
      `Making lifelong memories under the royal fireworks and castles! 🎆`,
      `Nothing compares to a day full of dreams and adventures! ❤️`,
    ];
  };

  const handleToggleHashtag = (tag: string) => {
    soundEffects.playClick();
    if (selectedHashtags.includes(tag)) {
      setSelectedHashtags(selectedHashtags.filter(t => t !== tag));
    } else {
      setSelectedHashtags([...selectedHashtags, tag]);
    }
  };

  const handleToggleCharacter = (char: string) => {
    soundEffects.playClick();
    if (selectedTaggedCharacters.includes(char)) {
      setSelectedTaggedCharacters(selectedTaggedCharacters.filter(c => c !== char));
    } else {
      setSelectedTaggedCharacters([...selectedTaggedCharacters, char]);
    }
  };

  const handleToggleSticker = (sticker: string) => {
    soundEffects.playClick();
    if (selectedStickers.includes(sticker)) {
      setSelectedStickers(selectedStickers.filter(s => s !== sticker));
    } else {
      setSelectedStickers([...selectedStickers, sticker]);
    }
  };

  const handlePublish = () => {
    soundEffects.playCameraShutter();
    setTimeout(() => soundEffects.playSocialPostSuccess(), 120);

    // Fire celebratory confetti
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.65 },
      colors: selectedPlatform === 'stark_net' 
        ? ['#00e5ff', '#ff1744', '#ffd600'] 
        : ['#ec4899', '#8b5cf6', '#f59e0b', '#3b82f6'],
    });

    const isVoucher = shareType === 'voucher' && !!activeVoucher;

    // Generate 1-2 instant realistic character replies based on universe & content
    const matchedUniverse = isVoucher ? 'disney' : (activeMemory?.universe || 'disney');
    const eligibleCharacters = CHARACTER_AUTO_REACTIONS.filter(
      c => c.universe === matchedUniverse || c.character === 'Tony Stark' || c.character === 'Sorcerer Mickey'
    );
    const chosenChar = eligibleCharacters[Math.floor(Math.random() * eligibleCharacters.length)];
    const randomCommentText = chosenChar.commentPool[Math.floor(Math.random() * chosenChar.commentPool.length)];

    const instantComments: SimulatedComment[] = [
      {
        id: 'comm_' + Date.now(),
        authorName: chosenChar.character,
        authorHandle: chosenChar.handle,
        authorAvatar: chosenChar.avatar,
        isCharacter: true,
        characterRole: matchedUniverse === 'marvel' ? 'Avenger Mentor' : 'Royal Host',
        content: randomCommentText,
        timestamp: 'Just Now',
        likesCount: 1,
      }
    ];

    const newPost: SimulatedSocialPost = {
      id: 'post_user_' + Date.now(),
      platform: selectedPlatform,
      postType: isVoucher ? 'loyalty_redemption' : 'park_memory',
      referenceId: isVoucher ? activeVoucher.id : (activeMemory?.id || 'mem_default'),
      authorName: user.displayName || 'Guest Adventurer',
      authorHandle: '@' + (user.displayName || 'guest').toLowerCase().replace(/\s+/g, '_'),
      authorAvatar: user.avatarUrl,
      authorTier: `${user.loyaltyTier.toUpperCase()} VIP`,
      createdAt: 'Just now',
      title: isVoucher ? `Redeemed: ${activeVoucher.title}` : (activeMemory?.title || 'Park Memory'),
      caption: caption.trim(),
      locationName: isVoucher ? 'WonderKingdom Guest Concierge' : (activeMemory?.locationName || 'Theme Park Promenade'),
      landName: isVoucher ? 'Kingdom Loyalty Hub' : (activeMemory?.landName || 'WonderKingdom'),
      universe: isVoucher ? 'disney' : (activeMemory?.universe || 'disney'),
      imageUrl: isVoucher ? undefined : activeMemory?.imageUrl,
      filterApplied: selectedFilter.id,
      tags: selectedHashtags,
      taggedCharacters: selectedTaggedCharacters,
      stickers: selectedStickers,
      audience,
      voucherData: isVoucher ? {
        rewardTitle: activeVoucher.title,
        rewardCategory: activeVoucher.category,
        icon: activeVoucher.icon,
        cost: activeVoucher.cost,
        voucherCode: activeVoucher.code,
        barcode: activeVoucher.barcode,
        tierTitle: `${user.loyaltyTier.toUpperCase()} Tier Pass`,
        expiresAt: activeVoucher.expiresAt,
        selectedOption: activeVoucher.selectedOption,
      } : undefined,
      ridePhotoStats: activeMemory?.ridePhotoStats,
      likesCount: Math.floor(Math.random() * 15) + 8,
      userLiked: true,
      sharesCount: Math.floor(Math.random() * 5) + 1,
      commentsCount: 1,
      comments: instantComments,
      reactions: {
        love: Math.floor(Math.random() * 12) + 6,
        magic: Math.floor(Math.random() * 8) + 4,
        wow: Math.floor(Math.random() * 10) + 2,
        cheer: Math.floor(Math.random() * 5) + 2,
      },
    };

    setPublishedPost(newPost);
    onPostPublished(newPost);
  };

  const handleCopyShareLink = () => {
    soundEffects.playMagicChime();
    setIsCopied(true);
    navigator.clipboard?.writeText(
      `${window.location.origin}/#social-post-${publishedPost?.id || 'share'}`
    );
    setTimeout(() => setIsCopied(false), 2500);
  };

  const platformInfo = SOCIAL_PLATFORMS[selectedPlatform];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border shadow-inner ${platformInfo.iconBg}`}>
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Simulated Social Media Hub
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                  Interactive Preview
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Broadcast your park memories and VIP loyalty rewards across virtual guest platforms
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PUBLISHED SUCCESS SCREEN */}
        {publishedPost ? (
          <div className="p-6 sm:p-8 space-y-6 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/10 animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                🎉 Successfully Broadcasted Live!
              </span>
              <h2 className="text-2xl font-black text-white">
                Published to {platformInfo.name}
              </h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Your post is now circulating on the virtual guest network. Fellow visitors and Disney & Marvel characters have started reacting!
              </p>
            </div>

            {/* Instant feedback card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{platformInfo.badgeEmoji}</span>
                  <span className="font-bold text-white">{publishedPost.authorName}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{publishedPost.authorHandle}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-amber-300 font-mono">
                  {publishedPost.createdAt}
                </span>
              </div>

              <p className="text-xs text-slate-200 line-clamp-2 italic">
                "{publishedPost.caption}"
              </p>

              {/* Instant character comment highlight */}
              {publishedPost.comments.length > 0 && (
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-start gap-2.5">
                  <img
                    src={publishedPost.comments[0].authorAvatar}
                    alt={publishedPost.comments[0].authorName}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-amber-400/50 flex-shrink-0"
                  />
                  <div className="space-y-0.5 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-amber-300">
                        {publishedPost.comments[0].authorName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {publishedPost.comments[0].authorHandle}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-[9px] font-bold text-amber-400">
                        Character Reply
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {publishedPost.comments[0].content}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Success Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleCopyShareLink}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'Link Copied!' : 'Copy Direct Share Link'}</span>
              </button>

              {onViewSocialFeed && (
                <button
                  onClick={() => {
                    soundEffects.playMagicChime();
                    onClose();
                    onViewSocialFeed();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>View in Live Park Social Feed →</span>
                </button>
              )}

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setPublishedPost(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Create Another Post
              </button>
            </div>
          </div>
        ) : (
          /* MAIN SHARE COMPOSER */
          <div className="p-4 sm:p-6 space-y-5">
            
            {/* ITEM SELECTOR (Memory vs Loyalty Voucher) */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-medium px-2">What to Share:</span>
                
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setShareType('memory');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    shareType === 'memory'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Park Memory Snapshot</span>
                </button>

                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setShareType('voucher');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    shareType === 'voucher'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Loyalty Reward Redemption</span>
                </button>
              </div>

              {/* Target info badge */}
              <div className="text-[11px] text-slate-400 font-medium pr-2">
                {shareType === 'memory' 
                  ? (activeMemory?.title || 'Selected Photo Snapshot') 
                  : (activeVoucher?.title || 'Loyalty VIP Pass')}
              </div>
            </div>

            {/* PLATFORM SELECTOR TABS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(Object.keys(SOCIAL_PLATFORMS) as SocialPlatform[]).map((pKey) => {
                const p = SOCIAL_PLATFORMS[pKey];
                const isSelected = selectedPlatform === pKey;

                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedPlatform(pKey);
                    }}
                    className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-1 relative overflow-hidden ${
                      isSelected
                        ? 'bg-slate-800/90 border-amber-400/80 shadow-lg ring-2 ring-amber-400/20'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 opacity-75 hover:opacity-100'
                    }`}
                  >
                    {isSelected && (
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${p.themeColor}`} />
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{p.badgeEmoji}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-white block">{p.name}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{p.brandTagline}</span>
                  </button>
                );
              })}
            </div>

            {/* TWO COLUMN GRID: PREVIEW & CUSTOMIZATION FORM */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
              
              {/* LEFT: LIVE SOCIAL POST PREVIEW (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Live Post Preview</span>
                  </span>
                  <span className="font-mono text-[10px] text-cyan-300">
                    {platformInfo.name} Format
                  </span>
                </div>

                {/* THE SIMULATED SOCIAL CARD */}
                <div className={`rounded-3xl border overflow-hidden shadow-2xl transition-all ${
                  selectedPlatform === 'stark_net'
                    ? 'bg-slate-950 border-cyan-500/50 shadow-cyan-500/10'
                    : selectedPlatform === 'magic_gram'
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800 shadow-rose-500/10'
                    : selectedPlatform === 'disney_story'
                    ? 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-purple-500/40'
                    : 'bg-slate-900 border-blue-600/40 shadow-blue-500/10'
                }`}>
                  
                  {/* POST HEADER */}
                  <div className="p-3.5 flex items-center justify-between gap-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img
                          src={user.avatarUrl}
                          alt={user.displayName}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover border-2 border-amber-400/80"
                        />
                        {selectedPlatform === 'stark_net' && (
                          <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-cyan-500 text-slate-950">
                            <Zap className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{user.displayName}</span>
                          <span className="text-[10px] font-mono text-cyan-400">
                            {selectedPlatform === 'stark_net' ? '@tactical_agent' : '@guest'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Compass className="w-2.5 h-2.5 text-slate-500" />
                          <span>
                            {shareType === 'voucher' 
                              ? 'VIP Loyalty Redemptions' 
                              : (activeMemory?.locationName || 'WonderKingdom')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-slate-500">Just Now</span>
                  </div>

                  {/* POST VISUAL CONTENT */}
                  {shareType === 'voucher' && activeVoucher ? (
                    /* HOLOGRAPHIC VIP PASS CARD PREVIEW */
                    <div className="p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/80 relative overflow-hidden border-y border-amber-500/30">
                      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
                      
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-3xl p-2 rounded-2xl bg-slate-950/80 border border-amber-500/40 shadow-lg">
                              {activeVoucher.icon}
                            </span>
                            <div>
                              <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 block">
                                ★ Official Digital Pass
                              </span>
                              <h4 className="text-sm font-extrabold text-white">{activeVoucher.title}</h4>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-mono font-black text-amber-300">
                              {activeVoucher.cost} pts
                            </span>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">
                              Redeemed
                            </span>
                          </div>
                        </div>

                        {/* Barcode Strip */}
                        <div className="p-3 rounded-xl bg-white text-slate-950 text-center space-y-1 shadow-md">
                          <div className="font-mono text-lg font-black tracking-[0.25em] select-none">
                            {activeVoucher.barcode}
                          </div>
                          <div className="text-[10px] font-mono font-bold text-slate-700">
                            CODE: {activeVoucher.code}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Status: <strong className="text-emerald-400">ACTIVE • VALID TODAY</strong></span>
                          <span>Tier: <strong className="text-amber-300">{user.loyaltyTier.toUpperCase()} VIP</strong></span>
                        </div>
                      </div>
                    </div>
                  ) : activeMemory ? (
                    /* PHOTO SNAPSHOT PREVIEW */
                    <div className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden">
                      <img
                        src={activeMemory.imageUrl}
                        alt={activeMemory.title}
                        referrerPolicy="no-referrer"
                        style={{ filter: selectedFilter.cssFilter }}
                        className="w-full h-full object-cover transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                      {/* Filter Name Watermark */}
                      {selectedFilter.id !== 'normal' && (
                        <div className="absolute top-2.5 right-2.5 pointer-events-none">
                          <span className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-700/70 text-[9px] font-mono text-amber-300">
                            ✨ {selectedFilter.name}
                          </span>
                        </div>
                      )}

                      {/* Badges / Stickers Overlay */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-wrap gap-1.5 pointer-events-none">
                        {selectedStickers.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-[10px] font-bold text-white shadow-md">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* POST BODY & CAPTION */}
                  <div className="p-3.5 space-y-2 text-xs">
                    <p className="text-slate-200 leading-relaxed">
                      <strong className="text-white mr-1.5">{user.displayName}</strong>
                      {caption}
                    </p>

                    {/* Hashtags display */}
                    {selectedHashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {selectedHashtags.map((tag, idx) => (
                          <span key={idx} className="text-cyan-400 font-mono text-[11px] hover:underline">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Tagged characters pill */}
                    {selectedTaggedCharacters.length > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-1">
                        <Users className="w-3 h-3 text-amber-400" />
                        <span>With: <strong>{selectedTaggedCharacters.join(', ')}</strong></span>
                      </div>
                    )}

                    {/* SOCIAL ENGAGEMENT COUNTERS FOOTER */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-slate-400 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-rose-400 font-bold">
                          <Heart className="w-3.5 h-3.5 fill-rose-500" />
                          <span>0</span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>0</span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Repeat className="w-3.5 h-3.5" />
                          <span>0</span>
                        </span>
                      </div>

                      <span className="text-[10px] font-mono text-slate-500 capitalize">
                        🌐 {audience} audience
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* RIGHT: CUSTOMIZATION FORM (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* PHOTO FILTER SELECTOR (If sharing memory) */}
                {shareType === 'memory' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-amber-400" />
                        <span>Photo Color & Film Filter:</span>
                      </label>
                      <span className="text-[11px] font-mono text-amber-300">
                        {selectedFilter.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {PHOTO_FILTERS.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => {
                            soundEffects.playClick();
                            setSelectedFilter(f);
                          }}
                          className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                            selectedFilter.id === f.id
                              ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full ${f.previewTint} shadow-inner`} />
                          <span className="text-[10px] font-bold line-clamp-1">{f.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* CAPTION TEXTAREA & QUICK SUGGESTIONS */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      Post Caption:
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {caption.length}/280
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Share your excitement, ride ratings, or magical moments..."
                    className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />

                  {/* Quick Prompts */}
                  <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    <span className="text-[10px] text-slate-500 font-semibold mr-1">Quick ideas:</span>
                    {getCaptionSuggestions().map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          soundEffects.playClick();
                          setCaption(sug);
                        }}
                        className="px-2 py-0.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-[10px] border border-slate-800 hover:border-slate-700 transition-colors"
                      >
                        Idea {idx + 1} ✨
                      </button>
                    ))}
                  </div>
                </div>

                {/* HASHTAGS SELECTOR */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Hashtags:</span>
                  </label>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      '#DisneyWonderKingdom',
                      '#AvengersCampus',
                      '#LoyaltyPerks',
                      '#LightningLaneVIP',
                      '#StarkTech',
                      '#MagicGram',
                      '#NighttimeSpectacular',
                      '#ZeroWait',
                    ].map((tag) => {
                      const isSelected = selectedHashtags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => handleToggleHashtag(tag)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all ${
                            isSelected
                              ? 'bg-cyan-600 text-white font-bold shadow-sm'
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* STICKERS & BADGES */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Overlay Badges & Stickers:</span>
                  </label>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      '⚡ Arc Reactor VIP',
                      '🏰 Castle Certified',
                      '🎟️ FastPass Holder',
                      '👑 Gold Tier Perk',
                      '🚀 Thrill Seeker',
                      '🎆 Nighttime Magic',
                    ].map((sticker) => {
                      const isSelected = selectedStickers.includes(sticker);
                      return (
                        <button
                          key={sticker}
                          onClick={() => handleToggleSticker(sticker)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {sticker}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* TAG CHARACTERS & COMPANIONS */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span>Tag Characters & Allies:</span>
                  </label>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Sorcerer Mickey',
                      'Tony Stark',
                      'Spider-Man',
                      'Cinderella',
                      'Captain Marvel',
                      'Goofy',
                      'Morgan Stark',
                    ].map((char) => {
                      const isSelected = selectedTaggedCharacters.includes(char);
                      return (
                        <button
                          key={char}
                          onClick={() => handleToggleCharacter(char)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-fuchsia-600 text-white font-bold shadow-sm'
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {char}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* AUDIENCE SELECTOR */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <span>Audience:</span>
                    <select
                      value={audience}
                      onChange={(e) => setAudience(e.target.value as any)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-semibold"
                    >
                      <option value="public">🌐 Public WonderKingdom Feed</option>
                      <option value="allies">🛡️ Avengers Tactical Allies Only</option>
                      <option value="family">🏰 Royal Family Circle Only</option>
                    </select>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    onClick={handlePublish}
                    className={`px-6 py-2.5 rounded-2xl text-white font-black text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 ${platformInfo.accentGradient}`}
                  >
                    <Send className="w-4 h-4" />
                    <span>{platformInfo.postVerb}</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
