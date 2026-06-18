import React, { useState } from 'react';
import { ChevronDown, MessageSquare, Loader2 } from 'lucide-react';
import { ProductCard } from './ProductSections';
import { useAppContext, Product } from '../AppContext';

export default function PremiumPage() {
  const { setViewedProduct, openQuickAdd, setCurrentView, recentlyViewed, shopifyProducts, isLoading } = useAppContext();

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4 bg-white pt-[88px]">
        <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
        <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">Loading Catalog...</p>
      </div>
    );
  }

  // Filter for premium products or products over a certain price
  const displayProducts = shopifyProducts.filter(p => 
    p.collections.includes('premium') || 
    p.title.toLowerCase().includes('premium') ||
    parseFloat(p.salePrice) > 5000
  );

  const fallbackProducts = shopifyProducts.slice(0, 8);

  return (
    <div className="w-full bg-white pb-20">
      {/* Hero Banner */}
      <div className="relative w-full h-[40vh] min-h-[350px] flex items-center justify-center bg-[#bdbdbd] mt-[72px] overflow-hidden">
        {/* Breadcrumbs */}
        <div className="absolute top-10 left-10 text-[11px] text-white font-bold z-20 flex gap-2 tracking-[0.2em] uppercase">
          <button 
            onClick={() => {
              setViewedProduct(null);
              setCurrentView('old-home');
            }} 
            className="hover:opacity-60 transition-opacity"
          >
            Home
          </button> 
          <span className="opacity-40">/</span> 
          <button onClick={() => setCurrentView('shop-all')} className="hover:opacity-60 transition-opacity">Shop</button> 
          <span className="opacity-40">/</span> 
          <span className="opacity-60 cursor-default">Premium</span>
        </div>

        {/* Hero Content */}
        <div className="relative flex items-center justify-center w-full px-4 text-center">
          <h1 className="text-7xl md:text-[140px] font-black uppercase tracking-tighter text-white select-none leading-none opacity-95">
            PREMIUM
          </h1>
        </div>
      </div>


      {/* Product Grid */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {(displayProducts.length > 0 ? displayProducts : fallbackProducts).length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-6 gap-y-12">
            {(displayProducts.length > 0 ? displayProducts : fallbackProducts).map((product, index) => (
              <ProductCard 
                key={product.id + index} 
                product={product} 
                onAddToCart={openQuickAdd} 
                onViewProduct={setViewedProduct} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <ChevronDown size={24} className="opacity-40 animate-bounce" />
             </div>
            <p className="text-sm font-medium tracking-widest uppercase">CATALOG EMPTY</p>
          </div>
        )}
      </div>
    </div>
  );
}
