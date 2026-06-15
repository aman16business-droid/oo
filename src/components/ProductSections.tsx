import React, { useState } from 'react';
import { Heart, ChevronLeft, ChevronRight, X, Ruler, Plus } from 'lucide-react';
import { useAppContext, Product } from '../AppContext';
import { getProductHearts } from '../utils/productUtils';

export const newInProducts: Product[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1597820334272-b7eaf719c8f0?q=80&w=600&auto=format&fit=crop",
    title: "COASTAL CHAOS TOTE",
    originalPrice: "799",
    salePrice: "599",
    savePercentage: "25",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
    title: "SUNSET COAST CO-ORD SET",
    originalPrice: "1,499",
    salePrice: "1,299",
    savePercentage: "13",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=600&auto=format&fit=crop",
    title: "DEEP BLUE RELAXED FIT JEANS",
    originalPrice: "1,999",
    salePrice: "1,799",
    savePercentage: "10",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1624378439575-d1ead6af00f7?q=80&w=600&auto=format&fit=crop",
    title: "DEEP BLUE RELAXED FIT JEANS",
    originalPrice: "1,999",
    salePrice: "1,799",
    savePercentage: "10",
  }
];

export const bestSellerProducts: Product[] = [
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=600&auto=format&fit=crop",
    title: "DEEP BLUE RELAXED FIT JEANS",
    originalPrice: "1,999",
    salePrice: "1,799",
    savePercentage: "10",
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop",
    title: "DEEP BLUE RELAXED FIT JEANS",
    originalPrice: "1,999",
    salePrice: "1,799",
    savePercentage: "10",
  },
  {
    id: "7",
    image: "https://images.unsplash.com/photo-1606822350800-4da2e0fce594?q=80&w=600&auto=format&fit=crop",
    title: "BLUE WASHED OUT JEANS",
    originalPrice: "1,999",
    salePrice: "1,799",
    savePercentage: "10",
  },
  {
    id: "8",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop",
    title: "BUTTERSCOTCH ICE CREAM OVERSIZED T-SHIRT",
    originalPrice: "1,199",
    salePrice: "999",
    savePercentage: "17",
  }
];

export const shopMensProducts: Product[] = [
  {
    id: "9",
    image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=600&auto=format&fit=crop",
    title: "MENS ESSENTIAL TEE PACK",
    originalPrice: "1,499",
    salePrice: "1,099",
    savePercentage: "26",
  },
  {
    id: "10",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=600&auto=format&fit=crop",
    title: "BLACK OVERSIZED T-SHIRT",
    originalPrice: "1,199",
    salePrice: "899",
    savePercentage: "25",
  },
  {
    id: "11",
    image: "https://images.unsplash.com/photo-1588661878939-ea4e1d51a9a4?q=80&w=600&auto=format&fit=crop",
    title: "CLASSIC LINEN SHIRT",
    originalPrice: "2,299",
    salePrice: "1,899",
    savePercentage: "17",
  },
  {
    id: "12",
    image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?q=80&w=600&auto=format&fit=crop",
    title: "PREMIUM CARGO PANTS",
    originalPrice: "2,499",
    salePrice: "1,999",
    savePercentage: "20",
  }
];

export const shopWomensProducts: Product[] = [
  {
    id: "13",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
    title: "WOMENS ESSENTIAL DRESS",
    originalPrice: "1,899",
    salePrice: "1,499",
    savePercentage: "21",
  },
  {
    id: "14",
    image: "https://images.unsplash.com/photo-1434389678232-04ce6c58a509?q=80&w=600&auto=format&fit=crop",
    title: "BLACK OVERSIZED OVERCOAT",
    originalPrice: "3,199",
    salePrice: "2,599",
    savePercentage: "18",
  },
  {
    id: "15",
    image: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=600&auto=format&fit=crop",
    title: "WHITE CROP TOP",
    originalPrice: "999",
    salePrice: "699",
    savePercentage: "30",
  },
  {
    id: "16",
    image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?q=80&w=600&auto=format&fit=crop",
    title: "HIGH WAISTED WIDE LEG JEANS",
    originalPrice: "2,199",
    salePrice: "1,899",
    savePercentage: "13",
  }
];

