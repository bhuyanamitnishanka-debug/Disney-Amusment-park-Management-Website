import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Attraction, ParkLocation } from '../types';
import { Flame, Activity, Zap, Info, Eye, EyeOff, Sliders, AlertTriangle, ChevronRight } from 'lucide-react';
import { soundEffects } from '../services/audio';

export type HeatmapMode = 'queue_density' | 'foot_traffic' | 'lightning_lane';

export interface HotspotData {
  id: string;
  name: string;
  x: number;
  y: number;
  weight: number; // 0.0 to 1.0
  densityPct: number; // 0 to 100%
  radius: number;
  waitTimeMinutes?: number;
  throughputPct?: number;
  category: string;
  congestionLevel: 'low' | 'moderate' | 'high' | 'critical';
  guestCountEst: number;
  primaryCause: string;
}

// ---------------------------------------------------------------------------
// 1. TOOLBAR COMPONENT
// ---------------------------------------------------------------------------
export interface ParkHeatmapToolbarProps {
  visible: boolean;
  onToggleVisible: () => void;
  mode: HeatmapMode;
  onChangeMode: (mode: HeatmapMode) => void;
  intensity: number;
  onChangeIntensity: (intensity: number) => void;
  showIsobars: boolean;
  onToggleIsobars: () => void;
  activeCongestionAverage: number;
}

