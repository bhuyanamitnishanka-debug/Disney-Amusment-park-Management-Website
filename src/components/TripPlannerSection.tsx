import React, { useState, useEffect, useMemo } from 'react';
import { 
  ParkLocation, 
  RouteOptimizationStrategy, 
  TripItineraryPlan, 
  TripItineraryItem 
} from '../types';
import { ALL_PARK_LOCATIONS, calculateParkRoute } from '../data/parkLocationsData';
import { 
  buildTripItineraryPlan, 
  optimizeLocationSequence,
  formatMinutesToTime 
} from '../utils/tripPlannerOptimizer';
import { TRIP_PLANNER_PRESETS, TripPreset } from '../data/tripPlannerPresets';
import { TripRouteMap } from './TripRouteMap';
import { soundEffects } from '../services/audio';
import confetti from 'canvas-confetti';
import { 
  Compass, 
  Clock, 
  MapPin, 
  Navigation, 
  Utensils, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  ArrowUpDown, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  Share2, 
  RotateCcw, 
  Footprints, 
  Shield, 
  Anchor, 
  AlertCircle,
  Calendar,
  Flame
} from 'lucide-react';

interface TripPlannerSectionProps {
  onNavigateToMap?: (locationId?: string) => void;
  onNavigateToMerch?: () => void;
}

