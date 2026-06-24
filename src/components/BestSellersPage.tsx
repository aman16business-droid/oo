import React, { useState } from 'react';
import { ChevronDown, MessageSquare, Loader2 } from 'lucide-react';
import { ProductCard } from './ProductSections';
import { useAppContext, Product } from '../AppContext';
import RecentlyViewed from './RecentlyViewed';

export default function BestSellersPage() {
  const { setViewedProduct, openQuickAdd, setCurrentView, recentlyViewed, shopifyProducts, isLoading } = useAppContext();

  if (isLoading && shopifyProducts.length === 0) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4 bg-white pt-[88px]">
        <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
        <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">Loading Catalog...</p>
      </div>
    );
  }

  // Filter for best seller products
  const displayProducts = shopifyProducts.filter(p => 
    p.collections.includes('best-sellers') || 
    p.collections.includes('best-seller') ||
    p.title.toLowerCase().includes('best')
  );

  const fallbackProducts = shopifyProducts.slice(0, 12);

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
          <span className="opacity-60 cursor-default">Best Sellers</span>
        </div>
      </div>


      {/* Product Grid */}
      <div className="max-w-[1600px] mx-auto px-3 md:px-6 py-8">
        {(displayProducts.length > 0 ? displayProducts : fallbackProducts).length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
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

      <RecentlyViewed />
    </div>
  );
}
