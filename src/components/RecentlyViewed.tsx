import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ChevronRight, Plus } from 'lucide-react';
import { useAppContext, Product } from '../AppContext';

export default function RecentlyViewed() {
  const { recentlyViewed, setViewedProduct, openQuickAdd, viewedProduct } = useAppContext();

  // Don't show if there's nothing or only the current product
  const productsToShow = recentlyViewed.filter(p => !viewedProduct || p.id !== viewedProduct.id);

  if (productsToShow.length === 0) return null;

  return (
    <section className="py-2 md:py-4 border-t border-gray-50 bg-white">
      <div className="max-w-[1700px] mx-auto px-5 md:px-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[#df3333] text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] block mb-1">History</span>
            <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tighter italic leading-none">Recently Viewed</h2>
          </div>
          <div className="hidden md:flex gap-4">
             <div className="h-[1px] w-16 bg-gray-100 self-center"></div>
             <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{productsToShow.length} items</span>
          </div>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-3 md:gap-6 md:grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 overflow-x-auto no-scrollbar pb-4 md:pb-0 snap-x">
          {productsToShow.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "50px" }}
              className="min-w-[140px] md:min-w-0 snap-start group"
            >
              <div 
                className="relative aspect-[3/4] bg-[#f9f9f9] rounded-lg md:rounded-xl overflow-hidden cursor-pointer mb-2.5"
                onClick={() => {
                  setViewedProduct(product);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-contain bg-white transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                
                {/* Quick actions overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openQuickAdd(product);
                    }}
                    className="w-full bg-black text-white py-2.5 md:py-3 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl"
                  >
                    <Plus size={12} />
                    Quick Add
                  </button>
                </div>

                {parseFloat(product.savePercentage) > 0 && (
                  <div className="absolute top-3 left-3 md:top-4 left-4 bg-[#e33535] text-white text-[7px] md:text-[8px] font-black px-2 py-0.5 md:py-1 rounded-full uppercase tracking-widest shadow-lg">
                    {product.savePercentage} OFF
                  </div>
                )}
              </div>

              <div className="px-1">
                <h3 className="text-[10px] md:text-[11px] font-black text-black uppercase tracking-tight truncate mb-0.5 md:mb-1 group-hover:text-[#df3333] transition-colors">{product.title}</h3>
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-[12px] md:text-[14px] font-black text-black italic">Rs.{product.salePrice}</span>
                  {product.originalPrice !== product.salePrice && (
                    <span className="text-[9px] md:text-[11px] font-bold text-gray-300 line-through">Rs.{product.originalPrice}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
