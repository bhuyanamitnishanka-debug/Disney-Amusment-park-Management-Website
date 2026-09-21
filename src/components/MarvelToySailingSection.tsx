import React, { useState } from 'react';
import { MerchandiseItem } from '../types';
import { soundEffects } from '../services/audio';
import { 
  Shield, 
  Sparkles, 
  Anchor, 
  ShoppingBag, 
  Search, 
  Filter, 
  Star, 
  Check, 
  Zap, 
  Eye, 
  Heart, 
  Compass, 
  Volume2, 
  Flame, 
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Truck,
  Award,
  Package
} from 'lucide-react';

interface MarvelToySailingSectionProps {
  items: MerchandiseItem[];
  onAddToCart: (item: MerchandiseItem, customEngraving?: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (itemId: string) => void;
  onOpenCart?: () => void;
  onViewItem?: (item: MerchandiseItem) => void;
}

export const MarvelToySailingSection: React.FC<MarvelToySailingSectionProps> = ({
  items,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
  onOpenCart,
  onViewItem,
}) => {
  // Filter for Marvel items and nautical sailing crafts
  const marvelItems = items.filter((item) => item.universe === 'marvel' || item.isSailingVessel);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('all');
  const [selectedMovieSeries, setSelectedMovieSeries] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalItem, setActiveModalItem] = useState<MerchandiseItem | null>(null);

  const handleOpenItemModal = (item: MerchandiseItem) => {
    setActiveModalItem(item);
    onViewItem?.(item);
  };
  const [engravingText, setEngravingText] = useState('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  // Character list extracted dynamically
  const availableCharacters = [
    'all',
    'Iron Man',
    'Spider-Man',
    'Thor',
    'Captain America',
    'Black Panther',
    'Doctor Strange',
    'Star-Lord',
    'Wolverine',
    'Namor',
    'Loki'
  ];

  // Movie/series list
  const availableMovies = [
    'all',
    'Avengers: Endgame',
    'Black Panther: Wakanda Forever',
    'Thor: Love and Thunder',
    'Spider-Man: No Way Home',
    'Guardians of the Galaxy Vol. 3',
    'Loki',
    'X-Men 97',
    'Captain America: Brave New World'
  ];

  // Sounds
  const playItemSound = (soundFx: MerchandiseItem['soundFx'], e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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
      default:
        soundEffects.playMagicChime();
        break;
    }
  };

  const handleAdd = (item: MerchandiseItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playItemSound(item.soundFx);
    onAddToCart(item, engravingText.trim() || undefined);
    setJustAddedId(item.id);
    setTimeout(() => setJustAddedId(null), 1800);
    if (activeModalItem) {
      setActiveModalItem(null);
      setEngravingText('');
    }
  };

  // Sections
  const newArrivals = marvelItems.filter((i) => i.isNewArrival);
  const topSellers = marvelItems.filter((i) => i.isTopSeller);

  // Filtered Catalog
  const filteredCatalog = marvelItems.filter((item) => {
    const matchesQuery = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.character && item.character.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.movieSeries && item.movieSeries.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesChar = selectedCharacter === 'all' || item.character === selectedCharacter;
    const matchesMovie = selectedMovieSeries === 'all' || item.movieSeries === selectedMovieSeries;
    const matchesCat = 
      selectedCategory === 'all' ||
      (selectedCategory === 'sailing' && item.isSailingVessel) ||
      (selectedCategory === 'action_toys' && item.category === 'toy') ||
      (selectedCategory === 'tech_replicas' && (item.category === 'gadget' || item.category === 'costume_replica'));

    return matchesQuery && matchesChar && matchesMovie && matchesCat;
  });

  const resetFilters = () => {
    soundEffects.playClick();
    setSearchQuery('');
    setSelectedCharacter('all');
    setSelectedMovieSeries('all');
    setSelectedCategory('all');
  };

