import React from 'react';
import { useAppContext } from '../AppContext';
import { ProductCard } from './ProductSections';
import { Search, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function SearchResultsPage() {
  const { shopifyProducts, searchQuery, setCurrentView, viewedProduct, setViewedProduct, openQuickAdd } = useAppContext();

  const filteredProducts = shopifyProducts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.collections.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="pt-32 pb-20 px-4 sm:px-8 min-h-screen bg-white">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <button 
              onClick={() => setCurrentView('old-home')}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition mb-4"
            >
              <ArrowLeft size={14} /> Back to Home
            </button>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic flex items-center gap-4">
              <Search size={40} className="text-[#e33535]" strokeWidth={3} />
              Search Results
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Showing {filteredProducts.length} results for "<span className="text-black font-black italic">{searchQuery}</span>"
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <span>Sort by:</span>
            <select className="bg-transparent border-none outline-none text-black cursor-pointer">
              <option>Relevance</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
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
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Search size={32} className="text-gray-200" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight italic mb-2">No results found</h3>
            <p className="text-gray-400 max-w-xs text-sm font-medium">
              We couldn't find anything matching your search. Try different keywords or check out our new arrivals.
            </p>
            <button 
              onClick={() => setCurrentView('new-arrivals')}
              className="mt-8 bg-black text-white px-10 py-4 text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-[#e33535] transition-all shadow-xl"
            >
              Shop New Arrivals
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
