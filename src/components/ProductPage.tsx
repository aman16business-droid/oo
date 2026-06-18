import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Ruler, ChevronRight, ChevronLeft, Truck, ShieldCheck, CreditCard, Loader2, Plus, Minus, Share2, Heart, Info, MapPin, RefreshCw, Layers, Lock, ShoppingBag, Package, Instagram, Play, Ghost, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext, Product } from '../AppContext';
import { ProductCard } from './ProductSections';

import RecentlyViewed from './RecentlyViewed';

export default function ProductPage({ product: initialProduct }: { product: Product }) {
  const { 
    addToCart, setViewedProduct, setCurrentView, recentlyViewed, 
    openQuickAdd, setIsCartOpen, shopifyProducts, isLoading,
    addToWishlist, removeFromWishlist, isProductInWishlist, 
    isCartOpen, isSearchOpen, isWishlistOpen, communityImages,
    uploadCommunityImage, uploadProductImage
  } = useAppContext();
  
  const [product, setProduct] = useState(initialProduct);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const communityInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const sizeAnchorRef = useRef<HTMLDivElement>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [pendingAction, setPendingAction] = useState<'cart' | 'buy' | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>('description');

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadProductImage(product.id, file);
        setProduct(prev => ({ ...prev, image: url }));
      } catch (err) {
        console.error("Failed to upload image", err);
      }
    }
  };

  const handleCommunityImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadCommunityImage(index, file);
      } catch (err) {
        console.error("Failed to upload image", err);
      }
    }
  };

  const today = new Date();
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const orderedDate = formatDate(today);
  const processingStart = new Date(today);
  processingStart.setDate(today.getDate() + 1);
  const processingEnd = new Date(today);
  processingEnd.setDate(today.getDate() + 2);
  const processingRange = `${formatDate(processingStart)} - ${formatDate(processingEnd)}`;

  const arrivalStart = new Date(today);
  arrivalStart.setDate(today.getDate() + 5);
  const arrivalEnd = new Date(today);
  arrivalEnd.setDate(today.getDate() + 7);
  const arrivalRange = `${formatDate(arrivalStart)} - ${formatDate(arrivalEnd)}`;

  const otherRecentlyViewed = useMemo(() => recentlyViewed.filter(p => p.id !== product.id), [recentlyViewed, product.id]);
  
  const relatedProducts = useMemo(() => {
    const related = shopifyProducts
      .filter(p => p.id !== product.id && p.collections.some(c => product.collections.includes(c)))
      .slice(0, 5);
    
    if (related.length < 5) {
      const additional = shopifyProducts
        .filter(p => p.id !== product.id && !related.find(rp => rp.id === p.id))
        .slice(0, 5 - related.length);
      return [...related, ...additional];
    }
    return related;
  }, [shopifyProducts, product]);

  // Sync product when globally updated (e.g., image change)
  useEffect(() => {
    const updated = shopifyProducts.find(p => p.id === product.id);
    if (updated && updated.image !== product.image) {
      setProduct(updated);
    }
  }, [shopifyProducts, product.id]);

  const isAnyDrawerOpen = isCartOpen || isSearchOpen || isWishlistOpen;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setPendingAction('cart');
      sizeAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const variantId = product.variants?.find((v: any) => 
      v.selectedOptions?.some((o: any) => o.value === selectedSize)
    )?.id || product.variants?.[0]?.id;

    addToCart({ 
      ...product, 
      size: selectedSize, 
      quantity,
      variantId 
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true);
      setPendingAction('buy');
      sizeAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    // Implement checkout logic here or just open cart for now
    handleAddToCart();
  };

  useEffect(() => {
    if (selectedSize && pendingAction) {
      if (pendingAction === 'cart') {
        handleAddToCart();
      } else if (pendingAction === 'buy') {
        handleBuyNow();
      }
      setPendingAction(null);
      setSizeError(false);
    }
  }, [selectedSize]);

  useEffect(() => {
    // Initial scroll for community gallery to enable left scrolling
    const container = document.getElementById('community-carousel');
    if (container) {
      container.scrollLeft = container.scrollWidth / 4;
      
      // Auto-scroll every 3 seconds
      const autoScrollInterval = setInterval(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          // Vertical scroll for mobile (2 rows visible, scroll by row height)
          const rowHeight = container.clientHeight / 2;
          const maxScrollY = container.scrollHeight - container.clientHeight;
          
          if (container.scrollTop >= maxScrollY - 10) {
            container.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            container.scrollBy({ top: rowHeight, behavior: 'smooth' });
          }
        } else {
          // Horizontal scroll for desktop
          const scrollAmount = container.clientWidth / 5;
          const maxScrollX = container.scrollWidth - container.clientWidth;
          
          if (container.scrollLeft >= maxScrollX - 10) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }
      }, 3000);

      return () => clearInterval(autoScrollInterval);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-black/10" size={40} strokeWidth={1} />
      </div>
    );
  }
  return (
    <div className="bg-white min-h-screen selection:bg-black selection:text-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pt-12 md:pt-16 pb-8">
        
        {/* Main Product Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Left: Product Media */}
          <div className="w-full lg:w-[62%]">
             {/* Mobile View: Horizontal Swipe Gallery */}
             <div className="lg:hidden -mx-4 mb-0">
                <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-1 px-4">
                  {[product.image, ...(product.images || [])].filter((img, i, self) => img && self.indexOf(img) === i).map((img, idx) => (
                    <div key={idx} className="min-w-full snap-center pt-[133.33%] relative bg-gray-50 rounded-lg overflow-hidden shrink-0 group">
                      <img 
                        src={img} 
                        alt={`${product.title} - view ${idx + 1}`} 
                        className="absolute inset-0 w-full h-full object-cover" 
                        loading={idx === 0 ? "eager" : "lazy"}
                        decoding="async"
                      />
                      {/* Upload Button Overlay */}
                      {!product.image?.startsWith('blob:') && (
                        <div className="absolute top-4 left-4 z-20">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              mainImageInputRef.current?.click();
                            }}
                            className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-xl text-black"
                          >
                            <Upload size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {/* Visual Indicators */}
                <div className="flex justify-center gap-1.5 mt-2">
                  {[product.image, ...(product.images || [])].filter((img, i, self) => img && self.indexOf(img) === i).map((_, idx) => (
                    <div key={idx} className="w-1 h-1 rounded-full bg-gray-300" />
                  ))}
                </div>
             </div>

             {/* Desktop View: Multi-Angle Display System */}
             <div className="hidden lg:flex flex-col gap-6">
                <div className="relative aspect-[3/4] bg-gray-50 rounded-[24px] overflow-hidden group shadow-sm">
                   <img 
                     src={product.image} 
                     alt={product.title} 
                     loading="eager"
                     decoding="async"
                     className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   
                   {/* Upload Button Overlay */}
                   {!product.image?.startsWith('blob:') && (
                     <div className="absolute top-10 left-10 z-50 transition-all">
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           mainImageInputRef.current?.click();
                         }}
                         className="bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2 text-[11px] font-black tracking-widest uppercase border border-white/20"
                       >
                         <Upload size={18} />
                         <span>Upload Product Photo</span>
                       </button>
                       <input 
                         type="file" 
                         ref={mainImageInputRef} 
                         onChange={handleMainImageUpload} 
                         className="hidden" 
                         accept="image/*"
                       />
                     </div>
                   )}

                   <button className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl hover:bg-white hover:scale-110 active:scale-95 transition-all duration-300 group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100">
                     <Share2 size={22} className="text-black" />
                   </button>
                </div>
                
                {/* Secondary Angles - Curated Grid */}
                <div className="grid grid-cols-2 gap-6">
                   <div className="aspect-[3/4] bg-gray-50 rounded-[20px] overflow-hidden group/angle relative shadow-sm">
                     <img src={product.image} alt="alternative perspective" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover/angle:scale-110" />
                     <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/angle:opacity-100 transition-opacity" />
                   </div>
                   <div className="aspect-[3/4] bg-gray-50 rounded-[20px] overflow-hidden group/angle relative shadow-sm">
                     <img src={product.image} alt="detail focus" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale brightness-110 transition-transform duration-700 group-hover/angle:scale-110" />
                     <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/angle:opacity-100 transition-opacity" />
                   </div>
                </div>
             </div>
          </div>

          {/* Right: Product Details & Controls */}
          <div className="w-full lg:w-[45%] flex flex-col pt-0 lg:sticky lg:top-32 h-fit">
            <div className="flex justify-between items-start mb-1 pt-2">
              <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-black leading-tight flex-1">
                {product.title}
              </h1>
              <button 
                onClick={() => isProductInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)}
                className={`p-2 transition-all duration-300 group ${isProductInWishlist(product.id) ? 'text-[#df3333]' : 'text-gray-300 hover:text-black'}`}
              >
                <Heart size={28} className={isProductInWishlist(product.id) ? 'fill-current' : 'group-hover:scale-110 transition-transform'} strokeWidth={1} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              {parseFloat(product.originalPrice) > parseFloat(product.salePrice) && (
                <span className="text-gray-300 line-through text-lg md:text-xl font-light">
                  Rs.{product.originalPrice}
                </span>
              )}
              <span className="text-[#dc2626] text-xl md:text-2xl font-bold">
                Rs.{product.salePrice}
              </span>
              {parseFloat(product.originalPrice) > parseFloat(product.salePrice) && (
                <span className="bg-[#dc2626] text-white text-[9px] font-black px-2.5 py-1 rounded-[3px] uppercase tracking-widest ml-1">
                  SAVE {product.savePercentage}
                </span>
              )}
            </div>
            
            <button className="text-[10px] text-gray-400 underline mb-8 self-start hover:text-black">
              Shipping calculated at checkout.
            </button>

            {/* Size Selector with Measurements */}
            <div className="mb-8" ref={sizeAnchorRef}>
              <div className="flex justify-between items-end mb-4 px-0.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${sizeError ? 'text-[#df3333]' : 'text-black'}`}>
                    {sizeError ? 'Choose your size' : 'Select Size'}
                  </span>
                  {sizeError && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-1 h-1 rounded-full bg-[#df3333]" 
                    />
                  )}
                </div>
                <button className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-[#df3333] transition-colors uppercase tracking-widest">
                  <Ruler size={14} /> Size Chart
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 flex items-center justify-center text-xs font-bold transition-all border rounded-md uppercase ${selectedSize === size ? 'bg-black text-white border-black shadow-sm' : sizeError ? 'bg-white text-[#df3333] border-[#df3333] border-dashed animate-pulse' : 'bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons - Elite Performance Pack */}
            <div className="flex flex-col gap-4 mb-10">
              <div className="flex gap-4">
                 <div className="h-16 w-32 border-2 border-gray-100 rounded-2xl flex items-center justify-between px-5 bg-gray-50/50" style={{ flexShrink: 0 }}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-black p-2 transition-colors active:scale-75"><Minus size={16} strokeWidth={3} /></button>
                    <span className="text-base font-black italic">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-black p-2 transition-colors active:scale-75"><Plus size={16} strokeWidth={3} /></button>
                 </div>
                 <button 
                   onClick={handleAddToCart}
                   className="flex-1 bg-white border-2 border-black text-black h-16 rounded-2xl font-black text-xs tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all duration-500 shadow-xl shadow-black/5 active:scale-95 flex items-center justify-center gap-3 group"
                 >
                   <ShoppingBag size={18} className="group-hover:rotate-12 transition-transform" />
                   ADD TO CART
                 </button>
              </div>
              <button 
                onClick={handleBuyNow}
                className="relative w-full bg-black text-white h-16 rounded-2xl font-black text-xs tracking-[0.3em] uppercase overflow-hidden group shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] active:scale-[0.98] transition-all"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  BUY IT NOW
                  <ChevronRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
              </button>
            </div>

            {/* World-Class Compact Trust Bar */}
            <div className="flex items-center justify-between py-5 border-y border-gray-100 mb-0 px-4">
              <div className="flex items-center gap-2">
                <Lock size={12} className="text-[#df3333]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-black italic leading-none">Secure <br/> <span className="text-[#df3333]">Payments</span></span>
              </div>
              <div className="w-[1px] h-4 bg-gray-100"></div>
              <div className="flex items-center gap-2">
                <RefreshCw size={12} className="text-[#df3333]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-black italic leading-none">7-Day Easy <br/> <span className="text-[#df3333]">Returns</span></span>
              </div>
              <div className="w-[1px] h-4 bg-gray-100"></div>
              <div className="flex items-center gap-2 group">
                <CreditCard size={12} className="text-[#df3333]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-black italic leading-none">COD & Prepaid <br/> <span className="text-[#df3333]">Discount</span></span>
              </div>
            </div>

            {/* Precision Delivery Timeline - High Impact & Integrated */}
            <div className="relative px-4 pb-2 pt-2 mb-0">
              <div className="absolute top-[38px] left-[15%] right-[15%] h-[2px] bg-gray-100"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="flex flex-col items-center gap-3 w-1/3 group">
                  <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white ring-[4px] ring-white shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-[#df3333]">
                    <ShoppingBag size={12} strokeWidth={2.5} />
                  </div>
                  <div className="text-center space-y-0.5">
                    <p className="text-[9px] font-black text-black uppercase tracking-tight">{orderedDate}</p>
                    <p className="text-[6px] font-black text-gray-300 uppercase tracking-[0.2em]">Ordered</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 w-1/3 group">
                  <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white ring-[4px] ring-white shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-[#df3333]">
                    <Truck size={12} strokeWidth={2.2} />
                  </div>
                  <div className="text-center space-y-0.5">
                    <p className="text-[9px] font-black text-black uppercase tracking-tight">{processingRange}</p>
                    <p className="text-[6px] font-black text-gray-300 uppercase tracking-[0.2em]">Processing</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 w-1/3 group">
                  <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white ring-[4px] ring-white shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-[#df3333]">
                    <Package size={12} strokeWidth={2.2} />
                  </div>
                  <div className="text-center space-y-0.5">
                    <p className="text-[9px] font-black text-black uppercase tracking-tight">{arrivalRange}</p>
                    <p className="text-[6px] font-black text-gray-300 uppercase tracking-[0.2em]">Arrival</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Detail Accordions */}
            <div className="border-t border-gray-100">
              {[
                { 
                  id: 'description', 
                  title: 'Description', 
                  content: product.description || 'Premium streetwear silhouette featuring ultra-heavyweight cotton construction, dropped shoulders, and a distinct boxy fit designed for the modern urban landscape.'
                },
                { 
                  id: 'shipping', 
                  title: 'Shipping & Returns', 
                  content: 'Standard shipping across India in 5-7 business days. Easy 7-day returns and size exchanges. Items must be unworn with original tags intact.' 
                }
              ].map((item) => (
                <div key={item.id} className="border-b border-gray-100 font-sans">
                  <button 
                    onClick={() => setExpandedSection(expandedSection === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between py-2.5 group px-4"
                  >
                    <span className={`text-[8px] font-black uppercase tracking-[0.25em] transition-colors ${expandedSection === item.id ? 'text-black' : 'text-black/40 group-hover:text-black'}`}>
                      {item.title}
                    </span>
                    <div className={`transition-transform duration-500 ${expandedSection === item.id ? 'rotate-180' : ''}`}>
                      {expandedSection === item.id ? (
                        <Minus size={10} strokeWidth={2} className="text-black" />
                      ) : (
                        <Plus size={10} strokeWidth={2} className="text-black/20 group-hover:text-black" />
                      )}
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedSection === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 px-4 text-[8px] font-bold leading-[1.6] text-black/50 uppercase tracking-widest max-w-[95%]">
                          {item.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Community Style Gallery - "As Seen On You" */}
        <div className="mt-12 lg:mt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 px-4 md:px-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-[1px] bg-black"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Community Squad</span>
              </div>
              <h2 className="text-2xl md:text-5xl font-black italic uppercase tracking-tighter leading-[0.9]">
                We are sharing our <span className="text-[#df3333]">Customer Images</span>
              </h2>
            </div>
          </div>

          <div className="relative group/gallery">
            <div 
              id="community-carousel"
              className="grid grid-cols-2 md:flex gap-3 md:gap-4 h-[440px] xs:h-[480px] md:h-auto overflow-y-auto md:overflow-x-auto no-scrollbar snap-y md:snap-x snap-mandatory pt-4 pb-12 px-4 md:px-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
            {communityImages.map((img, i) => {
              return (
                <div 
                  key={i}
                  className="flex-shrink-0 w-full md:w-[calc(20%-12.8px)] aspect-[4/5] snap-start"
                >
                  <div className="relative w-full h-full overflow-hidden group rounded-xl md:rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
                    <img 
                      src={img} 
                      alt={`Community Style ${i + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                    />
                    
                     {/* Upload Button Overlay */}
                     {!communityImages[i]?.startsWith('blob:') && (
                       <div className="absolute top-2 left-2 z-50 transition-all">
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             communityInputRefs.current[i]?.click();
                           }}
                           className="bg-black text-white p-2 rounded-full shadow-2xl transition-all border border-white/20"
                         >
                           <Upload size={12} />
                         </button>
                         <input 
                           type="file" 
                           ref={el => communityInputRefs.current[i] = el}
                           onChange={(e) => handleCommunityImageUpload(e, i)}
                           className="hidden"
                           accept="image/*"
                         />
                       </div>
                     )}

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Instagram className="text-white" size={20} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

        {relatedProducts.length > 0 && (
          <div className="mt-12 pt-12 border-t border-gray-100">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">You May Also Like</h2>
                <button 
                  onClick={() => setCurrentView('shop-all')}
                  className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-[#df3333] hover:border-[#df3333] transition-all"
                >
                  View All
                </button>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-10">
                {relatedProducts.slice(0, 5).map(p => (
                  <ProductCard key={p.id} product={p} onAddToCart={openQuickAdd} onViewProduct={setViewedProduct} />
                ))}
             </div>
          </div>
        )}
      </div>

      <RecentlyViewed />

      <AnimatePresence>
        {!isAnyDrawerOpen && (
          <motion.div 
            initial={{ y: 120, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 120, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.4 }}
            className="lg:hidden fixed bottom-6 left-2 right-2 z-[200] h-[68px] bg-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] border border-gray-100 flex items-center px-2 gap-1.5 rounded-[18px] overflow-hidden will-change-transform"
          >
            <div className="relative w-10 h-10 bg-gray-50 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-[#df3333] rounded-full ring-2 ring-white animate-pulse"></div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1 mb-0.5 whitespace-nowrap overflow-hidden">
                <span className="text-[5px] font-black uppercase tracking-[0.05em] text-[#df3333]">Selling Fast</span>
                <span className="text-[5px] font-bold text-gray-300">|</span>
                <span className="text-[5px] font-black uppercase tracking-[0.05em] text-gray-400">14 in carts</span>
              </div>
              <p className="text-[11px] font-black text-black italic leading-none mb-1">Rs.{product.salePrice}</p>
              <h4 className="text-[7px] font-bold uppercase truncate tracking-tight text-gray-400 leading-none">{product.title}</h4>
            </div>

            <div className="flex gap-1.5 items-center flex-shrink-0">
               <button 
                 onClick={handleAddToCart}
                 className="w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90 border-2 bg-white border-black text-black"
                 aria-label="Add to cart"
               >
                 <ShoppingBag size={16} strokeWidth={2.5} />
               </button>
               <button 
                 onClick={handleBuyNow}
                 className="relative h-10 px-3 text-[8px] font-black uppercase tracking-[0.05em] rounded-xl flex items-center justify-center gap-1 overflow-hidden group shadow-lg transition-all active:scale-95 bg-black text-white whitespace-nowrap"
               >
                 <span className="relative z-10 flex items-center gap-1">
                   BUY NOW
                   <ChevronRight size={10} strokeWidth={3.5} className="group-hover:translate-x-1 transition-transform" />
                 </span>
                 <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
