import React, { useState, useEffect, useMemo } from 'react';
import { Attraction, ParkLand, ParkLocation, RouteNavigation } from '../types';
import { ALL_PARK_LOCATIONS, calculateParkRoute } from '../data/parkLocationsData';
import { soundEffects } from '../services/audio';
import { 
  ParkHeatmapToolbar, 
  ParkHeatmapCanvasLayer, 
  HeatmapMode 
} from './ParkHeatmapOverlay';
import { 
  Sparkles, 
  Shield, 
  Anchor, 
  Rocket, 
  Compass, 
  Clock, 
  Users, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Play, 
  Flame,
  ChevronRight,
  Info,
  MapPin,
  Utensils,
  ShoppingBag,
  Navigation,
  RotateCcw,
  Heart,
  ExternalLink,
  ArrowRight,
  Layers
} from 'lucide-react';

interface ParkMapProps {
  lands: ParkLand[];
  attractions: Attraction[];
  onDispatchRide: (attractionId: string) => void;
  onToggleLightningLane: (attractionId: string) => void;
  onUpdateRideStatus: (attractionId: string, status: any) => void;
  favoriteAttractionIds?: string[];
  onToggleFavoriteAttraction?: (attractionId: string) => void;
  onNavigateToMerchStore?: () => void;
  onNavigateToMarvelSection?: () => void;
  onNavigateToTripPlanner?: () => void;
}

