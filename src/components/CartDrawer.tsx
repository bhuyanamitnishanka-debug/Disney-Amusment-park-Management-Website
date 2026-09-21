import React, { useState } from 'react';
import { CartItem, DeliveryOption } from '../types';
import { soundEffects } from '../services/audio';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Package, 
  Truck, 
  Hotel, 
  Compass, 
  Sparkles, 
  Shield 
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onCheckoutSuccess: (order: {
    orderId: string;
    items: CartItem[];
    total: number;
    delivery: DeliveryOption;
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckoutSuccess,
}) => {
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>('park_locker');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);
  const deliveryFee = selectedDelivery === 'sailing_cargo_home' ? 12.0 : 0; // Free in-park delivery!
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    setIsProcessing(true);
    soundEffects.playMagicChime();

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      soundEffects.playFireworksBoom();

      // Launch victory fireworks
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#ffffff'],
      });

      const orderData = {
        orderId: `DISNEY-MARVEL-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [...items],
        total,
        delivery: selectedDelivery,
      };

      onCheckoutSuccess(orderData);
      onClearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-bold text-white">Disney & Marvel Cart</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
                {items.length} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg text-lg font-bold"
            >
              ✕
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isSuccess ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center text-2xl animate-bounce">
                  ✨
                </div>
                <h4 className="text-xl font-bold text-white">Magical Order Dispatched!</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                  Your official Disney collectibles and Marvel superhero gear are being prepared at the central Emporium vault.
                </p>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Delivery Method:</span>
                    <span className="font-bold text-amber-300 capitalize">{selectedDelivery.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Dispatch:</span>
                    <span className="font-bold text-emerald-400">15 – 20 Minutes</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
                >
                  Return to Kingdom Map
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="text-4xl">🛍️</div>
                <div className="text-sm font-bold text-slate-300">Your Toy Cart is Empty</div>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Explore our authentic Marvel superhero weapons and handcrafted Disney sailing galleons.
                </p>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-4">
                  {items.map((cartItem) => (
                    <div
                      key={cartItem.item.id}
                      className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between gap-3"
                    >
                      <img
                        src={cartItem.item.image}
                        alt={cartItem.item.title}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {cartItem.item.title}
                        </div>
                        <div className="text-[11px] text-amber-400 font-mono font-bold mt-0.5">
                          ${cartItem.item.price.toFixed(2)}
                        </div>
                        {cartItem.customEngraving && (
                          <div className="text-[10px] text-slate-400 italic truncate">
                            Engraving: "{cartItem.customEngraving}"
                          </div>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden bg-slate-900">
                          <button
                            onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-white font-mono">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(cartItem.item.id)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Options Selector */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Select Park Express Delivery
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        setSelectedDelivery('park_locker');
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedDelivery === 'park_locker'
                          ? 'bg-blue-950/60 border-blue-500 text-white'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                      }`}
                    >
                      <Package className="w-4 h-4 text-blue-400 mb-1" />
                      <div className="text-xs font-bold text-slate-200">Park Smart Locker</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Main St. / Avengers Exit</div>
                    </button>

                    <button
                      onClick={() => {
                        soundEffects.playRepulsorBlast();
                        setSelectedDelivery('ride_queue_runner');
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedDelivery === 'ride_queue_runner'
                          ? 'bg-red-950/60 border-red-500 text-white'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                      }`}
                    >
                      <Truck className="w-4 h-4 text-red-400 mb-1" />
                      <div className="text-xs font-bold text-slate-200">Ride Queue Runner</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Delivered to your wait line</div>
                    </button>

                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        setSelectedDelivery('resort_hotel');
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedDelivery === 'resort_hotel'
                          ? 'bg-purple-950/60 border-purple-500 text-white'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                      }`}
                    >
                      <Hotel className="w-4 h-4 text-purple-400 mb-1" />
                      <div className="text-xs font-bold text-slate-200">Resort Stateroom</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Sent to your hotel room</div>
                    </button>

                    <button
                      onClick={() => {
                        soundEffects.playShipBell();
                        setSelectedDelivery('sailing_cargo_home');
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedDelivery === 'sailing_cargo_home'
                          ? 'bg-emerald-950/60 border-emerald-500 text-white'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                      }`}
                    >
                      <Compass className="w-4 h-4 text-emerald-400 mb-1" />
                      <div className="text-xs font-bold text-slate-200">Sailing Express Cargo</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Shipped Worldwide +$12</div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer / Checkout Summary */}
          {items.length > 0 && !isSuccess && (
            <div className="p-6 border-t border-slate-800 bg-slate-950/80 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-200">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Park Delivery Service:</span>
                  <span className="font-mono text-emerald-400">
                    {deliveryFee === 0 ? 'FREE (In-Park)' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total Amount:</span>
                  <span className="font-mono text-amber-400">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                id="complete-checkout-btn"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white text-xs font-bold shadow-xl shadow-red-600/30 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Dispatched to Park Vault...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Complete Disney & Marvel Checkout</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
