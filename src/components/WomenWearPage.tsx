import React from 'react';
import { MessageSquare } from 'lucide-react';
import { ProductCard, shopWomensProducts } from './ProductSections';
import { useAppContext, Product } from '../AppContext';

// Extend the products for a better grid
const products: Product[] = [
  ...shopWomensProducts,
  {
    id: "w5",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop",
    title: "FLORAL MIDI DRESS",
    originalPrice: "2,499",
    salePrice: "1,899",
    savePercentage: "24",
  },
  {
    id: "w6",
    image: "https://images.unsplash.com/photo-1539109132314-d4a8c62e4042?q=80&w=600&auto=format&fit=crop",
    title: "SATIN SILK BLOUSE",
    originalPrice: "1,699",
    salePrice: "1,299",
    savePercentage: "23",
  },
  {
    id: "w7",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop",
    title: "LEATHER CLUTCH BAG",
    originalPrice: "1,299",
    salePrice: "899",
    savePercentage: "30",
  },
  {
    id: "w8",
    image: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=600&auto=format&fit=crop",
    title: "ELEGANT SUMMER TOP",
    originalPrice: "1,199",
    salePrice: "999",
    savePercentage: "16",
  }
];

export default function WomenWearPage() {
  const { setViewedProduct, openQuickAdd, setCurrentView, shopifyProducts } = useAppContext();

  const displayProducts = shopifyProducts.length > 0 ? shopifyProducts : products;

  return (
    <div className="w-full bg-white pb-20 pt-[88px]">
      {/* Hero Banner */}
      <div className="relative w-full h-[60vh] min-h-[500px] max-h-[700px] overflow-hidden font-sans">
        <img 
          src="https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=2560&auto=format&fit=crop" 
          alt="Women Wear" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-white/40" />
        
        {/* Breadcrumbs */}
        <div className="absolute top-[30px] left-[40px] text-[13px] text-black font-medium z-20 flex gap-2 tracking-wide">
          <button 
            onClick={() => {
              setViewedProduct(null);
              setCurrentView('old-home');
            }} 
            className="hover:text-gray-600 underline underline-offset-[5px] cursor-pointer"
          >
            Home
          </button> 
          <span className="opacity-70 font-normal px-1">/</span> 
          <button onClick={() => setCurrentView('shop-all')} className="hover:text-gray-200 underline underline-offset-[5px] cursor-pointer">Shop</button> 
          <span className="opacity-70 font-normal px-1">/</span> 
          <span>Women Wear</span>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-black z-10 text-center pb-8">
          <h1 className="text-5xl md:text-[80px] font-black uppercase tracking-wide text-black drop-shadow-sm">
            WOMEN WEAR
          </h1>
        </div>

        {/* Trust Badges Bottom Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[70px] bg-black/60 backdrop-blur-md flex justify-center items-center gap-12 sm:gap-24 px-6 text-white z-20 overflow-x-auto sm:overflow-visible no-scrollbar">
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
