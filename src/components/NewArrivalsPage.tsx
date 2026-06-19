import React, { useState } from 'react';
import { ChevronDown, MessageSquare, RefreshCcw, Shirt, Tag, Loader2 } from 'lucide-react';
import { ProductCard } from './ProductSections';
import { useAppContext, Product } from '../AppContext';

import RecentlyViewed from './RecentlyViewed';

export default function NewArrivalsPage() {
  const { setViewedProduct, openQuickAdd, setCurrentView, shopifyProducts, isLoading } = useAppContext();

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4 bg-white pt-[88px]">
        <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
        <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">Fetching New Arrivals...</p>
      </div>
    );
  }

  // Prioritize products in 'new-arrivals' collection, but always include the 8 most recent products from the catalog
  const collectionProducts = shopifyProducts.filter(p => p.collections.includes('new-arrivals'));
  const latestProducts = shopifyProducts.slice(0, 48); // Show up to 48 latest products if not in collection
  
  // Merge and remove duplicates by ID
  const allDisplay = [...collectionProducts, ...latestProducts];
  const displayProducts = allDisplay.filter((p, index) => 
    allDisplay.findIndex(item => item.id === p.id) === index
  );

  return (
    <div className="w-full bg-white pb-20">
      {/* Hero Banner */}
      <div className="relative w-full h-[40vh] min-h-[350px] flex items-center justify-center bg-[#bdbdbd] overflow-hidden">
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
          <span className="opacity-60 cursor-default">New Arrivals</span>
        </div>

        {/* Hero Content */}
        <div className="relative flex items-center justify-center w-full px-4 text-center">
          <h1 className="text-7xl md:text-[140px] font-black uppercase tracking-tighter text-white select-none leading-none opacity-95">
            NEW ARRIVALS
          </h1>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {displayProducts.length > 0 ? (
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
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Shirt size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-medium tracking-widest uppercase">No products found in Catalog</p>
            <p className="text-[10px] mt-2 opacity-60">Check Shopify Admin to ensure products are active and published to Headless.</p>
          </div>
        )}
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