  return (
    <div className="space-y-10">
      {/* Hero Banner: Marvel Superhero Toy Sailing Pavilion */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-red-950/80 to-slate-900 border border-red-900/60 p-6 sm:p-10 shadow-2xl shadow-red-950/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-red-400" />
            <span>Stark Applied Sciences & Wakandan Nautical Fleet</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Marvel Superhero <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-cyan-400">
              Toy & Sailing Fleet Vault
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Welcome to the official Avengers Campus toy armory and superhero sailing pavilion. Explore high-tech superhero action toys, wearable vibranium replicas, and oceanic amphibious crafts—including the <span className="text-cyan-300 font-semibold">Naval Quinjet Hydrofoil</span>, <span className="text-purple-300 font-semibold">Wakandan Royal Sunbird Skiff</span>, and <span className="text-amber-300 font-semibold">Asgardian Dragon Longship</span>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Authentic Sound FX Previews</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>In-Park Locker & Sailing Cargo Home Delivery</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <Zap className="w-3.5 h-3.5 text-red-400" />
              <span>Custom Stark Laser Engraving</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOP SELLERS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Top Sellers
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  Bestselling Marvel Toys & Ships
                </span>
              </h2>
              <p className="text-xs text-slate-400">Most requested by park visitors and Avengers Campus recruits</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topSellers.slice(0, 4).map((item, idx) => {
            const isWishlisted = wishlistIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => handleOpenItemModal(item)}
                className="group relative bg-slate-900/90 hover:bg-slate-850 rounded-2xl border border-slate-800 hover:border-amber-500/50 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative">
                  {/* Top Rank Badge */}
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 text-amber-300 border border-amber-500/40 text-[11px] font-black backdrop-blur-sm shadow-md">
                    <span>#{idx + 1}</span>
                    <span>Top Seller</span>
                  </div>

                  {/* Wishlist Heart */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEffects.playClick();
                      onToggleWishlist(item.id);
                    }}
                    className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-red-400 border border-slate-800 transition-colors"
                    title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  {/* Image */}
                  <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-950 mb-3 relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.isSailingVessel && (
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-cyan-950/90 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 flex items-center gap-1">
                        <Anchor className="w-3 h-3 text-cyan-400" />
                        <span>Sailing Vessel</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-semibold text-red-400">{item.character || 'Marvel Hero'}</span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {item.rating} ({item.reviewsCount})
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white line-clamp-2 group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-base font-black text-white">${item.price.toFixed(2)}</span>
                      {item.originalPrice && (
                        <span className="text-xs text-slate-500 line-through ml-1.5">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => playItemSound(item.soundFx, e)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
                        title="Play audio preview"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => handleAdd(item, e)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                          justAddedId === item.id
                            ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                            : 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30'
                        }`}
                      >
                        {justAddedId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* NEW ARRIVALS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                New Arrivals
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                  Fresh Releases
                </span>
              </h2>
              <p className="text-xs text-slate-400">Newly commissioned Stark, Wakandan, and Multiversal gear</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {newArrivals.slice(0, 3).map((item) => {
            const isWishlisted = wishlistIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => handleOpenItemModal(item)}
                className="group relative bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-cyan-500/30 hover:border-cyan-400 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative">
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    <span>NEW ARRIVAL</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEffects.playClick();
                      onToggleWishlist(item.id);
                    }}
                    className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-red-400 border border-slate-800 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-950 mb-3 relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.isSailingVessel && (
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/90 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 flex items-center gap-1">
                        <Anchor className="w-3 h-3 text-cyan-400" />
                        <span>Oceanic Sailing Vessel</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-cyan-400">{item.movieSeries || 'Marvel Studios'}</span>
                    <span className="text-slate-300 font-mono text-[11px]">{item.character}</span>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="text-lg font-black text-white">${item.price.toFixed(2)}</span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => playItemSound(item.soundFx, e)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
                        title="Sound preview"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => handleAdd(item, e)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          justAddedId === item.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30'
                        }`}
                      >
                        {justAddedId === item.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* COMPREHENSIVE BROWSE, SEARCH & FILTER SUITE */}
      <section className="space-y-6 pt-4 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-red-400" />
              Browse Marvel Armory & Sailing Fleet
            </h2>
            <p className="text-xs text-slate-400">Search and filter across superhero characters, movies, and vessel models</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search toys, Quinjets, shields..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-xs text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 space-y-3">
          {/* Character Filter Pills */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <span>Filter by Superhero Character:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {availableCharacters.map((char) => (
                <button
                  key={char}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedCharacter(char);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCharacter === char
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {char === 'all' ? 'All Characters' : char}
                </button>
              ))}
            </div>
          </div>

          {/* Movie / Series Filter Pills */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <span>Filter by Marvel Movie / Series:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {availableMovies.map((movie) => (
                <button
                  key={movie}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedMovieSeries(movie);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedMovieSeries === movie
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {movie === 'all' ? 'All Movies & Series' : movie}
                </button>
              ))}
            </div>
          </div>

          {/* Category Type Filter */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Type:</span>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  selectedCategory === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Gear ({marvelItems.length})
              </button>
              <button
                onClick={() => setSelectedCategory('sailing')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  selectedCategory === 'sailing' ? 'bg-cyan-900 text-cyan-200 border border-cyan-700' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Anchor className="w-3 h-3 text-cyan-400" />
                Sailing & Oceanic Vessels
              </button>
              <button
                onClick={() => setSelectedCategory('action_toys')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  selectedCategory === 'action_toys' ? 'bg-red-950 text-red-200 border border-red-800' : 'text-slate-400 hover:text-white'
                }`}
              >
                Action Toys
              </button>
              <button
                onClick={() => setSelectedCategory('tech_replicas')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  selectedCategory === 'tech_replicas' ? 'bg-amber-950 text-amber-200 border border-amber-800' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tech Replicas & Armor
              </button>
            </div>

            {(searchQuery || selectedCharacter !== 'all' || selectedMovieSeries !== 'all' || selectedCategory !== 'all') && (
              <button
                onClick={resetFilters}
                className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCatalog.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 space-y-3">
              <Shield className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Marvel Toys Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No items match your active search and filter combinations. Try resetting filters or searching for another character.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-colors"
              >
                View All Marvel Toys
              </button>
            </div>
          ) : (
            filteredCatalog.map((item) => {
              const isWishlisted = wishlistIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenItemModal(item)}
                  className="group bg-slate-900/80 hover:bg-slate-850 rounded-2xl border border-slate-800 hover:border-red-500/40 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-red-950/20 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative">
                    {/* Badge */}
                    {item.badge && (
                      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-slate-950/80 text-amber-300 border border-amber-500/40 text-[10px] font-bold backdrop-blur-sm">
                        {item.badge}
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundEffects.playClick();
                        onToggleWishlist(item.id);
                      }}
                      className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-red-400 border border-slate-800 transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>

                    <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-950 mb-3 relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.isSailingVessel && (
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-cyan-950/90 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 flex items-center gap-1">
                          <Anchor className="w-3 h-3 text-cyan-400" />
                          <span>Sailing Model</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="font-semibold text-red-400">{item.character || 'Marvel'}</span>
                        <span className="truncate max-w-[120px] text-slate-400">{item.movieSeries}</span>
                      </div>

                      <h3 className="font-bold text-sm text-white line-clamp-2 group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <span className="text-base font-black text-white">${item.price.toFixed(2)}</span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => playItemSound(item.soundFx, e)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
                          title="Sound preview"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => handleAdd(item, e)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                            justAddedId === item.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30'
                          }`}
                        >
                          {justAddedId === item.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* DETAILED TOY & SAILING VESSEL MODAL */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  {activeModalItem.character && (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold">
                      {activeModalItem.character}
                    </span>
                  )}
                  {activeModalItem.movieSeries && (
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold">
                      {activeModalItem.movieSeries}
                    </span>
                  )}
                  {activeModalItem.isSailingVessel && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                      <Anchor className="w-3 h-3" /> Sailing Vessel
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white">{activeModalItem.title}</h2>
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

            {/* Modal Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                  <img
                    src={activeModalItem.image}
                    alt={activeModalItem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => playItemSound(activeModalItem.soundFx)}
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Play Sound FX</span>
                  </button>
                </div>

                {/* Hero Rating metrics */}
                {activeModalItem.heroRating && (
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                    <div className="font-bold text-slate-300 flex items-center justify-between">
                      <span>Stark Tech Analysis</span>
                      <span className="text-[10px] text-amber-400 font-mono">CLASSIFIED GRADE</span>
                    </div>
                    <div className="space-y-1.5">
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                          <span>Combat Power</span>
                          <span className="font-bold text-white">{activeModalItem.heroRating.power}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: `${activeModalItem.heroRating.power}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                          <span>Technology Level</span>
                          <span className="font-bold text-white">{activeModalItem.heroRating.tech}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${activeModalItem.heroRating.tech}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-black text-white">
                      ${activeModalItem.price.toFixed(2)}
                      {activeModalItem.originalPrice && (
                        <span className="text-sm text-slate-500 line-through ml-2 font-normal">
                          ${activeModalItem.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-emerald-400 font-medium mt-0.5">
                      ✓ In Stock ({activeModalItem.stock} available in park vault)
                    </p>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activeModalItem.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-xs font-bold text-slate-200">Interactive Features:</span>
                    <ul className="space-y-1 text-xs text-slate-400">
                      {activeModalItem.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-red-400 font-bold">•</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Specifications */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-[11px] text-slate-400">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Material:</span>
                      <span className="text-slate-300 font-medium">{activeModalItem.specs.material}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Scale:</span>
                      <span className="text-slate-300 font-medium">{activeModalItem.specs.scale}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Power:</span>
                      <span className="text-slate-300 font-medium">{activeModalItem.specs.batteryRequired}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Recommended Age:</span>
                      <span className="text-slate-300 font-medium">{activeModalItem.specs.ageRange}</span>
                    </div>
                  </div>

                  {/* Custom Engraving Input */}
                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Custom Stark Engraving (Optional):</span>
                      <span className="text-[10px] text-slate-500">Free In-Park Service</span>
                    </label>
                    <input
                      type="text"
                      maxLength={30}
                      placeholder="e.g. Agent Parker / Property of Tony Stark"
                      value={engravingText}
                      onChange={(e) => setEngravingText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-slate-600"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => onToggleWishlist(activeModalItem.id)}
                    className={`p-3 rounded-xl border transition-colors ${
                      wishlistIds.includes(activeModalItem.id)
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                    title="Toggle Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${wishlistIds.includes(activeModalItem.id) ? 'fill-red-500' : ''}`} />
                  </button>

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
