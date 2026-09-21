import React, { useState, useMemo, useEffect } from 'react';
import { 
  SimulatedSocialPost, 
  SocialPlatform, 
  UserProfile, 
  SimulatedComment 
} from '../types';
import { SOCIAL_PLATFORMS, PHOTO_FILTERS, CHARACTER_AUTO_REACTIONS } from '../data/socialFeedData';
import { soundEffects } from '../services/audio';
import { 
  X, 
  Share2, 
  Heart, 
  MessageSquare, 
  Repeat, 
  Send, 
  Filter, 
  Search, 
  Plus, 
  Sparkles, 
  Award, 
  Camera, 
  Users, 
  Compass, 
  Zap, 
  Copy, 
  Check, 
  Smile, 
  Flame,
  Radio
} from 'lucide-react';

interface SocialFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: SimulatedSocialPost[];
  user: UserProfile;
  onOpenCreateShare: () => void;
  onUpdatePost: (updatedPost: SimulatedSocialPost) => void;
}

export const SocialFeedModal: React.FC<SocialFeedModalProps> = ({
  isOpen,
  onClose,
  posts,
  user,
  onOpenCreateShare,
  onUpdatePost,
}) => {
  if (!isOpen) return null;

  // Filters & Searching
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | 'all'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'memory' | 'redemption'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [livePulseActive, setLivePulseActive] = useState(true);

  // Background simulation pulse: occasionally tick up likes on random post
  useEffect(() => {
    if (!livePulseActive || posts.length === 0) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * posts.length);
      const target = posts[randomIndex];
      if (target) {
        onUpdatePost({
          ...target,
          likesCount: target.likesCount + 1,
        });
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [livePulseActive, posts, onUpdatePost]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (selectedPlatform !== 'all' && post.platform !== selectedPlatform) return false;
      if (selectedType === 'memory' && post.postType !== 'park_memory') return false;
      if (selectedType === 'redemption' && post.postType !== 'loyalty_redemption') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = 
          post.title.toLowerCase().includes(q) ||
          post.caption.toLowerCase().includes(q) ||
          post.authorName.toLowerCase().includes(q) ||
          post.authorHandle.toLowerCase().includes(q) ||
          post.locationName.toLowerCase().includes(q) ||
          post.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }
      return true;
    });
  }, [posts, selectedPlatform, selectedType, searchQuery]);

  // Handle Like Post
  const handleToggleLike = (post: SimulatedSocialPost) => {
    soundEffects.playClick();
    const isLiked = !post.userLiked;
    const updated: SimulatedSocialPost = {
      ...post,
      userLiked: isLiked,
      likesCount: isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
    };
    onUpdatePost(updated);
  };

  // Handle Reaction Click
  const handleAddReaction = (post: SimulatedSocialPost, reactionKey: 'love' | 'magic' | 'wow' | 'cheer') => {
    soundEffects.playMagicChime();
    const curReactions = post.reactions || { love: 0, magic: 0, wow: 0, cheer: 0 };
    const updated: SimulatedSocialPost = {
      ...post,
      reactions: {
        ...curReactions,
        [reactionKey]: (curReactions[reactionKey] || 0) + 1,
      },
      likesCount: post.likesCount + 1,
    };
    onUpdatePost(updated);
  };

  // Handle Submit User Comment
  const handleAddComment = (post: SimulatedSocialPost) => {
    if (!commentInput.trim()) return;
    soundEffects.playClick();

    const userComment: SimulatedComment = {
      id: 'comm_usr_' + Date.now(),
      authorName: user.displayName,
      authorHandle: '@' + user.displayName.toLowerCase().replace(/\s+/g, '_'),
      authorAvatar: user.avatarUrl,
      content: commentInput.trim(),
      timestamp: 'Just Now',
      likesCount: 0,
    };

    const updated: SimulatedSocialPost = {
      ...post,
      commentsCount: post.commentsCount + 1,
      comments: [...post.comments, userComment],
    };

    onUpdatePost(updated);
    setCommentInput('');

    // Trigger character reply simulation after 2 seconds
    setTimeout(() => {
      const candidates = CHARACTER_AUTO_REACTIONS.filter(
        c => post.universe === c.universe || c.character === 'Tony Stark' || c.character === 'Sorcerer Mickey'
      );
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      const replyComment: SimulatedComment = {
        id: 'comm_char_' + Date.now(),
        authorName: chosen.character,
        authorHandle: chosen.handle,
        authorAvatar: chosen.avatar,
        isCharacter: true,
        characterRole: chosen.universe === 'marvel' ? 'Avenger Mentor' : 'Royal Host',
        content: `Replying to @${user.displayName}: ${chosen.commentPool[Math.floor(Math.random() * chosen.commentPool.length)]}`,
        timestamp: 'Just now',
        likesCount: 1,
      };

      onUpdatePost({
        ...updated,
        commentsCount: updated.commentsCount + 1,
        comments: [...updated.comments, replyComment],
      });
      soundEffects.playMagicChime();
    }, 2200);
  };

  const handleCopyPostLink = (postId: string) => {
    soundEffects.playMagicChime();
    setCopiedPostId(postId);
    navigator.clipboard?.writeText(`${window.location.origin}/#social-post-${postId}`);
    setTimeout(() => setCopiedPostId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER BAR */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-fuchsia-600 via-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Park Pulse Social Feed
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Guest Stream
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time photos, ride scores, and VIP loyalty reward redemptions across Disney & Avengers Campus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playMagicChime();
                onOpenCreateShare();
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Share Memory or Perk</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTROLS & FILTER BAR */}
        <div className="p-3 bg-slate-950/90 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 flex-shrink-0">
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts by guest, ride, or hashtag..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:border-amber-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Platform Filters */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-xs">
            <button
              onClick={() => { soundEffects.playClick(); setSelectedPlatform('all'); }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                selectedPlatform === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Platforms
            </button>
            {(Object.keys(SOCIAL_PLATFORMS) as SocialPlatform[]).map((pKey) => {
              const p = SOCIAL_PLATFORMS[pKey];
              const isSelected = selectedPlatform === pKey;
              return (
                <button
                  key={pKey}
                  onClick={() => { soundEffects.playClick(); setSelectedPlatform(pKey); }}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{p.badgeEmoji}</span>
                  <span>{p.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => { soundEffects.playClick(); setSelectedType('all'); }}
              className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                selectedType === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => { soundEffects.playClick(); setSelectedType('memory'); }}
              className={`px-2 py-0.5 rounded-lg font-medium flex items-center gap-1 transition-all ${
                selectedType === 'memory' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>Memories</span>
            </button>
            <button
              onClick={() => { soundEffects.playClick(); setSelectedType('redemption'); }}
              className={`px-2 py-0.5 rounded-lg font-medium flex items-center gap-1 transition-all ${
                selectedType === 'redemption' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              <Award className="w-3 h-3" />
              <span>Perks</span>
            </button>
          </div>

        </div>

        {/* FEED SCROLLABLE CONTENT */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-950/60 border border-slate-800 space-y-3">
              <Camera className="w-12 h-12 text-slate-600 mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-white">No posts matched your current filter</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Be the first to post a new park memory snapshot or loyalty reward redemption to the guest feed!
              </p>
              <button
                onClick={onOpenCreateShare}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Create a Social Post
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const platform = SOCIAL_PLATFORMS[post.platform];
              const isVoucher = post.postType === 'loyalty_redemption';
              const filterObj = PHOTO_FILTERS.find(f => f.id === post.filterApplied);

              return (
                <div
                  key={post.id}
                  className={`rounded-3xl border overflow-hidden shadow-xl transition-all ${
                    post.platform === 'stark_net'
                      ? 'bg-slate-950 border-cyan-500/40 shadow-cyan-500/5'
                      : post.platform === 'magic_gram'
                      ? 'bg-slate-900 border-slate-800 shadow-rose-500/5'
                      : post.platform === 'disney_story'
                      ? 'bg-slate-900 border-purple-500/40'
                      : 'bg-slate-900 border-blue-600/40 shadow-blue-500/5'
                  }`}
                >
                  
                  {/* POST HEADER */}
                  <div className="p-4 flex items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950/50">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border-2 border-amber-400/80 shadow-md"
                        />
                        <span className="absolute -bottom-1 -right-1 text-xs">
                          {platform.badgeEmoji}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs sm:text-sm font-bold text-white">{post.authorName}</span>
                          <span className="text-[11px] font-mono text-slate-400">{post.authorHandle}</span>
                          <span className="px-2 py-0.2 rounded-full bg-slate-800 border border-slate-700 text-[10px] text-amber-300 font-bold">
                            {post.authorTier}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Compass className="w-3 h-3 text-slate-500" />
                          <span>{post.locationName}</span>
                          <span>•</span>
                          <span className={post.universe === 'marvel' ? 'text-red-400 font-semibold' : 'text-blue-400 font-semibold'}>
                            {post.landName.split('&')[0]}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400">
                        {post.createdAt}
                      </span>
                      <button
                        onClick={() => handleCopyPostLink(post.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                        title="Copy direct link to post"
                      >
                        {copiedPostId === post.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* POST CONTENT: REDEMPTION VOUCHER VS MEMORY PHOTO */}
                  {isVoucher && post.voucherData ? (
                    <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden border-y border-amber-500/30">
                      <div className="max-w-md mx-auto space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="text-4xl p-2.5 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-lg">
                              {post.voucherData.icon}
                            </span>
                            <div>
                              <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 block">
                                ★ Official Digital Pass Redemption
                              </span>
                              <h4 className="text-base font-black text-white">{post.voucherData.rewardTitle}</h4>
                              {post.voucherData.selectedOption && (
                                <span className="text-xs text-amber-300 font-semibold block">
                                  {post.voucherData.selectedOption}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-mono font-black text-amber-300">
                              {post.voucherData.cost} pts
                            </span>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">
                              Redeemed
                            </span>
                          </div>
                        </div>

                        {/* Barcode Strip */}
                        <div className="p-4 rounded-2xl bg-white text-slate-950 text-center space-y-1 shadow-lg">
                          <div className="font-mono text-2xl font-black tracking-[0.25em] select-none">
                            {post.voucherData.barcode}
                          </div>
                          <div className="text-xs font-mono font-bold text-slate-800">
                            CODE: {post.voucherData.voucherCode}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Status: <strong className="text-emerald-400 font-bold">ACTIVE • READY TO SCAN</strong></span>
                          <span>Expires: <strong className="text-amber-300 font-bold">{post.voucherData.expiresAt}</strong></span>
                        </div>
                      </div>
                    </div>
                  ) : post.imageUrl ? (
                    <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-950 overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        style={{ filter: filterObj?.cssFilter || 'none' }}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                      {/* Filter Watermark */}
                      {filterObj && filterObj.id !== 'normal' && (
                        <div className="absolute top-3 right-3 pointer-events-none">
                          <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-700 text-[10px] font-mono text-amber-300">
                            ✨ {filterObj.name}
                          </span>
                        </div>
                      )}

                      {/* Ride telemetry HUD pill if thrill ride */}
                      {post.ridePhotoStats && (
                        <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/40 text-[10px] font-mono text-cyan-300 flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5 text-cyan-400" />
                          {post.ridePhotoStats.maxSpeedMph && (
                            <span>{post.ridePhotoStats.maxSpeedMph} MPH</span>
                          )}
                          {post.ridePhotoStats.gForce && (
                            <span>• {post.ridePhotoStats.gForce}</span>
                          )}
                          {post.ridePhotoStats.score && (
                            <span className="text-emerald-400 font-bold">• ★ {post.ridePhotoStats.score.toLocaleString()}</span>
                          )}
                        </div>
                      )}

                      {/* Stickers Pill Strip */}
                      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 pointer-events-none">
                        {post.stickers.map((s, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-[10px] font-bold text-white shadow-md">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* CAPTION & DETAILS */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      <strong className="text-white mr-2">{post.authorName}</strong>
                      {post.caption}
                    </p>

                    {/* Hashtags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.tags.map((tag, idx) => (
                          <span key={idx} className="text-cyan-400 font-mono text-xs hover:underline cursor-pointer">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Tagged companions */}
                    {post.taggedCharacters.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        <span>Tagged Allies: <strong>{post.taggedCharacters.join(', ')}</strong></span>
                      </div>
                    )}

                    {/* QUICK EMOJI REACTION BAR */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => handleAddReaction(post, 'love')}
                        className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs flex items-center gap-1 transition-transform active:scale-95"
                      >
                        <span>❤️</span>
                        <span className="font-mono text-[11px] text-slate-300">{post.reactions?.love || 0}</span>
                      </button>

                      <button
                        onClick={() => handleAddReaction(post, 'magic')}
                        className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs flex items-center gap-1 transition-transform active:scale-95"
                      >
                        <span>✨</span>
                        <span className="font-mono text-[11px] text-slate-300">{post.reactions?.magic || 0}</span>
                      </button>

                      <button
                        onClick={() => handleAddReaction(post, 'wow')}
                        className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs flex items-center gap-1 transition-transform active:scale-95"
                      >
                        <span>😮</span>
                        <span className="font-mono text-[11px] text-slate-300">{post.reactions?.wow || 0}</span>
                      </button>

                      <button
                        onClick={() => handleAddReaction(post, 'cheer')}
                        className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs flex items-center gap-1 transition-transform active:scale-95"
                      >
                        <span>👏</span>
                        <span className="font-mono text-[11px] text-slate-300">{post.reactions?.cheer || 0}</span>
                      </button>

                      <div className="flex-1" />

                      {/* Like & Comments Toggle */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleLike(post)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                            post.userLiked
                              ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                              : 'bg-slate-950 text-slate-300 hover:text-white border-slate-800'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${post.userLiked ? 'fill-white' : ''}`} />
                          <span>{post.likesCount}</span>
                        </button>

                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{post.comments.length}</span>
                        </button>
                      </div>
                    </div>

                    {/* COMMENTS LIST & COMMENT INPUT */}
                    {activeCommentPostId === post.id && (
                      <div className="pt-3 border-t border-slate-800/80 space-y-3 animate-in fade-in duration-150">
                        {/* Comments list */}
                        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                          {post.comments.map((comm) => (
                            <div key={comm.id} className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                              <img
                                src={comm.authorAvatar}
                                alt={comm.authorName}
                                referrerPolicy="no-referrer"
                                className="w-7 h-7 rounded-full object-cover border border-amber-400/60 flex-shrink-0"
                              />
                              <div className="flex-1 space-y-0.5 text-xs">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-white">{comm.authorName}</span>
                                    <span className="text-[10px] font-mono text-slate-400">{comm.authorHandle}</span>
                                    {comm.isCharacter && (
                                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-[9px] font-bold text-amber-400 border border-amber-500/30">
                                        {comm.characterRole || 'Character'}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-500">{comm.timestamp}</span>
                                </div>
                                <p className="text-slate-300 leading-relaxed">
                                  {comm.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add comment input */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment(post);
                            }}
                            placeholder="Add a comment as guest... (characters will reply!)"
                            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:border-amber-400"
                          />
                          <button
                            onClick={() => handleAddComment(post)}
                            disabled={!commentInput.trim()}
                            className={`p-2 rounded-xl font-bold transition-all ${
                              commentInput.trim()
                                ? 'bg-cyan-600 text-white shadow-md'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