export const TripPlannerSection: React.FC<TripPlannerSectionProps> = ({
  onNavigateToMap,
  onNavigateToMerch,
}) => {
  // Selected location IDs for itinerary
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('disney_marvel_trip_planner_ids');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default initial itinerary: Avengers Sprint + Disney Classic mix
    return [
      'space_mountain',
      'cinderella_royal_table',
      'avengers_quinjet',
      'pym_test_kitchen',
      'pirates_sailing',
    ];
  });

  // Trip configuration state
  const [startTime, setStartTime] = useState<string>('09:00 AM');
  const [strategy, setStrategy] = useState<RouteOptimizationStrategy>('smart_wait');
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [expandedWalkingStepId, setExpandedWalkingStepId] = useState<string | null>(null);

  // Search & Filter state for location selector
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'attraction' | 'restaurant' | 'short_wait' | 'marvel' | 'disney'>('all');
  const [landFilter, setLandFilter] = useState<string>('all');

  // Interactive calculation animation state
  const [isCalculating, setIsCalculating] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('disney_marvel_trip_planner_ids', JSON.stringify(selectedLocationIds));
    } catch (e) {
      console.error('Failed saving itinerary to localStorage', e);
    }
  }, [selectedLocationIds]);

  // Resolve selected locations from master catalog
  const selectedLocations = useMemo(() => {
    return selectedLocationIds
      .map((id) => ALL_PARK_LOCATIONS.find((loc) => loc.id === id))
      .filter((loc): loc is ParkLocation => Boolean(loc));
  }, [selectedLocationIds]);

  // Compute Itinerary Plan using optimizer
  const currentPlan: TripItineraryPlan = useMemo(() => {
    return buildTripItineraryPlan(selectedLocations, startTime, strategy, 'My Custom Park Itinerary');
  }, [selectedLocations, startTime, strategy]);

  // Filtered available locations for selector catalog
  const availableLocations = useMemo(() => {
    return ALL_PARK_LOCATIONS.filter((loc) => {
      // Search text
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = loc.name.toLowerCase().includes(query);
        const matchesDesc = loc.description.toLowerCase().includes(query);
        const matchesCuisine = loc.cuisine?.toLowerCase().includes(query);
        const matchesLand = loc.landId.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCuisine && !matchesLand) {
          return false;
        }
      }

      // Land filter
      if (landFilter !== 'all' && loc.landId !== landFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter === 'attraction' && loc.category !== 'attraction') return false;
      if (categoryFilter === 'restaurant' && loc.category !== 'restaurant') return false;
      if (categoryFilter === 'short_wait') {
        const wait = loc.waitTimeMinutes ?? 99;
        if (wait > 25) return false;
      }
      if (categoryFilter === 'marvel' && loc.universe !== 'marvel') return false;
      if (categoryFilter === 'disney' && loc.universe !== 'disney') return false;

      return true;
    });
  }, [searchQuery, categoryFilter, landFilter]);

  // Handlers
  const handleToggleLocation = (locId: string) => {
    if (selectedLocationIds.includes(locId)) {
      soundEffects.playClick();
      setSelectedLocationIds((prev) => prev.filter((id) => id !== locId));
    } else {
      soundEffects.playMagicChime();
      setSelectedLocationIds((prev) => [...prev, locId]);
    }
  };

  const handleApplyPreset = (preset: TripPreset) => {
    soundEffects.playMagicChime();
    setSelectedLocationIds(preset.locationIds);
    setStrategy(preset.strategy);

    // Mini confetti burst
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#06b6d4', '#f59e0b', '#ec4899', '#6366f1'],
    });
  };

  const handleRecalculateOptimalRoute = () => {
    soundEffects.playRepulsorBlast();
    setIsCalculating(true);

    setTimeout(() => {
      setIsCalculating(false);
      soundEffects.playFireworksBoom();
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#10b981', '#3b82f6', '#f59e0b'],
      });
    }, 600);
  };

  const handleMoveStep = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= selectedLocationIds.length) return;

    soundEffects.playClick();
    setSelectedLocationIds((prev) => {
      const next = [...prev];
      const temp = next[fromIndex];
      next[fromIndex] = next[toIndex];
      next[toIndex] = temp;
      return next;
    });
  };

  const handleRemoveStep = (locId: string) => {
    soundEffects.playClick();
    setSelectedLocationIds((prev) => prev.filter((id) => id !== locId));
  };

  const handleClearAll = () => {
    soundEffects.playClick();
    if (window.confirm('Clear all stops from your Trip Itinerary?')) {
      setSelectedLocationIds([]);
    }
  };

  const handleCopyItinerarySummary = () => {
    soundEffects.playClick();
    if (currentPlan.items.length === 0) return;

    const summaryLines = [
      `🏰 Disney WonderKingdom & Marvel Campus • Day Itinerary`,
      `Scheduled Start: ${currentPlan.startTime} | Total Duration: ~${Math.round(currentPlan.totalTripMinutes / 60)}h ${currentPlan.totalTripMinutes % 60}m`,
      `Walking: ${currentPlan.totalWalkingDistanceYards} yards (~${currentPlan.totalWalkingMinutes} mins) | Time Saved: ~${currentPlan.estimatedTimeSavedMinutes} mins`,
      `----------------------------------------`,
      ...currentPlan.items.map(
        (item) =>
          `${item.stepNumber}. [${item.arrivalTime} - ${item.departureTime}] ${item.location.name} (${item.location.category.toUpperCase()}) - Wait: ${item.waitTimeMinutes}m` +
          (item.walkingMinutesToNext > 0 ? `\n   ↳ Walk ~${item.walkingMinutesToNext}m (${item.walkingYardsToNext} yds) to next stop` : '')
      ),
    ];

    navigator.clipboard.writeText(summaryLines.join('\n'));
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  // Convert minutes into clean hours + minutes string
  const formatDurationDisplay = (totalMins: number) => {
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    if (hours === 0) return `${mins} mins`;
    if (mins === 0) return `${hours} hrs`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Top Banner & Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Background glow orb */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-20 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wide">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tactical Park Navigation Engine</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
              Park Day <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-rose-400">Trip Planner</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Curate your dream day across WonderKingdom and Marvel Avengers Campus. Select attractions and dining venues, 
              and our optimization engine calculates the mathematically ideal walking route based on live queue telemetry.
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              id="calculate-route-button"
              onClick={handleRecalculateOptimalRoute}
              disabled={isCalculating || selectedLocationIds.length === 0}
              className={`flex-1 sm:flex-initial px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 ${
                selectedLocationIds.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white shadow-cyan-500/25 ring-2 ring-cyan-400/40'
              }`}
            >
              <Zap className={`w-4 h-4 ${isCalculating ? 'animate-spin' : 'text-amber-300'}`} />
              <span>{isCalculating ? 'Optimizing Route...' : 'Calculate Optimal Route'}</span>
            </button>

            <button
              onClick={handleCopyItinerarySummary}
              disabled={selectedLocationIds.length === 0}
              className="px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all"
              title="Copy itinerary summary to clipboard"
            >
              {copiedToast ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copiedToast ? 'Copied to Clipboard!' : 'Share / Copy'}</span>
            </button>

            {selectedLocationIds.length > 0 && (
              <button
                onClick={handleClearAll}
                className="p-3 rounded-2xl bg-slate-900/90 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-300 transition-colors"
                title="Clear all itinerary stops"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Preset Itinerary Carousel / Pills */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Recommended Ready-to-Go Preset Itineraries:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TRIP_PLANNER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className="group text-left p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all hover:scale-[1.02] active:scale-95 space-y-1"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-base">{preset.icon}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 group-hover:bg-cyan-950 group-hover:text-cyan-300">
                    {preset.estimatedDuration}
                  </span>
                </div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {preset.name}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                  {preset.tagline}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Optimization Strategy & Time Configuration Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs shadow-lg">
        
        {/* Start Time Picker */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Park Arrival / Start Time:</span>
          </label>
          <select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
          >
            <option value="08:00 AM">08:00 AM (Early Rope Drop)</option>
            <option value="08:30 AM">08:30 AM</option>
            <option value="09:00 AM">09:00 AM (Standard Park Opening)</option>
            <option value="09:30 AM">09:30 AM</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="12:00 PM">12:00 PM (Midday Arrival)</option>
            <option value="02:00 PM">02:00 PM (Afternoon Stroll)</option>
          </select>
        </div>

        {/* Optimization Algorithm Strategy */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-indigo-400" />
            <span>Route Optimization Algorithm:</span>
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            
            <button
              onClick={() => {
                soundEffects.playClick();
                setStrategy('smart_wait');
              }}
              className={`p-2 rounded-xl border text-left transition-all ${
                strategy === 'smart_wait'
                  ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 ring-1 ring-cyan-500/50'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-bold flex items-center gap-1">
                <span>⚡</span> Smart Wait-Time
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Minimizes combined queue + walking</div>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                setStrategy('min_walking');
              }}
              className={`p-2 rounded-xl border text-left transition-all ${
                strategy === 'min_walking'
                  ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/50'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-bold flex items-center gap-1">
                <span>🚶</span> Minimal Walking
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Shortest physical footsteps loop</div>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                setStrategy('balanced_dining');
              }}
              className={`p-2 rounded-xl border text-left transition-all ${
                strategy === 'balanced_dining'
                  ? 'bg-amber-950/60 border-amber-500 text-amber-200 ring-1 ring-amber-500/50'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="font-bold flex items-center gap-1">
                <span>🍽️</span> Balanced Dining
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Spaces meals comfortably between rides</div>
            </button>

          </div>
        </div>

      </div>

      {/* Metrics Summary Cards */}
      {currentPlan.items.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Total Day Span
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {formatDurationDisplay(currentPlan.totalTripMinutes)}
            </div>
            <div className="text-[11px] text-slate-400">
              {currentPlan.startTime} → {currentPlan.items[currentPlan.items.length - 1]?.departureTime}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Footprints className="w-3.5 h-3.5 text-indigo-400" /> Walking Footsteps
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {currentPlan.totalWalkingDistanceYards.toLocaleString()} <span className="text-xs text-slate-400 font-normal">yds</span>
            </div>
            <div className="text-[11px] text-slate-400">
              ~{currentPlan.totalWalkingMinutes} mins total walking
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Queue Wait Time
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {formatDurationDisplay(currentPlan.totalWaitMinutes)}
            </div>
            <div className="text-[11px] text-slate-400">
              Across {currentPlan.items.filter((i) => i.location.category === 'attraction').length} attractions
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5 text-rose-400" /> Experience Time
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {formatDurationDisplay(currentPlan.totalExperienceMinutes)}
            </div>
            <div className="text-[11px] text-slate-400">
              Riding, dining, and shows
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 space-y-1">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Optimization Value
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-300">
              ~{currentPlan.estimatedTimeSavedMinutes} <span className="text-xs font-normal">mins</span>
            </div>
            <div className="text-[11px] text-emerald-400/80">
              Saved vs unoptimized order!
            </div>
          </div>

        </div>
      )}

      {/* Main Two-Column Interactive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Interactive Blueprint Map + Step-by-Step Chronological Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Interactive Route Blueprint Visualizer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-cyan-400" />
                <span>Walking Route Blueprint</span>
              </h2>
              <span className="text-xs text-slate-400">
                Central Castle Hub Promenade Network
              </span>
            </div>

            <TripRouteMap
              plan={currentPlan}
              activeStepId={activeStepId}
              onSelectStep={(id) => setActiveStepId(id)}
            />
          </div>

          {/* Chronological Timeline Itinerary */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>Chronological Day Timeline</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Step-by-step stops with queue times, experience duration, and turn-by-turn walking legs.
                </p>
              </div>

              {currentPlan.items.length > 1 && (
                <div className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  <span>Reorder available</span>
                </div>
              )}
            </div>

            {currentPlan.items.length === 0 ? (
              <div className="p-8 rounded-3xl bg-slate-900/50 border border-dashed border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-xl">
                  🧭
                </div>
                <div className="text-sm font-bold text-white">Your Itinerary is Empty</div>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Select attractions and restaurants from the right panel or pick a preset above to calculate your custom walking route.
                </p>
              </div>
            ) : (
              <div className="space-y-3 relative">
                
                {currentPlan.items.map((item, index) => {
                  const isLast = index === currentPlan.items.length - 1;
                  const isDining = item.location.category === 'restaurant';
                  const isSelected = activeStepId === item.id;
                  const isWalkingExpanded = expandedWalkingStepId === item.id;

                  return (
                    <div key={item.id} className="space-y-3">
                      
                      {/* STOP CARD */}
                      <div
                        id={`itinerary-step-${item.id}`}
                        onClick={() => setActiveStepId(item.id)}
                        className={`group relative p-4 sm:p-5 rounded-2xl transition-all border ${
                          isSelected
                            ? 'bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/30 shadow-xl'
                            : 'bg-slate-950/80 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          
                          {/* Left: Step Number badge & Location info */}
                          <div className="flex items-start gap-3.5">
                            <div 
                              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-black text-sm text-white shrink-0 shadow-lg ${
                                isDining
                                  ? 'bg-gradient-to-br from-amber-500 to-rose-600 shadow-amber-500/30'
                                  : item.location.universe === 'marvel'
                                  ? 'bg-gradient-to-br from-red-600 to-red-800 shadow-red-500/30'
                                  : 'bg-gradient-to-br from-indigo-600 to-blue-700 shadow-indigo-500/30'
                              }`}
                            >
                              <span>{item.stepNumber}</span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white text-sm sm:text-base leading-tight">
                                  {item.location.name}
                                </span>
                                
                                {item.location.universe === 'marvel' ? (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-950/80 text-red-300 border border-red-800/60">
                                    Marvel Campus
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-950/80 text-blue-300 border border-blue-800/60">
                                    WonderKingdom
                                  </span>
                                )}

                                {isDining && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/60">
                                    {item.location.diningType || 'Dining'}
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-400 line-clamp-2">
                                {item.location.description}
                              </p>

                              {/* Timing Pills */}
                              <div className="pt-1 flex items-center gap-3 flex-wrap text-xs">
                                <div className="flex items-center gap-1 font-mono text-cyan-300 font-bold bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-800/40">
                                  <Clock className="w-3 h-3 text-cyan-400" />
                                  <span>{item.arrivalTime} – {item.departureTime}</span>
                                </div>

                                <div className="flex items-center gap-1 text-slate-300 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800 text-[11px]">
                                  <span>Wait:</span>
                                  <strong className={item.waitTimeMinutes > 40 ? 'text-amber-400' : 'text-emerald-400'}>
                                    {item.waitTimeMinutes} mins
                                  </strong>
                                </div>

                                <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                                  <span>Stay:</span>
                                  <span className="text-slate-200">~{item.experienceDurationMinutes} mins</span>
                                </div>

                                {item.location.lightningLaneAvailable && (
                                  <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                                    <Zap className="w-3 h-3" />
                                    <span>Lightning Lane</span>
                                  </div>
                                )}

                                {item.location.mobileOrderAvailable && (
                                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Mobile Order</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right: Step Reorder and Remove controls */}
                          <div className="flex items-center gap-1 shrink-0">
                            <div className="flex flex-col gap-0.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveStep(index, 'up');
                                }}
                                disabled={index === 0}
                                className={`p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ${
                                  index === 0 ? 'opacity-20 cursor-not-allowed' : ''
                                }`}
                                title="Move stop earlier"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveStep(index, 'down');
                                }}
                                disabled={isLast}
                                className={`p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ${
                                  isLast ? 'opacity-20 cursor-not-allowed' : ''
                                }`}
                                title="Move stop later"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveStep(item.locationId);
                              }}
                              className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                              title="Remove stop from itinerary"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>
                      </div>

                      {/* WALKING CONNECTOR TO NEXT STOP */}
                      {!isLast && (
                        <div className="pl-6 sm:pl-7 my-1">
                          <div className="border-l-2 border-dashed border-indigo-500/40 pl-5 py-1 space-y-2">
                            
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                                <Footprints className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Walk <strong className="text-white">~{item.walkingMinutesToNext} min</strong></span>
                                <span className="text-slate-500">•</span>
                                <span className="text-slate-400">{item.walkingYardsToNext.toLocaleString()} yards via Central Promenade</span>
                              </div>

                              {item.routeToNext && item.routeToNext.steps.length > 0 && (
                                <button
                                  onClick={() => setExpandedWalkingStepId(isWalkingExpanded ? null : item.id)}
                                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors"
                                >
                                  <span>{isWalkingExpanded ? 'Hide Steps' : 'Turn-by-turn guidance'}</span>
                                  <ChevronDown className={`w-3 h-3 transition-transform ${isWalkingExpanded ? 'rotate-180' : ''}`} />
                                </button>
                              )}
                            </div>

                            {/* Expandable turn-by-turn walking steps */}
                            {isWalkingExpanded && item.routeToNext && (
                              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5 animate-fadeIn">
                                <div className="text-[11px] font-bold text-slate-300">
                                  Walking route to {currentPlan.items[index + 1]?.location.name}:
                                </div>
                                <ol className="space-y-1 text-slate-400 text-[11px]">
                                  {item.routeToNext.steps.map((step, sIdx) => (
                                    <li key={sIdx} className="flex items-start gap-1.5">
                                      <span className="text-cyan-400 font-bold">{sIdx + 1}.</span>
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}

                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}

              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Location Catalog & Selector Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 sticky top-24">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>Attraction & Dining Catalog</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Add or remove destinations to recalculate your route.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/60">
                {selectedLocationIds.length} Added
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search rides, restaurants, cuisine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Filter Pills */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    categoryFilter === 'all'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  All ({ALL_PARK_LOCATIONS.length})
                </button>

                <button
                  onClick={() => setCategoryFilter('attraction')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    categoryFilter === 'attraction'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  🎢 Attractions
                </button>

                <button
                  onClick={() => setCategoryFilter('restaurant')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    categoryFilter === 'restaurant'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  🍽️ Dining
                </button>

                <button
                  onClick={() => setCategoryFilter('short_wait')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    categoryFilter === 'short_wait'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  ⏱️ Low Wait (&lt;25m)
                </button>

                <button
                  onClick={() => setCategoryFilter('marvel')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    categoryFilter === 'marvel'
                      ? 'bg-red-600 text-white font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Shield className="w-3 h-3 inline mr-1" /> Marvel
                </button>
              </div>

              {/* Land filter dropdown */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400">Filter Land:</span>
                <select
                  value={landFilter}
                  onChange={(e) => setLandFilter(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="all">All Lands & Campuses</option>
                  <option value="avengers_campus">Avengers Campus</option>
                  <option value="tomorrowland">Tomorrowland</option>
                  <option value="fantasyland">Fantasyland</option>
                  <option value="adventureland">Adventureland</option>
                  <option value="star_wars">Star Wars Outpost</option>
                  <option value="pixar_pier">Pixar Pier</option>
                </select>
              </div>
            </div>

            {/* Scrollable list of available locations */}
            <div className="max-h-[580px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {availableLocations.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No matching locations found for current filters.
                </div>
              ) : (
                availableLocations.map((loc) => {
                  const isAdded = selectedLocationIds.includes(loc.id);
                  const isDining = loc.category === 'restaurant';
                  const wait = loc.waitTimeMinutes ?? 15;

                  return (
                    <div
                      key={loc.id}
                      className={`p-3 rounded-2xl border transition-all ${
                        isAdded
                          ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md'
                          : 'bg-slate-950/70 hover:bg-slate-950 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2.5">
                        
                        {/* Thumbnail */}
                        {loc.image && (
                          <img
                            src={loc.image}
                            alt={loc.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-800"
                          />
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-white truncate">
                              {loc.name}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span className="capitalize">{loc.landId.replace('_', ' ')}</span>
                            <span>•</span>
                            {isDining ? (
                              <span className="text-amber-400">{loc.cuisine || 'Gourmet'}</span>
                            ) : (
                              <span>Attraction</span>
                            )}
                          </div>

                          {/* Live wait time tag */}
                          <div className="flex items-center gap-1.5 pt-0.5 text-[10px]">
                            <span
                              className={`px-1.5 py-0.2 rounded font-bold ${
                                wait <= 20
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                                  : wait <= 45
                                  ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                                  : 'bg-red-950 text-red-400 border border-red-800/60'
                              }`}
                            >
                              {wait}m queue
                            </span>

                            {loc.lightningLaneAvailable && (
                              <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                                <Zap className="w-2.5 h-2.5" /> LL
                              </span>
                            )}

                            {loc.mobileOrderAvailable && (
                              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Mobile Order
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Add / Remove toggle button */}
                        <button
                          onClick={() => handleToggleLocation(loc.id)}
                          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 active:scale-95 ${
                            isAdded
                              ? 'bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/60'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>Add</span>
                            </>
                          )}
                        </button>

                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
