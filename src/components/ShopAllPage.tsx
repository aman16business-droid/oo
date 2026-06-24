import React, { useState } from 'react';
import { ChevronDown, MessageSquare, Loader2 } from 'lucide-react';
import { ProductCard } from './ProductSections';
import { useAppContext, Product } from '../AppContext';
import RecentlyViewed from './RecentlyViewed';

export default function ShopAllPage() {
  const { setViewedProduct, openQuickAdd, setCurrentView, recentlyViewed, shopifyProducts, isLoading } = useAppContext();

  if (isLoading && shopifyProducts.length === 0) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4 bg-white pt-[88px]">
        <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
        <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">Loading Catalog...</p>
      </div>
    );
  }

  const displayProducts = shopifyProducts;

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
          <span className="opacity-60 cursor-default">All Products</span>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-[1600px] mx-auto px-3 md:px-6 py-12">
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
            {displayProducts.map((product, index) => (
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
      
      {/* You May Also Like Section (Recommendations) */}
      <div className="max-w-[1600px] mx-auto px-3 md:px-6 py-20 border-t border-gray-100 mt-10">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-11px font-black text-gray-300 uppercase tracking-[0.2em] text-center mb-4 leading-none">
            CURATED FOR YOU
          </h2>
          <h3 className="text-3xl font-black text-black uppercase tracking-tight text-center leading-none">
            YOU MAY ALSO LIKE
          </h3>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
           {shopifyProducts.slice(0, 4).map((product, index) => (
             <ProductCard 
               key={product.id + "-recommend-" + index} 
               product={product} 
               onAddToCart={openQuickAdd} 
               onViewProduct={setViewedProduct} 
             />
           ))}
        </div>
      </div>
      
      <RecentlyViewed />
      
      {/* Floating Action Button removed in favor of global Chatbot */}
    </div>
  );
}
