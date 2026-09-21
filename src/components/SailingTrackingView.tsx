import React, { useState } from 'react';
import { soundEffects } from '../services/audio';
import { 
  Compass, 
  Anchor, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  Shield, 
  Sparkles, 
  Navigation,
  MapPin,
  RefreshCw
} from 'lucide-react';

interface ActiveDelivery {
  id: string;
  itemTitle: string;
  universe: 'disney' | 'marvel' | 'nautical_sailing';
  destination: string;
  status: 'assembling' | 'in_transit' | 'ready_for_pickup';
  progress: number;
  lockerCode?: string;
  etaMinutes: number;
}

export const SailingTrackingView: React.FC = () => {
  const [deliveries, setDeliveries] = useState<ActiveDelivery[]>([
    {
      id: 'DISNEY-SAIL-8842',
      itemTitle: 'Pirates of the Caribbean "Black Pearl" Wooden Sailing Galleon',
      universe: 'nautical_sailing',
      destination: 'Smart Locker Bay #14 (Main Street Emporium)',
      status: 'ready_for_pickup',
      progress: 100,
      lockerCode: 'SAIL-4096',
      etaMinutes: 0,
    },
    {
      id: 'MARVEL-TECH-3319',
      itemTitle: 'Iron Man Mark LXXXV Arc Reactor Voice-Activated Helmet',
      universe: 'marvel',
      destination: 'In-Queue Runner: Space Mountain Queue Post 4',
      status: 'in_transit',
      progress: 70,
      etaMinutes: 6,
    },
    {
      id: 'DISNEY-ROYAL-9011',
      itemTitle: 'Cinderella Royal Castle Enchanted Musical Crystal Scepter',
      universe: 'disney',
      destination: 'Disney Grand Floridian Resort • Room 408',
      status: 'assembling',
      progress: 35,
      etaMinutes: 22,
    },
  ]);

  const [unlockedLocker, setUnlockedLocker] = useState<string | null>(null);

  const handleUnlockLocker = (code: string) => {
    soundEffects.playMagicChime();
    setUnlockedLocker(code);
    setTimeout(() => {
      soundEffects.playShipBell();
    }, 400);
  };

  const handleSimulateNewDispatch = () => {
    soundEffects.playRepulsorBlast();
    const newDelivery: ActiveDelivery = {
      id: `DISNEY-SAIL-${Math.floor(1000 + Math.random() * 9000)}`,
      itemTitle: "Spider-Man WEB-Tech Dual Gauntlets (Laser Engraved)",
      universe: 'marvel',
      destination: 'Smart Locker Bay #07 (Avengers Campus Exit)',
      status: 'assembling',
      progress: 15,
      lockerCode: `HERO-${Math.floor(1000 + Math.random() * 9000)}`,
      etaMinutes: 14,
    };
    setDeliveries([newDelivery, ...deliveries]);
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <Anchor className="w-3.5 h-3.5" />
              <span>Sailing & Park Logistics Control</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-white">
              Disney Merchandise Sailing & Marvel Toy Dispatch Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time monitoring of all maritime cargo shipments, in-park smart locker releases, and Stark Runner queue express deliveries.
            </p>
          </div>

          <button
            onClick={handleSimulateNewDispatch}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 active:scale-95 transition-all self-start md:self-center"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Simulate New Toy Dispatch</span>
          </button>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* Main Grid: Active Deliveries on Left, Locker Pass on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Deliveries List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Live In-Park & Sailing Dispatches ({deliveries.length})</span>
            </h3>
            <span className="text-xs text-slate-400">All systems operational</span>
          </div>

          <div className="space-y-4">
            {deliveries.map((delivery) => {
              const isMarvel = delivery.universe === 'marvel';
              const isSailing = delivery.universe === 'nautical_sailing';

              return (
                <div
                  key={delivery.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 backdrop-blur-md space-y-4 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">{delivery.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          delivery.status === 'ready_for_pickup' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          delivery.status === 'in_transit' ? 'bg-blue-950 text-blue-300 border border-blue-800 animate-pulse' :
                          'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {delivery.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white mt-1">
                        {delivery.itemTitle}
                      </h4>
                    </div>

                    <div className="text-right sm:self-center">
                      <div className="text-xs font-bold text-amber-400">
                        {delivery.etaMinutes === 0 ? 'Ready Now' : `ETA: ~${delivery.etaMinutes} mins`}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {delivery.status === 'ready_for_pickup' ? 'Awaiting pickup' : 'Cast runner moving'}
                      </div>
                    </div>
                  </div>

                  {/* Destination Info */}
                  <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                    <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span className="font-semibold">{delivery.destination}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          delivery.progress === 100
                            ? 'bg-emerald-500'
                            : isMarvel
                            ? 'bg-red-500'
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${delivery.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Vault Assembled</span>
                      <span>En Route</span>
                      <span>Delivered / Locker Stored</span>
                    </div>
                  </div>

                  {/* Locker Pickup PIN Action */}
                  {delivery.lockerCode && (
                    <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Smart Locker PIN:</span>
                        <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                          {delivery.lockerCode}
                        </span>
                      </div>

                      <button
                        onClick={() => handleUnlockLocker(delivery.lockerCode!)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
                      >
                        {unlockedLocker === delivery.lockerCode ? '✓ Door Unlocked' : 'Simulate Locker Unlock'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Smart Locker Digital Pass Card (1 col) */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-400" />
            <span>Digital Smart Locker Pass</span>
          </h3>

          <div className="bg-gradient-to-b from-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/40 mx-auto flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">Disney MagicKey Locker Access</h4>
              <p className="text-xs text-slate-400 mt-1">
                Scan this pass at any digital smart locker terminal across the Kingdom.
              </p>
            </div>

            {/* Stylized QR Code Placeholder */}
            <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl shadow-lg flex flex-col items-center justify-center">
              <div className="w-full h-full border-4 border-slate-950 p-2 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-6 h-6 bg-slate-950 rounded-sm" />
                  <div className="w-6 h-6 bg-slate-950 rounded-sm" />
                </div>
                <div className="text-center font-mono text-[9px] font-black text-slate-950">
                  DISNEY-KEY-2026
                </div>
                <div className="flex justify-between">
                  <div className="w-6 h-6 bg-slate-950 rounded-sm" />
                  <div className="w-3 h-3 bg-slate-950 rounded-full mx-auto" />
                </div>
              </div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
              <div className="text-slate-400">Assigned Station:</div>
              <div className="font-bold text-amber-300 mt-0.5">Main Street Central Locker Bay A</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
