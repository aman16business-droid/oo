import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Ruler, Plus, Loader2, Heart, ShoppingBag } from 'lucide-react';
import { useAppContext, Product } from '../AppContext';
import { motion } from 'motion/react';

export const ProductCard = React.memo(({ product, onAddToCart, onViewProduct }: { product: Product, onAddToCart: (p: Product) => void, onViewProduct: (p: Product) => void }) => {
  const { viewedProduct, addToWishlist, removeFromWishlist, isProductInWishlist } = useAppContext();

  const optimizedImage = product.image?.includes('cdn.shopify.com') 
    ? `${product.image}${product.image.includes('?') ? '&' : '?'}width=600` 
    : product.image || 'https://images.unsplash.com/photo-1594932224011-042041c6543b?q=80&w=800&auto=format&fit=crop';

  const inWishlist = isProductInWishlist(product.id);

  return (
    <div className="group/card relative cursor-pointer flex flex-col" onClick={() => onViewProduct(product)}>
      <div className="relative bg-[#f8f8f8] aspect-[3/4] mb-4 overflow-hidden flex items-center justify-center group border border-transparent hover:border-gray-100 transition-colors duration-500">
        <img 
          src={optimizedImage} 
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" 
        />
        
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/[0.02] transition-colors duration-500"></div>

        {/* Elite Branding & Discount */}
        <div className="absolute top-5 left-5 z-10">
          {product.savePercentage !== '0%' && (
            <div className="bg-[#e23737] text-white text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider shadow-sm">
              SAVE {product.savePercentage}
            </div>
          )}
        </div>

        {/* Wishlist Button - Match Image Skinny Style */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
          }}
          className={`absolute top-5 right-5 z-20 transition-all duration-300 ${inWishlist ? 'text-[#df3333]' : 'text-black hover:scale-110'}`}
        >
          <Heart size={24} className={inWishlist ? 'fill-current' : ''} strokeWidth={1} />
        </button>

        {/* Hover Action Bar - Match Image Solid Box Style */}
        <div className="absolute bottom-0 left-0 right-0 z-20 hidden md:block">
           <button 
             onClick={(e) => {
               e.stopPropagation();
               onAddToCart(product);
             }}
             className="w-full bg-[#1a1a1a] text-white py-5 text-[11px] font-black tracking-[0.2em] hover:bg-black transition-colors uppercase flex items-center justify-center opacity-0 md:translate-y-4 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-300"
           >
             ADD TO CART
           </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-left px-1">
        <div className="flex justify-between items-start gap-2">
          <h4 className="text-[11px] md:text-[13px] font-black uppercase text-gray-900 tracking-tight leading-tight italic truncate">
            {product.title}
          </h4>
          <span className="text-[#df3333] text-[11px] md:text-[13px] font-black italic shrink-0">Rs.{product.salePrice}</span>
        </div>
        
        <div className="flex gap-2 items-center text-[10px]">
           {product.originalPrice !== product.salePrice && (
             <span className="text-gray-300 line-through font-bold">Rs.{product.originalPrice}</span>
           )}
           <span className="text-gray-400 font-bold uppercase tracking-widest text-[8px]">SHADOW STICKER</span>
        </div>

        {/* Mobile Quick Add */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="md:hidden mt-4 w-full bg-black text-white py-3 text-[10px] font-black tracking-widest uppercase rounded-lg active:scale-95 transition-all flex items-center justify-center gap-2 italic"
        >
          ADD TO BAG
        </button>
      </div>
    </div>
  );
});