export const ParkHeatmapToolbar: React.FC<ParkHeatmapToolbarProps> = ({
  visible,
  onToggleVisible,
  mode,
  onChangeMode,
  intensity,
  onChangeIntensity,
  showIsobars,
  onToggleIsobars,
  activeCongestionAverage,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-3xl shadow-xl backdrop-blur-md">
      
      {/* Left: Heatmap Master Toggle & Status Badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            soundEffects.playMagicChime();
            onToggleVisible();
          }}
          className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 border ${
            visible
              ? 'bg-gradient-to-r from-rose-600 via-amber-600 to-orange-600 text-white border-rose-400 shadow-lg shadow-rose-600/30'
              : 'bg-slate-800 hover:bg-slate-750 text-rose-300 border-rose-500/40'
          }`}
        >
          <Flame className={`w-4 h-4 ${visible ? 'text-amber-300 animate-pulse' : 'text-rose-400'}`} />
          <span>{visible ? 'D3 Heatmap Active' : 'Enable D3 Heatmap'}</span>
          <span className={`w-2 h-2 rounded-full ${visible ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
        </button>

        {/* Live average congestion badge */}
        {visible && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px]">Park Saturation:</span>
            <span className="font-mono font-bold text-amber-400">{activeCongestionAverage}%</span>
            <span className={`w-2 h-2 rounded-full ${activeCongestionAverage > 65 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'}`} />
          </div>
        )}
      </div>

      {/* Middle & Right: Mode Switcher & Tuning Sliders */}
      {visible && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* Mode Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => {
                soundEffects.playClick();
                onChangeMode('queue_density');
              }}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                mode === 'queue_density'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Queue Hotspots
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                onChangeMode('foot_traffic');
              }}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                mode === 'foot_traffic'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Foot Traffic Flow
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                onChangeMode('lightning_lane');
              }}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                mode === 'lightning_lane'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Lightning Lane Load
            </button>
          </div>

          {/* Isobar Contours Button */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onToggleIsobars();
            }}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border flex items-center gap-1.5 transition-colors ${
              showIsobars
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
            title="Toggle topological isobar density contour rings"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Isobars</span>
          </button>

          {/* Intensity Slider */}
          <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-[11px]">
            <span className="text-slate-400">Emission:</span>
            <input
              type="range"
              min="0.35"
              max="1.0"
              step="0.05"
              value={intensity}
              onChange={(e) => onChangeIntensity(parseFloat(e.target.value))}
              className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              title="Adjust thermal emission intensity"
            />
            <span className="font-mono text-slate-300 w-7 text-right">
              {Math.round(intensity * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// 2. CANVAS LAYER COMPONENT (Renders D3 SVG inside map canvas)
// ---------------------------------------------------------------------------
export interface ParkHeatmapCanvasLayerProps {
  attractions: Attraction[];
  locations: ParkLocation[];
  visible: boolean;
  mode: HeatmapMode;
  intensity: number;
  showIsobars: boolean;
  onSelectLocation?: (location: ParkLocation) => void;
  selectedLocationId?: string | null;
}

export const ParkHeatmapCanvasLayer: React.FC<ParkHeatmapCanvasLayerProps> = ({
  attractions,
  locations,
  visible,
  mode,
  intensity,
  showIsobars,
  onSelectLocation,
  selectedLocationId,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<HotspotData | null>(null);

  // Compute hotspot data points based on live park data & selected mode
  const hotspots = useMemo<HotspotData[]>(() => {
    const points: HotspotData[] = [];

    // 1. Attractions hotspots (from live attractions state)
    attractions.forEach((att) => {
      let weight = 0.3;
      let congestionLevel: HotspotData['congestionLevel'] = 'low';
      let primaryCause = 'Nominal standby queue';

      if (mode === 'queue_density') {
        const wait = att.waitTimeMinutes || 10;
        weight = Math.min(1.0, Math.max(0.2, wait / 75));
        if (att.status === 'weather_hold') {
          weight = Math.min(1.0, weight + 0.25);
          primaryCause = 'Weather Hold (Queues Paused)';
        } else if (att.status === 'maintenance') {
          weight = Math.min(1.0, weight + 0.15);
          primaryCause = 'Technical Refurbishment (Rerouting)';
        } else if (wait >= 60) {
          primaryCause = 'Surge E-Ticket Attraction Demand';
        } else if (wait >= 35) {
          primaryCause = 'Steady Peak Standby Line';
        }
      } else if (mode === 'foot_traffic') {
        const throughput = att.currentThroughputPct || 85;
        const wait = att.waitTimeMinutes || 10;
        weight = Math.min(1.0, (throughput / 100) * 0.5 + (wait / 80) * 0.5);
        primaryCause = 'High Promenade Footprint & Boarding Flow';
      } else {
        // lightning_lane
        if (att.lightningLaneAvailable) {
          weight = Math.min(1.0, (att.waitTimeMinutes || 10) / 60);
          primaryCause = 'Lightning Lane Priority Redemptions Active';
        } else {
          weight = 0.2;
          primaryCause = 'Standby Only (No FastPass Priority)';
        }
      }

      const densityPct = Math.round(weight * 100);
      if (densityPct >= 80) congestionLevel = 'critical';
      else if (densityPct >= 60) congestionLevel = 'high';
      else if (densityPct >= 40) congestionLevel = 'moderate';
      else congestionLevel = 'low';

      const baseRadius = 8 + weight * 16;
      const guestCountEst = Math.round(
        (att.capacityPerHour / 2) * (weight + 0.2) * (att.currentThroughputPct / 100)
      );

      points.push({
        id: att.id,
        name: att.name,
        x: att.coordinates.x,
        y: att.coordinates.y,
        weight,
        densityPct,
        radius: baseRadius,
        waitTimeMinutes: att.waitTimeMinutes,
        throughputPct: att.currentThroughputPct,
        category: 'attraction',
        congestionLevel,
        guestCountEst: Math.max(120, guestCountEst),
        primaryCause,
      });
    });

    // 2. Add Dining hotspots (Meal peaks at Pym Kitchen, Blue Bayou, etc.)
    locations
      .filter((loc) => loc.category === 'restaurant')
      .forEach((loc) => {
        const mealRushWeight = mode === 'foot_traffic' ? 0.72 : 0.45;
        const densityPct = Math.round(mealRushWeight * 100);
        points.push({
          id: loc.id,
          name: loc.name,
          x: loc.coordinates.x,
          y: loc.coordinates.y,
          weight: mealRushWeight,
          densityPct,
          radius: 12,
          category: 'restaurant',
          congestionLevel: mealRushWeight > 0.6 ? 'high' : 'moderate',
          guestCountEst: 350,
          primaryCause: 'Dining Meal Rush & Mobile Order Pickups',
        });
      });

    // 3. Central Promenade & Cinderella Castle Hub Hotspot (Natural Crossroads)
    if (mode === 'foot_traffic') {
      points.push({
        id: 'castle_hub_crossroads',
        name: 'Cinderella Castle Central Promenade Hub',
        x: 50,
        y: 48,
        weight: 0.88,
        densityPct: 88,
        radius: 20,
        category: 'hub',
        congestionLevel: 'critical',
        guestCountEst: 2850,
        primaryCause: 'Central Landmark Cross-Traffic & Parade Concourse',
      });

      points.push({
        id: 'main_street_turnstiles',
        name: 'Main Street U.S.A. Ingress Concourse',
        x: 50,
        y: 84,
        weight: 0.68,
        densityPct: 68,
        radius: 14,
        category: 'hub',
        congestionLevel: 'high',
        guestCountEst: 1400,
        primaryCause: 'Park Entry Turnstiles & Emporium Strollers',
      });
    }

    return points;
  }, [attractions, locations, mode]);

  // Top 3 critical congested zones for HUD banner
  const topCongested = useMemo(() => {
    return [...hotspots].sort((a, b) => b.weight - a.weight).slice(0, 3);
  }, [hotspots]);

  // D3 Render Effect
  useEffect(() => {
    if (!svgRef.current || !visible) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Definitions
    const defs = svg.append('defs');

    // Filter: Gaussian Blur for soft heat field diffusion
    const filter = defs
      .append('filter')
      .attr('id', 'd3-heat-blur')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter
      .append('feGaussianBlur')
      .attr('in', 'SourceGraphic')
      .attr('stdDeviation', 3.2);

    // Color Interpolator: Turbo / Inferno thermal spectrum mapped with D3
    hotspots.forEach((spot) => {
      const gradId = `heat-grad-${spot.id.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
      const grad = defs
        .append('radialGradient')
        .attr('id', gradId)
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%');

      const coreColor =
        spot.congestionLevel === 'critical'
          ? '#ef4444'
          : spot.congestionLevel === 'high'
          ? '#f97316'
          : spot.congestionLevel === 'moderate'
          ? '#eab308'
          : '#06b6d4';

      const midColor =
        spot.congestionLevel === 'critical'
          ? '#f97316'
          : spot.congestionLevel === 'high'
          ? '#eab308'
          : '#10b981';

      grad.append('stop').attr('offset', '0%').attr('stop-color', coreColor).attr('stop-opacity', 0.85 * intensity);
      grad.append('stop').attr('offset', '45%').attr('stop-color', midColor).attr('stop-opacity', 0.55 * intensity);
      grad.append('stop').attr('offset', '80%').attr('stop-color', '#3b82f6').attr('stop-opacity', 0.2 * intensity);
      grad.append('stop').attr('offset', '100%').attr('stop-color', '#1e1b4b').attr('stop-opacity', 0);
    });

    // 1. Heat Diffusion Layer (Blurred glowing circles with screen blend)
    const heatGroup = svg
      .append('g')
      .attr('class', 'd3-heatmap-diffusion')
      .attr('filter', 'url(#d3-heat-blur)')
      .style('mix-blend-mode', 'screen')
      .attr('pointer-events', 'none');

    heatGroup
      .selectAll('circle.heat-blob')
      .data(hotspots)
      .join('circle')
      .attr('class', 'heat-blob')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('r', (d) => d.radius * 1.3)
      .attr('fill', (d) => `url(#heat-grad-${d.id.replace(/[^a-zA-Z0-9_-]/g, '_')})`)
      .attr('opacity', 0.9);

    // 2. Isobar Density Contour Rings Layer
    if (showIsobars) {
      const isobarGroup = svg
        .append('g')
        .attr('class', 'd3-isobar-rings')
        .attr('pointer-events', 'none');

      hotspots
        .filter((d) => d.weight >= 0.45)
        .forEach((spot) => {
          const ringCounts = spot.weight >= 0.75 ? 3 : 2;
          const strokeColor =
            spot.congestionLevel === 'critical'
              ? '#f43f5e'
              : spot.congestionLevel === 'high'
              ? '#fb923c'
              : '#facc15';

          for (let i = 1; i <= ringCounts; i++) {
            const ringRadius = spot.radius * (i * 0.35 + 0.35);
            isobarGroup
              .append('circle')
              .attr('cx', spot.x)
              .attr('cy', spot.y)
              .attr('r', ringRadius)
              .attr('fill', 'none')
              .attr('stroke', strokeColor)
              .attr('stroke-width', 0.45)
              .attr('stroke-dasharray', i % 2 === 0 ? '1.5 1' : '2.5 1.5')
              .attr('opacity', (0.55 - i * 0.12) * intensity);
          }
        });
    }

    // 3. Hotspot Center Cores & Interactive Hit Areas
    const coreGroup = svg.append('g').attr('class', 'd3-hotspot-interactive-cores');

    const spotElements = coreGroup
      .selectAll('g.hotspot-interactive-node')
      .data(hotspots)
      .join('g')
      .attr('class', 'hotspot-interactive-node')
      .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
      .style('cursor', 'pointer')
      .on('mouseenter', (_event, d) => {
        soundEffects.playClick();
        setHoveredHotspot(d);
      })
      .on('mouseleave', () => {
        setHoveredHotspot(null);
      })
      .on('click', (_event, d) => {
        soundEffects.playMagicChime();
        const matched = locations.find((l) => l.id === d.id);
        if (matched && onSelectLocation) {
          onSelectLocation(matched);
        }
      });

    // Core focal circle
    spotElements
      .append('circle')
      .attr('r', (d) => (d.weight >= 0.7 ? 3.2 : 2.2))
      .attr('fill', (d) =>
        d.congestionLevel === 'critical'
          ? '#ef4444'
          : d.congestionLevel === 'high'
          ? '#f97316'
          : d.congestionLevel === 'moderate'
          ? '#eab308'
          : '#06b6d4'
      )
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 0.6)
      .attr('opacity', 0.95);

    // Pulse wave on critical/high hotspots
    spotElements
      .filter((d) => d.weight >= 0.65)
      .append('circle')
      .attr('r', 4.5)
      .attr('fill', 'none')
      .attr('stroke', (d) => (d.congestionLevel === 'critical' ? '#ef4444' : '#f97316'))
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.8)
      .append('animate')
      .attr('attributeName', 'r')
      .attr('from', '4')
      .attr('to', '12')
      .attr('dur', '2s')
      .attr('repeatCount', 'indefinite');

    spotElements
      .filter((d) => d.weight >= 0.65)
      .select('circle:last-child')
      .append('animate')
      .attr('attributeName', 'opacity')
      .attr('from', '0.8')
      .attr('to', '0')
      .attr('dur', '2s')
      .attr('repeatCount', 'indefinite');
  }, [hotspots, visible, intensity, showIsobars, locations, onSelectLocation]);

  if (!visible) return null;

  return (
    <>
      {/* D3 SVG OVERLAY (Mounted on the Map Canvas) */}
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full z-12 pointer-events-auto"
        style={{ mixBlendMode: 'plus-lighter' }}
      />

      {/* FLOATING REAL-TIME D3 HEATMAP HUD & LEGEND */}
      <div className="absolute bottom-3 left-3 right-3 z-25 pointer-events-none flex flex-col md:flex-row items-stretch md:items-end justify-between gap-3">
        
        {/* Top Congestion Alerts Pills */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-2.5 sm:p-3 backdrop-blur-md shadow-2xl pointer-events-auto max-w-lg space-y-2">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Real-Time Congestion Hotspots</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">D3 Density Engine</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {topCongested.map((spot) => (
              <button
                key={spot.id}
                onClick={() => {
                  soundEffects.playClick();
                  const matched = locations.find((l) => l.id === spot.id);
                  if (matched && onSelectLocation) {
                    onSelectLocation(matched);
                  }
                }}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-transform hover:scale-105 flex items-center gap-1.5 ${
                  spot.congestionLevel === 'critical'
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                    : spot.congestionLevel === 'high'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                    : 'bg-slate-900 text-slate-300 border-slate-700'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                <span className="truncate max-w-[130px]">{spot.name}</span>
                <span className="font-mono text-amber-300">
                  {spot.waitTimeMinutes ? `${spot.waitTimeMinutes}m` : `${spot.densityPct}%`}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* D3 Thermal Spectrum Color Legend Bar */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-2.5 sm:p-3 backdrop-blur-md shadow-2xl pointer-events-auto flex flex-col gap-1.5 min-w-[240px]">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Low (Smooth Flow)</span>
            <span>Critical (&gt;70m Wait)</span>
          </div>

          {/* Continuous Thermal Gradient Bar */}
          <div className="w-full h-2 rounded-full overflow-hidden bg-slate-800 border border-slate-700/60 flex">
            <div
              className="w-full h-full"
              style={{
                background:
                  'linear-gradient(to right, #06b6d4 0%, #10b981 25%, #eab308 55%, #f97316 75%, #ef4444 100%)',
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
            <span>0-30%</span>
            <span>30-60%</span>
            <span>60-80%</span>
            <span>80-100%</span>
          </div>
        </div>
      </div>

      {/* HOVER TOOLTIP FOR D3 HOTSPOTS */}
      {hoveredHotspot && (
        <div
          className="absolute z-35 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 transition-all duration-150"
          style={{
            left: `${hoveredHotspot.x}%`,
            top: `${hoveredHotspot.y}%`,
          }}
        >
          <div className="bg-slate-950/95 border border-rose-500/70 p-3 rounded-2xl shadow-2xl shadow-rose-950/70 max-w-xs space-y-1.5 backdrop-blur-md text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                hoveredHotspot.congestionLevel === 'critical'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : hoveredHotspot.congestionLevel === 'high'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              }`}>
                {hoveredHotspot.congestionLevel.toUpperCase()} CONGESTION
              </span>
              <span className="font-mono font-bold text-amber-400 text-xs">
                {hoveredHotspot.densityPct}% Saturation
              </span>
            </div>

            <div className="font-extrabold text-white text-sm">
              {hoveredHotspot.name}
            </div>

            <p className="text-[11px] text-slate-300 leading-tight">
              {hoveredHotspot.primaryCause}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[10px]">
              <div>
                <span className="text-slate-500">Est. Crowd in Zone:</span>
                <div className="font-mono font-bold text-slate-200">
                  ~{hoveredHotspot.guestCountEst.toLocaleString()} guests
                </div>
              </div>
              <div>
                <span className="text-slate-500">Current Wait Time:</span>
                <div className="font-mono font-bold text-amber-300">
                  {hoveredHotspot.waitTimeMinutes !== undefined
                    ? `${hoveredHotspot.waitTimeMinutes} mins`
                    : 'N/A (Open Area)'}
                </div>
              </div>
            </div>

            <div className="text-[10px] text-cyan-400 font-semibold text-center pt-0.5">
              Click node to inspect operations
            </div>
          </div>
        </div>
      )}
    </>
  );
};
