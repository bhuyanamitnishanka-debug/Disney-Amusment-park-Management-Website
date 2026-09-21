import React, { useState } from 'react';
import { MerchandiseItem, UniverseType } from '../types';
import { soundEffects } from '../services/audio';
import { 
  Shield, 
  Sparkles, 
  Anchor, 
  ShoppingBag, 
  Volume2, 
  Star, 
  Check, 
  Zap, 
  Compass, 
  Search, 
  Filter, 
  Eye, 
  Package, 
  Truck,
  Heart,
  Flame,
  Award,
  ArrowRight
} from 'lucide-react';

interface MerchandiseStoreProps {
  items: MerchandiseItem[];
  onAddToCart: (item: MerchandiseItem, customEngraving?: string) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (itemId: string) => void;
  onNavigateToMarvelSection?: () => void;
}

export const MerchandiseStore: React.FC<MerchandiseStoreProps> = ({
  items,
  onAddToCart,
  wishlistIds = [],
  onToggleWishlist,
  onNavigateToMarvelSection,
}) => {
  const [selectedUniverse, setSelectedUniverse] = useState<UniverseType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'new_arrivals' | 'top_sellers'>('all');
  const [activeModalItem, setActiveModalItem] = useState<MerchandiseItem | null>(null);
  const [engravingText, setEngravingText] = useState('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const handlePlayItemSound = (soundFx: MerchandiseItem['soundFx'], e: React.MouseEvent) => {
    e.stopPropagation();
    switch (soundFx) {
      case 'repulsor':
        soundEffects.playRepulsorBlast();
        break;
      case 'thunder':
        soundEffects.playMjolnirThunder();
        break;
      case 'web_shot':
        soundEffects.playWebShoot();
        break;
      case 'ship_bell':
        soundEffects.playShipBell();
        break;
      case 'magic_chime':
      default:
        soundEffects.playMagicChime();
        break;
    }
  };

  const handleAdd = (item: MerchandiseItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    handlePlayItemSound(item.soundFx, { stopPropagation: () => {} } as any);
    onAddToCart(item, engravingText.trim() || undefined);
    setJustAddedId(item.id);
    setTimeout(() => setJustAddedId(null), 1800);
    if (activeModalItem) {
      setActiveModalItem(null);
      setEngravingText('');
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesUniverse = selectedUniverse === 'all' || item.universe === selectedUniverse;
    const matchesQuery = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.character && item.character.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.movieSeries && item.movieSeries.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMode = 
      filterMode === 'all' ||
      (filterMode === 'new_arrivals' && item.isNewArrival) ||
      (filterMode === 'top_sellers' && item.isTopSeller);

    return matchesUniverse && matchesQuery && matchesMode;
  });

  return (
    <div className="space-y-8">
      
      {/* Storefront Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-indigo-950 to-red-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Disney & Marvel Official Collectibles</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-black text-white tracking-tight">
            The Grand Disney & Marvel <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-red-500">
              Toy & Sailing Merchandise Pavilion
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Equip your heroic adventure with authentic Marvel Stark Tech toys, handcrafted Disney sailing galleons, and enchanted royal collectibles. Order directly for <span className="text-amber-300 font-semibold">in-park locker pickup</span>, <span className="text-cyan-300 font-semibold">ride queue runner dispatch</span>, or <span className="text-emerald-300 font-semibold">home sailing cargo shipping</span>.
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-300 pt-2 flex-wrap">
            <span className="flex items-center gap-1">
              <Package className="w-4 h-4 text-amber-400" /> Free Park Locker Pickup
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-cyan-400" /> Queue Seat Delivery
            </span>
            <span className="flex items-center gap-1">
              <Compass className="w-4 h-4 text-emerald-400" /> Disney Sailing Worldwide
            </span>
          </div>
        </div>

        {/* Ambient background glows */}
        <div className="absolute -right-10 -bottom-10 w-96 h-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* DEDICATED MARVEL SUPERHERO TOY SAILING CALLOUT BANNER */}
      {onNavigateToMarvelSection && (
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-red-950 via-slate-900 to-cyan-950 border border-red-500/40 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-600/30 border border-red-500 flex items-center justify-center text-xl">
              🦸‍♂️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Marvel Superhero Toy Sailing Vault
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold">
                  DEDICATED SECTION
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Filter by characters (Iron Man, Spider-Man, Thor, Namor), movies, and explore New Arrivals & Top Sellers.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEffects.playRepulsorBlast();
              onNavigateToMarvelSection();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Open Marvel Section</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        
        {/* Category Universe Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => {
              soundEffects.playClick();
              setSelectedUniverse('all');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedUniverse === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Toys & Treasures ({items.length})
          </button>

          <button
            onClick={() => {
              soundEffects.playRepulsorBlast();
              setSelectedUniverse('marvel');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedUniverse === 'marvel'
                ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-red-300" />
            <span>Marvel Superhero Toys</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playMagicChime();
              setSelectedUniverse('disney');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedUniverse === 'disney'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Disney Princess & Castle</span>
          </button>
        </div>

        {/* Quick Filter: New Arrivals / Top Sellers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode(filterMode === 'new_arrivals' ? 'all' : 'new_arrivals')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              filterMode === 'new_arrivals'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>New Arrivals</span>
          </button>

          <button
            onClick={() => setFilterMode(filterMode === 'top_sellers' ? 'all' : 'top_sellers')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              filterMode === 'top_sellers'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3 h-3 text-amber-400" />
            <span>Top Sellers</span>
          </button>

          {/* Search Input */}
          <div className="relative w-full md:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search merchandise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => {
          const isMarvel = item.universe === 'marvel';
          const isSailing = item.isSailingVessel || item.category === 'sailing_model';
          const isWishlisted = wishlistIds.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => {
                soundEffects.playClick();
                setActiveModalItem(item);
              }}
              className="group bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer backdrop-blur-md relative"
            >
              {/* Top Image Section */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                {/* Badge */}
                {item.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/85 backdrop-blur-md text-amber-300 border border-amber-500/40 shadow-sm">
                    {item.badge}
                  </span>
                )}

                {/* Wishlist Heart */}
                {onToggleWishlist && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEffects.playClick();
                      onToggleWishlist(item.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-red-400 border border-slate-700 backdrop-blur-md transition-all active:scale-95"
                    title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                )}

                {/* Sound FX Interactive Trigger Button on Card */}
                <button
                  onClick={(e) => handlePlayItemSound(item.soundFx, e)}
                  title="Test Sound Effect"
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-950/80 hover:bg-blue-600 border border-slate-700 text-white backdrop-blur-md transition-all active:scale-95 shadow-md flex items-center gap-1 text-[10px] font-semibold"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Audio FX</span>
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      {isMarvel ? <Shield className="w-3 h-3 text-red-400" /> : isSailing ? <Anchor className="w-3 h-3 text-emerald-400" /> : <Sparkles className="w-3 h-3 text-indigo-400" />}
                      {isMarvel ? (item.character || 'Marvel') : isSailing ? 'Sailing Vessel' : 'Disney'}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{item.rating}</span>
                      <span className="text-[10px] text-slate-500">({item.reviewsCount})</span>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Pricing & Add to Cart */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-lg font-black text-white font-mono">
                      ${item.price.toFixed(2)}
                    </div>
                    {item.originalPrice && (
                      <div className="text-[10px] text-slate-500 line-through">
                        ${item.originalPrice.toFixed(2)}
                      </div>
                    )}
                  </div>

                  <button
                    id={`add-to-cart-${item.id}`}
                    onClick={(e) => handleAdd(item, e)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md ${
                      justAddedId === item.id
                        ? 'bg-emerald-600 text-white'
                        : isMarvel
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                    }`}
                  >
                    {justAddedId === item.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {activeModalItem.universe === 'marvel' ? 'Marvel Superhero Collection' : 'Walt Disney Imagineering'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {activeModalItem.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setActiveModalItem(null);
                  setEngravingText('');
                }}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                <img
                  src={activeModalItem.image}
                  alt={activeModalItem.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={(e) => handlePlayItemSound(activeModalItem.soundFx, e)}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Play Sound</span>
                </button>
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="text-2xl font-black text-white font-mono">
                    ${activeModalItem.price.toFixed(2)}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeModalItem.description}
                  </p>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-200">Key Features:</span>
                    <ul className="text-xs text-slate-400 space-y-1">
                      {activeModalItem.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Engraving Option */}
                  <div className="pt-2">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Custom Laser Engraving (Free):
                    </label>
                    <input
                      type="text"
                      maxLength={24}
                      value={engravingText}
                      onChange={(e) => setEngravingText(e.target.value)}
                      placeholder="e.g. Recruit Stark / Disney 2026"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                  {onToggleWishlist && (
                    <button
                      onClick={() => onToggleWishlist(activeModalItem.id)}
                      className={`p-3 rounded-xl border transition-colors ${
                        wishlistIds.includes(activeModalItem.id)
                          ? 'bg-red-500/20 text-red-400 border-red-500/40'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${wishlistIds.includes(activeModalItem.id) ? 'fill-red-500' : ''}`} />
                    </button>
                  )}

                  <button
                    onClick={() => handleAdd(activeModalItem)}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart • ${activeModalItem.price.toFixed(2)}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
