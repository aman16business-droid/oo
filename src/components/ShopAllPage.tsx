import React, { useState } from 'react';
import { ChevronDown, MessageSquare, Loader2 } from 'lucide-react';
import { ProductCard } from './ProductSections';
import { useAppContext, Product } from '../AppContext';
import RecentlyViewed from './RecentlyViewed';

export default function ShopAllPage() {
  const { setViewedProduct, openQuickAdd, setCurrentView, recentlyViewed, shopifyProducts, isLoading } = useAppContext();

  if (isLoading) {
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
          <span className="opacity-60 cursor-default">All Products</span>
        </div>

        {/* Hero Content */}
        <div className="relative flex items-center justify-center w-full px-4 text-center">
          <h1 className="text-7xl md:text-[140px] font-black uppercase tracking-tighter text-white select-none leading-none opacity-95">
            SHOP ALL
          </h1>
        </div>
      </div>


      {/* Product Grid */}
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-6 gap-y-12">
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
      <div className="max-w-[1600px] mx-auto px-6 py-20 border-t border-gray-100 mt-10">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-11px font-black text-gray-300 uppercase tracking-[0.2em] text-center mb-4 leading-none">
            CURATED FOR YOU
          </h2>
          <h3 className="text-3xl font-black text-black uppercase tracking-tight text-center leading-none">
            YOU MAY ALSO LIKE
          </h3>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
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
      
      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition">
          <MessageSquare size={20} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
