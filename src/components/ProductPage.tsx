import React, { useState } from 'react';
import { Heart, Ruler, ChevronRight, Truck, ShieldCheck, CreditCard, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppContext, Product } from '../AppContext';
import { ProductCard } from './ProductSections';
import { getProductHearts } from '../utils/productUtils';

export default function ProductPage({ product }: { product: Product }) {
  const { addToCart, favorites, toggleFavorite, setViewedProduct, setCurrentView, recentlyViewed, openQuickAdd, setIsCartOpen, shopifyProducts, isLoading } = useAppContext();
  
  // Use first variant as default size if available
  const initialSize = product.variants?.[0]?.selectedOptions?.find((o: any) => o.name?.toLowerCase() === 'size')?.value || 'OS';
  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants?.[0]?.id);
  const [quantity, setQuantity] = useState(1);
  
  const isFavorite = favorites.some((p) => p.id === product.id);

  // Filter out the current product from recently viewed list
  const otherRecentlyViewed = recentlyViewed.filter(p => p.id !== product.id);

  const handleAddToCart = () => {
    addToCart({ ...product, size: selectedSize, quantity, variantId: selectedVariantId });
    setIsCartOpen(true);
  };
  
  if (isLoading) {
     return <div className="pt-32 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  // Get available sizes from variants
  const availableSizes = [...new Set((product.variants || []).map((v: any) => {
    const sizeOpt = v.selectedOptions?.find((o: any) => o.name?.toLowerCase() === 'size' || o.name?.toLowerCase() === 'title');
    return sizeOpt ? sizeOpt.value : null;
  }).filter(Boolean))];

  return (
    <div className="w-full pt-28 md:pt-32 pb-16 bg-gradient-to-b from-white to-gray-50/50 shrink-0">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          
          {/* Left Column - Image Gallery */}
             <div className="lg:w-[60%] flex flex-col md:flex-row gap-4">
              {/* Desktop Thumbnails */}
              <div className="hidden md:flex flex-col gap-4 w-20 shrink-0">
                {product.images.map((img, i) => (
                  <div key={i} className="aspect-[3/4] bg-[#f8f8f8] rounded-sm overflow-hidden cursor-pointer border border-transparent hover:border-black transition">
                    <img src={img} className="w-full h-full object-cover mix-blend-multiply" alt={`${product.title} view ${i}`} />
                  </div>
                ))}
              </div>
              
              {/* Mobile Swipable Gallery */}
              <div className="md:hidden flex gap-2 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory px-4 -mx-4">
                 {product.images.map((img, i) => (
                   <div key={i} className="min-w-[85vw] aspect-[3/4] bg-[#f8f8f8] rounded-xl overflow-hidden snap-center shadow-md border border-gray-100">
                     <img src={img} className="w-full h-full object-cover mix-blend-multiply" alt={`${product.title} view ${i}`} />
                   </div>
                 ))}
              </div>

              {/* Main Images (Large Screen) */}
              <div className="hidden md:flex flex-1 flex-col gap-4">
                <div className="w-full bg-[#f8f8f8] rounded-sm overflow-hidden">
                  <img src={product.image} className="w-full h-auto object-cover mix-blend-multiply" alt={product.title} />
                </div>
                <div className="hidden md:grid grid-cols-2 gap-4">
                   {product.images.slice(1, 3).map((img, i) => (
                     <div key={i} className="bg-[#f8f8f8] rounded-sm overflow-hidden">
                       <img src={img} className="w-full h-auto object-cover mix-blend-multiply" alt={`${product.title} angle ${i + 2}`} />
                     </div>
                   ))}
                </div>
              </div>
           </div>

          {/* Right Column - Product Details */}
          <div className="lg:w-[40%] flex flex-col sticky top-32 self-start">
             {/* Breadcrumbs */}
             <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mb-6 flex gap-2 items-center">
               <button 
                 onClick={() => {
                   setViewedProduct(null);
                   setCurrentView('old-home');
                 }} 
                 className="hover:text-black transition"
               >
                 Home
               </button> 
               <ChevronRight size={12} /> 
               <button onClick={() => { setViewedProduct(null); setCurrentView('shop-all'); }} className="hover:text-black transition">Shop</button> 
               <ChevronRight size={12} /> 
               <span className="text-black font-semibold truncate">{product.title}</span>
             </div>

             <div className="flex justify-between items-start mb-2 gap-4">
                <h1 className="text-2xl sm:text-4xl font-black text-gray-900 uppercase tracking-tight leading-[1.1] flex-1">
                  {product.title}
                </h1>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleFavorite(product)}
                  className={`shrink-0 bg-white shadow-sm border border-gray-100 p-2.5 rounded-full transition ${isFavorite ? 'text-[#e33535]' : 'text-gray-500 hover:text-black hover:border-gray-300 hover:shadow-md'}`}
                >
                  <Heart size={20} strokeWidth={2} fill={isFavorite ? 'currentColor' : 'none'} />
                </motion.button>
             </div>

             {/* Heart Count instead of Reviews - Cool Styled Version */}
             <div className="flex items-center gap-2.5 mb-6 group cursor-default">
               <div className="relative">
                 <Heart 
                    size={18} 
                    fill="#ffb7ce" 
                    stroke="#ff69b4" 
                    strokeWidth={1.5}
                    className="drop-shadow-[0_0_8px_rgba(255,183,206,0.5)] group-hover:scale-125 transition-all duration-300 animate-pulse" 
                 />
               </div>
               <div className="flex flex-col">
                 <span className="text-[13px] text-gray-900 font-black tracking-tight leading-none italic uppercase">
                   {(() => {
                     // Deterministic varied base between 25-140 based on product title and id for variety
                     let hash = 0;
                     const str = product.id + product.title;
                     for (let i = 0; i < str.length; i++) {
                       hash = ((hash << 5) - hash) + str.charCodeAt(i);
                       hash |= 0;
                     }
                     const baseHearts = 25 + (Math.abs(hash) % 116);
                     
                     const refDate = new Date('2024-06-01').getTime();
                     const now = new Date().getTime();
                     const growthHearts = Math.floor((now - refDate) / (1000 * 60 * 60 * 24 * 2));
                     
                     return baseHearts + growthHearts;
                   })()} <span className="text-pink-400">hearts</span>
                 </span>
               </div>
             </div>

             {/* Pricing */}
             <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4">
               <span className="text-[#e33535] text-xl md:text-2xl font-black tracking-tight whitespace-nowrap">Rs. {product.salePrice}.00</span>
               <span className="text-gray-400 line-through text-sm md:text-lg whitespace-nowrap">Rs. {product.originalPrice}.00</span>
               <span className="bg-[#e33535] text-white text-[9px] md:text-xs font-black px-2 py-0.5 md:py-1 rounded-[2px] tracking-widest uppercase whitespace-nowrap">SAVE {product.savePercentage}%</span>
             </div>
             
             <p className="text-xs text-gray-600 mb-8 pb-8 border-b border-gray-200">
               <span className="text-gray-900 font-medium underline cursor-pointer">Shipping</span> calculated at checkout.
             </p>

             {/* Size Selector */}
             <div className="mb-8">
               <div className="flex justify-between items-end mb-4">
                 <div className="flex flex-col gap-1">
                   <span className="text-xs font-bold tracking-widest text-gray-900 uppercase">Size</span>
                   <span className="text-sm font-medium text-[#e33535]">Selected: {selectedSize}</span>
                 </div>
                 <button className="text-xs font-bold flex items-center gap-1.5 text-gray-900 hover:text-[#e33535] transition tracking-widest uppercase pb-1 border-b border-black">
                   <Ruler size={14} /> Sizing guide
                 </button>
               </div>
               <div className="flex flex-wrap gap-3">
                 {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                   <motion.button 
                     key={size}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setSelectedSize(size)}
                     className={`w-14 h-12 flex items-center justify-center border transition duration-200 font-bold text-sm tracking-widest uppercase rounded-[8px] ${selectedSize === size ? 'border-neutral-700 bg-gradient-to-b from-neutral-800 to-black text-white shadow-lg' : 'border-gray-200 text-gray-900 hover:border-gray-300 hover:shadow-md bg-gradient-to-b from-white to-gray-50 shadow-sm'}`}
                   >
                     {size}
                   </motion.button>
                 ))}
               </div>
             </div>

             {/* Add to Cart logic */}
             <div className="flex flex-col gap-4 mb-8">
                <div className="flex gap-4">
                  {/* Quantity */}
                  <div className="border border-gray-200 bg-gray-50/50 shadow-inner w-32 flex items-center justify-between px-4 h-14 rounded-md">
                     <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-black flex-1 text-left text-2xl font-light">-</button>
                     <span className="font-bold text-sm text-center w-8">{quantity}</span>
                     <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-black flex-1 text-right text-2xl font-light">+</button>
                  </div>
                  {/* Add to Cart */}
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-b from-white to-gray-50 text-black border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 h-14 rounded-[8px] font-bold text-sm tracking-[0.2em] uppercase transition duration-300 flex items-center justify-center gap-2 group"
                  >
                    <span>Add to Cart</span>
                  </motion.button>
                </div>
                {/* Buy Now */}
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-b from-neutral-800 to-black text-white h-14 rounded-[8px] font-black text-sm tracking-[0.2em] relative overflow-hidden transition-all duration-300 shadow-lg border border-white/10 hover:-translate-y-0.5 group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span>BUY IT NOW</span>
                    <span className="transform transition-transform duration-300 group-hover:translate-x-1.5 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0">→</span>
                  </span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-60 transition duration-300 ease-out"></div>
                </motion.button>
             </div>

              <div className="grid grid-cols-3 gap-2 md:gap-4 border-t border-gray-200 pt-6 md:pt-8 mb-6 md:mb-8 pb-6 md:pb-8 border-b">
                <div className="flex flex-col items-center text-center gap-2 md:gap-3">
                  <Truck className="text-black shrink-0" size={18} md:size={24} strokeWidth={1.5} />
                  <span className="text-[8px] md:text-[11px] font-black uppercase tracking-[0.1em] text-gray-900 leading-tight">Free <br className="hidden sm:inline" />Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 md:gap-3">
                  <ShieldCheck className="text-black shrink-0" size={18} md:size={24} strokeWidth={1.5} />
                  <span className="text-[8px] md:text-[11px] font-black uppercase tracking-[0.1em] text-gray-900 leading-tight">Secure <br className="hidden sm:inline" />Checkout</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 md:gap-3">
                  <CreditCard className="text-black shrink-0" size={18} md:size={24} strokeWidth={1.5} />
                  <span className="text-[8px] md:text-[11px] font-black uppercase tracking-[0.1em] text-gray-900 leading-tight">Flexible <br className="hidden sm:inline" />Payment</span>
                </div>
              </div>

                {/* Product Infos */}
              <div className="flex flex-col gap-0 text-sm">
                <DetailsAccordion title="Product Description" defaultOpen>
                  <p className="text-gray-600 mb-4 leading-relaxed font-medium">
                    {product.description || "No description available for this product."}
                  </p>
                </DetailsAccordion>
                <DetailsAccordion title="Shipping & Returns">
                  <p className="text-gray-600 leading-relaxed font-medium">We offer free shipping across the country on all prepaid orders. Delivery within 3-5 business days. Returns are accepted within 7 days of delivery as long as the product is unworn and tags remain intact.</p>
                </DetailsAccordion>
              </div>

          </div>
        </div>
      </div>
 
      {/* You May Also Like */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24 mb-12 md:mb-16">
        <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight mb-8 md:mb-10 text-center">YOU MAY ALSO LIKE</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-x-6 gap-y-10 md:gap-y-12">
          {shopifyProducts.slice(0, 4).map((p) => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onAddToCart={openQuickAdd} 
              onViewProduct={setViewedProduct} 
            />
          ))}
        </div>
      </div>
 
      {/* Recently Viewed */}
      {otherRecentlyViewed.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight mb-8 md:mb-10 text-center">RECENTLY VIEWED</h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-x-6 gap-y-10 md:gap-y-12">
            {otherRecentlyViewed.slice(0, 5).map((p) => (
              <ProductCard 
                key={p.id + "-recent"} 
                product={p} 
                onAddToCart={openQuickAdd} 
                onViewProduct={setViewedProduct} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailsAccordion({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between font-bold uppercase tracking-widest text-gray-900 text-xs hover:text-[#e33535] transition"
      >
        <span>{title}</span>
        {isOpen ? <span className="text-xl font-light leading-none">-</span> : <span className="text-xl font-light leading-none">+</span>}
      </button>
      {isOpen && (
        <div className="mt-5 animate-in slide-in-from-top-2 fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
