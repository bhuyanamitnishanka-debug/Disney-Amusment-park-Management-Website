import React, { useState, useEffect } from 'react';
import { TripItineraryPlan, TripItineraryItem } from '../types';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Utensils, 
  Sparkles, 
  ChevronRight, 
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { soundEffects } from '../services/audio';

interface TripRouteMapProps {
  plan: TripItineraryPlan;
  activeStepId: string | null;
  onSelectStep: (stepId: string) => void;
}

export const TripRouteMap: React.FC<TripRouteMapProps> = ({
  plan,
  activeStepId,
  onSelectStep,
}) => {
  const [hoveredStep, setHoveredStep] = useState<TripItineraryItem | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Animated traveler along the full route
  useEffect(() => {
    if (plan.fullRouteWaypoints.length < 2) return;

    let frameId: number;
    let startTimestamp: number | null = null;
    const duration = 12000; // 12 second loop

    const stepAnimation = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = (elapsed % duration) / duration;
      setAnimationProgress(progress);
      frameId = requestAnimationFrame(stepAnimation);
    };

    frameId = requestAnimationFrame(stepAnimation);
    return () => cancelAnimationFrame(frameId);
  }, [plan.fullRouteWaypoints]);

  // Calculate animated position of traveler
  const travelerPosition = React.useMemo(() => {
    const wps = plan.fullRouteWaypoints;
    if (!wps || wps.length < 2) return null;

    const totalSegments = wps.length - 1;
    const scaledProgress = animationProgress * totalSegments;
    const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
    const segmentFraction = scaledProgress - segmentIndex;

    const p1 = wps[segmentIndex];
    const p2 = wps[segmentIndex + 1];

    if (!p1 || !p2) return null;

    return {
      x: p1.x + (p2.x - p1.x) * segmentFraction,
      y: p1.y + (p2.y - p1.y) * segmentFraction,
    };
  }, [plan.fullRouteWaypoints, animationProgress]);

  // Polyline points string
  const polylinePoints = React.useMemo(() => {
    if (!plan.fullRouteWaypoints || plan.fullRouteWaypoints.length === 0) return '';
    return plan.fullRouteWaypoints.map((wp) => `${wp.x},${wp.y}`).join(' ');
  }, [plan.fullRouteWaypoints]);

  return (
    <div className="relative w-full rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden group">
      
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs shadow-lg">
          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-white">Interactive Park Walking Blueprint</span>
          <span className="text-[10px] text-slate-400">({plan.items.length} Waypoint Stops)</span>
        </div>

        {plan.items.length > 0 && (
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs pointer-events-auto shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-slate-300 font-mono text-[11px]">
              {plan.totalWalkingDistanceYards.toLocaleString()} yds • ~{plan.totalWalkingMinutes} min walking
            </span>
          </div>
        )}
      </div>

      {/* Main SVG Park Blueprint */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[460px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 select-none">
        
        {/* Subtle Map Grid */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }} 
        />

        {/* Themed Land Background Areas */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {/* Avengers Campus */}
          <div className="absolute top-[8%] right-[8%] w-[32%] h-[36%] rounded-3xl bg-red-950/40 border border-red-800/30 flex items-start justify-end p-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-400/70">Avengers Campus</span>
          </div>

          {/* Tomorrowland */}
          <div className="absolute bottom-[8%] right-[10%] w-[32%] h-[36%] rounded-3xl bg-cyan-950/40 border border-cyan-800/30 flex items-end justify-end p-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400/70">Tomorrowland</span>
          </div>

          {/* Fantasyland (Center Castle Top) */}
          <div className="absolute top-[6%] left-[34%] w-[32%] h-[32%] rounded-3xl bg-purple-950/40 border border-purple-800/30 flex items-start justify-center p-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-400/70">Fantasyland</span>
          </div>

          {/* Adventureland & Sailing Lagoon */}
          <div className="absolute bottom-[10%] left-[8%] w-[34%] h-[40%] rounded-3xl bg-emerald-950/40 border border-emerald-800/30 flex items-end justify-start p-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400/70">Adventureland & Lagoon</span>
          </div>
        </div>

        {/* SVG Route Paths & Hubs */}
        <svg 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none" 
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            <linearGradient id="tripRouteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="1" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.9" />
            </linearGradient>
            
            <filter id="routePathGlow">
              <feGaussianBlur stdDeviation="1.2" result="glowBlur"/>
              <feMerge>
                <feMergeNode in="glowBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Central Castle Promenade Radial Hub */}
          <circle cx="50" cy="48" r="16" fill="none" stroke="#475569" strokeWidth="0.4" strokeDasharray="1.5 1.5" opacity="0.35" />
          <circle cx="50" cy="48" r="30" fill="none" stroke="#334155" strokeWidth="0.3" strokeDasharray="2 2" opacity="0.25" />

          {/* Sailing Lagoon Water Body */}
          <path
            d="M 6,55 Q 15,50 24,58 T 32,70 Q 20,78 6,75 Z"
            fill="#0284c7"
            fillOpacity="0.2"
            stroke="#0284c7"
            strokeWidth="0.5"
            strokeDasharray="1 1"
          />

          {/* Glowing Outer Path Shadow */}
          {polylinePoints && (
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.0"
              opacity="0.35"
              filter="url(#routePathGlow)"
            />
          )}

          {/* Dynamic Animated Pulse Line for Selected Trip Itinerary */}
          {polylinePoints && (
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="url(#tripRouteGradient)"
              strokeWidth="1.0"
              strokeDasharray="2.5 1.5"
              className="animate-pulse"
            />
          )}

          {/* Central Hub Landmark Marker */}
          <g>
            <circle cx="50" cy="48" r="2.2" fill="#6366f1" opacity="0.7" />
            <circle cx="50" cy="48" r="1" fill="#ffffff" />
          </g>
        </svg>

        {/* Central Castle Hub Label */}
        <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center opacity-70">
          <span className="text-base">🏰</span>
          <span className="text-[8px] font-bold text-slate-400 bg-slate-950/80 px-1 py-0.5 rounded border border-slate-800">Castle Hub</span>
        </div>

        {/* Itinerary Waypoint Pins */}
        {plan.items.map((item, idx) => {
          const isSelected = activeStepId === item.id;
          const isHovered = hoveredStep?.id === item.id;
          const isDining = item.location.category === 'restaurant';
          const waitTime = item.waitTimeMinutes;

          return (
            <div
              key={item.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-all duration-200"
              style={{
                left: `${item.location.coordinates.x}%`,
                top: `${item.location.coordinates.y}%`,
              }}
              onClick={() => {
                soundEffects.playClick();
                onSelectStep(item.id);
              }}
              onMouseEnter={() => setHoveredStep(item)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              {/* Outer pulsing halo if active */}
              {isSelected && (
                <div className="absolute -inset-2 rounded-full bg-cyan-400/30 animate-ping pointer-events-none" />
              )}

              {/* Pin Badge */}
              <div 
                className={`group/pin relative flex items-center justify-center transition-all duration-200 ${
                  isSelected 
                    ? 'scale-125 z-30 shadow-xl' 
                    : isHovered 
                    ? 'scale-115 z-25' 
                    : 'scale-100'
                }`}
              >
                <div 
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs sm:text-sm border-2 shadow-lg transition-transform ${
                    isDining
                      ? 'bg-gradient-to-br from-amber-500 to-rose-600 text-white border-amber-300 shadow-amber-500/40'
                      : item.location.universe === 'marvel'
                      ? 'bg-gradient-to-br from-red-600 to-red-800 text-white border-red-300 shadow-red-500/40'
                      : 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-indigo-300 shadow-indigo-500/40'
                  } ${isSelected ? 'ring-4 ring-cyan-400' : ''}`}
                >
                  <span>{item.stepNumber}</span>
                </div>

                {/* Queue wait pill attached to pin */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded-full bg-slate-950/95 border border-slate-800 text-[9px] font-bold text-slate-200 flex items-center gap-0.5 shadow-md">
                  {isDining ? <Utensils className="w-2 h-2 text-amber-400" /> : <Clock className="w-2 h-2 text-cyan-400" />}
                  <span>{waitTime}m</span>
                </div>
              </div>

              {/* Floating Tooltip preview on hover */}
              {isHovered && !isSelected && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-slate-950/95 backdrop-blur-md p-2.5 rounded-xl border border-cyan-500/40 shadow-2xl z-40 text-left pointer-events-none">
                  <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold mb-1">
                    <span>STOP #{item.stepNumber}</span>
                    <span>{item.arrivalTime}</span>
                  </div>
                  <div className="text-xs font-bold text-white leading-snug line-clamp-1">{item.location.name}</div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>Wait: <strong className="text-white">{waitTime} min</strong></span>
                    <span>Duration: <strong className="text-white">{item.experienceDurationMinutes} min</strong></span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Animated Traveler Indicator along Route */}
        {travelerPosition && (
          <div
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-75"
            style={{
              left: `${travelerPosition.x}%`,
              top: `${travelerPosition.y}%`,
            }}
          >
            <div className="relative flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-cyan-400/40 animate-ping absolute" />
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-cyan-400 border border-white shadow-lg shadow-cyan-400/80 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Map Legend Footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-600 border border-indigo-300" />
            <span className="text-[11px]">Disney Ride</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 border border-red-300" />
            <span className="text-[11px]">Marvel Ride</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-300" />
            <span className="text-[11px]">Dining / Restaurant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-400 inline-block" />
            <span className="text-[11px]">Optimal Walking Path</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <Info className="w-3 h-3 text-slate-500" />
          <span>Click any pin to focus step details</span>
        </div>
      </div>

    </div>
  );
};
