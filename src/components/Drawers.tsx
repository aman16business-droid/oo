import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Trash2, ChevronRight, Plus, Minus, Tag, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../AppContext';
import { ProductCard, bestSellerProducts } from './ProductSections';
import confetti from 'canvas-confetti';

export default function Drawers() {
  const {
    isCartOpen, setIsCartOpen, cart, removeFromCart, updateCartItemQty, updateCartItemSize,
    isFavOpen, setIsFavOpen, favorites, toggleFavorite,
    isSearchOpen, setIsSearchOpen, setViewedProduct, openQuickAdd
  } = useAppContext();

  const [couponCode, setCouponCode] = useState('');
  const celebratedThresholds = useRef<Set<number>>(new Set());

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => {
    const price = parseInt(item.salePrice.replace(/[^0-9]/g, ''));
    return total + (price * item.quantity);
  }, 0);

  // Discount thresholds
  const thresholds = [
    { amount: 699, discount: "10%", code: "SHADOW10" },
    { amount: 3499, discount: "15%", code: "SHADOW15" },
    { amount: 8999, discount: "20%", code: "SHADOW20" }
  ];

  useEffect(() => {
    thresholds.forEach(t => {
      if (cartTotal >= t.amount && !celebratedThresholds.current.has(t.amount)) {
        celebratedThresholds.current.add(t.amount);
        // Party air strike!
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { x: 0.8, y: 0.4 },
          colors: ['#000000', '#ffffff', '#e33535'],
          zIndex: 9999
        });
      } else if (cartTotal < t.amount && celebratedThresholds.current.has(t.amount)) {
        celebratedThresholds.current.delete(t.amount);
      }
    });
  }, [cartTotal, thresholds]);

  const currentThreshold = thresholds.find(t => cartTotal < t.amount) || thresholds[thresholds.length - 1];
  const isMaxDiscount = cartTotal >= thresholds[thresholds.length - 1].amount;
  
  const amountToNext = currentThreshold.amount - cartTotal;
  const maxLimit = 10000;
  const progressPercent = Math.min((cartTotal / maxLimit) * 100, 100);

  return (
    <>
      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col pt-20 px-6 bg-white/95 backdrop-blur-md transition-all">
          <div className="max-w-4xl mx-auto w-full relative">
            <input 
              autoFocus
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-transparent border-b-2 border-black text-3xl font-light py-4 outline-none placeholder:text-gray-400"
            />
            <Search size={32} className="absolute right-2 top-4 text-gray-400" />
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute -top-12 right-0 p-2 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>
            <div className="mt-8 text-sm text-gray-500 font-medium tracking-wider">POPULAR SEARCHES: OVERSIZED T-SHIRT, CARGO PANTS, LINEN SHIRT</div>
          </div>
        </div>
      )}

      {/* Cart Drawer Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[150] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsCartOpen(false)} 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full md:max-w-[450px] bg-white h-full shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-[#f8f8f8] shrink-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black tracking-tight text-gray-800 uppercase italic">Your Cart</h2>
                  <span className="text-sm font-bold text-gray-400">({cart.length} items)</span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 hover:bg-gray-200 transition-colors rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Promo Banner */}
              <div className="bg-black text-white py-2.5 px-4 flex flex-col items-center justify-center text-center shrink-0">
                <span className="text-[10px] font-black tracking-[0.2em] uppercase mb-0.5">New customers enjoy 5% OFF!</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Use code WELCOME05 on your first order</span>
              </div>

              {/* Progress Bar Container */}
              <div className="p-6 border-b border-gray-100 bg-white shrink-0">
                <div className="text-center mb-6 px-4">
                  {isMaxDiscount ? (
                    <p className="text-[11px] font-black text-green-600 uppercase tracking-widest">You've unlocked the maximum discount!</p>
                  ) : (
                    <p className="text-[10px] md:text-[11px] font-bold text-gray-500 uppercase tracking-tight leading-relaxed max-w-[320px] mx-auto">
                      Add items worth <span className="text-black font-black">₹{amountToNext.toLocaleString()}</span> more to unlock <span className="text-black font-black">{currentThreshold.discount} off</span>
                    </p>
                  )}
                </div>

                <div className="relative h-1 bg-gray-100 rounded-full mb-8 mx-6 mt-10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="absolute h-full bg-black rounded-full"
                  />
                  
                  {thresholds.map((t, idx) => (
                    <div 
                      key={idx} 
                      className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                      style={{ left: `${(t.amount / maxLimit) * 100}%` }}
                    >
                      {/* Price above */}
                      <span className="absolute bottom-5 text-[8px] font-black text-gray-400 whitespace-nowrap">₹{t.amount.toLocaleString()}</span>
                      
                      {/* Circle node */}
                      <div className={`w-4 h-4 rounded-full border-2 transition-colors flex items-center justify-center ${cartTotal >= t.amount ? 'border-black bg-white ring-4 ring-black/5' : 'border-gray-200 bg-white'}`}>
                        <div className={`text-[7px] font-black ${cartTotal >= t.amount ? 'text-black' : 'text-gray-300'}`}>%</div>
                      </div>
                      
                      {/* Label below */}
                      <div className="absolute top-5 whitespace-nowrap flex flex-col items-center">
                        <span className={`text-[8px] font-black uppercase tracking-tighter transition-colors ${cartTotal >= t.amount ? 'text-black' : 'text-gray-400'}`}>
                            {t.discount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {cart.length > 0 && (
                <div className="flex-1 flex flex-col overflow-hidden bg-[#fcfcfc]">
                   {/* Items Area - Scrollable */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                    <div className="flex flex-col gap-3">
                      {cart.map((item, index) => (
                        <div key={`${item.id}-${item.selectedSize}-${index}`} className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-sm flex gap-3 overflow-hidden relative">
                          <div className="w-16 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 relative">
                            <div>
                              <div className="flex justify-between items-start">
                                <h4 className="text-[10px] font-black text-gray-800 uppercase tracking-tight leading-tight mb-1 pr-6 line-clamp-2">{item.title}</h4>
                                <button 
                                  onClick={() => removeFromCart(index)}
                                  className="text-gray-300 hover:text-black p-1 shrink-0 absolute right-0 top-0"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              
                              <div className="flex items-center">
                                <div className="relative">
                                  <select 
                                    value={item.selectedSize}
                                    onChange={(e) => updateCartItemSize(index, e.target.value)}
                                    className="appearance-none bg-gray-50 border border-gray-200 text-[9px] font-black px-2 py-0.5 rounded-md pr-6 focus:outline-none focus:ring-1 focus:ring-black h-6 cursor-pointer uppercase tracking-widest"
                                  >
                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => (
                                      <option key={s} value={s}>{s}</option>
                                    ))}
                                  </select>
                                  <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 scale-[0.5]">
                                    <ChevronRight size={14} className="rotate-90" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                                <button 
                                  onClick={() => updateCartItemQty(index, Math.max(1, item.quantity - 1))}
                                  className="w-5 h-5 flex items-center justify-center hover:bg-white rounded transition-colors"
                                >
                                  <Minus size={10} />
                                </button>
                                <span className="w-6 text-center text-[10px] font-black">{item.quantity}</span>
                                <button 
                                  onClick={() => updateCartItemQty(index, item.quantity + 1)}
                                  className="w-5 h-5 flex items-center justify-center hover:bg-white rounded transition-colors"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-[10px] font-black text-black leading-tight">₹{parseInt(item.salePrice.replace(/[^0-9]/g, '')).toLocaleString()}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                    {/* Fixed Suggested Strip */}
                  <div className="bg-[#fcfcfc] border-t border-black/[0.02] pt-4 pb-3 shrink-0">
                    <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] mb-3 px-5 italic opacity-80">Suggested for you</h4>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 px-5 snap-x">
                      {bestSellerProducts.slice(0, 10).map((product) => (
                        <div key={product.id} className="min-w-[125px] snap-start bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col group transition-transform hover:-translate-y-1">
                          <div 
                              className="h-28 bg-gray-50 relative overflow-hidden cursor-pointer"
                              onClick={() => {
                                  setViewedProduct(product);
                                  setIsCartOpen(false);
                              }}
                          >
                            <img src={product.image} alt={product.title} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition duration-700" />
                            <div className="absolute top-2 left-2 bg-[#e33535] text-white text-[7px] font-black px-2 py-0.5 rounded-[4px] uppercase tracking-tighter shadow-sm">
                              {product.savePercentage}% OFF
                            </div>
                          </div>
                          <div className="p-2.5 flex flex-col flex-1">
                            <h5 className="text-[8px] font-black text-gray-800 uppercase tracking-tight truncate mb-1.5">{product.title}</h5>
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-black text-black">₹{product.salePrice}</span>
                              <button 
                                onClick={() => openQuickAdd(product)}
                                className="hidden sm:flex p-1.5 bg-black text-white rounded-lg hover:bg-[#e33535] transition-colors shadow-sm"
                              >
                                <Plus size={10} strokeWidth={3} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fixed Checkout Console */}
                  <div className="bg-white border-t border-black/[0.03] p-4 shrink-0">
                    <div className="relative mb-3">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={14} />
                      <input 
                        type="text" 
                        placeholder="Enter Coupon Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#f9f9f9] border border-gray-100 rounded-xl text-[10px] font-black placeholder:text-gray-300 focus:outline-none focus:border-black shadow-inner uppercase tracking-wider"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center mb-1 px-1">
                       <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Grand Total</span>
                          <span className="text-base font-black text-black">₹{cartTotal.toLocaleString()}.00</span>
                       </div>
                       <button className="bg-black text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg active:shadow-none">
                          Checkout
                       </button>
                    </div>
                  </div>
                </div>
              )}

              {cart.length === 0 && (
                <div className="flex-1 flex flex-col overflow-hidden bg-[#fcfcfc]">
                  <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
                    <ShoppingBag size={48} className="text-gray-200 mb-4" />
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight italic">Your cart is empty</h3>
                    <p className="text-gray-400 text-[10px] mt-2 uppercase font-bold tracking-widest">Add items to start shopping</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-8 bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all shadow-lg"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Wishlist Drawer */}
      <AnimatePresence>
        {isFavOpen && (
          <div className="fixed inset-0 z-[150] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsFavOpen(false)} 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full md:max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-white/50"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 tracking-wider text-sm">WISHLIST ({favorites.length})</h3>
                <button onClick={() => setIsFavOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition">
                  <X size={20} strokeWidth={1.5} className="text-gray-500" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5">
                {favorites.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center text-center space-y-4">
                    <p className="text-gray-500 text-sm">Your wishlist is empty.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {favorites.map((item) => (
                      <div key={item.id} className="relative group/card cursor-pointer">
                        <div 
                          className="aspect-[3/4] mb-2 rounded-sm overflow-hidden bg-[#f8f8f8] relative"
                          onClick={() => {
                            setViewedProduct(item);
                            setIsFavOpen(false);
                          }}
                        >
                           <img src={item.image} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
                           <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(item);
                              }}
                              className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-white"
                           >
                             <X size={14} />
                           </button>
                        </div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wide truncate mb-1">{item.title}</h4>
                        <p className="text-[#e33535] font-semibold text-xs">Rs.{item.salePrice}.00</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
