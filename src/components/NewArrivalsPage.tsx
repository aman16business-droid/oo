import React, { useState } from 'react';
import { ChevronDown, MessageSquare, RefreshCcw, Shirt, Tag, Loader2 } from 'lucide-react';
import { ProductCard } from './ProductSections';
import { useAppContext, Product } from '../AppContext';

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
  const latestProducts = shopifyProducts.slice(0, 8);
  
  // Merge and remove duplicates by ID
  const allDisplay = [...collectionProducts, ...latestProducts];
  const displayProducts = allDisplay.filter((p, index) => 
    allDisplay.findIndex(item => item.id === p.id) === index
  );

  return (
    <div className="w-full bg-white pb-20 pt-[88px]">
      {/* Hero Banner */}
      <div className="relative w-full h-[60vh] min-h-[500px] max-h-[700px] overflow-hidden font-sans">
        <img 
          src="https://images.unsplash.com/photo-1529139574466-a303027c028c?q=80&w=2560&auto=format&fit=crop" 
          alt="New Arrivals" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Breadcrumbs */}
        <div className="absolute top-[30px] left-[40px] text-[13px] text-white font-medium z-20 flex gap-2 tracking-wide">
          <button 
            onClick={() => {
              setViewedProduct(null);
              setCurrentView('old-home');
            }} 
            className="hover:text-gray-200 underline underline-offset-[5px] cursor-pointer"
          >
            Home
          </button> 
          <span className="opacity-70 font-normal px-1">/</span> 
          <button onClick={() => setCurrentView('shop-all')} className="hover:text-gray-200 underline underline-offset-[5px] cursor-pointer">Shop</button> 
          <span className="opacity-70 font-normal px-1">/</span> 
          <span>New Arrivals</span>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 text-center pb-8">
          <h1 className="text-5xl md:text-[80px] font-bold uppercase tracking-wide text-white drop-shadow-md">
            NEW ARRIVALS
          </h1>
        </div>

        {/* Trust Badges Bottom Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[70px] bg-black/60 backdrop-blur-md flex justify-center items-center gap-12 sm:gap-24 px-6 text-white z-20 overflow-x-auto sm:overflow-visible no-scrollbar">
            {/* Express Shipping */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-[40px] h-[40px] bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[13px] font-black uppercase tracking-widest leading-none">Express</span>
                <span className="text-[10px] opacity-70 uppercase tracking-tighter mt-1">Super Fast Delivery</span>
              </div>
            </div>
            
            <div className="hidden sm:block w-[1px] h-[30px] bg-white/20"></div>
            
            {/* Easy Returns */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-[40px] h-[40px] bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[13px] font-black uppercase tracking-widest leading-none">Easy Return</span>
                <span className="text-[10px] opacity-70 uppercase tracking-tighter mt-1">7 Day Policies</span>
              </div>
            </div>
            
            <div className="hidden sm:block w-[1px] h-[30px] bg-white/20"></div>
            
            {/* Secure Payments */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-[40px] h-[40px] bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[13px] font-black uppercase tracking-widest leading-none">Safe Pay</span>
                <span className="text-[10px] opacity-70 uppercase tracking-tighter mt-1">100% Encrypted</span>
              </div>
            </div>
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
      
      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition">
          <MessageSquare size={20} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
