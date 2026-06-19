import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Trash2, ChevronRight, Plus, Minus, Tag, ShoppingBag, Loader2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext, ViewType } from '../AppContext';
import { ProductCard } from './ProductSections';
import confetti from 'canvas-confetti';
import { createCheckout } from '../lib/shopify';

export default function Drawers() {
  const {
    isCartOpen, setIsCartOpen, cart, removeFromCart, updateCartItemQty, updateCartItemSize,
    isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, 
    setViewedProduct, openQuickAdd, shopifyProducts, setCurrentView,
    wishlist, isWishlistOpen, setIsWishlistOpen, removeFromWishlist
  } = useAppContext();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setViewedProduct(null);
      setCurrentView('search-results');
      setIsSearchOpen(false);
    }
  };

  const [couponCode, setCouponCode] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const celebratedThresholds = useRef<Set<number>>(new Set());

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    
    // Attempt to map out variant IDs to submit to Shopify
    const items = cart.map(item => ({
      variantId: item.variantId || item.variants?.[0]?.id,
      quantity: item.quantity
    })).filter(i => i.variantId);

    if (items.length === 0) {
      alert("Failed to find valid product variants. This typically happens when using the base mock products without a real Shopify integration. Please connect your store.");
      setIsCheckingOut(false);
      return;
    }

    const result = await createCheckout(items);
    if (result?.url) {
      if (window.top !== window.self) {
        // App is running inside the AI Studio preview iframe
        alert("Shopify strictly blocks checkout pages from loading inside an iframe for security reasons. \n\nBecause you are viewing this app inside the AI Studio preview, we must open the checkout in a new window. \n\nTo view this app normally (where checkout happens in the same tab), please click the 'Open in New Window' icon in the top right corner of the AI Studio preview header.");
        window.open(result.url, '_blank');
      } else {
        // App is opened in its own separate tab
        window.location.href = result.url;
      }
    } else {
      alert(result?.error || "Failed to create checkout. Please check your Shopify credentials.");
      setIsCheckingOut(false);
    }
  };

  // Calculate cart subtotal
  const subtotal = cart.reduce((total, item) => {
    const price = parseFloat(item.salePrice.replace(/[^0-9.]/g, '')) || 0;
    return total + (price * item.quantity);
  }, 0);

  // Discount thresholds
  const thresholds = [
    { amount: 699, discount: 10, code: "SHADOW10" },
    { amount: 3499, discount: 15, code: "SHADOW15" },
    { amount: 8999, discount: 20, code: "SHADOW20" }
  ];

  // Auto-applied discount based on thresholds
  const autoDiscountPercent = thresholds.reduce((max, t) => {
    if (subtotal >= t.amount) return t.discount;
    return max;
  }, 0);

  // Coupon code discount
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const thresholdMatch = thresholds.find(t => t.code === code);
    
    if (thresholdMatch) {
      setAppliedCoupon({ code: thresholdMatch.code, discount: thresholdMatch.discount });
    } else if (code === 'WELCOME05') {
      setAppliedCoupon({ code: 'WELCOME05', discount: 5 });
    } else {
      alert("Invalid coupon code");
      setAppliedCoupon(null);
    }
  };

  // Final discount calculation (whichever is higher: auto or applied coupon)
  const finalDiscountPercent = Math.max(autoDiscountPercent, appliedCoupon?.discount || 0);
  const discountAmount = subtotal * (finalDiscountPercent / 100);
  const grandTotal = subtotal - discountAmount;

  useEffect(() => {
    thresholds.forEach(t => {
      if (subtotal >= t.amount && !celebratedThresholds.current.has(t.amount)) {
        celebratedThresholds.current.add(t.amount);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { x: 0.8, y: 0.4 },
          colors: ['#000000', '#ffffff', '#e33535'],
          zIndex: 9999
        });
      } else if (subtotal < t.amount && celebratedThresholds.current.has(t.amount)) {
        celebratedThresholds.current.delete(t.amount);
      }
    });
  }, [subtotal]);

  const currentThreshold = thresholds.find(t => subtotal < t.amount) || thresholds[thresholds.length - 1];
  const isMaxDiscount = subtotal >= thresholds[thresholds.length - 1].amount;
  
  const amountToNext = currentThreshold.amount - subtotal;
  const maxLimit = 10000;
  const progressPercent = Math.min((subtotal / maxLimit) * 100, 100);

  return (
    <>
      {/* Search Drawer Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[150] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" 
              onClick={() => setIsSearchOpen(false)} 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full md:max-w-[500px] bg-white h-full shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header with Search Input */}
              <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                <div className="relative flex-1">
                   <input 
                     autoFocus
                     type="text" 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Search for items..." 
                     className="w-full bg-transparent text-base font-medium py-2 outline-none placeholder:text-gray-400"
                     onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                   />
                </div>
                <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition" aria-label="Close search">
                  <X size={24} strokeWidth={1.5} className="text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar">
                {/* Popular Searches */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Popular Searches</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { label: 'WOMEN', view: 'women-wear' as ViewType },
                      { label: 'MEN', view: 'men-wear' as ViewType },
                      { label: 'NEW ARRIVALS', view: 'new-arrivals' as ViewType },
                      { label: 'PREMIUM', view: 'premium' as ViewType },
                      { label: 'BESTSELLERS', view: 'best-sellers' as ViewType }
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          setViewedProduct(null);
                          setCurrentView(item.view);
                          setIsSearchOpen(false);
                        }}
                        className="px-5 py-2.5 border border-gray-100 text-[10px] font-bold tracking-widest uppercase rounded-full hover:bg-black hover:text-white transition-all shadow-sm"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Top Products */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Top Products</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                    {shopifyProducts.slice(0, 6).map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAddToCart={openQuickAdd}
                        onViewProduct={(p) => {
                          setViewedProduct(p);
                          setIsSearchOpen(false);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              <div className="flex items-center justify-between p-3.5 md:p-5 border-b border-gray-100 bg-[#f8f8f8] shrink-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base md:text-lg font-black tracking-tight text-gray-800 uppercase italic">Your Cart</h2>
                  <span className="text-xs font-bold text-gray-400">({cart.length})</span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 hover:bg-gray-200 transition-colors rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Promo Banner */}
              <div className="bg-black text-white py-2 px-4 flex flex-col items-center justify-center text-center shrink-0">
                <span className="text-[9px] font-black tracking-[0.2em] uppercase">5% OFF FOR NEW CUSTOMERS</span>
                <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">CODE: WELCOME05</span>
              </div>

              {/* Progress Bar Container */}
              <div className="p-3 md:p-6 border-b border-gray-100 bg-white shrink-0">
                <div className="text-center mb-3 px-2">
                  {isMaxDiscount ? (
                    <p className="text-[9px] md:text-[11px] font-black text-green-600 uppercase tracking-widest leading-none">Maximum discount unlocked!</p>
                  ) : (
                    <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-tight leading-relaxed max-w-[280px] mx-auto">
                      Add <span className="text-black font-black">₹{amountToNext.toLocaleString()}</span> more to unlock <span className="text-black font-black">{currentThreshold.discount}% off</span>
                    </p>
                  )}
                </div>

                <div className="relative h-1 bg-gray-100 rounded-full mb-6 mx-5 mt-6">
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
                      <span className="absolute bottom-4 text-[7px] font-bold text-gray-300 whitespace-nowrap">₹{t.amount.toLocaleString()}</span>
                      
                      {/* Circle node */}
                      <div className={`w-3.5 h-3.5 rounded-full border-2 transition-colors flex items-center justify-center ${subtotal >= t.amount ? 'border-black bg-white ring-2 ring-black/5' : 'border-gray-100 bg-white'}`}>
                        <div className={`text-[6px] font-black ${subtotal >= t.amount ? 'text-black' : 'text-gray-200'}`}>%</div>
                      </div>
                      
                      {/* Label below */}
                      <div className="absolute top-4 whitespace-nowrap flex flex-col items-center">
                        <span className={`text-[8px] font-black uppercase tracking-tighter transition-colors ${subtotal >= t.amount ? 'text-black' : 'text-gray-400'}`}>
                            {t.discount}%
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
                        <div key={`${item.id}-${item.size}-${index}`} className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-sm flex gap-3 overflow-hidden relative">
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
                                    value={item.size}
                                    onChange={(e) => updateCartItemSize(index, e.target.value)}
                                    className="appearance-none bg-gray-50 border border-gray-200 text-[9px] font-black px-2 py-0.5 rounded-md pr-6 focus:outline-none focus:ring-1 focus:ring-black h-6 cursor-pointer uppercase tracking-widest"
                                  >
                                    {item.variants?.length > 0 ? (
                                      [...new Set(item.variants.map((v: any) => {
                                        const sizeOpt = v.selectedOptions?.find((o: any) => o.name?.toLowerCase() === 'size' || o.name?.toLowerCase() === 'title');
                                        return sizeOpt ? sizeOpt.value : null;
                                      }).filter(Boolean))].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                      ))
                                    ) : (
                                      <option value={item.size}>{item.size}</option>
                                    )}
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
                                <div className="text-[10px] font-black text-black leading-tight">₹{parseFloat(item.salePrice).toLocaleString()}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Fixed Suggested Strip */}
                  <div className="bg-[#fcfcfc] border-t border-black/[0.02] pt-3 pb-2 shrink-0">
                    <h4 className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2 px-4 italic opacity-80">Suggested for you</h4>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 px-4 snap-x">
                      {shopifyProducts.slice(0, 10).map((product) => (
                        <div key={product.id} className="min-w-[110px] snap-start bg-white rounded-xl overflow-hidden border border-gray-50 shadow-sm flex flex-col group">
                          <div 
                              className="h-24 bg-gray-50 relative overflow-hidden cursor-pointer"
                              onClick={() => {
                                  setViewedProduct(product);
                                  setIsCartOpen(false);
                              }}
                          >
                            <img src={product.image} alt={product.title} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition duration-700" />
                            {parseFloat(product.savePercentage) > 0 && (
                              <div className="absolute top-1.5 left-1.5 bg-[#e33535] text-white text-[6px] font-black px-1.5 py-0.5 rounded-[4px] uppercase tracking-tighter shadow-sm">
                                {product.savePercentage} OFF
                              </div>
                            )}
                          </div>
                          <div className="p-2 flex flex-col flex-1">
                            <h5 className="text-[7px] font-black text-gray-600 uppercase tracking-tight truncate mb-1">{product.title}</h5>
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black text-black">₹{product.salePrice}</span>
                              <button 
                                onClick={() => openQuickAdd(product)}
                                className="p-1 bg-black text-white rounded-md hover:bg-[#e33535] transition-colors"
                              >
                                <Plus size={8} strokeWidth={3} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fixed Checkout Console */}
                  <div className="bg-white border-t border-black/[0.1] p-3 md:p-6 shrink-0 safe-bottom">
                    <div className="flex gap-2 mb-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                        <input 
                          type="text" 
                          placeholder="Coupon Code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                          className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-[10px] text-[9px] font-bold placeholder:text-gray-400 focus:outline-none focus:border-black shadow-sm uppercase tracking-wider"
                        />
                      </div>
                      <button 
                        onClick={applyCoupon}
                        className="px-4 bg-black text-white rounded-[10px] text-[8px] font-black uppercase tracking-widest hover:bg-gray-800 transition-colors"
                      >
                        Apply
                      </button>
                    </div>

                    <div className="space-y-1 mb-2 px-1">
                      <div className="flex justify-between items-center text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}.00</span>
                      </div>
                      {finalDiscountPercent > 0 && (
                        <div className="flex justify-between items-center text-[8px] font-black text-green-600 uppercase tracking-widest">
                          <span>Discount ({finalDiscountPercent}%) {appliedCoupon && `[${appliedCoupon.code}]`}</span>
                          <span>- ₹{discountAmount.toLocaleString()}.00</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-1 mt-0.5 border-t border-gray-100">
                        <span className="text-[9px] font-black text-black uppercase tracking-[0.1em]">Grand Total</span>
                        <span className="text-xs md:text-lg font-black text-black">₹{grandTotal.toLocaleString()}.00</span>
                      </div>
                    </div>
                    
                    <button 
                      disabled={isCheckingOut}
                      onClick={handleCheckout}
                      className="w-full bg-black text-white py-2.5 md:py-4 rounded-[10px] text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md active:shadow-none disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-safe"
                    >
                      {isCheckingOut && <Loader2 size={12} className="animate-spin" />}
                      {isCheckingOut ? 'Processing...' : 'Secure Checkout'}
                    </button>
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

      {/* Wishlist Drawer Overlay */}
      <AnimatePresence>
        {isWishlistOpen && (
          <div className="fixed inset-0 z-[150] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsWishlistOpen(false)} 
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
                  <h2 className="text-lg font-black tracking-tight text-gray-800 uppercase italic">Wishlist</h2>
                  <span className="text-sm font-bold text-gray-400">({wishlist.length} products)</span>
                </div>
                <button 
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-1 hover:bg-gray-200 transition-colors rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              {wishlist.length > 0 ? (
                <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                  {wishlist.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex gap-4 overflow-hidden group">
                      <div className="w-20 h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100 cursor-pointer" onClick={() => { setViewedProduct(product); setIsWishlistOpen(false); }}>
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div className="relative pr-8">
                          <h4 className="text-[11px] font-black text-gray-800 uppercase tracking-tight leading-tight line-clamp-2 cursor-pointer" onClick={() => { setViewedProduct(product); setIsWishlistOpen(false); }}>{product.title}</h4>
                          <span className="text-xs font-black text-black mt-1 inline-block">₹{parseFloat(product.salePrice).toLocaleString()}</span>
                          <button 
                            onClick={() => removeFromWishlist(product.id)}
                            className="absolute top-0 right-0 p-1 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex gap-2">
                           <button 
                            onClick={() => openQuickAdd(product)}
                            className="flex-1 bg-black text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#df3333] transition-colors"
                           >
                              Add to cart
                           </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
                  <Heart size={48} className="text-gray-200 mb-4" />
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight italic">Your wishlist is empty</h3>
                  <p className="text-gray-400 text-[10px] mt-2 uppercase font-bold tracking-widest leading-relaxed">Save your favorite premium items <br/> to track them here.</p>
                  <button 
                    onClick={() => setIsWishlistOpen(false)}
                    className="mt-8 bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all shadow-lg"
                  >
                    Explore
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
