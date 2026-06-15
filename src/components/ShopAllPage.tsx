import React, { useState } from 'react';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { ProductCard, newInProducts, bestSellerProducts, shopMensProducts } from './ProductSections';
import { useAppContext, Product } from '../AppContext';

// We duplicate or extend the newInProducts to show a nice grid
const products: Product[] = [
  ...newInProducts,
  ...bestSellerProducts,
  ...shopMensProducts
];

export default function ShopAllPage() {
  const { setViewedProduct, openQuickAdd, setCurrentView, recentlyViewed, shopifyProducts } = useAppContext();

  const displayProducts = shopifyProducts.length > 0 ? shopifyProducts : products;

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50/50 pb-20 pt-[88px]">
      {/* Hero Banner */}
      <div className="relative w-full h-[45vh] min-h-[350px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1610384104075-e05c8cf200c3?q=80&w=2070&auto=format&fit=crop" 
          alt="Shop All" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Breadcrumbs */}
        <div className="absolute top-6 left-6 text-xs text-white/90 font-medium z-20 flex gap-2">
          <button 
            onClick={() => {
              setViewedProduct(null);
              setCurrentView('old-home');
            }} 
            className="hover:text-white underline underline-offset-4 cursor-pointer"
          >
            Home
          </button> 
          <span className="opacity-50">/</span> 
          <span className="underline underline-offset-4 cursor-pointer">Shop</span> 
          <span className="opacity-50">/</span> 
          <span className="text-white">All</span>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 p-6 text-center pt-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-[0.15em] mb-12 drop-shadow-lg">ALL</h1>
        </div>
      </div>


      {/* Product Grid */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
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
      </div>
      
      {/* You May Also Like Section (Recommendations) */}
      <div className="max-w-[1600px] mx-auto px-6 py-20 border-t border-gray-100 mt-10">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter text-center leading-none">
            YOU MAY ALSO LIKE
          </h2>
          <div className="w-20 h-1 bg-black mt-4"></div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
           {bestSellerProducts.slice(0, 4).map((product, index) => (
             <ProductCard 
               key={product.id + "-recommend-" + index} 
               product={product} 
               onAddToCart={openQuickAdd} 
               onViewProduct={setViewedProduct} 
             />
           ))}
        </div>
      </div>
      
      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <div className="max-w-[1600px] mx-auto px-6 py-20 border-t border-gray-100 mt-10 mb-10">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter text-center leading-none">
              RECENTLY VIEWED
            </h2>
            <div className="w-20 h-1 bg-black mt-4"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
             {recentlyViewed.slice(0, 10).map((product, index) => (
               <ProductCard 
                 key={product.id + "-recent-" + index} 
                 product={product} 
                 onAddToCart={openQuickAdd} 
                 onViewProduct={setViewedProduct} 
               />
             ))}
          </div>
        </div>
      )}
      
      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition">
          <MessageSquare size={20} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