export default function ProductSections() {
  const { setViewedProduct, openQuickAdd, shopifyProducts, isLoading, setCurrentView } = useAppContext();

  if (isLoading && shopifyProducts.length === 0) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-12 h-12 animate-spin text-black/10" strokeWidth={1} />
        <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-sm animate-pulse text-center">Syncing Archives...</p>
      </div>
    );
  }

  const newInItems = shopifyProducts.filter(p => p.collections.includes('new-arrivals')).length > 0
    ? shopifyProducts.filter(p => p.collections.includes('new-arrivals'))
    : shopifyProducts.slice(0, 4);

  const bestSellerItems = shopifyProducts.filter(p => p.collections.includes('best-sellers')).length > 0
    ? shopifyProducts.filter(p => p.collections.includes('best-sellers'))
    : shopifyProducts.slice(4, 8);

  const mensItems = shopifyProducts.filter(p => p.collections.includes('men') || p.collections.includes('mens')).slice(0, 4);
  const womensItems = shopifyProducts.filter(p => p.collections.includes('women') || p.collections.includes('womens')).slice(0, 4);
 
  return (
    <div className="py-2 md:py-4 bg-white space-y-4 md:space-y-6">
      
      {/* New In Section */}
      <GridSection 
        title="NEW DROP" 
        subtitle="Fresh silhouettes from the archives"
        exploreLabel="View All"
        onExplore={() => setCurrentView('new-arrivals')}
        products={newInItems}
        onAddToCart={openQuickAdd}
        onViewProduct={setViewedProduct}
      />

      {/* Best Seller Section */}
      <GridSection 
        title="BEST SELLERS" 
        subtitle="The most coveted pieces community"
        exploreLabel="View All"
        onExplore={() => setCurrentView('best-sellers')}
        products={bestSellerItems}
        onAddToCart={openQuickAdd}
        onViewProduct={setViewedProduct}
      />

      {/* Hero Banner Section */}
      <section className="w-full relative h-[60vh] md:h-[75vh] flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1517721867165-27a1cbe2d3db?q=80&w=2600&auto=format&fit=crop" 
            alt="Discover What's New"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover grayscale brightness-[0.4] contrast-125 transition-transform duration-1000 group-hover:scale-105"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-4xl px-6">
          <span className="text-[#df3333] text-[11px] font-black tracking-[0.5em] uppercase">Limited Availability</span>
          <h2 className="text-white text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase italic text-center">
            BEYOND THE <br /> VISIBLE SURFACE
          </h2>
          <button 
            onClick={() => setCurrentView('shop-all')}
            className="bg-white text-black font-black text-[11px] px-12 py-5 rounded-full hover:bg-[#df3333] hover:text-white transition-all tracking-[0.2em] uppercase italic shadow-2xl"
          >
            EXPLORE ARCHIVES
          </button>
        </div>
      </section>

      {/* For Him Section */}
      {mensItems.length > 0 && (
        <GridSection 
          title="FOR HIM" 
          subtitle="Engineered for the modern minimalist"
          exploreLabel="Shop Now"
          onExplore={() => setCurrentView('men-wear')}
          products={mensItems}
          onAddToCart={openQuickAdd}
          onViewProduct={setViewedProduct}
        />
      )}

      {/* For Her Section */}
      {womensItems.length > 0 && (
        <GridSection 
          title="FOR HER" 
          subtitle="Refined aesthetics with rugged edge"
          exploreLabel="Shop Now"
          onExplore={() => setCurrentView('women-wear')}
          products={womensItems}
          onAddToCart={openQuickAdd}
          onViewProduct={setViewedProduct}
        />
      )}
    </div>
  );
}

function GridSection({ 
  title, 
  subtitle, 
  exploreLabel, 
  onExplore, 
  products, 
  onAddToCart, 
  onViewProduct 
}: { 
  title: string, 
  subtitle: string, 
  exploreLabel: string, 
  onExplore: () => void, 
  products: Product[],
  onAddToCart: (p: Product) => void,
  onViewProduct: (p: Product) => void
}) {
  return (
    <section className="max-w-[1440px] mx-auto px-3 md:px-10">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#df3333] rounded-full"></span>
            {title}
          </h2>
        </div>
        <button 
          onClick={onExplore}
          className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#df3333] hover:text-black transition-colors border-b border-[#df3333] pb-1"
        >
          {exploreLabel}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
        {products.slice(0, 4).map((product) => (
          <ProductCard 
            key={product.id}
            product={product} 
            onAddToCart={onAddToCart} 
            onViewProduct={onViewProduct} 
          />
        ))}
      </div>
    </section>
  );
}
