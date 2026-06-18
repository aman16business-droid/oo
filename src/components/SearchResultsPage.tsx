import React from 'react';
import { useAppContext } from '../AppContext';
import { ProductCard } from './ProductSections';
import { motion } from 'motion/react';

export default function SearchResultsPage() {
  const { shopifyProducts, searchQuery, viewedProduct, setViewedProduct, openQuickAdd } = useAppContext();

  const filteredProducts = shopifyProducts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.collections.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="pt-24 md:pt-32 pb-20 px-6 md:px-12 min-h-screen bg-white font-sans">
      <div className="max-w-[1700px] mx-auto">
        <div className="mb-10">
          <p className="text-[12px] md:text-[13px] text-gray-500 font-medium mb-8">
            {filteredProducts.length} Results found for <span className="text-black font-bold uppercase">"{searchQuery}"</span>:
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <ProductCard 
                  product={product} 
                  onAddToCart={openQuickAdd}
                  onViewProduct={(p) => setViewedProduct(p)} 
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center">
             <h3 className="text-xl font-black uppercase tracking-tight italic mb-2">No results found</h3>
             <p className="text-gray-400 text-sm font-medium">Try different keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
}
