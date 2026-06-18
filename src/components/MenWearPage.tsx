import React from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { ProductCard } from './ProductSections';
import { useAppContext, Product } from '../AppContext';

import RecentlyViewed from './RecentlyViewed';

export default function MenWearPage() {
  const { setViewedProduct, openQuickAdd, setCurrentView, shopifyProducts, isLoading } = useAppContext();

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4 bg-white pt-[88px]">
        <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
        <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">Fetching Collections...</p>
      </div>
    );
  }

  // Filter for mens if collection exists, otherwise just the latest
  const displayProducts = shopifyProducts.filter(p => p.collections.includes('men') || p.collections.includes('mens')).length > 0
    ? shopifyProducts.filter(p => p.collections.includes('men') || p.collections.includes('mens'))
    : shopifyProducts;

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
          <span className="opacity-60 cursor-default">Men</span>
        </div>

        {/* Hero Content */}
        <div className="relative flex items-center justify-center w-full px-4 text-center">
          <h1 className="text-7xl md:text-[140px] font-black uppercase tracking-tighter text-white select-none leading-none opacity-95">
            MEN
          </h1>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-6 gap-y-12">
          {displayProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={openQuickAdd} 
              onViewProduct={setViewedProduct} 
            />
          ))}
        </div>
      </div>
      
      <RecentlyViewed />

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition">
          <MessageSquare size={20} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
