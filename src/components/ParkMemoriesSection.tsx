import React, { useState, useMemo } from 'react';
import { ParkMemorySnapshot, UserProfile as UserProfileType } from '../types';
import { soundEffects } from '../services/audio';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  Sparkles, 
  Heart, 
  Share2, 
  Download, 
  Trash2, 
  Plus, 
  Filter, 
  Search, 
  Calendar, 
  MapPin, 
  Shield, 
  Flame, 
  Star, 
  Sliders, 
  Info, 
  Check, 
  X, 
  Maximize2, 
  Zap, 
  Compass, 
  Award,
  Layers,
  Sparkle,
  Radio
} from 'lucide-react';
import { IMAGEN_PRESET_TEMPLATES, MemoryPresetTemplate } from '../data/memoriesData';

interface ParkMemoriesSectionProps {
  user: UserProfileType;
  onUpdateUser: (updated: Partial<UserProfileType>) => void;
  onNavigateToAttractionOnMap?: (attractionId: string) => void;
  onOpenSocialShare?: (memory?: ParkMemorySnapshot) => void;
  onOpenSocialFeed?: () => void;
}

export const ParkMemoriesSection: React.FC<ParkMemoriesSectionProps> = ({
  user,
  onUpdateUser,
  onNavigateToAttractionOnMap,
  onOpenSocialShare,
  onOpenSocialFeed,
}) => {
  const memories = useMemo(() => user.parkMemories ?? [], [user.parkMemories]);

  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'disney' | 'marvel' | 'thrill' | 'night' | 'liked'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');

  // Modal states
  const [selectedSnapshot, setSelectedSnapshot] = useState<ParkMemorySnapshot | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'details' | 'prompt_blueprint' | 'telemetry'>('details');

  // Generator form state
  const [genTitle, setGenTitle] = useState('');
  const [genLandName, setGenLandName] = useState('Fantasyland & Cinderella Castle');
  const [genLandId, setGenLandId] = useState('fantasyland');
  const [genUniverse, setGenUniverse] = useState<'disney' | 'marvel'>('disney');
  const [genPrompt, setGenPrompt] = useState('');
  const [genCaption, setGenCaption] = useState('');
  const [genAtmosphere, setGenAtmosphere] = useState('Golden Hour Sunset');
  const [genSelectedPreset, setGenSelectedPreset] = useState<MemoryPresetTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter and sort memories
  const filteredMemories = useMemo(() => {
    return memories
      .filter((mem) => {
        const matchesSearch = 
          mem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mem.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mem.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mem.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return false;

        if (selectedFilter === 'disney') return mem.universe === 'disney';
        if (selectedFilter === 'marvel') return mem.universe === 'marvel';
        if (selectedFilter === 'thrill') return !!mem.ridePhotoStats || mem.highlightBadge.includes('Thrill');
        if (selectedFilter === 'night') return mem.tags.some(t => t.toLowerCase().includes('night') || t.toLowerCase().includes('fireworks'));
        if (selectedFilter === 'liked') return !!mem.userLiked;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.likesCount - a.likesCount;
        return 0; // maintain initial chronological array order
      });
  }, [memories, searchQuery, selectedFilter, sortBy]);

  // Like / Heart Toggle
  const handleToggleLike = (memoryId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEffects.playClick();
    const updated = memories.map((mem) => {
      if (mem.id === memoryId) {
        const isLiked = !mem.userLiked;
        return {
          ...mem,
          userLiked: isLiked,
          likesCount: isLiked ? mem.likesCount + 1 : Math.max(0, mem.likesCount - 1),
        };
      }
      return mem;
    });

    onUpdateUser({ parkMemories: updated });

    // Update selected snapshot if open
    if (selectedSnapshot && selectedSnapshot.id === memoryId) {
      const target = updated.find(m => m.id === memoryId);
      if (target) setSelectedSnapshot(target);
    }
  };

  // Feature / Pin Toggle
  const handleToggleFeatured = (memoryId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEffects.playMagicChime();
    const updated = memories.map((mem) => {
      if (mem.id === memoryId) {
        return { ...mem, featured: !mem.featured };
      }
      return mem;
    });
    onUpdateUser({ parkMemories: updated });
    showToast('Updated featured status on your park profile!');
  };

  // Delete Snapshot
  const handleDeleteSnapshot = (memoryId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to remove this memory snapshot from your collection?')) {
      return;
    }
    soundEffects.playClick();
    const updated = memories.filter((mem) => mem.id !== memoryId);
    onUpdateUser({ parkMemories: updated });
    if (selectedSnapshot?.id === memoryId) {
      setSelectedSnapshot(null);
    }
    showToast('Memory snapshot deleted.');
  };

  // Select a preset template in generator modal
  const handleSelectPreset = (preset: MemoryPresetTemplate) => {
    soundEffects.playClick();
    setGenSelectedPreset(preset);
    setGenTitle(preset.name);
    setGenLandName(preset.landName);
    setGenLandId(preset.landId);
    setGenUniverse(preset.universe);
    setGenPrompt(preset.defaultPrompt);
    setGenCaption(`Experiencing the wonder of ${preset.name}. An unforgettable memory generated with Imagen.`);
  };

  // Handle Generate with Imagen
  const handleGenerateMemory = () => {
    if (!genTitle.trim()) {
      alert('Please provide a title for your memory snapshot.');
      return;
    }

    soundEffects.playMagicChime();
    setIsGenerating(true);
    setGenerationStep('Synthesizing park location semantics with Imagen 3...');

    setTimeout(() => {
      setGenerationStep('Simulating atmospheric lighting, lens bokeh, and depth maps...');
    }, 900);

    setTimeout(() => {
      setGenerationStep('Applying Disney PhotoPass AI metadata and cryptographic watermark...');
    }, 1800);

    setTimeout(() => {
      setIsGenerating(false);
      
      const newSnapshot: ParkMemorySnapshot = {
        id: 'mem_' + Date.now(),
        title: genTitle.trim(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        locationName: genLandName,
        landId: genLandId,
        landName: genLandName,
        universe: genUniverse,
        imageUrl: genSelectedPreset ? genSelectedPreset.imageUrl : 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80',
        caption: genCaption.trim() || `An extraordinary highlight during our visit to ${genLandName}.`,
        highlightBadge: genSelectedPreset ? genSelectedPreset.suggestedBadge : '✨ Imagen 3 Memory Capture',
        photographerType: 'Imagen 3 Pro Snapshot',
        imagenPrompt: genPrompt.trim() || `Cinematic high resolution theme park snapshot of ${genTitle} at ${genLandName} during ${genAtmosphere}, authentic vacation memory.`,
        cameraParameters: {
          lens: '35mm f/1.4 Leica Cine',
          lighting: genAtmosphere,
          aspectRatio: '4:3',
          style: 'Cinematic High-Fidelity Snapshot'
        },
        tags: [genLandName.split(' ')[0], genAtmosphere, 'Imagen Snapshot', genUniverse === 'marvel' ? 'Avengers' : 'Disney Magic'],
        likesCount: 1,
        userLiked: true,
        featured: true,
        companions: [user.displayName, 'Disney & Marvel Cast'],
      };

      const updated = [newSnapshot, ...memories];
      onUpdateUser({ parkMemories: updated });

      // Reset modal
      setIsGenerateModalOpen(false);
      setGenTitle('');
      setGenPrompt('');
      setGenCaption('');
      setGenSelectedPreset(null);

      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#fbbf24', '#f43f5e']
      });

      showToast(`✨ Successfully generated "${newSnapshot.title}" with Imagen!`);
    }, 2600);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 p-3.5 rounded-2xl bg-slate-900 border border-amber-400/80 text-amber-200 text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Control Deck */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-rose-400" />
                <span>Imagen Generative Snapshots</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold">
                {memories.length} Captured Visits
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Park Memories Album
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Relive your unforgettable visits and highlights across Disney WonderKingdom & Avengers Campus. 
              Each memory is rendered with high-fidelity visual fidelity inspired by Imagen generative photography.
            </p>
          </div>

          {/* Action Button: Generate New Memory & Social Feed */}
          <div className="flex flex-wrap items-center gap-3">
            {onOpenSocialFeed && (
              <button
                onClick={() => {
                  soundEffects.playMagicChime();
                  onOpenSocialFeed();
                }}
                className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 text-white text-xs sm:text-sm font-bold border border-rose-500/40 shadow-lg shadow-rose-500/10 transition-all flex items-center gap-2"
              >
                <div className="relative">
                  <Radio className="w-4 h-4 text-rose-400" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                </div>
                <span>Park Pulse Social Feed</span>
              </button>
            )}

            <button
              onClick={() => {
                soundEffects.playMagicChime();
                setIsGenerateModalOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-amber-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white text-xs sm:text-sm font-black shadow-xl shadow-rose-600/20 border border-rose-400/40 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
              <span>Generate New Snapshot</span>
            </button>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Total Snapshots:</span>
            <span className="text-lg font-mono font-black text-white">{memories.length}</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Featured Highlights:</span>
            <span className="text-lg font-mono font-black text-amber-400">
              {memories.filter(m => m.featured).length} Pinned
            </span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Community Likes:</span>
            <span className="text-lg font-mono font-black text-rose-400">
              {memories.reduce((acc, m) => acc + m.likesCount, 0)} ❤️
            </span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">AI Diffusion Engine:</span>
            <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1 mt-1">
              <Zap className="w-3.5 h-3.5" /> Imagen 3 Pro
            </span>
          </div>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memories by ride, land, hero, or keyword..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
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

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => { soundEffects.playClick(); setSelectedFilter('all'); }}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              selectedFilter === 'all'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Snapshots ({memories.length})
          </button>
          <button
            onClick={() => { soundEffects.playClick(); setSelectedFilter('disney'); }}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              selectedFilter === 'disney'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            🏰 Disney Magic
          </button>
          <button
            onClick={() => { soundEffects.playClick(); setSelectedFilter('marvel'); }}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              selectedFilter === 'marvel'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            ⚡ Avengers Campus
          </button>
          <button
            onClick={() => { soundEffects.playClick(); setSelectedFilter('thrill'); }}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              selectedFilter === 'thrill'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            🚀 Coasters & Thrills
          </button>
          <button
            onClick={() => { soundEffects.playClick(); setSelectedFilter('night'); }}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              selectedFilter === 'night'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            🎆 Night Shows
          </button>
          <button
            onClick={() => { soundEffects.playClick(); setSelectedFilter('liked'); }}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              selectedFilter === 'liked'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            ❤️ Liked Only
          </button>
        </div>
      </div>

      {/* SNAPSHOTS GRID */}
      {filteredMemories.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
          <Camera className="w-12 h-12 text-slate-600 mx-auto animate-bounce" />
          <h3 className="text-lg font-bold text-white">No memory snapshots match your filter</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try resetting your search query or generate a brand new park memory using Imagen!
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((memory) => {
            return (
              <div
                key={memory.id}
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedSnapshot(memory);
                }}
                className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-amber-400/60 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
              >
                {/* Image Container with Polaroid Ratio */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                  <img
                    src={memory.imageUrl}
                    alt={memory.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-[10px] font-bold text-white flex items-center gap-1 shadow-md">
                      {memory.highlightBadge}
                    </span>

                    {memory.featured && (
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Star className="w-3 h-3 fill-slate-950" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  {/* Photopass / AI Watermark tag */}
                  <div className="absolute bottom-3 left-3 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-sm border border-slate-800 text-[9px] font-mono text-cyan-300">
                      ⚡ {memory.photographerType}
                    </span>
                  </div>

                  {/* Hover Quick Action: Expand */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-lg flex items-center gap-1 text-[11px]">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    
                    {/* Date & Land */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{memory.date}</span>
                      </span>
                      <span className={`font-semibold ${memory.universe === 'marvel' ? 'text-red-400' : 'text-blue-400'}`}>
                        {memory.landName.split('&')[0]}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {memory.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed italic">
                      "{memory.caption}"
                    </p>
                  </div>

                  {/* Ride stats pill if present */}
                  {memory.ridePhotoStats && (
                    <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center justify-between text-[10px] font-mono">
                      {memory.ridePhotoStats.maxSpeedMph && (
                        <span className="text-amber-400 font-bold">
                          ⚡ {memory.ridePhotoStats.maxSpeedMph} MPH
                        </span>
                      )}
                      {memory.ridePhotoStats.gForce && (
                        <span className="text-cyan-400">
                          Force: {memory.ridePhotoStats.gForce}
                        </span>
                      )}
                      {memory.ridePhotoStats.score && (
                        <span className="text-emerald-400 font-bold">
                          ★ {memory.ridePhotoStats.score.toLocaleString()} pts
                        </span>
                      )}
                    </div>
                  )}

                  {/* Card Footer: Tags & Like Button */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-1 overflow-hidden h-6">
                      {memory.tags.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {onOpenSocialShare && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            soundEffects.playMagicChime();
                            onOpenSocialShare(memory);
                          }}
                          className="p-1.5 rounded-xl border bg-slate-800 hover:bg-cyan-600/30 text-slate-400 hover:text-cyan-300 border-slate-700 transition-all flex items-center gap-1"
                          title="Share to Simulated Social Media (MagicGram, StarkNet, KingdomBook)"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={(e) => handleToggleLike(memory.id, e)}
                        className={`p-1.5 rounded-xl border flex items-center gap-1 transition-all ${
                          memory.userLiked
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                        }`}
                        title={memory.userLiked ? 'Unlike' : 'Like snapshot'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${memory.userLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span className="text-[11px] font-mono font-bold">{memory.likesCount}</span>
                      </button>

                      <button
                        onClick={(e) => handleToggleFeatured(memory.id, e)}
                        className={`p-1.5 rounded-xl border transition-all ${
                          memory.featured
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                        }`}
                        title={memory.featured ? 'Remove from profile spotlight' : 'Pin to profile spotlight'}
                      >
                        <Star className={`w-3.5 h-3.5 ${memory.featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. EXPANDED SNAPSHOT LIGHTBOX & DETAILS MODAL */}
      {/* ========================================================================= */}
      {selectedSnapshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold">
                  {selectedSnapshot.highlightBadge}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">•</span>
                <span className="text-xs text-slate-400 hidden sm:inline">{selectedSnapshot.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundEffects.playMagicChime();
                    if (onOpenSocialShare) {
                      onOpenSocialShare(selectedSnapshot);
                    } else {
                      navigator.clipboard?.writeText(window.location.href);
                      showToast('Snapshot commemorative link copied to clipboard!');
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Share Snapshot to Social Media (MagicGram, StarkNet, KingdomBook)"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share to Social</span>
                </button>
                <button
                  onClick={() => {
                    soundEffects.playMagicChime();
                    showToast('Simulated high-res PhotoPass card download initiated!');
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                  title="Download High-Res"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteSnapshot(selectedSnapshot.id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300"
                  title="Delete Snapshot"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedSnapshot(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Photo View */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-950 overflow-hidden">
              <img
                src={selectedSnapshot.imageUrl}
                alt={selectedSnapshot.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 pointer-events-none">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    ⚡ {selectedSnapshot.photographerType}
                  </span>
                  <h3 className="text-lg sm:text-2xl font-black text-white drop-shadow-md">
                    {selectedSnapshot.title}
                  </h3>
                </div>

                <div className="pointer-events-auto">
                  <button
                    onClick={() => handleToggleLike(selectedSnapshot.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md ${
                      selectedSnapshot.userLiked
                        ? 'bg-rose-600 text-white border-rose-400'
                        : 'bg-slate-950/80 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${selectedSnapshot.userLiked ? 'fill-white' : ''}`} />
                    <span>{selectedSnapshot.likesCount} Likes</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs switcher inside modal */}
            <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-slate-950 text-xs">
              <button
                onClick={() => setActiveModalTab('details')}
                className={`pb-2.5 font-bold border-b-2 transition-colors ${
                  activeModalTab === 'details'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Memory Story & Highlights
              </button>
              <button
                onClick={() => setActiveModalTab('prompt_blueprint')}
                className={`pb-2.5 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeModalTab === 'prompt_blueprint'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Imagen Diffusion Blueprint</span>
              </button>
              {selectedSnapshot.ridePhotoStats && (
                <button
                  onClick={() => setActiveModalTab('telemetry')}
                  className={`pb-2.5 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeModalTab === 'telemetry'
                      ? 'border-rose-400 text-rose-300'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>On-Ride Telemetry</span>
                </button>
              )}
            </div>

            {/* Tab 1: Story Details */}
            {activeModalTab === 'details' && (
              <div className="p-6 space-y-4 text-xs">
                <div>
                  <h4 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                    Guest Vacation Caption
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed italic bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    "{selectedSnapshot.caption}"
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px]">Location & Land:</span>
                    <div className="font-bold text-white flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{selectedSnapshot.locationName}</span>
                    </div>
                    <span className="text-slate-400 text-[11px] block">
                      Sector: {selectedSnapshot.landName}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px]">Companions in Frame:</span>
                    <div className="font-semibold text-slate-200">
                      {selectedSnapshot.companions && selectedSnapshot.companions.length > 0
                        ? selectedSnapshot.companions.join(', ')
                        : 'Solo Exploration'}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <span className="text-slate-500 text-[10px] block mb-1.5">Memory Tags:</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {selectedSnapshot.tags.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 text-[11px]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Imagen Prompt Blueprint */}
            {activeModalTab === 'prompt_blueprint' && (
              <div className="p-6 space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                      Grounding Diffusion Prompt (Imagen 3)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Photorealistic Mode</span>
                  </div>
                  <p className="font-mono text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800 select-all">
                    "{selectedSnapshot.imagenPrompt}"
                  </p>
                </div>

                {selectedSnapshot.cameraParameters && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Simulated Lens:</span>
                      <span className="font-mono text-amber-300 font-bold">
                        {selectedSnapshot.cameraParameters.lens || '35mm f/1.4'}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Lighting Environment:</span>
                      <span className="font-mono text-cyan-300 font-bold">
                        {selectedSnapshot.cameraParameters.lighting || 'Cinematic Ambient'}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Aspect Ratio:</span>
                      <span className="font-mono text-slate-200 font-bold">
                        {selectedSnapshot.cameraParameters.aspectRatio || '4:3'}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Diffusion Seed:</span>
                      <span className="font-mono text-emerald-400 font-bold">#482910</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: On-Ride Telemetry */}
            {activeModalTab === 'telemetry' && selectedSnapshot.ridePhotoStats && (
              <div className="p-6 space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-white">
                      {selectedSnapshot.ridePhotoStats.attractionName || 'Attraction Telemetry'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                      Disney PhotoPass Sensor Grid
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    {selectedSnapshot.ridePhotoStats.maxSpeedMph && (
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Top Velocity</span>
                        <span className="text-xl font-mono font-black text-amber-400">
                          {selectedSnapshot.ridePhotoStats.maxSpeedMph} MPH
                        </span>
                      </div>
                    )}
                    {selectedSnapshot.ridePhotoStats.gForce && (
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Peak G-Force</span>
                        <span className="text-xl font-mono font-black text-cyan-400">
                          {selectedSnapshot.ridePhotoStats.gForce}
                        </span>
                      </div>
                    )}
                    {selectedSnapshot.ridePhotoStats.score && (
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Interactive Score</span>
                        <span className="text-xl font-mono font-black text-emerald-400">
                          {selectedSnapshot.ridePhotoStats.score.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. GENERATE NEW MEMORY WITH IMAGEN STUDIO MODAL */}
      {/* ========================================================================= */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-gradient-to-r from-slate-950 via-indigo-950/80 to-slate-950">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-md">
                  <Sparkles className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Imagen Park Memory Studio
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Synthesize a commemorative park highlight using Imagen generative diffusion
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-6 space-y-5 text-xs">
              
              {/* Presets Quick Pick */}
              <div className="space-y-2">
                <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">
                  1. Choose a Scene Preset (or create custom below):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {IMAGEN_PRESET_TEMPLATES.map((preset) => {
                    const isSelected = genSelectedPreset?.id === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset)}
                        className={`p-2 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                          isSelected
                            ? 'bg-rose-500/20 border-rose-400 shadow-lg shadow-rose-500/20'
                            : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800'
                        }`}
                      >
                        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-900">
                          <img
                            src={preset.imageUrl}
                            alt={preset.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-bold text-white text-[11px] line-clamp-1">
                          {preset.name}
                        </span>
                        <span className="text-[9px] text-slate-400 line-clamp-1">
                          {preset.landName.split('&')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title & Land Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400 text-[11px] font-bold">Memory Snapshot Title:</label>
                  <input
                    type="text"
                    value={genTitle}
                    onChange={(e) => setGenTitle(e.target.value)}
                    placeholder="e.g. Slinky Dog Sunset Dash, Quinjet Launch..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 text-[11px] font-bold">Target Park Land:</label>
                  <select
                    value={genLandId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setGenLandId(id);
                      if (id === 'avengers_campus') {
                        setGenLandName('Marvel Avengers Campus');
                        setGenUniverse('marvel');
                      } else if (id === 'tomorrowland') {
                        setGenLandName('Tomorrowland & Space Port');
                        setGenUniverse('disney');
                      } else if (id === 'adventureland') {
                        setGenLandName('Adventureland & Pirates Sailing Bay');
                        setGenUniverse('disney');
                      } else if (id === 'star_wars') {
                        setGenLandName("Galaxy's Edge Outpost");
                        setGenUniverse('disney');
                      } else {
                        setGenLandName('Fantasyland & Cinderella Castle');
                        setGenUniverse('disney');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-rose-500"
                  >
                    <option value="fantasyland">🏰 Fantasyland & Cinderella Castle</option>
                    <option value="avengers_campus">⚡ Marvel Avengers Campus</option>
                    <option value="tomorrowland">🚀 Tomorrowland & Space Port</option>
                    <option value="adventureland">🚢 Adventureland & Pirates Bay</option>
                    <option value="star_wars">🛸 Galaxy's Edge Outpost</option>
                  </select>
                </div>
              </div>

              {/* Atmosphere / Lighting Options */}
              <div className="space-y-1.5">
                <label className="text-slate-400 text-[11px] font-bold">Lighting & Atmosphere:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Golden Hour Sunset', 'Nighttime Fireworks', 'Arc Reactor Twilight', 'Crisp Sunny Morning'].map((atmos) => (
                    <button
                      key={atmos}
                      type="button"
                      onClick={() => setGenAtmosphere(atmos)}
                      className={`px-3 py-2 rounded-xl border text-[11px] font-bold transition-all ${
                        genAtmosphere === atmos
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {atmos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-400 text-[11px] font-bold">
                    Imagen Creative Prompt:
                  </label>
                  <span className="text-[10px] text-cyan-400">Diffusion Guided</span>
                </div>
                <textarea
                  rows={2}
                  value={genPrompt}
                  onChange={(e) => setGenPrompt(e.target.value)}
                  placeholder="Describe your scene: e.g. A vibrant vacation snapshot of Cinderella Castle at twilight with fireworks reflecting in the royal lagoon, guests smiling, hyper-detailed..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:border-rose-500"
                />
              </div>

              {/* Guest Caption */}
              <div className="space-y-1.5">
                <label className="text-slate-400 text-[11px] font-bold">Personal Memory Caption / Note:</label>
                <textarea
                  rows={2}
                  value={genCaption}
                  onChange={(e) => setGenCaption(e.target.value)}
                  placeholder="Share what made this moment magical (e.g. First time riding front row with the kids, watching the fireworks...)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:border-rose-500"
                />
              </div>

              {/* Generation Progress Indicator */}
              {isGenerating && (
                <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/60 text-center space-y-2">
                  <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-amber-300 animate-pulse">
                    {generationStep}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isGenerating || !genTitle.trim()}
                  onClick={handleGenerateMemory}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-amber-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-extrabold shadow-lg shadow-rose-600/30 border border-rose-400/40 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Snapshot with Imagen</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