export const ParkMap: React.FC<ParkMapProps> = ({
  lands,
  attractions,
  onDispatchRide,
  onToggleLightningLane,
  onUpdateRideStatus,
  favoriteAttractionIds = [],
  onToggleFavoriteAttraction,
  onNavigateToMerchStore,
  onNavigateToMarvelSection,
  onNavigateToTripPlanner,
}) => {
  const [selectedLandId, setSelectedLandId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'attraction' | 'restaurant' | 'shop'>('all');
  const [selectedLocation, setSelectedLocation] = useState<ParkLocation | null>(null);
  
  // Route planning state
  const [routeFromId, setRouteFromId] = useState<string>('space_mountain');
  const [routeToId, setRouteToId] = useState<string>('pym_test_kitchen');
  const [activeRoute, setActiveRoute] = useState<RouteNavigation | null>(null);
  const [showRoutePlanner, setShowRoutePlanner] = useState<boolean>(false);

  // Animations
  const [paradeStep, setParadeStep] = useState<number>(35);
  const [sailingShipPosition, setSailingShipPosition] = useState<{ x: number; y: number }>({ x: 18, y: 64 });
  const [walkProgress, setWalkProgress] = useState<number>(0);

  // Real-time D3 Heatmap visualization state
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>('queue_density');
  const [heatmapIntensity, setHeatmapIntensity] = useState<number>(0.85);
  const [showIsobars, setShowIsobars] = useState<boolean>(true);

  // Live average park congestion saturation percentage
  const parkCongestionAverage = useMemo(() => {
    if (!attractions.length) return 50;
    const totalWait = attractions.reduce((acc, a) => acc + (a.waitTimeMinutes || 0), 0);
    const avgWait = totalWait / attractions.length;
    return Math.min(100, Math.round((avgWait / 60) * 100));
  }, [attractions]);

  // Synchronize locations with live wait times from attractions state
  const unifiedLocations: ParkLocation[] = useMemo(() => {
    return ALL_PARK_LOCATIONS.map((loc) => {
      if (loc.category === 'attraction') {
        const liveRide = attractions.find((a) => a.id === loc.id);
        if (liveRide) {
          return {
            ...loc,
            waitTimeMinutes: liveRide.waitTimeMinutes,
            status: liveRide.status,
            lightningLaneAvailable: liveRide.lightningLaneAvailable,
          };
        }
      }
      return loc;
    });
  }, [attractions]);

  // Recalculate route whenever origin or destination changes
  useEffect(() => {
    if (routeFromId && routeToId && routeFromId !== routeToId) {
      const calculated = calculateParkRoute(routeFromId, routeToId);
      setActiveRoute(calculated);
    } else {
      setActiveRoute(null);
    }
  }, [routeFromId, routeToId]);

  // Animate parade progress, sailing galleon voyage, and route walking traveler
  useEffect(() => {
    const timer = setInterval(() => {
      setParadeStep((prev) => (prev >= 90 ? 10 : prev + 1));
      setWalkProgress((prev) => (prev >= 100 ? 0 : prev + 2));
      setSailingShipPosition((prev) => {
        const nextX = prev.x > 22 ? 14 : prev.x + 0.15;
        const nextY = 62 + Math.sin(Date.now() / 1500) * 2;
        return { x: nextX, y: nextY };
      });
    }, 350);
    return () => clearInterval(timer);
  }, []);

  // Filter locations
  const filteredLocations = unifiedLocations.filter((loc) => {
    const matchesLand = selectedLandId === 'all' || loc.landId === selectedLandId;
    const matchesCat = selectedCategory === 'all' || loc.category === selectedCategory;
    return matchesLand && matchesCat;
  });

  const handleLocationClick = (location: ParkLocation) => {
    if (location.universe === 'marvel') {
      soundEffects.playRepulsorBlast();
    } else if (location.id.includes('sailing') || location.id.includes('pirates')) {
      soundEffects.playShipBell();
    } else {
      soundEffects.playMagicChime();
    }
    setSelectedLocation(location);
  };

  const handleSetRouteTo = (destinationId: string) => {
    soundEffects.playMagicChime();
    setRouteToId(destinationId);
    setShowRoutePlanner(true);
  };

  const handleSetRouteFrom = (originId: string) => {
    soundEffects.playClick();
    setRouteFromId(originId);
    setShowRoutePlanner(true);
  };

  const handleReverseRoute = () => {
    soundEffects.playClick();
    const temp = routeFromId;
    setRouteFromId(routeToId);
    setRouteToId(temp);
  };

  const handleClearRoute = () => {
    soundEffects.playClick();
    setActiveRoute(null);
    setShowRoutePlanner(false);
  };

  // Convert waypoints into SVG polyline points string
  const routePointsString = useMemo(() => {
    if (!activeRoute) return '';
    return activeRoute.waypoints.map((wp) => `${wp.x},${wp.y}`).join(' ');
  }, [activeRoute]);

  // Compute interpolated traveler coordinates along the route
  const travelerPos = useMemo(() => {
    if (!activeRoute || activeRoute.waypoints.length < 2) return null;
    const wps = activeRoute.waypoints;
    const totalSegments = wps.length - 1;
    const segmentFloat = (walkProgress / 100) * totalSegments;
    const currentSegmentIndex = Math.min(Math.floor(segmentFloat), totalSegments - 1);
    const segmentT = segmentFloat - currentSegmentIndex;

    const p1 = wps[currentSegmentIndex];
    const p2 = wps[currentSegmentIndex + 1];

    return {
      x: p1.x + (p2.x - p1.x) * segmentT,
      y: p1.y + (p2.y - p1.y) * segmentT,
    };
  }, [activeRoute, walkProgress]);

  const getLocationIcon = (category: ParkLocation['category']) => {
    switch (category) {
      case 'restaurant': return <Utensils className="w-3.5 h-3.5 text-amber-300" />;
      case 'shop': return <ShoppingBag className="w-3.5 h-3.5 text-rose-300" />;
      case 'attraction':
      default:
        return <Compass className="w-3.5 h-3.5 text-cyan-300" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls: Category Tabs & Land Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-xl">
        
        {/* Category Pills (Attractions, Dining, Shops) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            onClick={() => {
              soundEffects.playClick();
              setSelectedCategory('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Locations ({unifiedLocations.length})</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setSelectedCategory('attraction');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'attraction'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-cyan-300" />
            <span>Attractions & Rides</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setSelectedCategory('restaurant');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'restaurant'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-amber-300" />
            <span>Restaurants & Dining</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setSelectedCategory('shop');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'shop'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-rose-300" />
            <span>Shops & Bazaars</span>
          </button>
        </div>

        {/* Route Planner Toggle Button */}
        <div className="flex items-center gap-2 self-end lg:self-center">
          <button
            onClick={() => {
              soundEffects.playMagicChime();
              setShowRoutePlanner(!showRoutePlanner);
              if (!activeRoute && routeFromId && routeToId) {
                setActiveRoute(calculateParkRoute(routeFromId, routeToId));
              }
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              showRoutePlanner || activeRoute
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800 hover:bg-slate-750 text-indigo-300 border-indigo-500/40'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 text-indigo-300" />
            <span>{activeRoute ? 'Active Route Guidance' : 'Plan Walking Route'}</span>
          </button>

          {/* Land Filter Dropdown */}
          <select
            value={selectedLandId}
            onChange={(e) => {
              soundEffects.playClick();
              setSelectedLandId(e.target.value);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 font-semibold focus:outline-none"
          >
            <option value="all">All Lands</option>
            {lands.map((land) => (
              <option key={land.id} value={land.id}>
                {land.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ROUTE PLANNER CONTROLS OVERLAY (When active) */}
      {showRoutePlanner && (
        <div className="p-4 rounded-3xl bg-slate-900 border border-indigo-500/40 shadow-2xl space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Navigation className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Park Pedestrian Route Planner</h3>
                <p className="text-[11px] text-slate-400">Turn-by-turn guidance connecting any ride, restaurant, or store</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onNavigateToTripPlanner && (
                <button
                  onClick={() => {
                    soundEffects.playMagicChime();
                    onNavigateToTripPlanner();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-cyan-500/20"
                  title="Open the multi-stop Day Trip Planner"
                >
                  <Compass className="w-3 h-3" />
                  <span>Full Day Trip Planner</span>
                </button>
              )}
              <button
                onClick={handleReverseRoute}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
                title="Reverse Start & Destination"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reverse</span>
              </button>
              <button
                onClick={handleClearRoute}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs"
              >
                Close Planner
              </button>
            </div>
          </div>

          {/* Selectors for From and To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Starting From (Location A):</span>
              </label>
              <select
                value={routeFromId}
                onChange={(e) => setRouteFromId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400"
              >
                {unifiedLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    [{loc.category.toUpperCase()}] {loc.name} ({loc.landId.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Destination (Location B):</span>
              </label>
              <select
                value={routeToId}
                onChange={(e) => setRouteToId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-400"
              >
                {unifiedLocations.map((loc) => (
                  <option key={loc.id} value={loc.id} disabled={loc.id === routeFromId}>
                    [{loc.category.toUpperCase()}] {loc.name} ({loc.landId.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Route Metrics and Step-by-Step Directions */}
          {activeRoute && (
            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 space-y-1">
                <div className="text-[11px] text-indigo-300 font-bold">Estimated Walking Time</div>
                <div className="text-xl font-black text-white">~{activeRoute.estimatedMinutes} Minutes</div>
                <div className="text-[11px] text-slate-400">{activeRoute.distanceYards} yards along promenade</div>
              </div>

              <div className="lg:col-span-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                  <span>Turn-by-Turn Directions:</span>
                  <span className="text-[10px] text-cyan-400">Central Hub Route</span>
                </div>
                <ol className="space-y-1 text-slate-400 text-[11px]">
                  {activeRoute.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-indigo-400 font-bold">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Real-time D3.js Heatmap Radar Toolbar */}
      <ParkHeatmapToolbar
        visible={showHeatmap}
        onToggleVisible={() => setShowHeatmap(!showHeatmap)}
        mode={heatmapMode}
        onChangeMode={setHeatmapMode}
        intensity={heatmapIntensity}
        onChangeIntensity={setHeatmapIntensity}
        showIsobars={showIsobars}
        onToggleIsobars={() => setShowIsobars(!showIsobars)}
        activeCongestionAverage={parkCongestionAverage}
      />

      {/* MAIN INTERACTIVE ANIMATED MAP CANVAS */}
      <div className="relative w-full aspect-[16/10] min-h-[480px] max-h-[750px] rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 shadow-2xl shadow-indigo-950/40">
        
        {/* Background Ambience / Atmospheric Lighting */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-red-600/15 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-emerald-600/15 blur-3xl" />
        </div>

        {/* SVG Decorative Trails & Interactive Route Polyline */}
        <svg 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none" 
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            <linearGradient id="routeGlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="1" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.9" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Central Hub Rings */}
          <circle cx="50" cy="48" r="18" fill="none" stroke="#475569" strokeWidth="0.4" strokeDasharray="1.5 1.5" opacity="0.3" />
          <circle cx="50" cy="48" r="32" fill="none" stroke="#334155" strokeWidth="0.3" strokeDasharray="2 2" opacity="0.25" />
          
          {/* Water Lagoon for Sailing Armada & Adventureland Bay */}
          <path
            d="M 6,55 Q 15,50 24,58 T 32,70 Q 20,78 6,75 Z"
            fill="#0284c7"
            fillOpacity="0.2"
            stroke="#0284c7"
            strokeWidth="0.5"
            strokeDasharray="1 1"
            className="animate-pulse"
          />

          {/* Parade Route Line */}
          <path
            d="M 50,88 L 50,48 Q 40,35 30,25"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="0.6"
            strokeDasharray="2 1.5"
            opacity="0.6"
          />

          {/* ACTIVE ROUTE SVG LINE (When a route is planned between locations) */}
          {activeRoute && (
            <>
              {/* Glowing Underline */}
              <polyline
                points={routePointsString}
                fill="none"
                stroke="#6366f1"
                strokeWidth="1.8"
                opacity="0.4"
                filter="url(#glow)"
              />
              {/* Dynamic Animated Dashed Line */}
              <polyline
                points={routePointsString}
                fill="none"
                stroke="url(#routeGlowGradient)"
                strokeWidth="0.9"
                strokeDasharray="2 1"
                className="animate-pulse"
              />
            </>
          )}
        </svg>

        {/* Dynamic Route Waypoint Markers (A and B) */}
        {activeRoute && (
          <>
            {/* Origin Marker A */}
            <div
              className="absolute z-25 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${activeRoute.fromLocation.coordinates.x}%`,
                top: `${activeRoute.fromLocation.coordinates.y}%`,
              }}
            >
              <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg shadow-cyan-500/60 ring-4 ring-cyan-500/30 animate-pulse">
                A
              </div>
            </div>

            {/* Destination Marker B */}
            <div
              className="absolute z-25 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${activeRoute.toLocation.coordinates.x}%`,
                top: `${activeRoute.toLocation.coordinates.y}%`,
              }}
            >
              <div className="w-6 h-6 rounded-full bg-pink-500 text-white font-black text-xs flex items-center justify-center shadow-lg shadow-pink-500/60 ring-4 ring-pink-500/30 animate-pulse">
                B
              </div>
            </div>

            {/* Moving Traveler Dot on the Route */}
            {travelerPos && (
              <div
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300"
                style={{
                  left: `${travelerPos.x}%`,
                  top: `${travelerPos.y}%`,
                }}
              >
                <div className="relative">
                  <div className="w-5 h-5 rounded-full bg-white text-indigo-950 flex items-center justify-center text-[10px] shadow-lg shadow-white/50 ring-2 ring-indigo-400">
                    🚶
                  </div>
                  <div className="absolute -inset-1 rounded-full bg-indigo-400/40 animate-ping -z-10" />
                </div>
              </div>
            )}
          </>
        )}

        {/* Dynamic Parade Float Marker */}
        <div
          className="absolute z-20 transition-all duration-500 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${50 - (paradeStep > 50 ? (paradeStep - 50) * 0.4 : 0)}%`,
            top: `${90 - paradeStep * 0.65}%`,
          }}
        >
          <div className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] tracking-wide shadow-lg shadow-amber-500/50 flex items-center gap-1 animate-bounce">
            <span>👑</span>
            <span>Parade Float (Live)</span>
          </div>
        </div>

        {/* Nautical Sailing Galleon: Moving Black Pearl Ship in Adventureland Bay */}
        <div
          className="absolute z-15 transition-all duration-700 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{
            left: `${sailingShipPosition.x}%`,
            top: `${sailingShipPosition.y}%`,
          }}
          onClick={() => {
            soundEffects.playShipBell();
            const p = unifiedLocations.find((l) => l.id === 'pirates_sailing');
            if (p) setSelectedLocation(p);
          }}
          title="The Black Pearl Sailing Galleon - Click to inspect"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-950 border border-emerald-500/50 p-2 shadow-xl shadow-emerald-950/60 flex flex-col items-center justify-center text-center transform group-hover:scale-110 transition-transform">
              <span className="text-xl">⛵</span>
              <span className="text-[8px] font-bold text-emerald-300 uppercase tracking-tighter">Sailing</span>
            </div>
            <div className="absolute -bottom-2 -left-2 -right-2 h-2 bg-cyan-400/20 rounded-full blur-[2px] animate-pulse" />
          </div>
        </div>

        {/* Central Cinderella Castle Visual Landmark */}
        <div className="absolute top-[28%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none select-none text-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-indigo-900/90 via-blue-800/80 to-amber-500/20 border-2 border-indigo-400/40 p-2 shadow-2xl shadow-indigo-500/30 backdrop-blur-md flex flex-col items-center justify-center">
            <span className="text-4xl sm:text-5xl animate-pulse">🏰</span>
            <span className="text-[10px] sm:text-xs font-serif font-bold text-amber-300 tracking-wider">Cinderella Castle</span>
            <span className="text-[8px] text-blue-200">Royal Hub</span>
          </div>
        </div>

        {/* Avengers Stark Tower Visual Landmark */}
        <div className="absolute top-[12%] right-[10%] z-10 pointer-events-none select-none text-center">
          <div className="px-3 py-2 rounded-2xl bg-gradient-to-b from-red-950/90 to-slate-900/90 border border-red-500/40 shadow-xl shadow-red-900/30 backdrop-blur-md flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }}>
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-sm shadow-cyan-300" />
            </div>
            <div className="text-left">
              <div className="text-[11px] font-black tracking-widest text-red-400 uppercase">Stark Tower</div>
              <div className="text-[8px] text-slate-400">Avengers Flight Platform</div>
            </div>
          </div>
        </div>

        {/* D3.js Real-time Heatmap & Density Hotspots Overlay */}
        <ParkHeatmapCanvasLayer
          attractions={attractions}
          locations={unifiedLocations}
          visible={showHeatmap}
          mode={heatmapMode}
          intensity={heatmapIntensity}
          showIsobars={showIsobars}
          onSelectLocation={handleLocationClick}
          selectedLocationId={selectedLocation?.id}
        />

        {/* INTERACTIVE LOCATION NODES ON MAP */}
        {filteredLocations.map((location) => {
          const isSelected = selectedLocation?.id === location.id;
          const isRouteStart = routeFromId === location.id;
          const isRouteEnd = routeToId === location.id;

          let categoryBadgeColor = 'bg-cyan-500/20 border-cyan-500 text-cyan-300';
          if (location.category === 'restaurant') {
            categoryBadgeColor = 'bg-amber-500/20 border-amber-500 text-amber-300';
          } else if (location.category === 'shop') {
            categoryBadgeColor = 'bg-rose-500/20 border-rose-500 text-rose-300';
          }

          return (
            <div
              key={location.id}
              className="absolute z-20 transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${location.coordinates.x}%`,
                top: `${location.coordinates.y}%`,
              }}
            >
              <button
                onClick={() => handleLocationClick(location)}
                className={`group relative flex flex-col items-center focus:outline-none transition-transform duration-200 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                }`}
                title={`${location.name} (${location.category})`}
              >
                {/* Node Marker Bubble */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center border-2 transition-all shadow-lg ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-white ring-4 ring-amber-400/40'
                      : isRouteStart
                      ? 'bg-cyan-600 text-white border-white ring-4 ring-cyan-500/40'
                      : isRouteEnd
                      ? 'bg-purple-600 text-white border-white ring-4 ring-purple-500/40'
                      : location.universe === 'marvel'
                      ? 'bg-gradient-to-tr from-red-900 to-slate-900 border-red-500/80 text-white shadow-red-900/40'
                      : 'bg-gradient-to-tr from-blue-900 to-slate-900 border-blue-400/80 text-white shadow-blue-900/40'
                  }`}
                >
                  {getLocationIcon(location.category)}
                </div>

                {/* Real-time Wait Time / Status Pill Below Node */}
                <div className="mt-1 flex flex-col items-center pointer-events-none">
                  {location.category === 'attraction' && location.waitTimeMinutes !== undefined && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-950/90 border border-slate-700 text-amber-300 font-bold text-[10px] tracking-tight shadow-md whitespace-nowrap">
                      {location.waitTimeMinutes}m
                    </span>
                  )}
                  {location.category === 'restaurant' && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-950/90 border border-amber-500/40 text-amber-300 font-semibold text-[9px] tracking-tight shadow-md whitespace-nowrap">
                      🍽️ {location.waitTimeMinutes || 10}m prep
                    </span>
                  )}
                  {location.category === 'shop' && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-950/90 border border-rose-500/40 text-rose-300 font-semibold text-[9px] tracking-tight shadow-md whitespace-nowrap">
                      🛍️ Open
                    </span>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* DETAILED LOCATION INSPECTOR CARD */}
      {selectedLocation && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold uppercase tracking-wider">
                  {selectedLocation.landId.replace('_', ' ')}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                  selectedLocation.category === 'attraction'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : selectedLocation.category === 'restaurant'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {selectedLocation.category}
                </span>
                {selectedLocation.universe === 'marvel' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-800/60 text-xs font-bold flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Marvel Avengers Campus
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedLocation.name}</h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{selectedLocation.description}</p>
            </div>

            {/* Favorite & Close Buttons */}
            <div className="flex items-center gap-2 self-start">
              {onToggleFavoriteAttraction && selectedLocation.category === 'attraction' && (
                <button
                  onClick={() => onToggleFavoriteAttraction(selectedLocation.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    favoriteAttractionIds.includes(selectedLocation.id)
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  title="Bookmark to Favorite Rides in Profile"
                >
                  <Heart className={`w-4 h-4 ${favoriteAttractionIds.includes(selectedLocation.id) ? 'fill-red-500' : ''}`} />
                </button>
              )}

              <button
                onClick={() => setSelectedLocation(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Location Specific Live Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {selectedLocation.category === 'attraction' && (
              <>
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-0.5">
                  <span className="text-[11px] text-slate-400">Live Queue Wait</span>
                  <div className="text-lg font-bold text-amber-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{selectedLocation.waitTimeMinutes} Mins</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-0.5">
                  <span className="text-[11px] text-slate-400">Lightning Lane</span>
                  <div className="text-sm font-bold text-cyan-400">
                    {selectedLocation.lightningLaneAvailable ? 'Ready for Booking' : 'Standby Only'}
                  </div>
                </div>
              </>
            )}

            {selectedLocation.category === 'restaurant' && (
              <>
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-0.5">
                  <span className="text-[11px] text-slate-400">Cuisine Style</span>
                  <div className="text-xs font-bold text-white truncate">{selectedLocation.cuisine}</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-0.5">
                  <span className="text-[11px] text-slate-400">Service Type</span>
                  <div className="text-xs font-bold text-amber-300">{selectedLocation.diningType}</div>
                </div>
              </>
            )}

            {selectedLocation.category === 'shop' && (
              <>
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-0.5 col-span-2">
                  <span className="text-[11px] text-slate-400">Merchandise Specialty</span>
                  <div className="text-xs font-bold text-rose-300">{selectedLocation.merchSpecialty}</div>
                </div>
              </>
            )}

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-0.5 col-span-2 sm:col-span-2 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400">Route Navigation</span>
                <div className="text-xs font-bold text-indigo-300">Set Origin or Destination</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleSetRouteFrom(selectedLocation.id)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
                >
                  Start From Here
                </button>
                <button
                  onClick={() => handleSetRouteTo(selectedLocation.id)}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-indigo-600/30"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Route To Here</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions (e.g., jump to Marvel store or general store if applicable) */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-slate-800/80">
            {onNavigateToTripPlanner && (
              <button
                onClick={() => {
                  try {
                    const saved = localStorage.getItem('disney_marvel_trip_planner_ids');
                    const ids: string[] = saved ? JSON.parse(saved) : [];
                    if (!ids.includes(selectedLocation.id)) {
                      localStorage.setItem('disney_marvel_trip_planner_ids', JSON.stringify([...ids, selectedLocation.id]));
                    }
                  } catch (e) {
                    // ignore
                  }
                  soundEffects.playMagicChime();
                  onNavigateToTripPlanner();
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Add this attraction or restaurant to your Trip Planner itinerary"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Add to Day Trip Planner</span>
              </button>
            )}

            {selectedLocation.universe === 'marvel' && onNavigateToMarvelSection && (
              <button
                onClick={() => onNavigateToMarvelSection()}
                className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>View Marvel Superhero Toy Armory</span>
              </button>
            )}

            {selectedLocation.category === 'shop' && onNavigateToMerchStore && (
              <button
                onClick={() => onNavigateToMerchStore()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shop Collectibles & Sailing Models</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