export const ProductCard: React.FC<{ product: Product, onAddToCart: (p: Product) => void, onViewProduct: (p: Product) => void }> = ({ product, onAddToCart, onViewProduct }) => {
  const { favorites, toggleFavorite } = useAppContext();
  const isFavorite = favorites.some((p) => p.id === product.id);

  return (
    <div className="group/card relative cursor-pointer flex flex-col" onClick={() => onViewProduct(product)}>
      <div className="relative bg-[#f5f5f5] aspect-[3/4] mb-3 sm:mb-4 overflow-hidden flex items-center justify-center rounded-sm">
        <img 
          src={product.image} 
          alt={product.title}
          className="h-full w-full object-cover mix-blend-multiply transition-transform duration-700 group-hover/card:scale-110" 
        />
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-[#df3333] text-white text-[9px] sm:text-[11px] font-black px-1.5 sm:px-2 py-[2px] sm:py-[3px] tracking-wide z-10 rounded-sm italic uppercase">
          SAVE {product.savePercentage}%
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product);
          }}
          className={`absolute top-2 sm:top-4 right-2 sm:right-4 z-10 transition hover:scale-110 p-1.5 bg-white/80 rounded-full sm:bg-transparent sm:rounded-none ${isFavorite ? 'text-[#df3333]' : 'text-gray-900 sm:text-gray-400 sm:hover:text-black'}`}
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={isFavorite ? 0 : 2} className="sm:w-[18px] sm:h-[18px]" />
        </button>

        {/* Hover Add to Cart logic - Mobile always visible as a bar at bottom or overlay button */}
        <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover/card:translate-y-0 md:translate-y-full transition-transform duration-300 ease-out z-20 md:pointer-events-none group-hover/card:pointer-events-auto">
           <button 
             onClick={(e) => {
               e.stopPropagation();
               onAddToCart(product);
             }}
             className="w-full bg-[#1a1a1a] text-white py-3 sm:py-3.5 text-[11px] sm:text-[13px] font-black tracking-widest hover:bg-black transition-colors uppercase"
           >
             ADD TO CART
           </button>
        </div>
      </div>

      <div className="flex flex-col gap-0.5 text-left px-0.5 sm:px-1">
        <div className="flex items-center mb-1.5">
           <div className="flex items-center gap-1 bg-pink-50/50 px-1.5 py-0.5 rounded-full border border-pink-100/50">
             <Heart size={9} fill="#ffb7ce" stroke="#ffb7ce" className="sm:w-2.5 sm:h-2.5 animate-pulse" />
             <span className="text-[8px] sm:text-[10px] text-pink-500 font-black italic tracking-tighter leading-none">
               {getProductHearts(product.id, product.title)}
             </span>
           </div>
        </div>
        <h4 className="text-[11px] sm:text-[14px] font-bold uppercase text-[#000000] tracking-wider truncate mb-0.5 leading-tight">
          {product.title}
        </h4>
        <div className="flex gap-2 items-center text-[11px] sm:text-[13.5px]">
           <span className="text-[#999999] line-through font-medium">Rs.{product.originalPrice}</span>
           <span className="text-[#df3333] font-black italic">Rs.{product.salePrice}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProductSections() {
  const { toggleFavorite, setViewedProduct, openQuickAdd, shopifyProducts } = useAppContext();

  const newInItems = shopifyProducts.length >= 4 ? shopifyProducts.slice(0, 4) : newInProducts;
  const bestSellerItems = shopifyProducts.length >= 8 ? shopifyProducts.slice(4, 8) : bestSellerProducts;
  const mensItems = shopifyProducts.length >= 12 ? shopifyProducts.slice(8, 12) : shopMensProducts;
  const womensItems = shopifyProducts.length >= 16 ? shopifyProducts.slice(12, 16) : shopWomensProducts;

  return (
    <div className="py-16 bg-white overflow-hidden">
      
      {/* New In Section */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 mb-20">
        <div className="flex justify-between items-end mb-8">
           <div>
             <h2 className="text-[2.25rem] font-bold text-gray-900 mb-1 tracking-tight">New In</h2>
             <p className="text-gray-600 text-[15px]">Upgrade your closet with everything trendy and new</p>
           </div>
           <a href="#" className="hidden md:inline-block text-sm font-bold uppercase border-b-[2.5px] border-black pb-0.5 tracking-wider hover:text-gray-600 hover:border-gray-600 transition">
             Shop New Arrivals
           </a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-6 gap-y-12">
          {newInItems.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={openQuickAdd} onViewProduct={setViewedProduct} />
          ))}
        </div>
      </section>

      {/* Best Seller Section */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 relative group">
        <div className="flex justify-between items-end mb-8">
           <div>
             <h2 className="text-[2.25rem] font-bold text-gray-900 mb-1 tracking-tight">Best Seller</h2>
             <p className="text-gray-600 text-[15px]">Handpicked and crafted for you</p>
           </div>
           <a href="#" className="hidden md:inline-block text-sm font-bold uppercase border-b-[2.5px] border-black pb-0.5 tracking-wider hover:text-gray-600 hover:border-gray-600 transition">
             Shop BEST SELLERS
           </a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-6 gap-y-12">
          {bestSellerItems.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={openQuickAdd} onViewProduct={setViewedProduct} />
          ))}
        </div>
      </section>

      {/* Shop Mens Section */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 relative group mt-20">
        <div className="flex justify-between items-end mb-8">
           <div>
             <h2 className="text-[2.25rem] font-bold text-gray-900 mb-1 tracking-tight">Shop Mens</h2>
             <p className="text-gray-600 text-[15px]">The ultimate collection for him</p>
           </div>
           <a href="#" className="hidden md:inline-block text-sm font-bold uppercase border-b-[2.5px] border-black pb-0.5 tracking-wider hover:text-gray-600 hover:border-gray-600 transition">
             Shop Mens Collection
           </a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-6 gap-y-12">
          {mensItems.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={openQuickAdd} onViewProduct={setViewedProduct} />
          ))}
        </div>
      </section>

      {/* Discover What's New Section */}
      <section className="w-full relative mt-24 h-screen max-h-[850px] flex items-end justify-center pb-20">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1517721867165-27a1cbe2d3db?q=80&w=2600&auto=format&fit=crop" 
            alt="Discover What's New"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-6">
          <h2 className="text-white text-[2.5rem] md:text-[4.5rem] font-bold tracking-tight text-center leading-none uppercase">
            DISCOVER WHAT'S NEW
          </h2>
          <a href="#" className="bg-white text-black font-semibold text-[14px] px-10 py-3.5 rounded-md hover:bg-gray-100 transition tracking-wide uppercase">
            EXPLORE
          </a>
        </div>
      </section>

      {/* Shop Womens Section */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 relative group mt-20 mb-20">
        <div className="flex justify-between items-end mb-8">
           <div>
             <h2 className="text-[2.25rem] font-bold text-gray-900 mb-1 tracking-tight">Shop Women</h2>
             <p className="text-gray-600 text-[15px]">The ultimate collection for her</p>
           </div>
           <a href="#" className="hidden md:inline-block text-sm font-bold uppercase border-b-[2.5px] border-black pb-0.5 tracking-wider hover:text-gray-600 hover:border-gray-600 transition">
             Shop Womens Collection
           </a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-6 gap-y-12">
          {womensItems.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={openQuickAdd} onViewProduct={setViewedProduct} />
          ))}
        </div>
      </section>
    </div>
  );
}
