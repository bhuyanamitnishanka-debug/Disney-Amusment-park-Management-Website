import React, { useState, useRef } from 'react';
import { 
  ParkTelemetry, 
  CharacterGreeting, 
  ParadeShow, 
  MaintenanceAlert, 
  Attraction,
  WeatherForecastDay
} from '../types';
import { INITIAL_5_DAY_FORECAST } from '../data/parkData';
import { soundEffects } from '../services/audio';
import confetti from 'canvas-confetti';
import { 
  Users, 
  Sparkles, 
  Sun, 
  Moon, 
  CloudRain, 
  Sunset, 
  Shield, 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Play, 
  Pause, 
  Flame, 
  Smile, 
  TrendingUp,
  Activity,
  CloudSun,
  Wind,
  Droplets,
  ChevronLeft,
  ChevronRight,
  Compass,
  Waves,
  Zap,
  ShieldAlert,
  Info
} from 'lucide-react';

interface OperationsDashboardProps {
  telemetry: ParkTelemetry;
  characters: CharacterGreeting[];
  parades: ParadeShow[];
  alerts: MaintenanceAlert[];
  attractions: Attraction[];
  onUpdateWeather: (weather: ParkTelemetry['weather']) => void;
  onSimulateCrowdSurge: () => void;
  onToggleCharacterStatus: (characterId: string) => void;
  onResolveAlert: (alertId: string) => void;
  onTriggerShow: (showId: string) => void;
}

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({
  telemetry,
  characters,
  parades,
  alerts,
  attractions,
  onUpdateWeather,
  onSimulateCrowdSurge,
  onToggleCharacterStatus,
  onResolveAlert,
  onTriggerShow,
}) => {
  const capacityPct = Math.round((telemetry.attendance / telemetry.maxCapacity) * 100);

  const forecastList: WeatherForecastDay[] = telemetry.forecast || telemetry.weatherForecast || INITIAL_5_DAY_FORECAST;
  const [selectedDayId, setSelectedDayId] = useState<string>(forecastList[0]?.id || 'forecast_day_1');
  const selectedDay = forecastList.find(d => d.id === selectedDayId) || forecastList[0];
  const forecastScrollRef = useRef<HTMLDivElement>(null);

  const scrollForecast = (direction: 'left' | 'right') => {
    if (forecastScrollRef.current) {
      const scrollAmount = 300;
      forecastScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      soundEffects.playClick();
    }
  };

  const handleLaunchFireworks = () => {
    soundEffects.playFireworksBoom();
    soundEffects.playMagicChime();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#ffd700', '#ff007f', '#00f0ff', '#ffffff', '#7928ca'],
    });
    onTriggerShow('castle_fireworks');
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner: Real-Time Telemetry & Capacity Meter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Attendance & Capacity Card */}
        <div className="bg-slate-900/85 border border-slate-800 rounded-3xl p-5 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Kingdom Attendance</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{telemetry.attendance.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-mono">/ {telemetry.maxCapacity.toLocaleString()}</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                capacityPct > 90 ? 'bg-rose-500' : capacityPct > 75 ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              style={{ width: `${capacityPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>{capacityPct}% Capacity</span>
            <button
              onClick={onSimulateCrowdSurge}
              className="text-amber-400 hover:text-amber-300 font-medium underline"
            >
              +Simulate Surge
            </button>
          </div>
        </div>

        {/* Inflow Turnstile Rate */}
        <div className="bg-slate-900/85 border border-slate-800 rounded-3xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Entry Flow Rate</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">+{telemetry.turnstileEntryRate}</span>
            <span className="text-xs text-slate-400">guests / min</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Turnstiles Main Gate 1–16 Active</span>
          </div>
        </div>

        {/* Guest Satisfaction Score */}
        <div className="bg-slate-900/85 border border-slate-800 rounded-3xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Guest Happiness</span>
            <Smile className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-300 font-mono">{telemetry.guestSatisfaction}%</span>
            <span className="text-xs text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +0.4%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-3">
            Based on 8,420 Cast & Genie App surveys
          </div>
        </div>

        {/* Park Climate & Weather Mode */}
        <div className="bg-slate-900/85 border border-slate-800 rounded-3xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Kingdom Climate</span>
            {telemetry.weather === 'sunny' && <Sun className="w-4 h-4 text-amber-400" />}
            {telemetry.weather === 'magic_hour' && <Sunset className="w-4 h-4 text-orange-400" />}
            {telemetry.weather === 'night_sparkle' && <Moon className="w-4 h-4 text-indigo-400" />}
            {telemetry.weather === 'rain_protocol' && <CloudRain className="w-4 h-4 text-cyan-400" />}
          </div>
          <div className="mt-2 text-lg font-bold text-white capitalize">
            {telemetry.weather.replace('_', ' ')} ({telemetry.temperatureF}°F)
          </div>
          <div className="flex items-center gap-1.5 mt-2.5">
            <button
              onClick={() => {
                soundEffects.playClick();
                onUpdateWeather('sunny');
              }}
              title="Sunny Day"
              className={`p-1.5 rounded-lg border text-xs ${
                telemetry.weather === 'sunny' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              ☀️
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                onUpdateWeather('magic_hour');
              }}
              title="Magic Hour Sunset"
              className={`p-1.5 rounded-lg border text-xs ${
                telemetry.weather === 'magic_hour' ? 'bg-orange-500/20 border-orange-500 text-orange-300' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              🌅
            </button>
            <button
              onClick={() => {
                soundEffects.playMagicChime();
                onUpdateWeather('night_sparkle');
              }}
              title="Night Sparkle Spectacular"
              className={`p-1.5 rounded-lg border text-xs ${
                telemetry.weather === 'night_sparkle' ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              ✨
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                onUpdateWeather('rain_protocol');
              }}
              title="Rain Protocol (Indoor ride reroute)"
              className={`p-1.5 rounded-lg border text-xs ${
                telemetry.weather === 'rain_protocol' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              🌧️
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 5-DAY WEATHER & OPERATIONAL FORECAST SCROLLABLE STRIP */}
      {/* ======================================================================= */}
      <div className="bg-slate-900/85 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-5">
        
        {/* Strip Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  5-Day Kingdom Weather & Atmospheric Forecast
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Imagineering Radar
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Live wind vectors, precipitation radar, and ride queue operational advisories
              </p>
            </div>
          </div>

          {/* Left/Right Scroll Controls & Legend */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-[11px] text-slate-400 font-medium hidden md:inline-block mr-2">
              Scroll or click any day to inspect operational impact
            </span>
            <button
              onClick={() => scrollForecast('left')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors shadow-sm"
              title="Scroll forecast left"
              aria-label="Scroll forecast left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollForecast('right')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors shadow-sm"
              title="Scroll forecast right"
              aria-label="Scroll forecast right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Forecast Strip */}
        <div
          ref={forecastScrollRef}
          className="flex items-stretch gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700 select-none"
        >
          {forecastList.map((day, idx) => {
            const isSelected = day.id === selectedDayId;
            const isToday = idx === 0;

            // Determine viability badge styles
            const fireworksBadge = 
              day.fireworksViability === 'optimal' 
                ? { label: 'Optimal (<15mph)', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30' }
                : day.fireworksViability === 'favorable'
                ? { label: 'Favorable', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30' }
                : day.fireworksViability === 'moderate'
                ? { label: 'Moderate Watch', color: 'text-amber-400 bg-amber-950/60 border-amber-500/30' }
                : { label: 'High Risk', color: 'text-rose-400 bg-rose-950/60 border-rose-500/30' };

            const rainBadgeColor = 
              day.precipitationPct >= 50 
                ? 'text-rose-400 bg-rose-950/60 border-rose-500/30' 
                : day.precipitationPct >= 20 
                ? 'text-amber-400 bg-amber-950/60 border-amber-500/30'
                : 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30';

            return (
              <div
                key={day.id}
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedDayId(day.id);
                }}
                className={`min-w-[270px] sm:min-w-[295px] max-w-[320px] flex-shrink-0 rounded-2xl p-4.5 border cursor-pointer transition-all duration-300 flex flex-col justify-between relative group ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-400/90 shadow-xl shadow-cyan-950/50 ring-1 ring-cyan-400/40'
                    : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {/* Top Badge: Day, Date & Live Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-white">{day.day}</span>
                      {isToday && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-400">{day.date}</span>
                  </div>

                  {/* Weather Icon Stamp */}
                  <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    {day.icon}
                  </div>
                </div>

                {/* Condition Label */}
                <div className="mb-3">
                  <div className="text-xs font-bold text-slate-200 line-clamp-1">
                    {day.conditionLabel}
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-amber-300 font-mono">
                      {day.highTempF}°
                    </span>
                    <span className="text-sm font-semibold text-slate-400">/</span>
                    <span className="text-sm font-bold text-cyan-400 font-mono">
                      {day.lowTempF}°F
                    </span>
                  </div>
                </div>

                {/* Temperature Gradient Visual Line */}
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full mb-3 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-400"
                    style={{ width: `${Math.min(100, Math.max(20, (day.highTempF - 50) * 2))}%` }}
                  />
                </div>

                {/* Micro Metrics Strip */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/70 text-[11px] mb-3">
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-[10px] flex items-center gap-1">
                      <Droplets className="w-2.5 h-2.5 text-cyan-400" /> Rain
                    </span>
                    <span className={`font-mono font-bold mt-0.5 ${rainBadgeColor.split(' ')[0]}`}>
                      {day.precipitationPct}%
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-slate-500 text-[10px] flex items-center gap-1">
                      <Wind className="w-2.5 h-2.5 text-blue-400" /> Wind
                    </span>
                    <span className="font-mono font-bold text-slate-200 mt-0.5">
                      {day.windMph} mph
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-slate-500 text-[10px] flex items-center gap-1">
                      <Sun className="w-2.5 h-2.5 text-amber-400" /> UV Index
                    </span>
                    <span className="font-mono font-bold text-amber-300 mt-0.5">
                      {day.uvIndex}
                    </span>
                  </div>
                </div>

                {/* Operational Tags */}
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-slate-400">Fireworks:</span>
                    <span className={`px-2 py-0.5 rounded-md font-semibold border ${fireworksBadge.color}`}>
                      {fireworksBadge.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-slate-400">Sailing Fleet:</span>
                    <span className="font-medium text-slate-300 capitalize flex items-center gap-1">
                      <Waves className="w-3 h-3 text-cyan-400" />
                      {day.sailingConditions.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Bottom Trigger Action / Status */}
                <div className="pt-3 mt-3 border-t border-slate-800/70">
                  {day.condition in { sunny: 1, magic_hour: 1, night_sparkle: 1, rain_protocol: 1 } ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundEffects.playClick();
                        onUpdateWeather(day.condition as ParkTelemetry['weather']);
                      }}
                      className={`w-full py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        telemetry.weather === day.condition
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {telemetry.weather === day.condition ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Active Park Mode</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span>Simulate Weather</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="text-center py-1 text-[11px] text-slate-400 italic">
                      Forecast Model Locked
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Day Operational Deep Dive Panel */}
        {selectedDay && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedDay.icon}</span>
                <h4 className="text-sm font-bold text-white">
                  Operational Guidance for {selectedDay.day} ({selectedDay.date})
                </h4>
                <span className="text-xs text-cyan-400 font-mono">
                  {selectedDay.highTempF}°F High / {selectedDay.lowTempF}°F Low
                </span>
              </div>
              
              {selectedDay.recommendedAttractionType && (
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="text-slate-500">Recommended Lands:</span>
                  <span className="text-amber-300 font-semibold">{selectedDay.recommendedAttractionType}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ride Safety & Wind Limits</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {selectedDay.windMph > 14
                    ? 'Sustained winds may affect outdoor coaster lift hills (Space Mtn outdoor queue holds). Monitor safety sensors.'
                    : 'Winds well within nominal safety envelope (<35mph limit). Full coaster speeds dispatched.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Night Spectacular & Parades</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {selectedDay.fireworksViability === 'optimal'
                    ? 'Clear upper atmospheric window. 9:15 PM Happily Ever After fireworks cleared for launch.'
                    : selectedDay.fireworksViability === 'moderate'
                    ? 'Cloud ceiling variable. Starlight projection mapping on Cinderella Castle primed as contingency.'
                    : 'High wind protocol: Starlight pyrotechnics may adjust trajectories.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Imagineering Advisory</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {selectedDay.parkAdvisory}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Two Column Grid: Characters & Parades on Left, Technical & Maintenance on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Parades & Spectaculars Control */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Parades & Night Spectaculars</span>
            </h3>
            <span className="text-xs text-slate-400">Live Stage Operations</span>
          </div>

          <div className="space-y-4">
            {parades.map((show) => (
              <div
                key={show.id}
                className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{show.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      show.status === 'active_parade' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' :
                      show.status === 'scheduled' ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {show.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" /> {show.timeSlot}
                    </span>
                    <span>•</span>
                    <span>{show.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {show.type === 'fireworks' ? (
                    <button
                      onClick={handleLaunchFireworks}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 text-xs font-bold shadow-md transition-all active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Trigger Fireworks Now</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        soundEffects.playRideDispatch();
                        onTriggerShow(show.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      {show.status === 'active_parade' ? 'Advance Float Route' : 'Commence Show'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Character Meet & Greet Roster */}
          <div className="pt-4 border-t border-slate-800/80">
            <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <span>🎭</span>
              <span>Cast Character Meet-and-Greets</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {characters.map((char) => (
                <div
                  key={char.id}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shadow-inner">
                      {char.avatarEmoji}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white truncate max-w-[140px]">{char.name}</div>
                      <div className="text-[10px] text-slate-400">{char.location}</div>
                      <div className="text-[10px] font-mono text-amber-400 mt-0.5">
                        {char.status === 'greeting' ? `${char.currentLineMinutes}m wait time` : 'On Cast Break'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      onToggleCharacterStatus(char.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                      char.status === 'greeting'
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'bg-emerald-950/60 border-emerald-700 text-emerald-300 hover:bg-emerald-900/60'
                    }`}
                  >
                    {char.status === 'greeting' ? 'Send Break' : 'Deploy'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Maintenance & Engineering Incident Command */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-cyan-400" />
              <span>Technical & Safety Operations</span>
            </h3>
            <span className="text-xs text-slate-400">Disney Imagineering & Stark Tech</span>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 ${
                    alert.status === 'resolved' ? 'bg-emerald-950/80 text-emerald-400' : 'bg-amber-950/80 text-amber-400'
                  }`}>
                    {alert.status === 'resolved' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{alert.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Crew: {alert.assignedCrew}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">{alert.reportedAt}</div>
                  </div>
                </div>

                <div className="self-center">
                  {alert.status === 'pending' ? (
                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        onResolveAlert(alert.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors"
                    >
                      Resolve Ticket
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-medium">Cleared</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Ride Diagnostics Summary */}
          <div className="pt-4 border-t border-slate-800/80">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Fleet Diagnostics Overview
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <div className="text-xl font-bold text-emerald-400 font-mono">
                  {attractions.filter((a) => a.status === 'operational').length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Operational</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <div className="text-xl font-bold text-cyan-400 font-mono">
                  {attractions.reduce((acc, a) => acc + a.activeVehicles, 0)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Active Pods & Boats</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <div className="text-xl font-bold text-purple-400 font-mono">
                  {attractions.filter((a) => a.lightningLaneAvailable).length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Genie+ Priority</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
