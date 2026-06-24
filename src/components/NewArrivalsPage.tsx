import React, { useState } from 'react';
import { ChevronDown, MessageSquare, RefreshCcw, Shirt, Tag, Loader2 } from 'lucide-react';
import { ProductCard } from './ProductSections';
import { useAppContext, Product } from '../AppContext';

import RecentlyViewed from './RecentlyViewed';

export default function NewArrivalsPage() {
  const { setViewedProduct, openQuickAdd, setCurrentView, shopifyProducts, isLoading } = useAppContext();

  if (isLoading && shopifyProducts.length === 0) {
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
      <div className="pt-32 pb-12 px-6 flex flex-col items-center text-center">
        {/* Breadcrumbs */}
        <div className="text-[11px] text-black font-bold flex gap-2 tracking-[0.2em] uppercase mb-6">
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
      </div>

      {/* Products Grid */}
      <div className="max-w-[1600px] mx-auto px-3 md:px-6 py-8">
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
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

      {/* Floating Action Button removed in favor of global Chatbot */}
    </div>
  );
}
